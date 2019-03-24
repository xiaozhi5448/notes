# SSM抢红包应用

*整合ssm与redis，演示高并发抢红包场景*

## 1. 环境搭建

方便起见，使用docker建立本机redis与mysql容器，搭建测试环境

拉取mariadb镜像

```shell
docker pull mariadb
```

挂载已有的sql备份数据到指定目录/docker-entrypoint-initdb.d下，启动容器

```shell
docker run --name some-mariadb -p 3306:3306 -v ~/code:/docker-entrypoint-initdb.d:ro -e MYSQL_ROOT_PASSWORD=wodemima -d mariadb
```

在shell中登录新建用户并授予所有权限，当做应用的测试账户

```shell
create user 'zhile'@'localhost' identified by 'password';
grant all on *.* to 'zhile'@'localhost';
create user 'zhile'@'%' identified by 'password';
grant all on *.* to 'zhile'@'%';
flush privileges;
```

随后可以使用用户zhile，登录该mysql服务

