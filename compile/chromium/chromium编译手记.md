# chromium编译手记

### 1.阅读官方文档，准备环境

---

在github官网搜索chromium，找到项目仓库地址如下

https://github.com/chromium/chromium.git

在docs/readme.txt中查看项目简介

![](D:\dev_envir\docs\notes\compile\chromium\assets\first.png)

在readme中可以找到在各个系统构建chrome的说明

![](D:\dev_envir\docs\notes\compile\chromium\assets\Snipaste_2019-02-26_20-46-54.png)



### 2. 配置编译环境

---

#### 2.1 vsual studio 

版本与库的要求如下图，如果未安装的话，通过visual studio安装程序安装即可

![](D:\dev_envir\docs\notes\compile\chromium\assets\Snipaste_2019-02-26_20-49-50.png)

如果已经安装了visual studio，在开始菜单中可以找到visual studio installer，打开之后点击修改，随后应用即可安装需要的工具

![](D:\dev_envir\docs\notes\compile\chromium\assets\Snipaste_2019-02-26_21-10-02.png)

还需要安装sdk debugging tools，win10sdk已经通过visual studio安装以后，可以通过如下途径安装sdk debugging tools

控制面板->software->program and features->Windows Software Development Kit->

![](D:\dev_envir\docs\notes\compile\chromium\assets\Snipaste_2019-02-26_21-45-18.png)

right click->change->change->next->

![](D:\dev_envir\docs\notes\compile\chromium\assets\Snipaste_2019-02-26_21-46-46.png)

change，勾选debugging tools for windows，安装即可

#### 2.2 安装dept_tools

**根据文档给出的链接，直接下载dept_tools bundle**

![](D:\dev_envir\docs\notes\compile\chromium\assets\Snipaste_2019-02-26_21-49-30.png)

下载完成后，解压至某目录，此处解压至（d:\dev_envir\dept_tools)，随后将该目录添加到系统path环境变量的开头，如下图中的说明，dept_tools中包含有python与git工具，在后续使用过程中，要使用dept_tools目录中的python与git命令，所以需要将dept_tools目录添加进path变量的开头，屏蔽系统本来的python与git

![](D:\dev_envir\docs\notes\compile\chromium\assets\Snipaste_2019-02-26_21-56-20.png)

**添加DEPOT_TOOLS_WIN_TOOLCHAIN**
![](D:\dev_envir\docs\notes\compile\chromium\assets\Snipaste_2019-02-26_21-59-12.png)

![](D:\dev_envir\docs\notes\compile\chromium\assets\Snipaste_2019-02-26_22-01-12.png)

设置GYP_MSVS_VERSION与GYP_MSVS_OVERRIDE_PATH，前者指明visual studio版本，后者指明visual studio安装目录(可以添加进环境变量中，也可以在后续运行gclient命令时执行下面两条指令设置visual studio环境)

```
set GYP_MSVS_VERSION=2017
set GYP_MSVS_OVERRIDE_PATH=D:\Program Files (x86)\Microsoft Visual Studio\2017\Community
```

#### 2.3 获取gclient

随后在cmd窗口中运行gclient命令，根据文档说明，不能在cmd以外的环境比如powershell中运行，否则会达不到预期安装要求

![](D:\dev_envir\docs\notes\compile\chromium\assets\Snipaste_2019-02-26_22-10-22.png)

该命令执行完成后，会显示gclient的usage信息，表示gclient安装成功

![](D:\dev_envir\docs\notes\compile\chromium\assets\Snipaste_2019-02-26_22-16-13.png)



### 3. 获取chromium源码

---

#### 3.1 配置git

在cmd窗口（任意目录下）配置git参数（仅仅是获取源码的话，git账户信息应该不是必须的，理论上可以跳过，但是后面三个选项还是要设置的）

```shell
$ git config --global user.name "My Name"
$ git config --global user.email "my-name@chromium.org"
$ git config --global core.autocrlf false
$ git config --global core.filemode false
$ git config --global branch.autosetuprebase always
```

