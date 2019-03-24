# Django建站初步（1）

我们需要理解，一个web应用的本质是处理浏览器request请求返回html页面的容器。开始浏览器产生一个http请求，服务器接收到请求后，生成html文档作为返回数据的body，返回给浏览器，浏览器提取数据进行显示。常用的web容器有apache，tomcat等。如果要动态生成html内容，就需要手动处理上述过程，wsgi定义了一组接口，它要求开发者写出符合该标准的应用程序，wsgi来处理底层http处理的细节。使用原生wsgi编写程序依然十分繁琐，所以出现了功能不断完善的web框架，让程序员免于在底层信息处理中迷失。python最著名的网络框架有两个，一个是flask，小巧轻便，灵活，另一个是Django，框架较为庞大，功能扩展多。在搭建web应用的时候，经常碰到不同项目python包冲突的情况，为此我们使用虚拟环境。虚拟环境pyenv可以，官方的virtualenv亦可，都可以达到项目与系统分离的目的。

1. 了解django的运行流程是重要的
    python web框架一般运行于web容器之中，各个容器都可以配置wsgi标准应用，与web框架进行耦合。apache安装mod_wsgi模块后，可以将浏览器发送的httprequest请求以wsgi标准的形式发送给web后端，web后端处理该请求，返回response，其中的操作包括url映射、通过ORM技术从数据库中取出数据、模板渲染，最后将生成的response内容返回给web容器，由web容器返回给浏览器
2. django的安装
    在虚拟环境中使用pip即可，如果我们要安装特定版本的
    ```
    pip install django==1.8.3
    ```
3. django项目结构与基本概念
    项目是django中最为宏观的概念，即web项目。一个web应用可能需要许多不同的功能模块儿，这些模块儿叫做application。在处理request和response时如果我们希望可以自己对它们做出一些更改，需要通过中间件来完成，使用loader从模板中加载内容。使用如下命令创建一个web应用，名称为webStructure
    ```
    django-admin startproject webStructure
    ```
    该操作会在当前目录下生成一个名为webStructure的文件夹，其目录结构如下
    ![](https://upload-images.jianshu.io/upload_images/10339396-52774e2d4fc97317.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    manager.py是django用来管理项目的工具程序，可以接收命令行参数，在项目内的所有命令都需要该文件的支持。二层目录webStructure下，urls.py文件定义了url与处理url的视图函数之间的映射关系，settings定义了项目配置信息，wsgi则是djangoweb应用的wsgi借口，该文件是web项目的启动入口。在执行以上操作后，我们只是有了一个大体的框架，没有加入任何的功能，进入webStructure目录，使用如下命令新建一个application
    ```
    django-admin startapp mainsite
    ```
    新建立了一个app，此时项目结构如下
    ![](https://upload-images.jianshu.io/upload_images/10339396-5361e3043edd3a08.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    views.py定义了一系列处理url请求的函数，称为视图，models.py定义了网站要使用的数据结构，这里需要说明一下，django使用ORM技术存取数据库信息，这样做的好处是我们无需关心数据库类型，无需关心连接数据库的语句是那些，只要我们按照一定的标准定义数据结构，django自动帮我们完成数据库的操作。mainsite下的migrations文件夹下存放的文件是网站migrate的历史记录，什么是migrate呢，我们定义了models数据结构，要将models文件中的数据结构与数据库关联起来，需要执行migrate操作。在setting文件中，加入我们刚才创建的app
    ![](https://upload-images.jianshu.io/upload_images/10339396-05a09405dbbb51f7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    使用下面的命令执行migrate操作
    ```
    python manage.py migrate
    ```
    看到如下输出
    ![](https://upload-images.jianshu.io/upload_images/10339396-baebad99954b78cf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    每次对models文件做出更改时，都要执行该操作以将更改同步至数据库中。另外，在初始的时候，执行makemigrations命令以创建django与数据库之间的中间文件。该操作将在app目录下创建migrations目录，并在该目录下记录我们对models文件的所有改动（未同步至数据库），执行migrate后，该操作都会同步至数据库中。
4. django中的models
    models文件中定义了网站使用的数据结构，我们在models中定义数据，并通过migrate同步至数据库，随后我们最该类型数据的操作，可以反映至数据库中，这是使用ORM的便捷之处。django默认使用sqlite数据库，如果需要使用其他的数据库类型，需要在settings文件中配置相关选项，并且安装相应的python驱动。使用如下代码在models中定义一个类型
    ```
    # -*- coding: utf-8 -*-
    from __future__ import unicode_literals
    from django.utils import timezone
    from django.db import models
    
    # Create your models here.
    class Post(models.Model):
        title = models.CharField(max_length=200)
        slug = models.CharField(max_length=200)
        body = models.TextField()
        pub_date = models.DateTimeField(default=timezone.now)
    
        def __unicode__(self):
            return self.title
    
        class Meta:
            ordering = ('-pub_date',)
    ```
    同步至数据库中
    ```
    python manage.py makemigrations
    python manage.py migrate
    ```
5. 启用admin管理界面
    django项目创建之时，有web页面管理功能的支持，在使用这个功能之前，需要新建一个管理员用户
    ![](https://upload-images.jianshu.io/upload_images/10339396-1be887dce1450c75.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    在admin文件中，注册我们刚在创建的Post类，让我们可以在web控制台操作该对象
    ```
    # -*- coding: utf-8 -*-
    from __future__ import unicode_literals
    
    from django.contrib import admin
    from .models import Post
    # Register your models here.
    class PostAdmin(admin.ModelAdmin):
        list_display = ('title', 'slug', 'pub_date')
    admin.site.register(Post, PostAdmin)
    ```
    其中PostAdmin类为我们为了更改默认的显示方式而创建的，使用migrate命令将内容同步至数据库中，随后使用如下命令启动测试模式
    `python manage.py runserver 127.0.0.1:8000`
    访问根网页，我没没有为根目录设置任何内容，下面的结果只是告诉我们服务器运行成功了
    ![](https://upload-images.jianshu.io/upload_images/10339396-3cb06dae6526ebf2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    访问管理页面`http://127.0.0.1:8000/admin`,看到如下图所示的登录窗体，使用我们刚才创建的管理员账户登录即可
    ![](https://upload-images.jianshu.io/upload_images/10339396-73560bbdfb30e4e4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    登录以后看到我们刚才创建的Post类
    ![](https://upload-images.jianshu.io/upload_images/10339396-b588b127e4b57c7d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    可以在web控制台手动添加Post实例，这些更改都会被同步到数据库中。



​    


​    


​    



​    