# dockerfile

1. dockerfile基本语法规则
    - dockerfile的结构
      主要包含四部分，基础镜像，即该dockerfile基于何种基础镜像创建，随后是维护者信息，然后是镜像的操作指令，最后是镜像启动时需要执行的命令，看下面的例子
      ```
      # httpd dockerfile based on centos
      FROM centos
      MAINTAINER xiaozhifc 1786614260@qq.com
      RUN yum install --nogpgcheck httpd vim sed net-tools -y
      RUN sed -i 's/# ServerName www.example.com:80/ServerName localhost/' /etc/httpd/conf/httpd.conf
      EXPOSE 80
      CMD /usr/sbin/httpd -X
      ```
      构建时使用
      `docker build -t centos:httpd path_to_dockfile`
      查看构建成功的images
    ```
    $ docker images
    REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
    centos              httpd               61cee0059221        7 minutes ago       364 MB
    docker.io/centos    latest              49f7960eb7e4        11 days ago         200 MB
    ```
    创建容器
    `$ docker run -P --name web centos:httpd`
    查看端口映射
    ```
    $ docker ps
    CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                   NAMES
    c7b7c6c9149f        centos:httpd        "/bin/sh -c '/usr/..."   33 seconds ago      Up 31 seconds       0.0.0.0:32769->80/tcp   web
    ```
    访问32769
    ![](https://upload-images.jianshu.io/upload_images/10339396-ee9e90e46ba6946d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


2. 基本指令
    - RROM
      表示镜像的基础镜像，比如ubuntu，centos等
      `FROM image[:tag]`
    - MAINTAINER USER
      指定维护者信息
    - RUN
      ```
      RUN command para1 para2 ...
      RUN ["command", "para1", "para2"]
      ```
      前者默认使用/bin/sh -c在shell中执行，如使用其他shell，
      `RUN ["/bin/bash","-c","echo hello"]`
    - CMD
      ```
      CMD ["executable", "param1", "param2"]，使用exec执行
      CMD command param1 param2
      ```
      CMD指定容器开始时运行的命令
    - EXPOSE
      将暴露指定端口列表
      `EXPOSE 80 443 8080`
      在启动容器时，使用-P选项将其映射进主机端口
    - ENV
      ENV指令可以设置容器环境变量
      `ENV <key> <value>`
    - ADD
      添加指定的src到dest中，src可以是文件、目录、tar
      `ADD src dest`
    - COPY
      复制本机src到容器dest
      `COPY src dest`
    - ENTRYPOINT
      配置容器运行时执行的命令，不可被run参数覆盖，并且一个dockfile仅能使用一次，如果配置了多次，仅有最后一次会生效
      ```
      ENTRYPOINT ["COMMAND", "PARAM1", "PARAM2"]
      ENTRYPOINT COMMAND PARAM1 PARAM2
      ```
    - VOLUME
      创建数据卷，用于挂载本地目录或用作数据卷容器
      `VOLUME ["/data"]`
    - USER
      指定容器运行时的用户
      `USER username`
    - WORKDIR
      为后续命令指定工作目录，如果指定了相对路径，则相对于之前路径
      ` WORKDIR PATH`
    - ONBUILD
      使用该关键词来修饰一条命令，我们在镜像A的创建过程中使用ONBUILD标识了一些命令，现在我们创建image B，以A为基础镜像时，使用ONBUILD修饰的命令会再次得到执行。
 3. 创建镜像
    `docker build -t repo[:tag] path_to_dockfile`