# 问题记录与总结

### python使用mysql

python使用mysql数据库时需要安装mysqlclient，安装时有事出现mysql_config can't的报错

![1555937365569](/home/xiaozhi/Documents/notes/python/projs/assets/1555937365569.png)

相关头文件与源文件找不到都是由于开发包未安装造成的

```shell
sudo apt-get install libmysqlclient-dev
sudo apt-get install libmariadbclient-dev
```

