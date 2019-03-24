# docker简介

1. docker是什么
    在云计算时代，虚拟化技术是撑起云计算公司最重要的技术基石。docker是容器技术的一种，是基于linux Containers技术发展起来的。与传统虚拟机相比，有占用资源小、方便移植等优点。从下图看docker与虚拟机技术的不同
    ![](https://upload-images.jianshu.io/upload_images/10339396-3fa88cad8123ab51.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
2. 基本概念
    - 镜像
      镜像类似于虚拟机的操作系统镜像，是面向docker引擎的只读模板，是创建容器的基础
    - 容器
      容器类似于一个轻量级的沙箱，通过容器隔离应用和其他环境
    - 仓库
      仓库是docker集中存放镜像文件的地方
3. 安装
    centos7 使用yum安装即可
    `yum install docker -y`
    docker使用特有用户运行程序，当使用普通用户运行docker时，会提示权限不足，将当前用户添加进docker用户组即可
4. 镜像基本操作
    - 获取镜像
      可以使用pull子命令获取docker镜像
      `docker pull name[:tag]`
      可以将tag理解为操作系统版本号，如果不指定tag，则默认为latest，如从默认镜像仓库获取最新的centos镜像
      ![](https://upload-images.jianshu.io/upload_images/10339396-9e5e2431e999fa15.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      也可以指定镜像仓库下载镜像，如下，使用dl.dockerpool.com:5000获取最新的ubuntu镜像
      ![](https://upload-images.jianshu.io/upload_images/10339396-3e04e3a3e434fd3e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - 查看镜像信息
      使用`docker images`查看本地镜像
      ![](https://upload-images.jianshu.io/upload_images/10339396-aa55fdcf6b4f3410.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      repository标识了镜像来自哪个仓库，tag表示镜像的标签，id唯一标识一个镜像，created表示创建时间，size说明镜像大小。可以使用tag命令为本地镜像添加新的标签
      ![](https://upload-images.jianshu.io/upload_images/10339396-8fb3fb8b64887654.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      新创建的镜像id和之前的相同，说明它们是同一个镜像。可以使用inspect查看镜像信息
      ![](https://upload-images.jianshu.io/upload_images/10339396-74f48f776eaee56e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      可以使用id的前若干个字符串代替完整的id
      ![](https://upload-images.jianshu.io/upload_images/10339396-82a7d65932bd53a5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - 搜索镜像
      使用search命令从镜像仓库中搜索镜像
      ![](https://upload-images.jianshu.io/upload_images/10339396-9557d215f726135c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - 删除镜像
      使用rmi命令删除docker镜像
      `docker rmi name[:tag]`
      使用name删除镜像如上，也可以使用id删除
      ![](https://upload-images.jianshu.io/upload_images/10339396-7a14947d75fdeb32.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - 镜像创建
      镜像创建可以通过三种方式：通过已有容器、通过模板、通过dockerfile
      - 通过容器
        `docker commit options container [respository[:tag]]`
        可用的选项有-a指定作者信息，-m执行comment，-p执行创建镜像时暂停容器
        ![](https://upload-images.jianshu.io/upload_images/10339396-23a05fe7969a5bef.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      - 通过模板，可以使用操作系统模板文件导入镜像，使用openVZ模板导入
        在https://openvz.org/Download/template/precreated下载模板文件，随后使用如下的方式导入
        `cat debian-7.0-x86-minimal.tar.gz | docker import - debian:7.0`
        ![](https://upload-images.jianshu.io/upload_images/10339396-03253ae036215128.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

    - 存储和载入镜像
      使用save命令存储镜像为文件，使用load命令从文件加载镜像
      ![](https://upload-images.jianshu.io/upload_images/10339396-77051ab33b956cda.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - 可以使用push将镜像上传至docker官方仓库
      `docker push name[:tag]`
      在dockerhub注册一个账户，然后在本地使用`docker login`登陆dockerhub，随后使用push上传自己的镜像，注意上传之前，需要更改镜像tag关联自己的用户名称
      `docker tag debian:7.0 xiaozhifc/debian:7.0`
      ![](https://upload-images.jianshu.io/upload_images/10339396-41602318cd32fda1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      结果如下
      ![](https://upload-images.jianshu.io/upload_images/10339396-90a5b0de050d59d1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
5. 容器基本操作
    docker容器是镜像的一个运行实例，有额外的文件可写层，如果虚拟机是虚拟出的一整套操作系统，容器就是虚拟出单个应用及其运行环境的集合
    - 创建容器后容器处于停止状态
      创建容器
      ![](https://upload-images.jianshu.io/upload_images/10339396-4440315b0af61276.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      可以使用docker start命令来启动它
      ![](https://upload-images.jianshu.io/upload_images/10339396-23b2a8c6ad506e25.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      使用run子命令创建并启动容器
      ![](https://upload-images.jianshu.io/upload_images/10339396-46023cde9b2a8ce2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      使用run命令时，docker会先查看本地是否有指定镜像，如果没有则从dockerhub上下载，如果有的话就使用该镜像新建一个容器，在镜像外挂载一个文件可写层，桥接一个虚拟接口，分配ip地址，执行给定的命令，随后终止容器
      使用-i选项可以是用户交互式运行一个容器，一般和-t一起使用，表示分配一个虚拟终端
      ![](https://upload-images.jianshu.io/upload_images/10339396-2ad41f423dd264ed.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      使用exit或crtl-D退出
      有时需要让容器以守护态运行，使用-d参数
      ![](https://upload-images.jianshu.io/upload_images/10339396-5bd8f3b165e48e0e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

    - 终止容器
      处于运行状态的容器，可以使用stop命令终止，可以使用restart命令重新启动，处于终止状态的容器，可以使用start命令启动
      ![](https://upload-images.jianshu.io/upload_images/10339396-6f0790d701ed97b6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - 使用exec子命令进入容器执行指令
      ![](https://upload-images.jianshu.io/upload_images/10339396-aaa7bf13962cd39b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - 使用rm子命令删除容器，-f表示强制删除，在删除一个运行中的容器时，可以使用该选项
      ![](https://upload-images.jianshu.io/upload_images/10339396-1b3edb886b7ba346.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - 容器的导入和导出
      将容器导出至文件，分发后供其余主机导入后称为镜像
      ![](https://upload-images.jianshu.io/upload_images/10339396-56ddc7f4eb307713.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
6. 镜像仓库
    镜像仓库是存放docker镜像的地方，用户从镜像仓库搜索，下载上传镜像。默认镜像仓库为https://hub.docker.com官方镜像
    使用search指令从hub搜索镜像，搜索结果如下
    ![](https://upload-images.jianshu.io/upload_images/10339396-4555dd7c1fa0390e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    有两种类型，第一种是单个名称组成镜像，OFFICIAL为ok，表示docker官方维护的镜像，另一种类似username/imagename，表示由用户username创建的镜像
    配置镜像自动创建，有时候镜像中集成了某个应用，当应用更新时，手动更新镜像是麻烦的，可以使用docker的自动创建功能，当应用更新时，自动构建镜像。
    可以通过如下命令在本机启动一个镜像仓库容器，并将其中的/tmp/registry目录映射到本机目录
    ![](https://upload-images.jianshu.io/upload_images/10339396-08f58e9e6deced6a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    修改镜像名称后上传镜像
    ![](https://upload-images.jianshu.io/upload_images/10339396-71dbb32b18c3e79f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    拉取该镜像
    ![](https://upload-images.jianshu.io/upload_images/10339396-4128bfe3a321b805.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)








​      


​      