user.name与user.email分别对应用户名与邮箱地址

#### 3.2 获取chromium源码

创建chromium文件夹，切换到该文件夹中，尝试获取chromium源码，本次chromium文件夹位于

d:\dev_envir\code\chromium切换到该文件夹下使用fetch chromium命令获取chromium源码，chromium源码非常巨大，可以在fetch命令后加上--no-history跳过历史版本，可以节约一点时间

```
fetch chromium --no-history
```

耗时较长，如果中间断了，可以使用gclient sync同步

![](D:\dev_envir\docs\notes\compile\chromium\assets\fetch_chromium.png)

在执行gclient sync的过程中，发现执行到gclient runhooks经常由于网络原因无法进行，此时单步执行gclient runhooks，成功后再执行glicent sync，执行完之后源码就算是获取完成（获取源码完成后，其目录结构与内容与github上的chromium镜像仓库内容相同，可以直接下载github源码镜像，解压至chromium目录后，在chromium目录下执行gclient sync步骤，同步google代码仓库）

![](D:\dev_envir\docs\notes\compile\chromium\assets\Snipaste_2019-02-26_22-25-09.png)

在chromium目录下可以看到有src文件夹，后续步骤进入该文件夹中执行

```shell
cd src
```



### 4. 使用gn编译chromium

---

*使用gn命令编译chrome之前，最好查阅步骤六，设置google api key，这样编译出的chrome程序不会有缺少google api key的提示*

#### 4.1 使用gn生成.ninja 文件

```shell
gn gen out/Default
```

![](D:\dev_envir\docs\notes\compile\chromium\assets\Snipaste_2019-02-26_22-37-50.png)

#### 4.2 使用autoninja编译chromium

```shell
autoninja -C out\Default chrome # 非常耗时
```

等待编译完成

![](D:\dev_envir\docs\notes\compile\chromium\assets\Snipaste_2019-02-26_22-57-54.png)

编译完成后，会在out\Default\目录下生成chrome.exe可执行文件，打开即可看到chromium窗口

![](D:\dev_envir\docs\notes\compile\chromium\assets\Snipaste_2019-02-28_18-12-51.png)

#### 4.3 生成并运行单元测试

生成单元测试使用如下命令(run with cmd in folder src),编译过程较长，需耐心等待

```shell
ninja -C out/Default chrome/test:unit_tests
```

![](D:\dev_envir\docs\notes\compile\chromium\assets\Snipaste_2019-02-28_18-21-27.png)

编译完成后在out/Default/下生成unit_tests.exe，运行该测试，检验编译出现的问题

### 5. 生成visual studio解决方案

chromium源码十分庞大，生成的解决方案中包含很多子项目，导致性能不太好的计算机（我的笔记本）打开非常耗时，电脑性能好的同学可以尝试

```shell
$ gn gen --ide=vs out\vstudio
$ devenv out\Default\all.sln   # 使用vstudio命令行打开该解决方案，先打开visual studio，再在vs ide 中打开该项目亦可，所以这条命令可以不执行
```

gn命令执行完毕后，在out\studio目录下可已找到all.sln，使用visual studio打开即可，在visual studio中build all

![](D:\dev_envir\docs\notes\compile\chromium\assets\Snipaste_2019-02-28_18-30-58.png)

### 6. 配置google api key

<http://www.chromium.org/developers/how-tos/api-keys>

#### 6.1 申请google api key

随上述步骤编译出程序后，打开浏览器会看到一条警告信息

![](D:\dev_envir\docs\notes\compile\chromium\assets\Snipaste_2019-02-28_22-39-02.png)

由于缺少google api key，所以有关google账户的功能都不可以使用，下面尝试申请google api key

访问https://console.cloud.google.com，API和服务->凭据

![](D:\dev_envir\docs\notes\compile\chromium\assets\Snipaste_2019-02-28_22-41-14.png)

