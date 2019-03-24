# 五、ssh连接自动化管理

1. 使用polysh同时管理多台主机
    有时候我们需要在多台主机上进行相同的操作，一般来说这种情况可以写shell脚本来完成，但是如果程序要求很强的交互性，比如修改unix系统密码，shell时现较为复杂。polysh是一个python管理多条ssh通道的库，方便我们在多台主机同时执行交互式操作。
    ![](https://upload-images.jianshu.io/upload_images/10339396-4f824e4ab2eb89c6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    在host.txt文件中填入主机，在pass.txt文件中填入密码，执行polysh命令，以root用户登陆远程主机列表
    ![](https://upload-images.jianshu.io/upload_images/10339396-c1a66ca683462f8a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    使用polysh修改远程主机密码
    ![](https://upload-images.jianshu.io/upload_images/10339396-29b2a89759c57e4b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    还可以使用下图方式登陆
    ![](https://upload-images.jianshu.io/upload_images/10339396-3aee9d37f5d49214.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2. ssh协议的python实现paramiko
    使用之前使用pip安装paramiko
    `pip install paramiko --user`
    该库有两个核心组件，SSHClient与SFTPClient。相应封装linux下的ssh与sftp客户端
    SSHClient类的常用方法
    connect方法连接远程服务器，完成ssh认证过程，原型如下
    ![](https://upload-images.jianshu.io/upload_images/10339396-4c9d87f96ab2a0d1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    set_missing_host_key_policy方法设置远程服务器没有在known_hosts文件中的对应策略：AutoAddPolicy自动添加、RejectPolicy自动拒绝(default)、WarningPolicy警告并添加
    exec_command()在服务器执行linux命令
    open_sftp()返回SFTPClient对象,可以使用以下方法
    ![](https://upload-images.jianshu.io/upload_images/10339396-3c68b3f02d257796.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    使用paramiko登陆远程服务器
    ```
    In [14]: import paramiko
    In [15]: client = paramiko.SSHClient()
    # 设置默认策略
    In [16]: client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    # 如果要使用密钥登陆，使用keyfile指定密钥即可
    In [17]: client.connect(hostname='192.168.56.101', port=22, username=‘root’, password='wodemima')
    ```
    执行远程命令
    ```
    In [20]: stdin, stdout, stderr = client.exec_command('ls -l')
    # 随后从三个通道获取命令输出
    ```
    获取SFTPClient对象，可以像操作sftp一样操作sftp对象，该操作不要求服务器和客户端有sftp软件
    ```
    sftp = client.open_sftp()
    ```

    

    