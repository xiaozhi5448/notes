​        爬虫爬取的数据要经过数据存储步骤存储在磁盘上，对一些数据量较小的项目，数据可以暂时以磁盘文件的形式存储，如果数据量较大，可以选择数据库的方式存储需要的数据。

1. 以文件方式存储数据
    - 存储为json数据
      使用文件存储数据时，一个不得不说的话题是序列化。在面向对象语言设计中，将一个对象变为一个可以存储、发送的可以恢复出原始对象的字符序列的过程，叫做序列化。将序列化后的字符序列恢复为对象的过程叫做反序列化。经常碰到数据以json对象的方式出现，可以使用python的json模块将对象序列化进文件中保存起来
      ```python
      #coding:utf-8
      import json
      from bs4 import BeautifulSoup
      import requests
      user_agent = 'Mozilla/4.0 (compatible; MSIE 5.5; Windows NT)'
      headers={'User-Agent':user_agent}
      r = requests.get('http://seputu.com/',headers=headers)
      soup = BeautifulSoup(r.text,'html.parser',from_encoding='utf-8')#html.parser
      content=[]
      for mulu in soup.find_all(class_="mulu"):
          h2 = mulu.find('h2')
          if h2!=None:
              h2_title = h2.string#获取标题
              list=[]
              for a in mulu.find(class_='box').find_all('a'):#获取所有的a标签中url和章节内容
                  href = a.get('href')
                  box_title = a.get('title')
                  list.append({'href':href,'box_title':box_title})
              content.append({'title':h2_title,'content':list})
      with open('test.json','w') as fp:
          json.dump(content,fp=fp,indent=4)
      ```
    - 存储为csv文件
      csv是一种具有固定格式的表格文件，使用换行符来分隔一行，使用逗号分隔字段，python中使用csv模块操作csv文件。以下程序提取必要信息，存入csv文件中
      ```
      import csv
      import re
      from lxml import etree
      import requests
      user_agent = 'Mozilla/4.0 (compatible; MSIE 5.5; Windows NT)'
      headers={'User-Agent':user_agent}
      r = requests.get('http://seputu.com/',headers=headers)
      #使用lxml解析网页
      
      html = etree.HTML(r.text)
      div_mulus = html.xpath('.//*[@class="mulu"]')#先找到所有的div class=mulu标签
      pattern = re.compile(r'\s*\[(.*)\]\s+(.*)')
      rows=[]
      for div_mulu in div_mulus:
          #找到所有的div_h2标签
          div_h2 = div_mulu.xpath('./div[@class="mulu-title"]/center/h2/text()')
          if len(div_h2)> 0:
              h2_title = div_h2[0].encode('utf-8')
              a_s = div_mulu.xpath('./div[@class="box"]/ul/li/a')
              for a in a_s:
                  #找到href属性
                  href=a.xpath('./@href')[0].encode('utf-8')
                  #找到title属性
                  box_title = a.xpath('./@title')[0]
                  pattern = re.compile(r'\s*\[(.*)\]\s+(.*)')
                  match = pattern.search(box_title)
                  if match!=None:
                      date =match.group(1).encode('utf-8')
                      real_title= match.group(2).encode('utf-8')
                      # print real_title
                      content=(h2_title,real_title,href,date)
                      print content
                      rows.append(content)
      headers = ['title','real_title','href','date']
      with open('test.csv','w') as f:
          f_csv = csv.writer(f,)
          f_csv.writerow(headers)
          f_csv.writerows(rows)
      ```
    - 使用urlretrieve获取多媒体文件
      urllib中的urlretrieve函数可以将多媒体文件下载到本地。以下程序获取天堂图片网的图片，并显示单个图片文件的下载进度
      ```
      import urllib
      from lxml import etree
      import requests
      # 下载过程中调用此函数计算进度
      def Schedule(blocknum,blocksize,totalsize):
          '''''
          blocknum:已经下载的数据块
          blocksize:数据块的大小
          totalsize:远程文件的大小
          '''
          per = 100.0 * blocknum * blocksize / totalsize
          if per > 100 :
              per = 100
          print '当前下载进度：%d'%per
      user_agent = 'Mozilla/4.0 (compatible; MSIE 5.5; Windows NT)'
      headers={'User-Agent':user_agent}
      r = requests.get('http://www.ivsky.com/tupian/ziranfengguang/',headers=headers)
      #使用lxml解析网页
      html = etree.HTML(r.text)
      img_urls = html.xpath('.//img/@src')#先找到所有的img
      i=0
      for img_url in img_urls:
          urllib.urlretrieve(img_url,'img'+str(i)+'.jpg',Schedule)
          i+=1
      ```
