# Django建站初步(2）

## Django中视图的概念

一般来说，web应用包含两部分，前端页面和后端逻辑。前台通过post或get请求与后台交互，后台根据传递的参数进行系列动作，返回需要的内容。在Django中，这些后台逻辑，就是视图需要完成的工作。表面上看，视图是定义在views.py文件中的一系列函数，当用户请求某个网址时，根据urls.py文件中的动态网址映射到某个视图函数，执行某个动作，并返回HTTPResponse对象，返回给客户端

## Django中模型的概念

模型是网站要使用的数据结构，比如用户模型，定义了用户这个类别的数据结构，可能包含用户名、密码、邮箱地址等等信息。本来这些信息需要自己组织在数据库的表中，用户认证时，我们从数据库表中取出对应内容进行比对。Django使用ORM技术为我们简化了上述过程，我们仅需创建一个类，包含必要的字段，django会自动为我们在数据库中创建该类对应的表，而且为我们简化数据查询操作，这些类，定义自models.py文件中

## Django中模板的概念

html页面的内容应该是可重用的，页面是动态的、可渲染的，才有可能建立动态的网站，python中的jinja2模板引擎很好的应用在了web开发中，将原始html页面看做模板，模板中有一些变量，变量的内容会根据运行时视图函数传递过来的参数而变化，从而达到动态渲染的目的

## 创建我们的视图函数

