1. 一个完整的爬虫程序，应该包含五个部分，分别是负责url链接管理的URL管理器，负责获取网络数据的Downloader，负责解析html数据的parser，负责存储数据的dataoutput，以及调度以上四个程序的调度器。每次编写爬虫程序都要重写以上五个模块有些繁琐，所以前辈们开发出爬虫框架，使我们在编写爬虫程序的时侯只需要开发部分代码即可完成强大功能的爬虫程序。scrapy是众多爬虫框架的一种，经受了历史的考验，框架经过不断地发展功能更加完善也更为复杂。话不多说，先看一下scrapy架构
  ![](https://upload-images.jianshu.io/upload_images/10339396-c7b6da1c13e750f8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
   - 其中engine就相当于调度器，协调模块间的工作，控制数据流的流动
   - Scheduler负责调度以Request形式存在的html请求，当engine请求数据时返回request，并接受新的request
   - Downloader负责接受request，完成请求处理过程，返回页面的内容给spider
   - spider和之前说的parser很相似，这个spider完成的功能是解析html数据，返回生成的数据Item和新的Request，Request给Scheduler，Item给ItemPipeline
   - 这个ItemPipeline接受到数据以后，进行数据的存储操作
   - 数据在从Scheduler到Downloader的过程中，有时候我们想对Request做一些处理，之后在发送给Downloader下载，这些处理Request的工具叫做Downloader中间件
   - 同样的，html数据传送至spider之前经过了一些处理过程（如果需要的话）处理这些响应的工具就是spider中间件。

   scrapy的工作过程也类似，engine从spider取得第一个要处理的request，交给Scheluder调度，Scheluder将Request，传递给Downloader处理，downloader将下载好的数据返回给spider解析，spider解析出数据交给itempipeline，request交给Scheluder，重复上述过程，直到没有新的请求为止

2. scrapy安装与简单使用
    `pip install scrapy --user`
    在相应目录下新建scrapy项目
    `scrapy startproject projectname`
    创建完成后文件结构如下
    ![](https://upload-images.jianshu.io/upload_images/10339396-04d9e95ce8f522e3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    items.py定义了数据容器，数据被封装进item中在spider与itempipeline中流动，pipelines.py定义了处理item的流程，settings.py定义了全局设置，spiders文件夹中放了爬虫程序（刚创建时应该为空，这里由于已经新建了爬虫运行了，所以同时存在pyc文件）
    - scrapy命令行工具
      ![](https://upload-images.jianshu.io/upload_images/10339396-6edbb72e335897a2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      比较重要的有
      `scrapy crawl spidername`表示运行某个爬虫
      `scrapy shell url`在交互式shell中获取url后停止，可以进行一些调试工作
      ![](https://upload-images.jianshu.io/upload_images/10339396-d6f6e5f986d3db03.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      `scrapy list`列出可用的爬虫

    - 创建爬虫模块
      创建爬虫，在spiders文件夹中编写py文件，爬虫有一些基本的属性，name表示爬虫的名字，非常重要，engine通过name索引这个爬虫，start_urls是url列表，表示爬虫启动时的入口url，parse（）是spider的一个方法，默认的用于处理response的函数。parse函数中，对于获取到的页面对象，可以使用xpath选取页面基本内容，extract（）方法可以获取该对象的unicode表示。scrapy中Selector类专门用于从response中选择数据，将response传递进Selector即可创建Selector实例，随后可以使用xpath、css、re选择数据，选择后的元素使用extract()方法得到它的unicode表示。
      ```
      #!/usr/local/env python
      # encoding:utf-8
      import scrapy
      from scrapy import Selector
      from cnblogSpider.items import CnblogspiderItem
      class CnblogSpider(scrapy.Spider):
          name = "cnblogs"
          allowed_domains = ['cnblogs.com']
          start_urls = [
              'https://www.cnblogs.com/qiyeboy/default.html?page=1'
          ]
          def parse(self, response):
              all_articles = response.xpath(".//*[@class='day']")
              for article in all_articles:
                  title = article.xpath('.//*[@class="postTitle"]/a/text()').extract()[0]
                  abstract = article.xpath('.//*[@class="postCon"]/div/text()').extract()[0]
                  href = article.xpath('.//*[@class="postTitle"]/a/@href').extract()[0]
                  day = article.xpath('.//*[@class="dayTitle"]/a/text()').extract()[0]
                  # print title,'\n',day,'\n',href,'\n',abstract,'\n'
                  item = CnblogspiderItem(url=href, title=title, abstract=abstract, day=day)
                  request = scrapy.Request(url=href, callback=self.pase_body)
                  request.meta['item'] = item
                  yield request
              next_page = Selector(response).re(u'<a href="(\S*)">下一页</a>')
              if next_page:
                  yield scrapy.Request(url=next_page[0], callback=self.parse)
      
          def pase_body(self, response):
              item = response.meta['item']
              body = response.xpath(".//*[@class='postBody']")
              item['cimage_urls'] = body.xpath('.//img//@src').extract()
              yield item
      ```
    - 定义item,scrapy中item的操作十分类似于字典
      ```
      import scrapy
      
      
      class CnblogspiderItem(scrapy.Item):
          # define the fields for your item here like:
          # name = scrapy.Field()
          url = scrapy.Field()
          title = scrapy.Field()
          abstract = scrapy.Field()
          day = scrapy.Field()
          cimage_urls = scrapy.Field()
          cimages = scrapy.Field()
      ```
    - 定义Itempipeline，用于数据验证、查重、存储
      Itempipeline时一个独立的python类，其中item_process(self, item, spider)方法是处理item的主要方法
      定义Pipeline如下
      ```
      import json
      from scrapy.exceptions import DropItem
      # Define your item pipelines here
      #
      # Don't forget to add your pipeline to the ITEM_PIPELINES setting
      # See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html
      
      
      class CnblogspiderPipeline(object):
          def __init__(self):
              self.file = open('papers.json', 'wb')
          def process_item(self, item, spider):
              if item['title']:
                  line = json.dumps(dict(item)) + '\n'
                  self.file.write(line)
                  return item
              else:
                  raise DropItem('missing title in {}'.format(item))
      ```
      在settings.py文件中启用该pipeline
      ![](https://upload-images.jianshu.io/upload_images/10339396-579e650572da16b6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      使用内置的imagepipeline下载图片，在settings.py文件中配置如下，注意在spider的parse方法中为item方法添加对应的cimage_urls和cimages域
      ![](https://upload-images.jianshu.io/upload_images/10339396-a475722c4aad23e2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - 项目基本代码如上，启动爬虫时，可以在命令行中启动，也可以在python程序中启动
      `scrapy crawl spidername`启动该爬虫
    - scrapy调试
      使用shell交互式运行爬虫，scrapy.shell.inspect_response程序使程序运行到该位置时进入shell界面，如同使用scrapy shell url启动的一般，方便查看每一个响应。
      `inspect_response(response, self)`
      使用logging模块记录应用程序日志

      


