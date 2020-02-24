# python数据科学入门

## 从文件中读取数据

从文件中读取数据可以使用简单的python文件操作函数，也可以使用pandas已经集成的功能来实现。

##### 从文件读取

pandas.read_table

![1578363911657](/home/xiaozhi/Documents/notes/python/deeplearn/assets/1578363911657.png)

详细帮助信息可以查看help文档

对一个如下图所示的文本文件

![1578363945793](/home/xiaozhi/Documents/notes/python/deeplearn/assets/1578363945793.png)

使用该方法读取后得到dataframe结果

![1578363979024](/home/xiaozhi/Documents/notes/python/deeplearn/assets/1578363979024.png)

类似的还有read_csv,read_excel函数用于从csv或xlsx文件中读取数据，返回相应的dataframe。

pandas也可以从关系型数据库中读取frame

![1578364205032](/home/xiaozhi/Documents/notes/python/deeplearn/assets/1578364205032.png)

##### 处理丢失值 

drop_duplicates

fillna

dropna