继续上一节的例子，我们想在前端页面上看到我们刚才创建的Post，需要做的操作有，编写一个查询文章的视图函数，并且添加对应的url映射
在views.py文件中添加如下函数，查询文章内容，返回响应
```
def homepage(request):
    # 查询对应的内容
    posts = Post.objects.all()
    now = datetime.now()
    # get_template是Django中一个加载模板的函数，使用之前需先导入
    template = get_template('index.html')
    # render函数用来渲染html页面，将必要的数据传过去，locals（）是python的一个全局
    # 函数，表示所有本地变量字典
    html = template.render(locals())
    return HttpResponse(html)
```
在urls.py中添加url映射，'^$'表示匹配空内容，在url路径就表示根路径
![](https://upload-images.jianshu.io/upload_images/10339396-add784f886951192.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
使用Django模板时，需要在settings文件中进行一些配置，告诉Django引擎，模板在项目的哪个位置，好让get_template函数可以找到模板并进行渲染。一般将模板文件放在项目根目录的templates文件夹中，在项目根目录创建templates文件夹，并在settings文件中添加templates配置
![](https://upload-images.jianshu.io/upload_images/10339396-3a0996f48870beef.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
项目中的模板文件，都放在templates文件夹中
刚才视图函数中我们还渲染了index.html页面，该页面使用模板的继承方法，继承了base页面，其中加载了bootstrap样式，可以让输出的内容变得更美观（关于jinja2语法再起章节）。另外，在jinja2中使用静态文件时，不像一般的web应用引擎一样直接引用那么简单。需要在settings文件中指明静态文件所在目录
![](https://upload-images.jianshu.io/upload_images/10339396-656762a27da02f24.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

base.html页面如下
```
<!DOCTYPE html>
<html>
{% load staticfiles %}

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="{% static 'bootstrap/css/bootstrap.css' %}">
    <link rel="stylesheet" href="{% static 'bootstrap/css/bootstrap-grid.css' %}">
    <link rel="stylesheet" href="{% static 'bootstrap/css/bootstrap-grid.min.css' %}">
    <link rel="stylesheet" href="{% static 'bootstrap/css/bootstrap.min.css' %}">
    <link rel="stylesheet" href="{% static 'bootstrap/css/bootstrap-reboot.css' %}">
    <link rel="stylesheet" href="{% static 'bootstrap/css/bootstrap-reboot.min.css' %}">
    <title>
        {% block title %} {% endblock %}
    </title>
</head>

<body>
    <div class="container-fluid">
        {% include "header.html" %}
        <div class="row">
            <div class="col-sm-4">
                <div class="card">
                    <div class="card-header">
                        <h3>MENU</h3>
                    </div>
                    <div class="card-body">
                        <div class="list-group">
                            <a href='/' class="list-group-item">HOME</a>
                            <a href='#' class="list-group-item">实时新闻</a>
                            <a href='#' class="list-group-item">电视新闻</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-8">
                <div class="card">
                    <div class="card-header">
                        {% block headmessage %}{% endblock %}
                    </div>
                    <div class="card-body">
                        {% block content %}{% endblock %}
                    </div>
                    <div class="card-footer">
                        {% include "footer.html" %}
                    </div>
                </div>
            </div>
        </div>

    </div>
    <script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
    <script src="{% static 'bootstrap/js/bootstrap.bundle.js' %}"></script>
    <script src="{% static 'bootstrap/js/bootstrap.bundle.min.js' %}"></script>
    <script src="{% static 'bootstrap/js/bootstrap.js' %}"></script>
    <script src="{% static 'bootstrap/js/bootstrap.min.js' %}"></script>
</body>

</html>
```
index.html内容如下
```
{% extends "base.html" %} 
{% block title %} 欢迎光临我的博客 {% endblock %} 
{% block headmessage %}
<h3>本站文章列表</h3>
{% endblock %} 
{% block content %} 
    {% for post in posts %}
        <div class="card">
            <div class="card-header">
                <p>
                    <a href="/post/{{post.slug}}">{{post.title}}</a>
                </p>
            </div>
            <div class="card-body">
                <p>
                    {{ post.body | truncatechars:40 }}
                </p>
            </div>
            <div class="card-footer">
                <p>
                    发布时间:{{ post.pub_date | date:"Y M d, h:m:s"}}
                </p>
            </div>
        </div>

{% endfor %} 
{% endblock %}
```
我们重启该网页应用，访问根页面，看到如下结果，使用循环方式显示了文章列表，包含了文章标题，文章摘要，以及文章的发布时间。其中文章标题为超链接格式
![](https://upload-images.jianshu.io/upload_images/10339396-6d8cbd33d1010e51.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

加入显示文章内容的功能
在index.html为文章标题创建超链接，连接目的为/post/{{slug}}，需要创建视图函数，显示文章的内容，并且定义url映射，创建页面进行显示
views.py添加如下函数
```
def showpost(request, slug):
    template = get_template('post.html')
    try:
        post = Post.objects.get(slug=slug)
        if post != None:
            html = template.render(locals())
            return HttpResponse(html)
    except:
        return redirect('/')
```
urls.py添加url映射
![](https://upload-images.jianshu.io/upload_images/10339396-8a06e725d0cafb86.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
post.html模板文件内容如下
```
{% extends "base.html" %}
{% block title %}
    {{ post.title }} -->文学天地
{% endblock %}
{% block headmessage %}
    <h3>{{post.title}}</h3>
    <a href="/">come back</a>
{% endblock %}
{% block content %}
    <p>
        {{post.body}}
    </p>
{% endblock %}
```
重启服务，点击文章标题，看到文章详情
![](https://upload-images.jianshu.io/upload_images/10339396-b6d9ee5e8609cbf7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 返回JSON数据

django除了返回网页数据以外还可以返回json数据

```python
from django.http import HttpResponse, JsonResponse
import json
# Create your views here.
def close_door(request):
    result = {'key':"hello"}
    return HttpResponse(json.dumps(result, ensure_ascii=False), 		        content_type="application/json,charset=utf-8")
```

或

```
result = {'key': "hello"}
return JsonResponse(result)
```



## 总结（Django网站开发步骤）

- 需求分析，分e析项目需求，进行项目初步规划
- 数据库设计，根据需求分析的结果，设计网站需要操作的数据结构
- 设计网站页面
- 使用virtualenv创建项目虚拟环境
- 使用pip安装django包
- 使用django-admin startproject projectname生成项目
- 使用django-admin startapp appname生成模块，在settings文件中添加该app
- 创建templates文件夹，并在settings文件中配置templates目录内容，讲所有的模板，页面文件都放在该文件夹下
- 创建static文件夹，在settings文件中配置静态文件目录，并将所有静态文件放在该文件夹下
- 编辑models.py文件，定义网站使用的数据结构（在此之前配置网站使用的数据库）
- 编写views.py文件，导入之前创建的model，处理request请求
- 编写urls.py，进行url映射
- python manage.py makemigrations
- python manage.py migrate
- python manage.py runserver进行网站测试

