1. scrapy项目结构与各个组件的作用之前已经讨论过了，需要多多掌握的是scrapy内部运行机理，请求如何处理，这样我们才能理解中间件的概念，各个函数的作用。此次项目目标是爬去云起书院小说信息，存入mongodb数据库，使用redis去重，由于使用了redis数据库，可以将爬虫分布式运行。使用scrapy新建爬虫项目
    `scrapy startproject yunqiCrawl`
2. 页面分析
    云起书院小说条目基本如下，需要从中提取小说标题、作者、分类、状态、更新时间、总字数、小说图片url、小说id信息
    ![](https://upload-images.jianshu.io/upload_images/10339396-6b1c44000dcf1990.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    在点击小说具体信息后，进入小说页面，可以看到小说人气如下，同样抓取人气信息
    ![](https://upload-images.jianshu.io/upload_images/10339396-b29d6fbcadacb5b7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    通过scrapy shell url进入scrapy的shell中，使用该response慢慢调试需要构造的xpath语句，使用正确的xpath语句从页面中提取信息，取定xpath语句

3. 项目需要两种类型的Item，一种是小说列表页面的小说信息组成的Item，另一种是小说人气信息，所以先定义两个Item，代码如下，定义了需要的域，存放信息
    `vim yunqiCrawl/items.py`
    ```
    import scrapy
    
    
    class YunqiBookListItem(scrapy.Item):
        # define the fields for your item here like:
        # name = scrapy.Field()
        novelId = scrapy.Field()
        title = scrapy.Field()
        author = scrapy.Field()
        link = scrapy.Field()
        status = scrapy.Field()
        updateTime = scrapy.Field()
        wordsCount = scrapy.Field()
        imageUrl = scrapy.Field()
        novelType = scrapy.Field()
    
    
    class YunqiBookDetialItem(scrapy.Item):
        novelId = scrapy.Field()
        allClick = scrapy.Field()
        allLike = scrapy.Field()
        weekLike = scrapy.Field()
    ```
4. 编写spider模块，爬取页面信息，设置start_url等信息。讨论一些request对象的构造，spider返回request对象后，会经过调度器和下载器处理，返回response，继续交给spider处理，spider中可以定义多个处理函数，在request构造时，通过给callback参数传如处理函数，可以指定，该request经过处理返回的response使用哪个函数来解析。rules定义了一组从网页中提取链接的规则，LinkExtractor对象从页面中找到url，指定callback函数，直接以request的形式返回，使我们直接跳过了提取该页面url的步骤。spider对象的name指定了爬虫名称，allowed_domains指定了允许的域名，start_urls指定了爬虫程序的起点。程序时用yield关键字写成生成器的方式，可迭代
    ```
    # -*- coding: utf-8 -*-
    import scrapy
    from scrapy.linkextractors import LinkExtractor
    from scrapy.spiders import CrawlSpider, Rule
    from yunqiCrawl.items import YunqiBookListItem,YunqiBookDetialItem
    
    class YunqiQqComSpider(CrawlSpider):
        name = 'yunqi.qq.com'
        allowed_domains = ['yunqi.qq.com']
        start_urls = ['http://yunqi.qq.com/bk/so2/n30p1']
    
        rules = (
            Rule(LinkExtractor(
                 allow=r'/bk/so2/n30p\d+'),
                 callback='parse_book_list',
                 follow=True),
        )
    
        def parse_book_list(self, response):
            books = response.xpath('.//div[@class="book"]')
            for book in books:
                novelId = book\
                    .xpath('./div[@class="book_info"]/h3/a/@id').extract_first()
                novelImageUrl = book\
                    .xpath('./a/img/@src').extract_first()
                novelLink = book\
                    .xpath('./div[@class="book_info"]/h3/a/@href').extract_first()
                novelTitle = book\
                    .xpath('./div[@class="book_info"]/h3/a/text()').extract_first()
                novelInfos = book\
                    .xpath('./div[@class="book_info"]/dl/dd[@class="w_auth"]')
                if len(novelInfos) > 4:
                    novelAuthor = novelInfos[0].xpath('./a/text()').extract_first()
                    novelTypeB = novelInfos[1].xpath('./a/text()').extract_first()
                    novelStatus = novelInfos[2].xpath('./text()').extract_first()
                    novelUpdateTime = novelInfos[3].xpath('./text()')\
                        .extract_first()
                    novelWordsCount = novelInfos[4].xpath('./text()')\
                        .extract_first()
                else:
                    novelAuthor = ''
                    novelTypeB = ''
                    novelStatus = ''
                    novelUpdateTime = ''
                    novelWordsCount = ''
                bookItem = YunqiBookListItem(
                    novelId=novelId,
                    title=novelTitle,
                    link=novelLink,
                    author=novelAuthor,
                    status=novelStatus,
                    updateTime=novelUpdateTime,
                    wordsCount=novelWordsCount,
                    novelType=novelTypeB,
                    imageUrl=novelImageUrl
                )
                yield bookItem
                newRequest = scrapy.Request(
                    url=novelLink,
                    callback=self.parse_book_detail
                )
                print 'send request',novelLink
                newRequest.meta['novelId'] = novelId
                yield newRequest
    
        def parse_book_detail(self, response):
            novelId = response.meta['novelId']
            tdlist = response.xpath('.//div[@class="num"]/table/tr/td')
            novelAllClick = tdlist[0]\
                .xpath('./text()').extract_first().split(u'：')[1]
            novelAllLike = tdlist[1]\
                .xpath('./text()').extract_first().split(u'：')[1]
            novelWeekLike = tdlist[2]\
                .xpath('./text()').extract_first().split(r'：')[1]
            bookDetialItem = YunqiBookDetialItem(
                novelId=novelId,
                allClick=novelAllClick,
                allLike=novelAllLike,
                weekLike=novelWeekLike
            )
            yield bookDetialItem
    ```
5. pipeline
    在ItemPipeline中，可以完成数据存储操作，由于需要                                                                  将数据存储在mongodb中，在pipeline中同时完成mongodb数据库的连接。我们需要了解mongodb数据基本操作语法。ItemPipeline有一个特殊的from_crawler类方法，该方法，接受一个crawler对象，返回一个该类的实例，crawler是正在处理的spider，通过这个spider，可以获取到全局信息，比如settings.py文件中的设置信息，在该方法中获取配置信息，open_spider函数在打开spider时执行，close_spider函数在关闭spider时运行，在本例中，分别写入了打开mongodb连接和关闭mongodb连接操作。process_item是处理item的主要方法，在其中进行数据的存储操作
    ```
    import pymongo
    from yunqiCrawl.items import YunqiBookListItem, YunqiBookDetialItem
    
    
    class YunqicrawlPipeline(object):
        def __init__(self, mongo_db, mongo_uri):
            self.mongo_uri = mongo_uri
            self.mongo_db = mongo_db
    
        @classmethod
        def from_crawler(cls, crawler):
            return cls(
                mongo_db=crawler.settings.get('MONGO_DATABASE', 'yunqi'),
                mongo_uri=crawler.settings.get('MONGO_URI')
            )
    
        def open_spider(self, spider):
            self.client = pymongo.MongoClient(self.mongo_uri)
            self.db = self.client[self.mongo_db]
    
        def close_spider(self, spider):
            self.client.close()
    
        def process_item(self, item, spider):
            self.db.bookInfo.insert(dict(item))
    ```
    在settings中添加mongodb的信息
    ![](https://upload-images.jianshu.io/upload_images/10339396-c4e07f688ab09f12.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

6. 针对反爬
    使用随机user-agent头防止爬虫被发现，修改request请求头的操作，应该在下载器下载之前完成，对的，就是下载器中间件，在下载器中间件中，获取settings中的User-agent列表，使用random模块随机选择一个User-Agent头对request头进行修改，随后在settings文件中启用该中间件
    User-Agents列表内容较长，就是一个包含各种agents的列表，写入settings.py文件中即可
    ![](https://upload-images.jianshu.io/upload_images/10339396-0a5b1d10cb771e56.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    编写下载器中间件对request中的User-Agent进行修改，注意理解from_crawler函数，该函数可通过crawler参数获取爬虫全局信息，经常用于获取配置信息，下面的类时在middlewires文件中添加的。
    ```
    class RandomUserAgent(object):
        def __init__(self, agents):
            self.agents = agents
    
        @classmethod
        def from_crawler(cls, crawler):
            return cls(crawler.settings.getlist('USER_AGENTS'))
    
        def process_request(self, request, spider):
            request.headers.setdefault('User-Agent', random.choice(self.agents))
    ```
    随后在settings.py文件中启用该中间件，下载器中间件，系统默认会启用一些，如果需要禁用它们，需要在配置文件中说明，如下，禁用系统本来的user-agent中间件，使用我们自己编写的user-agent中间件
    ![](https://upload-images.jianshu.io/upload_images/10339396-e6f3f8b67d3f3134.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    此外我们可以设置自定义request的headers信息
    ![](https://upload-images.jianshu.io/upload_images/10339396-07cbfc88bd038076.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

    禁用cookie，在配置文件中说明即可
    ![](https://upload-images.jianshu.io/upload_images/10339396-c6cf0e42b259b4b6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
7. 去重
    使用redis缓存去重的方式较为简单，配置redis服务器信息，安装scrapy_redis，随后在配置文件中添加
    ![](https://upload-images.jianshu.io/upload_images/10339396-541e451b79b7bbf9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

    需要说明的是，该去重方式实际上使用了set集合元素的单一性，效率堪忧。关于去重，有专门的BloomFilter算法可以使用，也可以在redis中使用该算法去重，使用github前辈写好的工程项目即可
8. 分布式
    在不使用redis队列时，原始的爬虫数据流动如下图
    ![](https://upload-images.jianshu.io/upload_images/10339396-7a3ed5e872b9524e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    在使用redis队列调度之后，爬虫数据流如下
    ![](https://upload-images.jianshu.io/upload_images/10339396-3885b64825ce584a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    request队列存入redis服务器中，通过redis服务器来管理，这样可以将一个项目放在多台主机上，使用同一台redis服务器，可以达到分布式爬虫的效果。使用redis的步骤也不算繁琐，首先python的redis模块必不可少，使用pip安装即可，另外scrapy与redis对接的模块scrapy_redis也需要提前安装。接下来在配置文件中配置即可，即编辑settings.py文件
    ![](https://upload-images.jianshu.io/upload_images/10339396-7af870b28c1bfce2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    第一行指定了使用redis调度，第二行指定了使用redis队列，第三行是说状态信息会得到保存，以便于停止，重新运行，然后指定了redis主机信息。程序需要mongodb服务与redis服务，最后在命令行启动该爬虫即可。
    tips：该项目源码来自《python爬虫开发与项目实战》


​    


​    

​    
