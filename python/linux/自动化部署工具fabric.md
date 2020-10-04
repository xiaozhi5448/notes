# 自动化部署工具fabric

1. 之前的paramiko库可以帮我们在python程序中连接远程服务器，但步骤较为繁琐，使用paramiko时需要花费比较多的时间在python编程上，fabric也是一个python编写的基于ssh的库，提供简洁的api，可以让运维人员专注于linux服务器的管理，而不是python程序设计的细节
2. 从简单应用中看fabric
    `pip install fabric --user`
    使用fabric时，需要编写一个python文件，文件中包含一些函数，在fabric中称为task
    fab命令执行时，默认从当前文件夹下的fabfile.py文件中读取内容，也可以在运行时使用-f选项指定fabfile文件，编写fabfile文件如下
    ```python
    from fabric.api import run, sudo
    from fabric.api import env
    
    env.hosts=['192.168.56.101', '192.168.56.104']
    env.port = 22
    env.user = 'root'
    env.password = 'wodemima'
    def hostname():
        run('hostname')
    def ls(path='.'):
        run('ls {}'.format(path))
    
    def tail(path='/etc/passwd', line=10):
        sudo('tail -n {} {}'.format(line, path))
    ```
    其中run是远程命令的封装，sudo是以sudo权限执行，env是全局的配置字典，使用--list查看当前的task
    ![](https://upload-images.jianshu.io/upload_images/10339396-a60ea2944a16d741.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    执行任务hostname
    ![](https://upload-images.jianshu.io/upload_images/10339396-5c6cd8ec45cedc8a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    像函数一样执行task
    ![](https://upload-images.jianshu.io/upload_images/10339396-fb59b168a8474955.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
3. fabric的执行模型
    创建任务列表，即fabric中的task列表，fabfile中的系列python函数，对每个任务构建其目标主机，可以通过role装饰器指定（下面会讲），通过env.hosts指定，通过-H参数指定，之后遍历任务列表，对每个任务列表在相应的目标主机上执行，可以理解为两层for循环，外层是task，内层是host。默认的fabric会串行执行该过程。
4. fabric的命令行参数
    ![](https://upload-images.jianshu.io/upload_images/10339396-eebd957ad920611c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    在命令行执行fab命令
    ![](https://upload-images.jianshu.io/upload_images/10339396-1fa17d9583a038e4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
5. fabric的env字典
    fabric的配置信息除了可以在命令行指定以外，还可以使用env字典来配置，就像一开始给出的例子一样，在env中配置ssh信息。常用的配置有
    ![](https://upload-images.jianshu.io/upload_images/10339396-1a85d48b3885c810.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    可以使用下面的方式查看env配置信息
    `fab show_env`
    ```
    import json
    from fabric.api import env
    def show_env():
        print(json.dumps(env, indent=4)
    ```
6. fabric提供的命令
    - run远程执行命令
    - sudo以sudo权限执行命令
    - local在本地执行命令，如果要执行复杂的命令可以使用subprocess
    - get获取远程文件，指明remote_path与local_path即可
    - put上传文件，知名remote_path,local_path,与远程文件权限mode
7. fabric上下文管理器
    有时候我们只想在执行某些命令时改变系统设置，而不是全局修改，当命令执行完毕后返回至之前的环境中，上下文管理器可以帮我们完成类似请求
    - cd切换远程目录
      ```
      with cd('/etc/'):
          run('ls')
      ```
    - lcd切换本地目录
    - path用于设置远程服务器的环境变量，三种行为可选
      ![](https://upload-images.jianshu.io/upload_images/10339396-9fcfe4876b8a98b3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - prefix命令前缀，即对之后的操作的每一条命令，都加上该前缀
    - shell_env用于设置shell环境变量
    - settings用于临时覆盖env
    - hide隐藏输出，可供隐藏的信息类型如下
      ![](https://upload-images.jianshu.io/upload_images/10339396-d61ec061f646f014.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      ![](https://upload-images.jianshu.io/upload_images/10339396-def9bd908ccb8423.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - quiet隐藏全部输出
    - warn_only   settings(warn_only=True)当命令出错时仅给出警告，继续执行
8. fabric装饰器
    装饰器的使用与原生python装饰器的使用相同
    - task装饰器
      task是fabric的执行单元，默认情况下，fabfile中的每一个函数都是task，当我们指定了一个某一个函数为task（使用装饰器@task修饰该函数）时，其他函数将不会被认为是task
    - hosts装饰器
      fabric指定目标主机的方式有三种，可以在命令行中使用-H选项指定主机，可以在env设置hosts中指定主机，可以使用hosts装饰器指定task主机
      通过hosts指定该task的目标主机
      类似于
      `fab task:hosts='host1;host2'`
    - role装饰器
      介绍装饰器之前先理解role的概念，role即角色，在一个web集群中，可能有数据库服务、缓存服务、dns服务、web页面服务，每个服务又可能包含有多台主机，将相同功能的主机组定义为一个角色，分配一个角色名称，在task前使用role装饰器选定该role，可以让task在该role指定的主机上运行，归根结底还是为了方便主机的选取。定义role时，使用env.roledefs这个字典来定义，将内容赋值给该字典，即可用@role装饰器使用其中的role，看下面的例子
      ```
      from fabric.api import run, sudo,env
      env.hosts=['192.168.56.101', '192.168.56.102']
      env.port=22
      env.user='root'
      env.password='wodemima'
      env.roledefs={
              'test1':['192.168.56.101'],
              'test2':['192.168.56.102']
              }
      @roles('test1')
      @task
      def ls(path='./'):
          run('ls {}'.format(path))
      ```
    - parallel
      在目标服务器列表上并行执行task，可以理解为同时在多台服务器上执行task，fabric中的执行模型在之前提到，串行执行的方式对一些执行时间较长的任务会花费我们许多时间，这些进程间本来没有任何的联系，并行执行更符合需求。要并行执行task，只需要使用parallel装饰器即可。另外可以使用fab命令的-P参数（--parallel）通知程序并行执行程序，另外还可以使用env.parallel变量来指定是否并行执行
    - run_once
      这个装饰器可以让被修饰的task仅运行一次，比如打包本地文件上传至服务器，打包本地文件的行为应该仅需运行一次，而不管其他task多次调用该task
    - serial
      和parallel相反，serial强制fabric串行执行task
9. 其他有用函数
    - execute
      execute可以让我们在一个task中执行其他task
    - utils函数  fabric.utils
      abort终止程序执行，打印错误信息
      warn输出警告信息
      puts打印输出
    - color函数 fabric.colors
      包含如下函数
      ![](https://upload-images.jianshu.io/upload_images/10339396-343ff1f45feeceac.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
10. 最后看一个综合性的例子，在服务器组部署redis服务
    编辑fabfile文件
    ```python
    from fabric.api import *
    from fabric.contrib.console import confirm
    from fabric.colors import green
    from fabric.utils import abort
    
    env.hosts = ['192.168.56.101', '192.168.56.102']
    env.user = 'root'
    env.password = 'wodemima'
    env.port = 22
    
    
    @task
    @runs_once
    def local_test():
        local("tar -xf redis-4.0.9.tar.gz")
        with lcd('redis-4.0.9'), settings(warn_only=True):
            result = local("make && make test", capture=True)
            if result.failed and not confirm("Tests failed, continue anyway?"):
                abort("Aborting at user request!")
            else:
                print green("all tests passed without error")
    
    
    @task
    def put_file():
        put('redis-4.0.9.tar.gz', '/tmp/redis-4.0.9.tar.gz')
    
    
    @task
    def install():
        with cd('/tmp'):
            run('tar -xf redis-4.0.9.tar.gz')
            with cd('/tmp/redis-4.0.9'):
                run('make && make install')
    
    
    @task
    def clean_local():
        local("rm -rf redis-4.0.9")
    
    
    @task
    def install_process():
        execute(local_test)
        execute(put_file)
        execute(install)
        execute(clean_local)
    ```

      






