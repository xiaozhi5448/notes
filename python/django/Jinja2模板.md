# Jinja2模板

1. Django通过渲染模板来生成动态页面。但是在使用之前需要先指定模板文件的位置
    ![](https://upload-images.jianshu.io/upload_images/10339396-184dba8e9a67c860.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    BACKEND可以指定后端模板引擎，此处使用jinja2，在项目根目录下创建template文件夹，将模板文件都放入该文件夹下即可
2. jinja2语法初步
    在jinja2中，有三种语法
    - {{}}变量取值
    - {% %}控制结构
    - {# #}注释

    变量取值相当于占位符，将传递过来的变量名称放入其中，随后渲染为值
    `{{ var }}`
    控制结构和python中控制结构类似
    ```
    {% if bool %}
    do something
    {% elif bool2 %}
    do others
    {% else %}
    do 
    {% endif %}
    
    {% for post in posts %}
    <p>post.body</p>
    {% empty %}
    <p>没有文章</p>
    {% endfor %}
    ```
3. jinja2中的过滤器
    过滤器是jinja2中的一些内置函数，用来对输入的变量内容进行过滤，更改
    `{{ var | filter }}`
    常用的filter如下
    ![](https://upload-images.jianshu.io/upload_images/10339396-3176b3dbf8641de8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
4. jinja2中的宏
    宏就像是C语言中的宏定义，将一段代码定义为宏，再次使用时直接使用定义的宏，就行使用该段代码一样，还可以传递参数。宏的行为就像函数一样。jinja2中使用macro关键字定义宏
    ```
    {% macro input(name,age=20) %}
    <input type='text' name='{{name}}' value='{{age}}'> 
    {% endmacro %}
    <p>{{input('xiaozhi')}}</p>
    <p>{{input('xiaohong',21}}</p>
    ```
5. jinja2中的继承
    jinja2中使用block与endblock来定义一个块，块中的内容在子模板中可以被重写。子模板使用extends关键字来继承一个模板，并且在当前模板中通过block声明相同的块来覆盖重写父模板中的块，可以使用super()来引用父块中的内容
6. 在模板中使用静态文件
    网页中有时候需要放置一些图片之类的文件，需要在模板中加载。在这之前，setting文件中需要先指明静态文件的位置
    ![](https://upload-images.jianshu.io/upload_images/10339396-4ecfa4e4c553c4d8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    随后在需要使用静态文件的模板中
    ![](https://upload-images.jianshu.io/upload_images/10339396-beb32fe20ff30731.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
