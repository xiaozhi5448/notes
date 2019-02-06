1. 爬虫是什么
    爬虫是一段用来抓取互联网数据的一段程序，给定一个位置（url）为起点，爬虫从这个url开始，爬去互联网上的网页数据，爬虫又叫spider，爬行在互联网上的一只蜘蛛。爬取数据是一个不断进行的过程，通过种子Url获取基本网页，从获取的数据中提取出需要的url，循环获取数据，要完成爬虫的功能，最重要的操作就是数据获取与数据处理了，python中用于获取网络数据的库有很多，用户解析数据的库也有很多，非常适合于编写爬虫程序。
    通用爬虫结构如下
    ![](https://upload-images.jianshu.io/upload_images/10339396-45db6cbe4a434043.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2. python中有助于爬虫操作的库
    - requests（请求）
      相信requests大家都不陌生，requests是用来方便我们执行网络操作的第三方库，相比与标准库urllib、urllib2可以让我们操作网络数据时十分方便
    - Beautiful Soup（解析）
      beautiful soup是用于从html、xml数据中提取数据的工具库，让用户免于在复杂的正则表达式中挣扎，通过一些接口可以直接从文档中筛选出需要的数据，虽然如此，学习正则表达式还是很有必要的
3. beautiful soup库简单使用(html解析）
    - 安装
      bs4属于第三方库，使用之前需要先安装，使用pip
      ```
      pip install beautifulsoup4 --user
      ```
      导入该库时
      ```
      import bs4
      ```
    - 使用文件对象或html文本字符串初始化BeautifulSoup对象
      ```
      In [3]: html_doc = """
         ...: <html><head><title>The Dormouse's story</title></head>
         ...: <body>
         ...: <p class="title"><b>The Dormouse's story</b></p>
         ...: 
         ...: <p class="story">Once upon a time there were three little sisters; and their names were
         ...: <a href="http://example.com/elsie" class="sister" id="link1">Elsie</a>,
         ...: <a href="http://example.com/lacie" class="sister" id="link2">Lacie</a> and
         ...: <a href="http://example.com/tillie" class="sister" id="link3">Tillie</a>;
         ...: and they lived at the bottom of a well.</p>
         ...: 
         ...: <p class="story">...</p>
         ...: """
      In [5]: soup = BeautifulSoup(html_doc, 'html.parser')
      ```
    - 可以使用标准缩进格式输出html文本
      ```
      In [6]: print soup.prettify()
      ```
    - soup将htmldoc解析为一颗类似于dom的树，可以通过.标识符访问其中的节点，通过[]标识符访问节点的属性，通过.string或.strings得到该结点内容，节点也叫tag
      ```
       In [7]: soup.head.title
       Out[7]: <title>The Dormouse's story</title>
       
       In [8]: soup.p['class']
       Out[8]: [u'title']
       
       In [9]: soup.a['href']
       Out[9]: u'http://example.com/elsie'
       
       In [14]: soup.p.name
       Out[14]: u'p'
      
       In [10]: soup.a.string
       Out[10]: u'Elsie'
       
       In [11]: for info in soup.body.strings:
           ...:     print info
           ...:     
      ```
      获取所有文本内容
      ```
      print soup.get_text()
      ```
      通过attrs属性访问tag的所有属性
      ```
      In [16]: soup.a
      Out[16]: <a class="sister" href="http://example.com/elsie" id="link1">Elsie</a>
      
      In [17]: soup.a.attrs  
      Out[17]: {u'class': [u'sister'], u'href': u'http://example.com/elsie', u'id': u'link1'}
      ```
    - 遍历文档树
      - 使用children和contents属性获取直接子节点，使用descendant属性获取子孙节点。注意contents返回列表
        ```
        In [20]: for child in soup.body.children:
               ...:     print child
               ...:     
        In [22]: for child in soup.body.descendants:
              ...:     print child
              ...:     
        In [21]: soup.body.contents
        Out[21]: 
        [u'\n',<p class="title"><b>The Dormouse's story</b></p>,
        ```
      - 使用string，strings，stripped_strings获取节点内容，后两者返回迭代器，用户循环迭代
        ```
        In [23]: soup.a.string
        Out[23]: u'Elsie'
        
        In [27]: for string in soup.a.stripped_strings:
              ...:     print string
              ...:     
        Elsie
        ```
      - 父节点parent和所有父节点parents，兄弟节点next_sibling\previous_sibling，以及前后节点next_element\previous_element。注意，当得到一个tag时，打印出来总是包含其子节点的
        ```
        soup.a.parent
        for item in soup.s.parents:
            print item
        
         In [32]: soup.a
         Out[32]: <a class="sister" href="http://example.com/elsie" id="link1">Elsie</a>
         
         In [33]: soup.a.next_sibling 
         Out[33]: u',\n'
         
         In [34]: soup.a.next_sibling.next_sibling
         Out[34]: <a class="sister" href="http://example.com/lacie" id="link2">Lacie</a>
        
         In [36]: soup.a.next_element
         Out[36]: u'Elsie'
         
         In [37]: soup.a.next_element.next_element
         Out[37]: u',\n'
         
         In [38]: soup.a.next_element.next_element.next_element
         Out[38]: <a class="sister" href="http://example.com/lacie" id="link2">Lacie</a>
         
         In [39]: soup.a.next_element.next_element.next_element.next_element
         Out[39]: u'Lacie'
        ```
    - 搜索文档树使用find_all.搜索当前tag的所有子节点，查找符合要求的节点。参数name表示节点名称，attrs表示节点具有的属性，也可以在该位置传入正则表达式，soup将以match的方式匹配节点，True可以匹配任何值。attrs指定了该节点需要具备的属性及其值。kwargs，该参数会被当作指定tag的属性来搜索
      ```
      soup.find_all(name=None, attrs={}, recursive=True, text=None, limit=None, **kwargs)
      In [41]: soup.find_all('head')
      Out[41]: [<head><title>The Dormouse's story</title></head>]
      
      In [42]: soup.find_all('a',attrs={'id':'link1'})
      Out[42]: [<a class="sister" href="http://example.com/elsie" id="link1">Elsie</a>]
      In [43]: soup.find_all(['a', 'title'])
      Out[43]: 
      [<title>The Dormouse's story</title>,
       <a class="sister" href="http://example.com/elsie"           id="link1">Elsie</a>,
       <a class="sister" href="http://example.com/lacie" id="link2">Lacie</a>,
       <a class="sister" href="http://example.com/tillie" id="link3">Tillie</a>]
      ```
      kwargs参数举例。
      搜索属性
      ```
      In [44]: soup.find_all(id='link1')
      Out[44]: [<a class="sister" href="http://example.com/elsie" id="link1">Elsie</a>]
      ```
      使用class
      ```
      In [45]: soup.find_all(class_='sister')
      Out[45]: 
      [<a class="sister" href="http://example.com/elsie" id="link1">Elsie</a>,
       <a class="sister" href="http://example.com/lacie" id="link2">Lacie</a>,
       <a class="sister" href="http://example.com/tillie" id="link3">Tillie</a>]
      ```
      text参数用于搜索文档中字符串的内容
      ```
      In [48]: soup.find_all(text=re.compile('.*?l.*?', re.I))
      Out[48]: 
      [u'Once upon a time there were three little sisters; and their names were\n',
       u'Elsie',
       u'Lacie',
       u'Tillie',
       u';\nand they lived at the bottom of a well.']
      ```
    - 使用css选择器
      ```python
       In [49]: soup.select('head > title')
       Out[49]: [<title>The Dormouse's story</title>]
       
       In [50]: soup.select('p > # link1')
       Out[50]: []
       
       In [51]: soup.select('p > #link1')
       Out[51]: [<a class="sister" href="http://example.com/elsie" id="link1">Elsie</a>]
       
       In [52]: soup.select('p > .sister')
       Out[52]: 
       [<a class="sister" href="http://example.com/elsie" id="link1">Elsie</a>,
        <a class="sister" href="http://example.com/lacie" id="link2">Lacie</a>,
        <a class="sister" href="http://example.com/tillie" id="link3">Tillie</a>]
       
       In [53]: soup.select('#link1 ~ .sister')
       Out[53]: 
       [<a class="sister" href="http://example.com/lacie" id="link2">Lacie</a>,
        <a class="sister" href="http://example.com/tillie" id="link3">Tillie</a>]
       
       In [54]: soup.select('#link1 + .sister')
       Out[54]: [<a class="sister" href="http://example.com/lacie" id="link2">Lacie</a>]
       
       In [55]: soup.select('#link1')
       Out[55]: [<a class="sister" href="http://example.com/elsie" id="link1">Elsie</a>]
       
       In [56]: soup.select('title')
       Out[56]: [<title>The Dormouse's story</title>]
      ```
4. 使用xpath提取html文档中的节点元素
    1. 简介
      xpath是用来从xml文档中提取信息的工具，但是他也可以很好的工作在html文档中。
    2. 基本概念与语法解析
    - 节点
      节点的概念较容易理解，html文档被解析为树状结构，每个从根，到树叶，都是一个节点。节点类型包括文档节点，代表整个文档树，元素节点，代表某个标签，属性节点，代表某个元素的属性，文本节点，某节点的内容。节点的父子关系可以继承，还有兄弟节点，同胞，先辈，后代节点，根据名称理解
    - 语法
      xpath语法规定了选取节点依据的规则，选取节点时，根据给出的路径或步来选取，常见路径表达式如下
      ![](https://upload-images.jianshu.io/upload_images/10339396-cdc4770c59f3b558.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      下面是一些实例
      - classroom 选取classroom的所有子节点
      - /classroom 选取根元素classroom
      - classroom/student 选取classroom子元素中的student元素
      - //student 选取所有student元素
      - classroom//student 选取classroom后代元素的student元素
      - @lang 选取名称为lang的所有属性

      使用谓语限定选择条件，谓语写在中括号中，用于进一步限制选择条件。在选择时，可以使用通配符和“|”
      - classroom/student[1] 选择classroom的第一个student子元素
      - classroom/student[last()]选择classroom的最后一个student元素
      - classroom/student[position() < 3]选择classroom的前两个student元素
      - //name[@lang]选取所有含有属性lang的name元素
      - //name[@lang='en']选取lang属性为’en'的元素
      - classroom//student[age > 20]选取classroom的所有student元素，并且student元素的age元素的值大于20
      - //* 选取所有
      - //student/name | //student/age 选取所有student的name和age元素
    - xpath中轴的概念
      轴定义了所选节点与当前节点之间的树关系。xpath的选择路径既可以是相对的，也可以是绝对的。绝对路径以/开头，相对路径以元素开头。step/step/step,其中step语法详细格式为`轴名称::节点测试[谓语]`。xpath中的轴包括
      child子元素、
      parent父节点、
      ancestor先辈节点、
      ancestor-of-self先辈or本身、
      descendant后代节点、
      preceding当前节点之前的所有节点、
      following当前节点之后的所有节点、
      preceding-sibling当前节点前的所有同级节点
      following-sibling当前节点后的所有同级节点
      - 下面是一些实例
        - /classroom/child::student选取classroom子元素的所有student节点
        - //student/descentdant::id选取以student节点为父节点的id元素
    - xpath中的运算符
      xpath中的运算符主要用在谓语的位置判断比较元素的值
      `//student[age > 3]`
      类似的我们可以使用各种判断符号来判断，还可以使用or、and、mod表示逻辑








​        






​      