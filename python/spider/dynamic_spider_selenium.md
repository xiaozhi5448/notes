1. ajax技术是用于异步更新网页内容的一种技术，用户更新了信息，当网页只需要部分更新时，仅传递需要更新的那部分信息，提高网络效率，有时候网页的内容由ajax请求后的内容生成，使用静态爬虫难以获取到需要的数据，比如点击一个按钮，生成的网页内容，难以在第一次访问网页时就获取到。碰到这种情况，可以使用抓包工具或代理软件观察其中的ajax请求，观察对比请求中的参数，手动构造该请求，获取相关数据，随着网站维护人员安全意识的提高，构造请求变得越来越困难，协议分析能力需要我们长期的练习。firefox与chrome都有功能强大的控制台，在控制台中查看网络请求参数，js响应内容，调试网页。我们也可以使用burpsuite和zap代理工具观察http请求与响应，使用wireshark抓包工具获取数据包获取信息
2. 另一种动态网页获取方法是直接在内存中启动浏览器，使用python操作接口，操作浏览器中的动作，可以获取其中的数据，获取登陆后的cookie，取出cookie为下次所用，文章重点描述这种简单但是资源占用较高的方式
  python中的自动化测试工具selenium，和浏览器联动实现需求。
  `pip install selenium --user`
  随后下载selenium对这两者的驱动，将驱动所在文件夹加入系统环境变量path中，下载链接位于https://www.seleniumhq.org/download/
  ![](https://upload-images.jianshu.io/upload_images/10339396-3d65336dc32155b0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
  下载这两个驱动文件，放入同一文件夹，随后将该文件夹加入系统环境变量path中，在我的电脑上是修改.bashrc文件 
  `PATH="${PATH:+:${PATH}}/home/xiaozhi/tools/geckodriver/:"; export PATH`
  selenium基本操作如下,目的是登陆百度百科，并搜索词条python
   ```
   In [1]: from selenium import webdriver
   
   In [2]: from selenium.webdriver.common.keys import Keys
   
   In [3]: import time
   # 启动firefox
   In [4]: driver = webdriver.Firefox()
   # 访问百度百科
   In [5]: driver.get('https://www.baidu.com')
   # 获取输入框
   In [6]: in_tag = driver.find_element_by_id('kw')
   # 填写数据
   In [7]: in_tag.send_keys('python')
   # 获取搜索按钮
   In [8]: sea_tag = driver.find_element_by_id('su')
   # 点击发送
   In [9]: sea_tag.submit()
   ```
   ![](https://upload-images.jianshu.io/upload_images/10339396-54c520b4b5fcce57.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
   selenium可以在浏览器中完成许多操作，切换窗口，切换frame，获取完整网页，获取cookie等
   元素选取可以使用许多方式，css选择器，类名、id名、标签名、通过xpath选取等，
   ![](https://upload-images.jianshu.io/upload_images/10339396-19cab321e507c8ae.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
   说一下通用的方法find_element与find_elements方法，这两个方法第一个参数指定选择元素的方式，第二个参数给出条件
   ```
   from selenium.webdriver.common.by import By
   driver.find_element(By.ID, '8001')
   ```
   可以使用的方式如下
   ![](https://upload-images.jianshu.io/upload_images/10339396-00a653047c978357.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
   接下来看一个例程，如何启动无界面的浏览器，获取动态完整网页，有时候由于页面加载需要一定时间，在元素还没加载出来的时后代码就开始执行，程序就会报错，可以设置等待，指定某个元素出现后再继续执行，称为显式等待，另外可以使用线程休眠的方法。
   ```
   #!/usr/bin/env python
   # encoding:utf-8
   import time
   from selenium import webdriver
   from selenium.webdriver.firefox.options import Options
   from bs4 import BeautifulSoup
   from selenium.webdriver.support.ui import WebDriverWait
   from selenium.webdriver.support import expected_conditions as Exp_con
   
  # 添加firefox浏览器启动选项 
   options = Options()
   options.add_argument('-headless')
   driver = webdriver.Firefox(firefox_options=options)
   
   driver.get('http://hotel.qunar.com')
   
   ele_toCity = driver.find_element_by_id('toCity')
   ele_fromDate = driver.find_element_by_id('fromDate')
   ele_searchBtn = driver.find_element_by_class_name('search-btn')
   ele_toDate = driver.find_element_by_id('toDate')
   
   ele_toCity.clear()
   ele_toCity.send_keys(u'上海')
   ele_fromDate.clear()
   ele_fromDate.send_keys('2018-06-07')
   ele_toDate.clear()
   ele_toDate.send_keys('2018-06-10')
   ele_searchBtn.click()
   # 显示等待元素的一般方法，使用WebDriverWait，第一个参数为dirver，就是启动的浏览器，第二个参数为超时时间，如果时间过长会抛出异常，title_contains是判断条件的一种，判断条件有许多
   try:
       WebDriverWait(driver, 10).until(
           Exp_con.title_contains(u'上海')
       )
   except Exception,e:
       print e
   # 线程休眠
   time.sleep(5)
   # 将页面滑动至底部的js代码
   js = 'window.scrollTo(0, document.body.scrollHeight);'
   driver.execute_script(js)
   time.sleep(5)
   # 获取到页面完整的源代码，之后可以使用BeautifulSoup提取数据
   html_const = driver.page_source
   print html_const
   ```
   WebDriverWait的判断条件可以是以下几种
   ![](https://upload-images.jianshu.io/upload_images/10339396-6fe05b306856c8d5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

  ![](https://upload-images.jianshu.io/upload_images/10339396-25ad9218c1216b4a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
   接下来看一个使用cookie的例子，打开浏览器，使用正常方式登陆知乎，取出cookies，再使用requests登陆知乎，可以避免复杂的协议分析过程
   ```
   #!/usr/bin/env python
   from selenium import webdriver
   from selenium.webdriver.common.keys import Keys
   import requests
   
   
   chrome = webdriver.Chrome()
   chrome.get('https://www.zhihu.com')
   # 选择登陆方式
   login_choice = chrome.find_element_by_xpath('//div[@class="SignContainer-switch"]/span')
   login_choice.click()
   name_tag = chrome.find_element_by_name('username')
   password_tag = chrome.find_element_by_name('password')
   name_tag.send_keys('18392136027')
   password_tag.send_keys('your password')
   login_btn = chrome.find_element_by_tag_name('button')
   name_tag.send_keys(Keys.RETURN)
   raw_cookies = chrome.get_cookies()
   
   
   session_zhihu = requests.Session()
   for cookie in raw_cookies:
       session_zhihu.cookies.set(cookie['name'], cookie['value'])
   headers = {}
   user_agent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
   headers['User-Agent'] = user_agent
   res = session_zhihu.get('https://www.zhihu.com/', headers=headers)
   print res.text
   chrome.close()
   session_zhihu.close()
   ```
   部分代码来自《python爬虫开发与项目实战》







​    