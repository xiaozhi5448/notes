1. shell脚本首行
    `#!/bin/bash`
    这里/bin/bash只是一个例子，shell脚本首行一般以#！开头，后面跟的解释器即为执行此脚本的解释器，除了首行，跟在#后面的字符会被认为是注释

2. shell脚本的执行方式与区别
   - shell脚本执行时，会向系统内核请求启动一个全新的进程，读取用户环境变量，在该进程中执行脚本中的命令
   - bash script-name
     当脚本没有可执行权限时，使用此命令也可执行，新建子进程，在子进程中运行scriptname
   - path/script-name
     在当前目录下执行脚本，要求脚本必须有可执行权限，该方式也是在子进程中执行shell脚本
   - source 或 . script-name
     在当前目录下执行脚本，该方式会在当前shell环境中执行指令
   - sh script-name 或 cat script-name | bash

3. shell配置文件
  shell配置文件有/etc/profile,/etc/bashrc,~/bashrc, ~/bash_profile,/etc/profile.d/*
  加载顺序如下
  ![](https://upload-images.jianshu.io/upload_images/10339396-372ff941cee8953e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
4. shell脚本调试技巧
    - 使用echo命令输出中间结果
      打印中间结果是调试程序的基本需求，任何可以看到中间结果的方法都有助于调试程序
    - 使用sh命令行参数调试程序
      - sh -n查询该脚本语法是否有问题
      - sh -v执行脚本时，先将命令输出至屏幕，在标准输出中可以看到命令，如果有错误，会给出相应提示
      - sh -x在标准输出中，给出执行的命令和该命令的输出
    - 使用set命令缩小调试范围
      - set -x开始
      - set +x结束