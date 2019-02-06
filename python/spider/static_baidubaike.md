1. 目标需求
    爬取百度百科一百个词条，保存其相关的链接、标题、摘要信息
2. 爬虫架构
    想象一下爬虫运行的过程，从计算机启动，从某个特定url开始发出网络请求，得到响应后使用bs4解析，提取出需要保存的数据和url，对新提取出的url重复上述操作，当爬取指定数量url之后，将数据存盘。最明显的我们需要两个功能，获取网络数据，解析网络数据，将这两个功能封装进类中，将数据存盘也放入类中，还需要考虑的问题是url管理，决定进程何时停止。
    从以上一般过程，总结爬虫的结构，包括url管理器、url下载器、网页解析器、数据存储器、以及管理主进程的manager。url管理器维护已经下载的url和将要下载的url的集合，保证数据不重复，url下载器根据给出的url下载网络数据，网页解析器解析给出的页面内容，提取必要信息，数据存储器将数据存盘，最后还要有管理器协调以上四者的工作
3. 程序开发
    - url管理器代码如下
      ```python
      #!/usr/bin/env python
      # coding:utf-8
      class URLManager(object):
          def __init__(self):
              self.old_urls = set()
              self.new_urls = set()
          # 获取新的url
          def get_new_url(self):
              new_url = self.new_urls.pop()
              self.old_urls.add(new_url)
              return new_url
          # 添加待处理url
          def add_new_url(self, url):
              if url is None:
                  return
              elif url not in self.old_urls and url not in self.new_urls:
                  self.new_urls.add(url)
              else:处理
                  return
          # 添加待处理url列表
          def add_new_urls(self, urls):
              if urls is None or len(urls) == 0:
                  return
              else:
                  for url in urls:
                      self.add_new_url(url)
          # 返回待处理url数量
          def new_url_size(self):
              return len(self.new_urls)
          #返回已处理url数量
          def old_url_size(self):
              return len(self.old_urls)
          # 判断是否有新的url要处理
          def has_new_urls(self):
              return self.new_url_size() != 0
      ```
    - 下载器
      ```python
      #!/usr/bin/env python
      # coding:utf-8
      import requests
      class HtmlDownloader(object):
          def download(self, url):
              if url is None:
                  return
              else:
                  user_agent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36 OPR/53.0.2907.68'
                  headers = {'User-Agent':user_agent}
                  res = requests.get(url, headers=headers)
                  if res.status_code == 200:
                      res.encoding = 'utf-8'
                      return res.text
              return None
      ```
    - url解析器
      ```python
      #!/usr/bin/env python
      # coding:utf-8
      from bs4 import BeautifulSoup
      import re
      import urlparse
      
      
      class HtmlParser(object):
      
          def _get_new_urls(self, page_url, soup):
              if page_url is None or soup is None:
                  return
              else:
                  links = []
                  tag_a = soup.find_all('a', href=re.compile(r'/item/*'))
                  # 经测试第一个和最后一个连接不可用
                  tag_a.remove(tag_a[0])
                  tag_a.remove(tag_a[len(tag_a) - 1])
                  for tag in tag_a:
                      links.append(urlparse.urljoin(page_url, tag['href']))
              return set(links)
      
          def _get_new_data(self, page_url, soup):
              if page_url is None or soup is None:
                  return
              else:
                  data = {}
                  title = soup.find_all('dd', class_='lemmaWgt-lemmaTitle-title')
                  data['title'] = title[0].h1.get_text()
                  summary = soup.find_all('div', class_='lemma-summary')
                  data['summary'] = summary[0].get_text()
                  data['url'] = page_url
              return {item:data[item] for item in data.keys()}
      
          def parser(self, page_url, page_con):
              if page_url is None or page_con is None:
                  return
              else:
                  soup = BeautifulSoup(page_con, 'html.parser')
                  data = self._get_new_data(page_url,soup)
                  new_urls = self._get_new_urls(page_url, soup)
              return new_urls, data
      ```
    - 数据存储
      ```python
      #!/usr/bin/env python
      # encoding:utf-8
      # 编码问题
      import sys
      import codecs
      reload(sys)
      sys.setdefaultencoding('utf-8')
      
      
      class DataOutput(object):
          def __init__(self):
              self.datas = []
      
          def store_data(self, data):
              if data is None:
                  return
              else:
                  self.datas.append(data)
      
          def out_data(self):
              if len(self.datas) == 0:
                  print 'datas contains nothing...'
                  return
              else:
                  fp = codecs.open('baike.html', 'w',encoding='utf-8')
                  fp.write('<html>')
                  fp.write('<body>')
                  fp.write('<table>')
                  for data in self.datas:
                      fp.write('<tr>')
                      fp.write('<td>{}</td>'.format(data['url']))
                      fp.write('<td>{}</td>'.format(data['title']))
                      fp.write('<td>{}</td>'.format(data['summary']))
                      fp.write('</tr>')
                  fp.write('</table>')
                  fp.write('</body>')
                  fp.write('</html>')
                  fp.close()
      ```
    - 主程序管理
      ```python
      #!/usr/bin/env python
      # coding:utf-8
      from HtmlDownloader import HtmlDownloader
      from HtmlParser import HtmlParser
      from URLManager import URLManager
      from DataOutput import DataOutput
      
      
      class SpiderMan(object):
          def __init__(self):
              self.manager = URLManager()
              self.parser = HtmlParser()
              self.out_fp = DataOutput()
              self.downloader = HtmlDownloader()
      
          def craw(self, base_url):
              if base_url is None:
                  return
              else:
                  self.manager.add_new_url(base_url)
                  while(self.manager.has_new_urls() and self.manager.old_url_size() < 100):
                      try:
                          new_url = self.manager.get_new_url()
                          page = self.downloader.download(new_url)
                          urls, data = self.parser.parser(base_url, page)
                          self.manager.add_new_urls(urls)
                          self.out_fp.store_data(data)
                          print 'already got {} links...'.format(self.manager.old_url_size())
                      except Exception,e:
                          print 'crawing failed!'
      
                  self.out_fp.out_data()
      
      if __name__ == '__main__':
          spider = SpiderMan()
          spider.craw('https://baike.baidu.com/item/Python/407313')
      ```
4. 结果
    ![](https://upload-images.jianshu.io/upload_images/10339396-cce029a8597a871a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)