在页面中点击创建项目

![](D:\dev_envir\docs\notes\compile\chromium\assets\Snipaste_2019-02-28_22-42-15.png)

在创建页面中，名称填chromium-dev（随便填一个）其余默认，创建成功后点击创建凭据

![](D:\dev_envir\docs\notes\compile\chromium\assets\Snipaste_2019-02-28_22-45-47.png)

类型选择为api key，随后即可生成api-key，此次生成的api-key如下

>   AIzaSyC6LNZa7B7gi1GFu7HgcASnrLDejUOWVrE

再点击创建凭据，创建**oauth客户端id**类型的凭据

![](D:\dev_envir\docs\notes\compile\chromium\assets\Snipaste_2019-02-28_22-49-04.png)

创建该类型的凭据之前，需要先设置Oauth同意屏幕，填写一个名字即可，点击保存，随后来到oauth客户端id创建页面，选择类型其他，随意填写一个名称

![](D:\dev_envir\docs\notes\compile\chromium\assets\Snipaste_2019-02-28_22-51-46.png)

创建以后可以得到

>   客户端id：209800016817-uh5oued94c4fm7g44hto73rorh62q268.apps.googleusercontent.com
>
>   客户端密钥：b_-6XLEaGdg9NRlv4JKrTv9k

#### 6.2 在编译时指定google api key信息

google api key得到以后，可以在编译程序时指定api key，使用如下命令打开参数文件

```shell
gn args out/Default
```

将key信息填入

![](D:\dev_envir\docs\notes\compile\chromium\assets\Snipaste_2019-02-28_23-10-11.png)

![](D:\dev_envir\docs\notes\compile\chromium\assets\Snipaste_2019-02-28_23-12-16.png)

随后再编译程序，就可以使用google的全部功能

#### 6.3 在运行时指定key信息

使用命令行的setx工具永久设置相关环境变量

```shell
setx GOOGLE_API_KEY 生成的API密钥
setx GOOGLE_DEFAULT_CLIENT_ID 生成的客户端ID
setx GOOGLE_DEFAULT_CLIENT_SECRET 生成的客户端密钥
```

随后在打开chrome警告即消失

### 参考

#### 官方文档

https://github.com/chromium/chromium/blob/master/docs/windows_build_instructions.md

#### segmentfault链接（推荐）

https://segmentfault.com/a/1190000016921832

#### google api key应用说明

<http://www.chromium.org/developers/how-tos/api-keys>

#### 关于网络连接

由于获取源码与工具的过程中需要访问googlecode，在gfw内无法直接访问，推荐使用shadowsock+privoxy的方式设置http代理，shadowsocks是一款socks协议代理工具，相信大家并不陌生，privoxy可以将socks代理转换为http代理，在windows下下载privoxy，安装步骤一路默认，安装完成后，默认配置文件是位于安装目录的config.txt，在config.txt中添加

```
listen-address 127.0.0.1:8119 # privoxy监听地址
forward-socks5 / localhost:1080 . # 所有请求转发到本机1080端口的socks服务器
```

具体配置文件的规则需要根据privoxy的版本做出一些相应的调整，设置完成后，查看privoxy的启动日志有无异常，如果启动成功，通常没有提示信息，如果有错误，则会给出相应提示。设置好以后，在cmd窗口中设置http_proxy与https_proxy环境变量，变量的值均指向本机privoxy代理

```
set http_proxy=127.0.0.1:8119
set https_proxy=127.0.0.1:8119
```

这种设置方式只在当前cmd窗口中有效，可以使用curl或wget工具进行网络测试，访问www.google.com

![](D:\dev_envir\docs\notes\compile\chromium\assets\Snipaste_2019-02-26_23-04-45.png)

wget是cygwin中的一个小工具，如果没有安装的话，可以在浏览器中配置http代理指向privoxy，测试代理是否配置成功

