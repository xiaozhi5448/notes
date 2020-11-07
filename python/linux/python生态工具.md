# python生态工具

python是一门十分强大的语言，现在已经应用到各个领域中，深度学习、云计算、人工智能等等，因为python有很强的扩展性，有相当一部分的开源项目可以扩展python的功能。python在linux运维中也有很广泛的应用，以下是一些有用的小工具

## 使用SimpleHTTPServer快速启动简易服务器

`python -m SimpleHTTPServer`
-m选项可以使模块以脚本程序的方式运行，默认监听8000端口，以浏览器http访问，可以当文件服务器使用，用于文件共享

## 使用json解析json字符串

在命令行遇到json字符串时，想将其转换为json对象，可以使用python标准库中的json.tool工具
`echo 'str_json' | python -m json.tool`

## 检查某第三方库是否正确安装

可以使用python -c选项执行import语句

   ```
   python -c "import test123"
   ```
  ![](https://upload-images.jianshu.io/upload_images/10339396-b886b5ba64879e38.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
### pip高级用法

#### pip简介

pip是一款优秀的python包管理工具，提供了丰富的功能

   - 支持虚拟环境
   - 从requirements.txt中安装依赖
   - 处理二进制格式（.whl）
   - 下载安装分步进行，而且不会出现中间状态
   - 将软件包下载到本地再安装
       ![](https://upload-images.jianshu.io/upload_images/10339396-b5e843a7769f4cf7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

   - pip命令帮助，使用-h选项查看命令帮助
```
使用show查看软件包信息，使用check检查依赖是否安装完整，使用list查看已安装的包，使用install -r从requirements.txt中安装依赖，使用freeze导出依赖，也可以将软件包下载到本地，随后从本地安装
![](https://upload-images.jianshu.io/upload_images/10339396-5bbaea19d83e95f4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
```
## 交互式编程工具ipython

可以使用软件包管理工具安装ipython，yum或apt-get，具有与linux shell相当的功能，十分简便，自动缩进、命令补全、搜索历史、执行shell命令、语法高亮

## 使用python调试器pdb

## 使用pycodestyle检查代码是否符合pep8规范

`pip install pycodestyle`

## 使用autopep8格式化代码

`pip install autopep8`

## 使用pyenv管理工作环境

使用pyenvinstaller 安装更为简单并且带有更多插件

我们可以从github下载安装pyenv工具



下载至用户主目录下的.pyenv文件夹，随后在bash_profile文件中添加环境变量
![](https://upload-images.jianshu.io/upload_images/10339396-e5aa772b7db2ba05.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
执行脚本文件
![](https://upload-images.jianshu.io/upload_images/10339396-7112308dab9009ef.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
查看支持的版本
```pyenv install --list```
安装某版本python
```pyenv install -v x.x.x```
查看已安装版本
```pyenv versions```
选择系统默认的python版本
```pyenv global x.x.x```
卸载python某版本
```pyenv uninstall x.x.x```
安装python的依赖

```shell
sudo apt-get install gcc make build-essential libssl-dev zlib1g-dev \
libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev \
libncursesw5-dev xz-utils tk-dev libffi-dev liblzma-dev
```

直接使用pyenv install下载python源码包时间过长，先下载python包至.pyenv/cache/随后执行安装过程

## 使用virtualenv管理不同的项目

有时候开发不同项目的时候我们会用到不同的环境，如果不加以隔离，项目间相互干扰，破坏系统python环境。在安装了pyenv后，需要安装pyenv-virtualenv插件管理python不同的项目，virtualenv可以创建针对具体项目的虚拟环境，当进入某虚拟环境时，python作出的更改仅仅对当前项目有效，而不改变系统python环境，起到保护系统环境的作用安装方法可见github
克隆软件包
`git clone https://github.com/pyenv/pyenv-virtualenv.git $(pyenv root)/plugins/pyenv-virtualenv`
随后在bash_profile中加入
`eval "$(pyenv virtualenv-init -)"`
执行
`source ~/.bash_profile`
创建项目

```
pyenv virtualenv 2.7.14 first_project
pyenv virtualenv 3.6.5 second_project
```
查看项目
`pyenv virtualenvs`
进入某项目工作环境
`pyenv activate first_project`
退出某工作环境
`pyenv deactivate second_project`
 删除某环境
`pyenv virtualenv-delete second_project`

### 安装报错

#### libssl

  在debian与ubuntu系列中，使用`pyenv install -v 2.7.9`时报错
```
  The Python ssl extension was not compiled. Missing the OpenSSL lib
```
  原因在于系统使用的ssl库为1.1版本，但是编译该版本的python需要1.0
  ![](https://upload-images.jianshu.io/upload_images/10339396-fac939588add556f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
  解决方法是安装libssl1.0
  `sudo apt-get install libssl1.0-dev`

#### ctypes

![1566222177641](/home/xiaozhi/Documents/notes/python/linux/assets/1566222177641.png)

缺少libffi-dev依赖，安装即可

