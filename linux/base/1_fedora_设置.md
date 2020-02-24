1. 使用vim编辑器
2. 更换软件源，更新系统
3. 关闭selinux
4. 设置免密码执行sudo
5. gnome-tweak-tools美化界面
6. 安装windows字体
7. 小工具
    - chrome and opera
    - flameshot截图工具
    - wps文档编辑
    - wine环境运行windows程序，tim
    - gnome-terminal-nautilus为右键菜单添加打开终端功能
8. 开发环境
    - gcc
    - python
    - jdk
    - shell
    - vscode
9. 命令提示符设置（颜色、路径）
    `PS1="\[\e[32m\][\u@\h \w]\[\e[m\]\n$ "`
    放入.bashrc文件中
10. 网络管理工具
    - wireshark图形化抓包工具
    - tcpdump命令行抓包工具
11. vim插件管理，使用vundle
12. 安装shadowsocks，并使用privoxy工具将其转换为http代理供命令行使用,在浏览器中使用shadowsocks代理，chrome可以使用switchomega插件，firefox可以使用foxyproxy插件，opera使用simpleproxy
     - 使用pip安装shadowsocks工具
     - 使用sslocal命令，指定json文件进行端口监听
         ![](https://upload-images.jianshu.io/upload_images/10339396-22ed7613a595e663.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
         `sslocal -c config.json -d start`
     - 在/etc/init.d/目录下编写sslocal脚本文件执行上述命令，实现开机启动ss
     - 安装privoxy工具`dnf install privoxy`
     - 编辑配置文件/etc/privoxy/config,forward表示不使用代理
         ![](https://upload-images.jianshu.io/upload_images/10339396-b83643c239608f7d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
     - 启动privoxy服务
         `privoxy /etc/privoxy/config`
     - 如果设置全局代理，所有的流量都会经过ss，有时候我们只想让部分流量经过ss，此时可以在脚本中设置临时变量，指定http_proxy和https_proxy,随后执行命令，这样该命令的代理就是我们指定的值，编写/usr/bin/proxy,并添加执行权限
         ```
         http_proxy='http://127.0.0.1:8118' https_proxy='http://127.0.0.1:8118' $*
         ```
         $*代表所有的参数，因为运行方式是类似这样
         `proxy wget http://www.google.com`
      - 使用google连接测试
         ![](https://upload-images.jianshu.io/upload_images/10339396-640436eabea777da.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)