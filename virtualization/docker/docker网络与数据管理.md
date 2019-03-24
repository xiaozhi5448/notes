# docker网络与数据管理

1. 容器的数据管理是很有必要的，有时候要求可以查看容器内容，备份容器数据，共享某个容器中的内容，需要了解数据管理方面的知识。
    数据管理有两个主要方式，一个是使用数据卷，另一个是数据卷容器，都可以时现数据共享备份等
    - 数据卷
      在使用docker run命令运行容器时，可以使用-v选项为容器创建数据卷
      在容器内创建数据卷,-d表示后台运行，-P表示暴露容器需要开放的端口
      `docker run -d -P -v /bash centos /bin/bash`
      ![](https://upload-images.jianshu.io/upload_images/10339396-a39658789b55e148.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      挂载一个主机目录作为数据卷，用作主机和容器，容器和容器的数据共享。数据卷的改动实时可见，如下图，可以看到容器新建时存在images目录，初始为空，在主机上在images目录放入一张图片，默认权限为读写，可以通过指定ro选项设置只读
      ```
      docker run -itd -v `pwd`/images:/images centos /bin/bash
      docker run -itd -v `pwd`/images:/images:ro centos /bin/bash
      ```
      ![](https://upload-images.jianshu.io/upload_images/10339396-0c0bceca4b1597fc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      挂载一个本机文件作为数据卷也是可以的，在容器中可以访问该文件，挂载本机命令历史文件如下
      ```
      docker run -itd -v ~/.bash_history:/root/.bash_history centos /bin/bash
      ```
    - 使用数据卷容器
      对于经常更新的数据，使用数据卷容器更为合适
      创建一个容器并创建数据卷挂载到指定目录
      ```
      docker run -td -v /dbdata --name data centos /bin/bash
      docker run -td --volumes-from data --name db1 centos /bin/bash
      ```
      在data容器中新建文件，在其他容器实时可见
      ![](https://upload-images.jianshu.io/upload_images/10339396-05a96807c855e055.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      数据卷不会自动删除，要删除一个数据卷，必须在删除最后一个容器的同时使用-v选项删除关联的数据卷
    - 备份数据卷中的数据
      要将容器中的数据备份到主机，首先挂载一个主机目录到容器中，在容器中创建数据卷目录的数据压缩包保存到挂载到容器的主机目录中，即可时现备份。
      ![](https://upload-images.jianshu.io/upload_images/10339396-754e46ce9bef09fe.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      恢复数据到另一个容器中，首先创建一个带有数据卷的容器，随后在创建一个容器，挂载该容器的数据卷，并挂载主机已有的备份文件，在容器中解压该备份文件到容器的数据卷目录
      ```
      docker run -td -v /dbdata2 --name data2 centos /bin/bash
      docker run -td --volumes-from data2 -v `pwd`/data:/backup \
      >centos tar -xvf /backup/backup.tar -C /dbdata2
      ```
      ![](https://upload-images.jianshu.io/upload_images/10339396-fe91dc27828d5a42.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
2. docker网络配置
    暴露容器端口到主机端口，docker创建容器时，可以使用-p和-P选项指定端口设置，使用-p可以指定容器和主机之间的端口映射，使用-P可以使容器需要暴露的端口随机映射到可用的主机端口。
    使用docker新建容器，安装配置apache服务，在主机直接访问docker 容器ip地址
    ![](https://upload-images.jianshu.io/upload_images/10339396-5421e1647739fbcd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    ```
    docker run -td --name web2 -p 5000:80 centos:httpd /bin/bash
    $ docker exec -it web2 /bin/bash
    [root@89e2ab0f5677 /]# httpd
    [root@89e2ab0f5677 /]# exit
    exit
    ```
    查看端口映射配置
    ![](https://upload-images.jianshu.io/upload_images/10339396-71b733317885cb21.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

    访问本机的5000端口
    ![](https://upload-images.jianshu.io/upload_images/10339396-1add2ccec801dc30.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    映射端口有多种语法 -p hostport:containerport会映射容器端口到所有主机地址的hostport端口，如下
    ![](https://upload-images.jianshu.io/upload_images/10339396-ede83c78e8d372ec.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    还可以通过-p ip:hostport:containerport将容器端口映射到本机指定地址的端口，多次使用-p可以映射多个端口




​      