2. 数据库存储
    当项目增大，爬虫数量增多，将数据存储在文件中，不便于维护与数据同步、获取。将数据存储在数据库中，有利于数据存取、备份，提高程序可用性。数据库有关系型和非关系型（Nosql）等类型。关系型数据库的典型代表是mysql，即数据以表的形式被组织起来，字段与字段之间因为处于表中的同一行而可以被互相索引，通过这种个关系将数据组织起来，被称为关系型数据库。随着web数据多样化，简单的关系型数据已经不能满足互联网需求，各种各样的数据包括文本、视频等。非关系型数据库的出现就是为了解决此类问题。非关系型数据库中的文档型和键值型较为常用。记录sqlite、mysql、mongodb数据库的常用操作，方便之后查阅。基本的sql查询语法可以查看菜鸟教程。
    - 使用sqlite
      sqlite是关系型数据库的一种，具有体积小、便携等优点，一个文件即一个数据库，使用十分方便，缺点是并发性不好。
      使用之前使用对应系统的包管理工具安装sqlite数据包即可。使用
      `sqlite filename`即可创建一个filename命名的数据库
      创建数据库test.db
      `sqlite test.db`
      创建数据表person，字段有id，name，age
      ```
      sqlite> create table person(
      ...> id integer primary key,
      ...> name varchar(20),
      ...> age integer);
      ```
      向该表中插入数据
      `insert into person(name, age) values('xiaozhi', 22);`
      .help可以查看sqlite数据库帮助，命令一般以.开头
      可以查看数据表的结构，使用output设置输出，使用dump将数据保存至文件中，设置输出分隔符，保存为csv格式。
      事务是数据库系统的一个重要概念，有时候操作的原子性是很重要的，不能出现前端后台数据不一致的情况，这是不合理的。保证一组操作要么执行完毕，要么不执行，是数据库的事务处理完成的功能。在sqlite中使用`start transaction`指令开始一个事务，使用commit提交动作，使用roolback回滚操作
      python操作sqlite时，导入标准库sqlite3，基本操作如下
      ```
      #coding:utf-8
      import sqlite3
      # 使用connect方法连接/创建数据库，可以创建在内存中
      con = sqlite3.connect('./test.db')#con = sqlite3.connect(':memory:')
      # 使用cursor方法获取操作数据库的游标对象
      cur = con.cursor()
      # 使用cursor对象的execute方法执行sql语句
      cur.execute(' CREATE TABLE person (id integer primary key,name varchar(20),age integer)')
      # 两种传参方式，第二种做了参数化处理，防止sql注入
      data="0,'qiye',20"
      cur.execute(' INSERT INTO person VALUES (%s)'%data)
      
      cur.execute(' INSERT INTO person VALUES (?,?,?)',(0,'qiye',20))
      # 使用executemany执行多条sql语句
      cur.executemany(' INSERT INTO person VALUES (?,?,?)',[(3,'marry',20),(4,'jack',20)])
      
      
      cur.execute('SELECT * FROM person')
      # 使用fetchall获取所有查询结果
      res = cur.fetchall()
      for line in res:
          print line
          cur.execute('SELECT * FROM person')
          res = cur.fetchone()
          print res
      
      cur.execute('UPDATE person SET name=? WHERE id=?',('rose',1))
      cur.execute('DELETE FROM person WHERE id=?',(0,))
      # 使用commit方法提交动作
      con.commit()
      con.close()
      # 《python爬虫开发与项目实战》
      ```
    - mysql数据库
      mysql数据库安装不再说明，日常使用我们应该知道怎样连接至本地和远程数据库，数据库权限设置，用户账号密码设置，安全设置，数据库备份设置，数据表更改设置，数据增删查改设置，数据库备份设置，详细参见linux运维内容。python操作mysql数据库使用pymysql，python对数据库操做的封装十分简便、统一
      ```
      #coding:utf-8
      
      import pymysql
      # 使用connect方法连接mysql主机
      con = pymysql.connect(host='192.168.56.101', user='xiaozhi', passwd='wodemima', db='test', port=3306, charset='utf8')
      # 得到游标对象
      cur = con.cursor()
      # 执行sql指令
      cur.execute(' CREATE TABLE person (id int not null auto_increment primary key,name varchar(20),age int)')
      data="'qiye',20"
      # 两种传参方式
      cur.execute(' INSERT INTO person (name,age) VALUES (%s)'%data)
      
      cur.execute(' INSERT INTO person (name,age) VALUES (%s,%s)',('qiye',20))
      # 执行多条sql语句
      cur.executemany(' INSERT INTO person (name,age) VALUES (%s,%s)',[('marry',20),('jack',20)])
      # 提交操作
      con.commit()
      
      cur.execute('SELECT * FROM person')
      
      cur.execute('SELECT * FROM person')
      # 使用fetchall获取所有查询数据
      res = cur.fetchall()
      for line in res:
          print line
          cur.execute('SELECT * FROM person')
          res = cur.fetchone()
          print res
      # 更新数据表
      cur.execute('UPDATE person SET name=%s WHERE id=%s', ('rose', 1))
      cur.execute('DELETE FROM person WHERE id=%s', (0,))
      con.commit()
      con.close()
      ```
    - mongodb，mongodb是文档型数据库，和关系型数据库有许多不同。文档型数据库存储的基本单元是文档，多个文档组成集合collection，由集合组成database。
      ```
      #coding:utf-8
      import datetime
      import pymongo
      # 连接mongodb服务
      client = pymongo.MongoClient('mongodb://localhost:27017/')
      # 使用属性的方式得到数据库和集合
      db = client.papers
      
      collection = db.books
      
      book = {"author": "Mike",
       "text": "My first book!",
       "tags": ["爬虫", "python", "网络"],
      "date": datetime.datetime.utcnow()
       }
      # 向集合中插入数据
      book_id= collection .insert(book)
      
      books = [{"author": "Mike",
       "text": "My first book!",
       "tags": ["爬虫", "python", "网络"],
      "date": datetime.datetime.utcnow()
       },{"author": "qiye",
       "text": "My sec book!",
       "tags": ["hack", "python", "渗透"],
      "date": datetime.datetime.utcnow()
       }]
      books_id = collection.insert(books)
      
      
      collection.find_one({"author": "qiye"})
      for book in collection.find():
          print book
      for book in collection.find({"author": "qiye"}):
          print book
      
      collection.find({"author": "qiye"}).count()
      
      collection.update({"author": "qiye"},{"$set":{"text":"python book"}})
      
      collection.remove({"author": "qiye"})
      ```
      mongodb集群是多台mongodb服务器组合成的集群服务，主节点和从节点通过同步数据完成数据备份，当主节点宕机时，从节点可以代替主节点继续工作，提高系统容错性，搭建mongodb集群作为测试，在本机启动三个mongod服务当作三台主机
      ```
      mongod --dbpath=./data1 --replSet=replset &
      mongod --dbpath=./data2 --port 27018 --replSet=replset &
      mongod --dbpath=./data3 --port 27019 --replSet replset &
      ```
      使用mongo连接主节点进行集群设置
      ![](https://upload-images.jianshu.io/upload_images/10339396-5ab5008b496d9ce9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      使该设置生效
      ![](https://upload-images.jianshu.io/upload_images/10339396-f9566489a637712c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      插入数据
      ![](https://upload-images.jianshu.io/upload_images/10339396-596b45dfd6db83ab.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      在从节点查询
      ![](https://upload-images.jianshu.io/upload_images/10339396-8a92c34e2b3cd711.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      python访问mongo集群
      ```
      from pymongo import MongoClient
      client = MongoClient('mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1,27019', replicaset='replset')
      print client.test.testdb.find_one()
      ```
    - redis数据库与python
      ```
      #coding:utf-8
      import redis
      r = redis.Redis(host='127.0.0.1', port=6379)
      r.set('name', 'qiye')
      print r.get('name')
      
      '''
      pool = redis.ConnectionPool(host='127.0.0.1', port=6379)
      r = redis.Redis(connection_pool=pool)
      r.set('name', 'qiye')
      print r.get('name')
      '''
      ```





​      