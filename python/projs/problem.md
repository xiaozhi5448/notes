# 问题记录与总结

### python使用mysql

python使用mysql数据库时需要安装mysqlclient，安装时有事出现mysql_config can't的报错

![1555937365569](/home/xiaozhi/Documents/notes/python/projs/assets/1555937365569.png)

相关头文件与源文件找不到都是由于开发包未安装造成的

```shell
sudo apt-get install libmysqlclient-dev
sudo apt-get install libmariadbclient-dev
```

### python使用matplotlib库画图

tkinter配置问题

![1556182437036](/home/xiaozhi/Documents/notes/python/projs/assets/1556182437036.png)

可能在安装python时系统内没有tcl、tk运行环境，到时tkinter配置失败，需要安装python3-tk、python-tk、tk之后重新安装python（编译安装）

```shell
sudo apt-get install python3-tk python-tk tk
pyenv install 3.7.0
```

