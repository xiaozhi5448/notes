1. mysql数据库简介
    mysql是典型的关系型数据库管理系统，数据库中包含多张数据表，数据以记录的形式存在于数据表中，一条记录中包含若干字段，每个字段都有特定的数据类型。不同的表可能有一定的联系。从数据库中查询的语言被称为sql，数据库管理系统通过sql从数据库中检索数据。sql语法此处不再说明
2. mysql开源安装与基本配置
    mariadb是mysql的一个开源分支，自mysql闭源之后，经过开源社区的努力，mariadb也成为了一个功能十分完善可以替代mysql的数据库软件包，操作基本类似
    安装mariadb软件包
    ![](https://upload-images.jianshu.io/upload_images/10339396-4a7e3d957fefbeb2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    配置文件结构如下
    ![](https://upload-images.jianshu.io/upload_images/10339396-929120beab9bf84a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    使用yum安装软件后，自动创建用户mysql，使用最小权限运行mariadb服务
    ![](https://upload-images.jianshu.io/upload_images/10339396-95e6c394ddde49ab.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    使用mysql_install_db初始化数据库，在linux环境下，使用该命令初始化数据库时，会创建空白数据库test，同时在mysql数据库中创建user表。
    ![](https://upload-images.jianshu.io/upload_images/10339396-aec4371456e6c862.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    mysql.user表中root用户为默认管理员用户，未设置密码，匿名账户同样没有密码，可能导致安全问题
    使用mysql_secure_installation设置初始选项，设置是否允许root远程登陆，是否删除test数据库，设置root密码等选项。设置root密码后，启动mariadb，可以登陆mysql服务
    `mysql -h 127.0.0.1 -u root -p`随后键入密码即可登陆
    如果想更改启动参数，可以修改my.cnf文件，添加需要的选项
3. mysql工具
    - mysql客户端工具
      可以使用mysql工具连接至mariadb服务，使用-u指定用户名，-h指定主机，加上-p选项，如此登陆可以避免密码被记录在命令历史中
    - mysql管理工具mysqladmin
      创建数据库
      ![](https://upload-images.jianshu.io/upload_images/10339396-05fd793e2bc5cdfd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      删除数据库
      ![](https://upload-images.jianshu.io/upload_images/10339396-d78f8e47ed69127c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

      常用命令如下图
      ![](https://upload-images.jianshu.io/upload_images/10339396-0b9f8b421cd0159f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - mysqldump备份工具
      具体参数可以查看命令help说明
      备份所有数据库
      ![](https://upload-images.jianshu.io/upload_images/10339396-591b1ae53eb9f478.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      备份mysql数据库
      ![](https://upload-images.jianshu.io/upload_images/10339396-db1e3963ef2b05a4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      备份mysql数据库中的user表
      ![](https://upload-images.jianshu.io/upload_images/10339396-d72b764765d55465.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      还原所有数据库
      ![](https://upload-images.jianshu.io/upload_images/10339396-4854edb493d9687b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      还原mysql数据库
      ![](https://upload-images.jianshu.io/upload_images/10339396-3956fa5e7a0322e8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      还原mysql数据库中的user表
      ![](https://upload-images.jianshu.io/upload_images/10339396-27eda31dcb54eacb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
4. 数据库安全设置
    mysql数据库安全包括密码安全性、访问控制安全、数据安全（配置相关文件）。mysql的用户账户密码权限信息保存在mysql数据库中的user表中，可以使用mysqladmin或sql语句更改、添加、删除user表中记录达到账户管理功能。以下多个实例中看账户管理设置
    使用grant命令创建用户并授权
    `grant all on testdb.* to 'xiaozhi'@'localhost' identified by 'password';`
    创建admin用户，授予管理数据库权限，无密码本机登陆
    `grant reload,process on *.* to 'admin'@'localhost';`
    创建inspect用户，授予testdb数据库中所有数据表的权限，该用户可以从任何主机查询数据
    `grant all on testdb.* to 'inspect'@'%' identified by 'password';`
    使用show grants查看用户权限信息
    ![](https://upload-images.jianshu.io/upload_images/10339396-01d0ed9b933f3e74.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    直接修改mysql.user表更改用户密码
    ![](https://upload-images.jianshu.io/upload_images/10339396-f879d643d4e37baf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    通过mysqladmin设置root密码
    ![](https://upload-images.jianshu.io/upload_images/10339396-bf3934bcb87462fb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    通过set password设置用户密码
    ![](https://upload-images.jianshu.io/upload_images/10339396-c6c3e8124bbe5b69.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    使用revoke撤销权限
    ![](https://upload-images.jianshu.io/upload_images/10339396-a6841f2d5e84640b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    删除用户
    ![](https://upload-images.jianshu.io/upload_images/10339396-ca261bd0cc0f6af7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
5. mysql日志文件设置
    - 错误日志，配置文件中默认开启了错误日志，并且给出了错误日志文件路径，当mysql进程出错时，错误日志会记录错误信息
      ![](https://upload-images.jianshu.io/upload_images/10339396-a6e4b5901bcf3529.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      在mysql中使用如下选项查看mysql日志文件是否开启和日志文件位置
      ![](https://upload-images.jianshu.io/upload_images/10339396-8f7111d6aa2da4bf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

    - 查询日志
      查询日志中记录了数据库每条查询信息的sql语句及其响应，有助于我们做sql注入分析，性能调试。一般线上应用不开启，因为随着查询数量增加，日志文件增加十分迅速，给服务器带来负担
      查看mysql查询日志配置
      ![](https://upload-images.jianshu.io/upload_images/10339396-8e9fb150c82c7936.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      临时开启查询日志，当重启mysql时，该设置失效
      ![](https://upload-images.jianshu.io/upload_images/10339396-16f24ca1f5b4355b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      亦可在配置文件中指定以上两个选项
    - 慢查询日志
      当查询指令执行之间超过一定时间时，记录该查询信息
      ![](https://upload-images.jianshu.io/upload_images/10339396-f04dcc201a5bf35b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      long_query_time指定超时的阈值，slow_query_log为选项开关，slow_query_log_file为慢查询日志文件，在日志文件中指定该设置可以开启慢查询日志



​      















