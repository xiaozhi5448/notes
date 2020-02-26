# python语言程序设计

## python基本数据结构

### 数字

1. 包括整型、浮点型、复数（与其他语言重点区分）
2. 赋值方式和一般变量相同
3. 整数是不可变类型
4. 复数的常见属性
   - num.real 复数的实部
   - num.imag 复数的虚部
   - num.conjugate() 复数的共轭复数

5. 工厂函数
   - cmp（）比较两个数的大小
   - str()      返回对象的字符串表述
   - int()       返回整数字符串的数字类型
   - long() float() complex() 同int

6. 功能函数
   - abs() 求绝对值
   - divmod()根据除数和被除数得到商和余数的元组
   - pow() 指数函数
   - round()四舍五入
   - 进制转换函数hex() oct()  ord() chr() unichr()



### 序列

序列是一种通用数据结构，比如数组，列表等，有一些操作序列的通用函数，如下
- in /not in 成员关系操作符判断某元素是否属于某序列
- seq[ind] 获取下标为ind的元素
- seq[start:stop:step] 获取下标为start到下标为stop-1的元素集合,步长为step
- seq * expr   重复序列expr次
- seq1 + seq2 连接序列seq1与seq2

#### 通用内建函数

- list(iter) 将可迭代对象转换为列表
- turple（iter)将可迭代对象转换为元组
- unicode() 将对象转换为unicode字符串
- enumerate（iter）接受一个可迭代对象为参数，返回一个enumerate对象，可迭代，其指向元素由iter中所含元素与该元素位置组成的元组
- len(iter) 返回序列iter的长度
- max(iter,key=None)返回iter中的最大值，key是一个可以传递给sort函数的回调函数，可以规定排序的规则
- min(iter,key=None) 与max雷同
- sorted(iter, func=None, key=None, reverse=False)排序函数，func指定排序函数，key指定每个元素中提取用于比较的关键字，reverse指定是否反向排序
- zip(iter1,iter2...itern)返回一个列表，该列表第一个元素是由iter的第一个元素组成的元组，依次类推
 - reversed(seq)返回逆置的迭代器
 - any(seq)如果seq中有一个为True，则返回true
 - all(seq)如果seq中元素都为True，返回True

### 字符串

- 字符串的创建与赋值使用‘与“并无差异，可以将字符串当作列表，使用切片操作符得到子串，序列通用函数均可适用于字符串，字符串是不可变对象

- 在字符串前加字母r表示原生字符串，其中的特殊字符均当作普通字符来看待

- 在字符串前加字母u表示unicode字符串

- 使用'''包围字符串，字符串可以跨越多行，并且可以包含特殊字符

- 仅适用于字符串的函数
    - 格式化操作符%（格式化使用最新的format函数）
    - raw_input()输出提示字符串，并得到用户输入
    - ord('char')返回某字符的ascii数值
    - chr()返回某数字的ascii字符
    - string.capitalize()将首字母大写
    - string.center(width)返回原字符串居中，并用空格填充至width的新字符串
    - string.count(str, begin,end）返回string中str出现的次数
    - string.decode()
    - string.encode()
    - string.endswith(obj,beg,end)判断string是否以obj结束
    - string.startswith(obj)判断string是否以obj开始
    - string.expandtabs(tabsize)将字符串中的tab替换为空格
    - string.find(str,beg,end)在string中查找str，返回找到的索引值，否则返回-1
    - string.isalnum()判断string是否仅由字母数字组成（不包括空格）
    - string.isalpha()判断是否所有字符都是字母
    - string.isdigit()判断是否所有字符都是数字
    - string.isdecimal()判断十进制数字
    - string.islower()判断小写
    - string.isupper()判断大写
    - string.join(seq)返回以string为分割符，将seq中所有元素拼接起来的新字符串
    - string.lower()小写
    - string.upper()大写
    - string.strip()裁掉string两端的空白字符
    - string.split(sep)以sep为分隔符分隔string，返回列表
    - string.format()格式化字符串输出
       `'{} is better than {}'.fromat('red','yellow')`
       其中{}标识的位置表示将要放入参数，将format函数参数格式化后放入原字符串中，{}中的内容可以像下面这样
       `[[fill]align][sign][#][0][width][,][.precision][type]`

       fill 表示填充字符，默认是空格

       align 表示对齐方式 '<' 左对齐 '>' 右对齐 '^'居中
       sign 在显示数字时，规定是否显示+ -号，'-'默认取值，正数省略，负数显示'-'号
       width显示的宽度
       precision显示的精度
       type显示的类型
       一些示例

       - 通过参数位置访问
         `'{} is better than {}'.format('beautiful', 'ugly')`
       - 通过下标访问
         `'{0} is better than {1}'.format('beautiful', 'ugly')`
       - 使用字典
         ![](https://upload-images.jianshu.io/upload_images/10339396-69846005cbfdc426.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 列表

- 列表是序列的一种，序列通用操作函数均适用于列表，切片操作符，成员关系操作符
- 列表解析是一种快速构造列表的方法形如
  `[ 2*i for i in range(10)]`
- 内建函数
    - len序列长度
    - list()列表构造
    - zip，enumerate（），sum
    - sorted(),reversed()
    - append()向列表末尾添加一个元素
    - seq.extend(seq2)将seq2中的元素添加进seq
    - list.count(obj)返回obj在list中出现的次数
    - list.remove(obj)删除obj元素
    - list.pop()删除并返回指定位置的对象，默认最后一个
    - list.insert()插入元素
    - list.sort(）

### 元组

- 元组是不可变类型
- 浅拷贝使用完全切片操作[:]，使用工厂函数list(),turple()，使用copy函数，浅拷贝拷贝对象的引用，深拷贝使用deepcopy（）

### 字典

- 可以理解成一个可变的哈希表
- 字典的键必须是不可变类型，键必须是可哈希的，不可一个建对应多个值
- 创建字典
    - dict工厂函数
    - {}.fromkeys(seq,default)以seq中的元素为键创建字典
    - 访问字典中的元素dict['key']
    - dict.clear()删除所有元素
    - dict.pop['key']返回并删除指定元素
    - dict.items()返回包含字典键值对的列表
    - dict.keys()返回包含字典键的列表
    - dict.values()返回包含所有值的列表
    - dict.update(dict2)将dict2中的元素添加进dict

### 集合

- 操作符 in，not in，==，>=, <=,>,<,&,|,-,^
- 用set创建集合或用frozenset创建不可变集合
- s.add(e)添加元素
- s.update(t)
- s.pop()
- collections中的defaultdict对象
    - defaultdict接受一个类型作为参数创建一个字典，规定该字典默认值的类型，使用dict函数创建普通字典，当访问该字典中不存在的键时，会使程序抛出异常，使用defaultdict创建的字典，访问不存在的键时，返回默认类型的值。比如defaultdict(list),访问该字典中不存在的键值对时返回空的列表
- collections中的Counter对象
    - Counter('iter')可以从一个iterable的对象创建计数器
    - 访问：当指定的键不存在时返回0，否则返回该值的次数
    - c.update(element)新增元素
    - c.subtract(element)减少元素
    - c.most_common(n)返回topN的元素



## 文件处理

文件读写部分，python有一个基本的内置文件读取函数open
 `open(filename, mode)`其中mode可以是r、w、x、a，模式a表示打开文件会在文件末尾追加内容，使用w模式打开文件，如果文件存在会将文件清空，再写入，如果使用x模式打开文件，如果文件存在会抛出异常。open函数返回文件对象，当操作完成时，使用close方法关闭文件流

### 常见文件读写函数

-   read([size])读取指定长度文件内容，如果size为空，读取所有

-   readline()读取文件一行

-   readlines()读取文件所有内容到一个列表

-   seek(offset[,whence])函数更改文件指针的位置，whence表示从何处偏移，默认值是0，表示从文件头开始

-   write(str)将str写入文件

-   writelines(strlist)将字符串列表写入文件

-   读取文件内容常用迭代（python文件对象是可迭代的）

    ```python
    with open("test.txt") as f:
        for line in f:
            print line
    ```

-   示例：将文件中所有单词首字母变大写

    ```python
    with open("program_log.txt") as inf, open("program.txt", 'w') as outf:
         for line in inf:
             outf.write(" ".join([word.capitalize() for word in line.split()]))
             outf.write("\n")
    ```

### os.path中的路径与文件管理函数

#### os模块

-   os.listdir(dir)列出dir下所有的目录与文件
-   os.getcwd()获取当前工作目录
-   os.chdir(dir)改变工作目录
-   os.rmdir('dir')删除空目录
-   os.mkdir(dir)创建目录
-   rename()重命名目录或文件
-   os.chmod(file, mod)更改文件权限
-   os.access(file, auth)判断用户对该文件是否有指定权限
    其中auth可以取os.R_OK,os.W_OK,os.X_OK

#### 拆分

-   os.path.split(path)将path拆分为目录与文件名称，并返回二元组
-   os.path.dirname(path)获取path中的目录名称
-   os.path.filename(path)获取path中的文件名称
-   os.path.splitext(path)获取path中文件扩展名和去处扩展名后的二元组

#### 构建

-   os.path.join(dir...)接收可变参数，组合为完整路径
-   os.path.abspath(dir)得到某文件绝对路径
-   os.path.expanduser(path)展开用户目录
    `os.path.expanduser('~/test/txt')`

#### 获取文件属性

-   os.path.getsize(file)获取文件大小
-   os.path.{getctime(),getatime(),getmtime()}

#### 判断文件类型

-   os.path.exists(file)是否存在
-   os.path.isfile(file)是否是文件
-   os.path.isdir(file)是否是目录
-   os.path.islink()
-   os.path.ismount()

#### 示例

-   获取用户目录下所有的文件列表
    `[ name for name in os.listdir(os.path.expanduser('~')) if os.path.isfile(name)]`

-   获取用户目录下所有的目录列表
    `[ name for name in os.listdir(os.path.expanduser('~')) if os.path.isdir(name)]`

-   获取用户目录下目录到绝对路径之间的字典
    `{name: os.path.abspath(name) for name in os.listdir(os.path.expanduser('~')) if os.path.isdir(name)}`

-   获取最常用的10条命令

    ```python
    with open(os.path.expanduser('~/.bash_history')) as inf:
         for line in inf:
             cmd = line.strip().split()
             if cmd[0] == 'sudo':
                 c[cmd[1]]+=1
             else:
                 c[cmd[0]]+=1
    c.most_common(10)
    ```

### 文件查找

#### 使用字符串匹配

```python
[item for item in os.listdir('.') if item.endswith('txt')]
[item for item in os.listdir('.') if item.startswith('pro')]
```

![](https://upload-images.jianshu.io/upload_images/10339396-2393460f27140d8b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 使用fnmatch

-   fnmatch是一个文件名称匹配库，可以理解为简单的正则表达式匹配，支持的正则符号有

    -   *匹配任意数量任意字符
    -   ？匹配单个任意字符
    -   [seq]匹配seq中的字符
    -   [!seq]不匹配seq中的字符

-   常用函数

    -   fnmatch(file,pattern)判断文件是否符合特定模式

    -   fnmatchcase同上，忽略大小写

    -   filter(names,pat)返回输入列表中符合pat的元素组成的列表

    -   示例

        -   找到当前目录所有jpg文件

            ```
            [item for item in os.listdir('.') if fnmatch.fnmatch(item, '*.jpg')]
            ```

            ![](https://upload-images.jianshu.io/upload_images/10339396-835c0a00a80c5aab.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

        -   返回所有a-c开头的文件

            ```
            [item for item in os.listdir('.') if fnmatch.fnmatch('[a-c]*')]
            ```

            ![](https://upload-images.jianshu.io/upload_images/10339396-caabb18cbb71c48a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

        -   返回不是a-c开头的文件

            ```
            fnmatch.filter(os.listdir('.'), '[!a-c]*')
            ```

            ![](https://upload-images.jianshu.io/upload_images/10339396-8745a101945a3ff4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 使用glob

也可以直接使用glob查找文件，相当于os.listdir与fnmatch
`glob.glob('[a-c]*.jpg')`
  ![](https://upload-images.jianshu.io/upload_images/10339396-6e11dbf56fec9aed.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



#### 使用os.walk遍历目录树

os.walk(top, topdown=True, onerror=None, followlinks=False)walk函数递归返回三元组(dirpath, dirnames, filenames),dirpath保存当前目录，dirnames返回目录列表，filenames返回文件列表，如果想要忽略掉一个子目录，可以直接从dirnames中删除该目录
寻找某目录下某类型文件通用代码

```python
import os
import fnmatch

# 判断某文件是否符合某模式
def is_file_match(filename, partterns):
    for parttern in partterns:
        if fnmatch.fnmatch(filename, parttern):
            return True
        else:
            return False

# 查找root目录下除exculde_dir中符合parttern的文件
def find_specific_file(root, partterns=['*'], exclude_dir=[]):
    for rootdir, dirnames, filenames in os.walk(root):
        for filename in filenames:
            if is_file_match(filename, partterns):
                yield os.path.join(rootdir, filename)

        for dirname in dirnames:
            if dirname in exclude_dir:
                dirnames.remove(dirname)
```

### 使用shutil

#### 复制文件或目录

```python
import shutil
shutil.copy('a.txt', 'b.txt')
shutil.copytree('dir1', 'dir2')
```

#### 移动与重命名

```python
shutil.move('a.txt', 'b.txt')
shutil.move('a.txt', 'dir')
shutil.move('dir1', 'dir2')
```

#### 删除文件或目录

```python
shutil.rmtree('dir')
```

#### 通过计算md5校验码检查文件是否是同一个

```python
import hashlib
d = hashlib.md5()
with open('backup.py') as f:
    for line in f:
        d.update(line)
d.hexdigest()
```

#### 查找某目录下相同文件

```python
from __future__ import print_function
import hashlib
import fnmatch
import os
import sys

# 每次从文件中读取8192个字节
CHUNK_SIZE = 8192
# 判断文件是否符合某模式
def is_file_match(filename, partterns):
    for parttern in partterns:
        if fnmatch.fnmatch(filename, parttern):
            return True
        else:
            return False

# 查找指定目录下指定文件
def find_specific_file(root, partterns=['*'], exclude_dir=[]):
    for rootdir, dirnames, filenames in os.walk(root):
        for filename in filenames:
            if is_file_match(filename, partterns):
                yield os.path.join(rootdir, filename)

        for dirname in dirnames:
            if dirname in exclude_dir:
                dirnames.remove(dirname)
# 循环获取文件内容
def get_chunk(filename):
    with open(filename) as f:
        while True:
            chunk = f.read(CHUNK_SIZE)
            if not chunk:
                break
            else:
                yield chunk
# 获取文件md5校验和
def get_chsum(filename):
    d = hashlib.md5()
    for chunk in get_chunk(filename):
        d.update(chunk)
    return d.hexdigest()
# 执行查找比较过程
def main():
    sys.argv.append("")
    if not os.path.isdir(sys.argv[1]):
        print("{0} is not dir!".format(sys.argv[1]))
        exit()
    record = {}
    for item in find_specific_file(sys.argv[1]):
        checkres = get_chsum(item)
        if checkres in record:
            print("find duplicate file {0} vs {1}".format(record[checkres], item))
        else:
            record[checkres] = item

    print("filelist:",record)

if __name__ == '__main__':
    main()
```

### 压缩包管理

#### 使用tarfile创建与读取tar包

##### 读取tar文件

```python
with tarfile.open('mess.tar') as inf:
      for mem in inf.getmembers():
          print mem
```

##### 创建tar文件

```python
with tarfile.open("mess2.tar", mode='w') as outf:
    outf.add('b2.c')
```

#### tarfile对象常用方法

-   getnames()获取tar包的文件列表
-   extract()提取单个文件
-   extractall()提取所有文件
-   使用tarfile创建压缩包时，只需在mode参数指定压缩方式
    `tarfile.open('test.tar', mode='w:bz2')

## 数据存储

### 序列化与反序列化

程序运行时，所有内容保存在内存中，有时候需要把某些变量的内容或是运行时信息保存下来，下次程序运行时读取这些保存的内容，从而可以让程序从停止的地方继续执行。把变量、对象变为通用存储格式的过程叫序列化，从磁盘上的数据恢复出变量、对象的过程叫反序列化。python中的序列化与反序列化使用pickle模块或cpickle模块，其中cpickle使用c语言实现，速度上会快很多

#### 导入

```
try:
     import cPickle as pickle
except ImportError:
     import pickle
```

#### dump与dumps

dump和dumps方法可以将对象转变为存储字节字符串，其中dumps方法，接受一个对象，返回该对象的字节字符串，dump接受一个对象和一个文件句柄，直接将序列化之后的内容写入文件。

```python
In [3]: fp = open('dict.txt','w')
In [4]: test_dict = {'index_' + i: i for i in range(5)}
In [7]: cPickle.dumps(test_dict)
Out[7]: "(dp1\nS'index_4'\np2\nI4\nsS'index_2'\np3\nI2\nsS'index_3'\np4\nI3\nsS'index_0'\np5\nI0\nsS'index_1'\np6\nI1\ns."
In [8]: cPickle.dump(test_dict, fp)
In [9]: fp.close()
```

#### load与loads

load和loads方法将字节字符串反序列化为对象，load接受一个文件句柄，解析出文件中的对象，loads接受一个字节字符串，解析出对象

```python
In [10]: dict_ori = cPickle.load(open('dict.txt','r'))

In [11]: dict_ori
Out[11]: {'index_0': 0, 'index_1': 1, 'index_2': 2, 'index_3': 3, 'index_4': 4}
In [15]: pickle.loads(pickle.dumps(test_dict))
Out[15]: {'index_0': 0, 'index_1': 1, 'index_2': 2, 'index_3': 3, 'index_4': 4}
```

#### json对象存储与解析

使用json模块进行json存储与解析，json模块常用的函数有dumps，dump，load，loads与pickle类比记忆，但是有一些需要注意的选项需要看一下,ensure_ascii参数指定了怎样表示非ascii字符，默认为\uXXX，当设置ensure_ascii为False时，可以正常显示。skipkeys指定，当键不是python基本类型时的操作，如果保持默认False，会报Typerror异常，设置为True则会跳过该键

```python
 In [18]: test_dict
 Out[18]: {'index_0': 0, 'index_1': 1, 'index_2': 2, 'index_3': 3, 'index_4': 4}
 
 In [19]: json.dumps(test_dict)
 Out[19]: '{"index_4": 4, "index_2": 2, "index_3": 3, "index_0": 0, "index_1": 1}'
 
 In [20]: json.dump(test_dict, open('json_dump.txt', 'w'))
 
 In [21]: json.load(open('json_dump.txt'))
 Out[21]: {u'index_0': 0, u'index_1': 1, u'index_2': 2, u'index_3': 3, u'index_4': 4}
 
 In [22]: json.loads(json.dumps(test_dict))
 Out[22]: {u'index_0': 0, u'index_1': 1, u'index_2': 2, u'index_3': 3, u'index_4': 4}
```

### python操作csv与office文件

#### csv文件操作使用csv模块

csv文件是具有固定格式的一类文件，每行使用固定的行分隔符，每个域也是用固定的域分隔符（通常是','）。

#### 写入csv文件

```
In [6]: title = ['host', 'port']
In [8]: row_1 = ['192.168.56.101','80']

In [9]: row_2 = ['192.168.56.101','8080']
fp = open('tmp.txt', 'w')

In [12]: csv_write = csv.writer(fp)

In [13]: csv_write.writerow(title)

In [14]: csv_write.writerows([row_1, row_2])

In [15]: fp.close()
```

#### 读取csv文件

使用普通文件读取，或使用命名元组

```
In [18]: fp = open('tmp.txt','r')
In [19]: csv_reader = csv.reader(fp)
In [20]: title = next(csv_reader) 
In [21]: print title
['host', 'port']
In [22]: for line in csv_reader:
    ...:     print line
    ...:     
['192.168.56.101', '80']
['192.168.56.101', '8080']

 In [23]: from collections import namedtuple     
 In [24]: fp.close()         
 In [25]: fp = open('tmp.txt', 'r')         
 In [26]: csv_reader = csv.reader(fp)         
 In [27]: title = next(csv_reader)       
 In [28]: Row = namedtuple('Row', title)         
 In [29]: for line in csv_reader:
     ...:     row = Row(*line)
     ...:     print row.host,row.port
     ...:     print row
     ...:     
 192.168.56.101 80
 Row(host='192.168.56.101', port='80')
 192.168.56.101 8080
 Row(host='192.168.56.101', port='8080')
```

## 多线程与多进程

### 进程

进程的概念是需要理解的，进程是操作系统中正在运行的一个程序实例，操作系统通过进程操作原语来对其进行调度。操作系统得到调用某个进程指令时，将硬盘上的程序调入内存，分配空间，初始化进程堆栈，然后进程开始运行。有时候我们有同时运行多个程序的需求，如果你的电脑只能做一件事，那是一件很抓狂的事。操作系统通过进程调度算法调度进程运行，使计算机看起来同时运行了很多程序。

### python中多进程实现

#### fork

fork是linux下创建新进程的机制，通过fork父进程复制出一个相似，通过fork返回值判断执行子进程代码

```python
 import os
 def main():
     print 'current Process {} start...'.format(os.getpid())
     pid = os.fork()
     if pid < 0:
         print 'fork error!'
         exit(1)
     elif pid == 0:
         print 'child Process {} starting... , and my parent process is {}'.format(os.getpid(), os.getppid())
 
     else:
         print 'I({}) created the child({})'.format(os.getpid(), pid)
 if __name__ == '__main__':
         main()
```

得到如下输出

```python
current Process 5351 start...
I(5351) created the child(5352)
child Process 5352 starting... , and my parent process is 5351
```

#### multiprocess

使用multiprocess模块创建子进程，模块提供一个Process对象描述进程，创建进程时，只需要传入一个可调用的函数，以及函数运行时的参数即可

```
 import os
 import multiprocessing
 
 
 def run_proc(name):
     print 'child process {}({}) running...'.format(name, os.getpid())
 
 def main():
     print 'main process starting... {}'.format(os.getpid())
     processes = []
     for i in range(5):
         p = multiprocessing.Process(target=run_proc, args=(str(i),))
         processes.append(p)
         print 'process {} will start'
         p.start()
 
     for p in processes:
         p.join()
     print 'processes end'
 if __name__ == '__main__':
     main()
```

使用进程池限制进程个数。multiprocessing模块中的Pool对象，用来表示进程池，Pool对象的apply_async函数用于创建进程，同样的给出可调用的函数与函数运行需要的参数

```
 import os
 from multiprocessing import Pool
 
 def run_proc(name):
     print 'child process {}({}) running...'.format(name, os.getpid())
 
 def main():
     print 'main process starting... {}'.format(os.getpid())
     processes = Pool(processes=3)
     for i in range(5):
         processes.apply_async(run_proc,(str(i),))
     processes.close()
     processes.join()
 
 
     print 'processes end'
 if __name__ == '__main__':
     main()
```

### 进程间通信

#### 通过队列

队列，即multiprocessing模块中的Queue对象，队列中有某种资源，可以向队列中放入数据，另一个进程从队列中取出数据，当无数据可用时，消费者应该决定是阻塞等待资源还是返回一个错误，当队列已满，生产者应决定是阻塞等待可用空间还是返回错误。Queue对象有两个主要方法，get和put，get从队列中取出数据，put向队列中添加数据。blocked参数决定当队列不满足条件时是阻塞等待还是返回错误，默认为True，表示阻塞等待。timeout指定了队列阻塞的时间，如果超时，同样返回异常

```python
 from multiprocessing import Queue, Process
 import os, time, random
 
 def Proc_writer(q, urls):
     print 'Process {} is writing...'.format(os.getpid())
     for url in urls:
         q.put(url)
         print 'put {} to the Queue'.format(url)
         time.sleep(random.random())
 
 def Proc_reader(q):
     print 'Process {} is reading...'.format(os.getpid())
     while True:
         url = q.get(True)
         print 'get the {} from the Queue'.format(url)
 
 def main():
     print 'main process {} is running...'.format(os.getpid())
     q = Queue()
     process_1 = Process(target=Proc_writer, args=(q,['url_1', 'url_2', 'url_3']))
     process_2 = Process(target=Proc_writer, args=(q,['url_4', 'url_5', 'url_6']))
     process_3 = Process(target=Proc_reader, args=(q,))
     process_1.start()
     process_2.start()
     process_3.start()
     process_1.join()
     process_2.join()
     process_3.terminate()
     print 'done'
 
 
 if __name__ == '__main__':
     main()

```

#### 通过管道

multiprocessing模块的Pipe方法，返回一个二元组（conn1，conn2），Pipe方法有一个duplex参数，为True时代表管道连接是全双工的，为False时代表管道连接是单方向的，只能由conn2发送到conn1。send和recv方法用于发送与接受消息，如果没有消息可接受，recv阻塞，如果管道关闭，recv会抛出EOFError

```python
 import multiprocessing
import os, time, random
 
def proc_send(pipe, urls):
     print 'process {} is read to send urls'.format(os.getpid())
    for url in urls:
         pipe.send(url)
        print 'process {}: send {}'.format(os.getpid(), url)
         time.sleep(random.random())
 
def proc_recv(pipe):
    print 'process {} is ready to recv urls'.format(os.getpid())
    while True:
        print 'process {}: recv {}'.format(os.getpid(), pipe.recv())
        time.sleep(random.random())
 
 def main():
     pipe = multiprocessing.Pipe()
     process_send = multiprocessing.Process(
         target=proc_send,
         args=(pipe[0], ['url_' + str(i) for i in range(10)]))
     process_recv = multiprocessing.Process(
         target=proc_recv,
         args=(pipe[1],)
     )
     process_send.start()
     process_recv.start()
     process_send.join()
     process_recv.join()
     print 'done'
 
 if __name__ == '__main__':
     main()
```

#### 分布式多进程

分布式也是一个比较重要的概念，通过将负载高的计算分摊到多台计算机上来提高系统性能。使用python完成分布式计算功能是简单的。需要用到的一个数据结构是队列，联想一下操作系统中的生产者消费者模型，一些进程放入数据，一些进程取出数据。程序开始需要在服务端维护一个网络队列管理器，服务端程序注册操作网络队列的方法，随后使用该方法从网络上获取队列，对该队列的操作，对网络上的其他进程是可见的。队列的put和get方法用于放入取出数据，注意服务端和客户端注册的接口方法需统一。
使用multiprocessing子模块managers管理网络队列，其中的BaseManager类是一个基本的管理器，新建类继承该类。使用该类的register方法注册操作队列的方法，随后监听信道。如下例程
server

```python
 #!/usr/bin/env python
 import Queue
 from multiprocessing.managers import BaseManager
 
 # 创建队列实体
 task_queue = Queue.Queue()
 result_queue = Queue.Queue()
 
 class Queuemanager(BaseManager):
     pass
 
 # 注册方法
 print 'register the func'
 Queuemanager.register('get_task_queue', callable=lambda:task_queue)
 Queuemanager.register('get_result_queue', callable=lambda:result_queue)
 
 # 创建manager对象
 print 'initialing the task manager'
 manager = Queuemanager(address=('192.168.56.1', 8000), authkey='password')
 
 # 开始监听
 manager.start()
 # 从网络得到队列
 print 'get the queue from network...'
 task = manager.get_task_queue()
 result = manager.get_result_queue()
 # 向队列中放入数据等待处理
 print 'put urls to the task queue'
 for url in ['ImageUrl_' + str(i) for i in range(10)]:
     print 'put {} in task'.format(url)
     task.put(url)
 # 从队列中取出数据，阻塞等待
 for i in range(10):
     print 'result is {}'.format(result.get())
 
 manager.shutdown()
```

client

```python
      #!/usr/bin/env python
from multiprocessing.managers import BaseManager
import Queue


class Queuemanager(BaseManager):
    pass

Queuemanager.register('get_task_queue')
Queuemanager.register('get_result_queue')

server = '192.168.56.1'
port = 8000
key = 'password'
print 'try to connect to {}'.format(server)
manager = Queuemanager(address=(server, port), authkey=key)
manager.connect()

task = manager.get_task_queue()
result = manager.get_result_queue()

while not task.empty():
    image_url = task.get(True, timeout=10)
    print 'run task download {}'.format(image_url)
    result.put(image_url + '------>completed!')

print 'worker exit!'
```

### 线程

线程是一个存在于进程中的概念，用于在进程中并行完成不同的工作。线程与进程的不同另做介绍

#### python中的多线程

threading推荐使用的多线程模块

threading中的模块对象
![](https://upload-images.jianshu.io/upload_images/10339396-db94b1ac2597e6c2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
threading中的常见方法
![](https://upload-images.jianshu.io/upload_images/10339396-beb9d59aeef3d735.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Thread类
![](https://upload-images.jianshu.io/upload_images/10339396-e2542ecc8aa6022f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
初始化一个thread类来创建一个线程，我们可以

-   初始化Thread类，传入我们要运行的函数与参数
-   初始化Thread类，传入可调用对象，比如自定义可调用类
-   创建类继承Thread，覆盖run函数

#### threading模块实例

直接使用thread类

```python
#!/usr/bin/env python
import threading
from time import ctime, sleep
secLoop = [6, 4]
  def loop(sec, i):
      print 'loop', i, 'start at', ctime()
      sleep(sec)
      print 'loop', i, 'finished at', ctime()
 def main():
      nloop = range(len(secLoop))
      threads = []
      for i in nloop:
          threads.append(threading.Thread(target=loop, args=(secLoop[i], i)))

      for i in nloop:
          threads[i].start()

      for i in nloop:
          threads[i].join()

  if __name__ == '__main__':
      main()
        
```

自定义可调用类

```python
import threading
  from time import ctime, sleep
    
  secLoop = [6, 4]
  def loop(sec, i):
      print 'loop', i, 'start at', ctime()
      sleep(sec)
      print 'loop', i, 'finished at', ctime()

  class ThreadFunc(object):
      def __init__(self, func, args):
          self.func = func
          self.args = args

      def __call__(self):
          apply(self.func,self.args)

  def main():
      nloop = range(len(secLoop))
      threads = []
      for i in nloop:
          threads.append(threading.Thread(target=ThreadFunc(loop,(secLoop[i],i))))

      for i in nloop:
          threads[i].start()

      for i in nloop:
          threads[i].join()

  if __name__ == '__main__':
      main()
```

### python中的线程池与进程池

concurrent.futures 中的ThreadPoolExecutor封装了线程池实现，初始化是的max_workers指定了线程池的大小，使用submit提交线程，提交的同时线程开始执行，将提交返回的线程句柄放入列表中，使用as_complete方法阻塞等待线程执行的结果，ProcessPoolExecutor接口相同

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

# 参数times用来模拟网络请求的时间
def get_html(times):
    time.sleep(times)
    print("get page {}s finished".format(times))
    return times

executor = ThreadPoolExecutor(max_workers=2)
urls = [3, 2, 4] # 并不是真的url
all_task = [executor.submit(get_html, (url)) for url in urls]

for future in as_completed(all_task):
    data = future.result()
    print("in main: get page {}s success".format(data))
```

done（）判断是否结束，result()获取执行结果，wait方法可以等待列表中的线程完成



## python网络编程



要说python优雅在何处，与其他语言相比最为明显的，那一定是网络操作了。python可以让我们用最少的语句写出功能强大的程序，网络操作有相当多的开源库可以使用，而不用像其他语言一样，步骤繁琐。接下来从低到高介绍python网络编程

### socket网络编程接口

#### 基本概念

可以这样来理解socket，完成一段网络通信需要五个元素，协议族，协议类型，协议，目标ip地址，目标端口号，这是由TCP/IP网络结构决定的。socket作为一种数据结构，将以上五个信息组合起来，称为套接字。根据面向连接与非连接，套接字类型分为Datagram与Stream两种类型。Datagram套接字使用UDP协议，向目标地址发送数据包，不保证可靠送达，Stream使用TCP协议，是可靠的、具有差错与流量控制的传输协议，也就是说，stream类型的套接字传输信息，具有较好的可靠性，而Datagram类型的套接字具有更高的实时性。

#### 初始化流式套接字的步骤

##### 服务端

-   使用socket函数创建套接字
-   绑定到指定的ip地址
-   监听客户端连接
-   获取客户端连接后，使用返回的套接字收发数据
-   通信结束，关闭套接字

##### 客户端

-   创建套接字

-   连接指定ip地址

-   连接成功后收发数据

-   关闭套接字

    

    常用套接字函数

![](https://upload-images.jianshu.io/upload_images/10339396-6d8a155921c9ae00.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![](https://upload-images.jianshu.io/upload_images/10339396-79e1179f2f3b3835.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



#### 例程

##### 时间戳服务器

```python
 #!/usr/bin/env python
 import socket
 from time import ctime
 
 
 host='127.0.0.1'
 port=8000
 bufsize=1024
 addr=(host, port)
 
 sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
 sock.bind(addr)
 sock.listen(5)
 while True:
     print 'waiting for connection...'
     clisock, cliaddr = sock.accept()
     print 'connected from', cliaddr
     print 'peername:', clisock.getpeername()
     data = clisock.recv(bufsize)
     if not data:
         break
     clisock.send('[%s] %s' % (ctime(), data))
     clisock.close()
 sock.close()
```

##### 客户端

```python
 #!/usr/bin/env python
 from time import ctime
 import socket
 
 host='127.0.0.1'
 port=8000
 addr=(host, port)
 bufsize=1024
 
 
 while True:
     sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
     sock.connect(addr)
     data = raw_input(u'>')
     if not data:
         break
     sock.send(data)
     data = sock.recv(bufsize)
     print data
            #!/usr/bin/env python
 from time import ctime
 import socket
 
 host='127.0.0.1'
 port=8000
 addr=(host, port)
 bufsize=1024
 
 
 while True:
     sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
     sock.connect(addr)
     data = raw_input(u'>')
     if not data:
         break
     sock.send(data)
     data = sock.recv(bufsize)
     print data
 
     sock.close()
     sock.close()
```

### 异步socket

使用select， poll和epoll，操作接口统一，一般使用较为新的epoll，

一个使用epoll的例子如下

```python
import argparse
import logging
import os, sys
import select
import socket
import signal
import queue
logging.basicConfig(
    level=logging.DEBUG,  # 定义输出到文件的log级别，
    format='%(asctime)s  [%(filename)s %(lineno)d] %(levelname)s  %(message)s',  # 定义输出log的格式
    datefmt='%Y-%m-%d %A %H:%M:%S'
)


def parse_command_line(description: str):
    argparser = argparse.ArgumentParser(description=description)
    argparser.add_argument('--host', action='store', default='localhost',
                           required=False, dest='host', help='the host server will listen to')
    argparser.add_argument('--port', action='store', default=1070, type=int,
                           required=False, metavar='port', help="the port server will bind to")
    args = argparser.parse_args()
    return (args.host, args.port)


# POLLIN    There is data to read
# POLLPRI   There is urgent data to read
# POLLOUT   Ready for output: writing will not block
# POLLERR   Error condition of some sort
# POLLHUP   Hung up
# POLLRDHUP Stream socket peer closed connection, or shut down writing half of connection
# POLLNVAL  Invalid request: descriptor not open

READ_ONLY = (select.EPOLLIN | select.EPOLLPRI | select.EPOLLHUP | select.EPOLLERR)
READ_WRITE = (READ_ONLY | select.EPOLLOUT)


class Server:

    def __init__(self, server_addr: tuple):
        self.server_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_sock.setblocking(False)
        self.server_sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.server_sock.bind(server_addr)
        self.server_sock.listen(10)
        # self.inputs = [self.server_sock]
        self.fd_2_socks = {self.server_sock.fileno(): self.server_sock}

        self.outputs = []
        self.message_queues = {}
        self.poller = select.epoll()
        self.poller.register(self.server_sock.fileno(), READ_ONLY)
        logging.info('server socket initialized!')
        signal.signal(signal.SIGINT, self.destory_server)
        signal.signal(signal.SIGTERM, self.destory_server)

    def accept_connection(self):
        connection, client_addr = self.server_sock.accept()
        logging.info('connection from {}'.format(client_addr))
        connection.setblocking(False)
        self.fd_2_socks[connection.fileno()] = connection
        self.poller.register(connection.fileno(), READ_ONLY)
        self.message_queues[connection] = queue.Queue()

    def read_msg(self, conn: socket):
        data = conn.recv(1024)
        if data:

            logging.info('received msg({}): {}'.format(conn.getpeername(), data.decode('utf-8')))
            self.message_queues[conn].put(data)
            self.poller.modify(conn.fileno(), READ_WRITE)

        else:
            logging.info('closing socket: {}'.format(conn.getpeername()))
            self.poller.unregister(conn.fileno())
            conn.close()
            del self.message_queues[conn]

    def send_msg(self, conn: socket):
        try:
            msg = self.message_queues[conn].get_nowait()
        except queue.Empty:
            logging.error('{} queue empty!'.format(conn.getpeername()))
            self.poller.modify(conn.fileno(), READ_ONLY)
        else:
            logging.info('sending msg {} to {}'.format(msg, conn.getpeername()))
            conn.send(msg)

    def exception_handler(self, conn: socket):
        logging.error('exception occured on socket: {}'.format(conn.getpeername))

        self.poller.unregister(conn.fileno())
        conn.close()
        del self.message_queues[conn]

    def serv_forever(self):
        while True:
            logging.info('waiting for next event!')
            # 对epoll对象,poll参数单位是秒,对poll对象,参数单位是毫秒
            events = self.poller.poll(-1)
            for fd, flag in events:
                sock = self.fd_2_socks[fd]
                if flag & (select.EPOLLIN | select.EPOLLPRI):
                    if sock is self.server_sock:
                        self.accept_connection()
                    else:
                        self.read_msg(sock)
                elif flag & select.EPOLLOUT:
                    self.send_msg(sock)
                elif flag & (select.EPOLLERR | select.EPOLLHUP):
                    self.poller.unregister(fd)
                    sock.close()
                    del self.message_queues[sock]

    def destory_server(self, *args):
        logging.info('exiting......')
        for arg in args:
            print(arg)
        sys.exit(0)


if __name__ == '__main__':
    server_address = parse_command_line('asynchro socket server!')
    server = Server(server_address)
    server.serv_forever()

```

epoll会新建epoll对象，其poll方法会在已经注册的文件描述符上等待注册过的事件，当有事件发生或时间达到时，返回描述符与事件组成的元组。



### 网络http操作

使用urllib、urllib2、requests

一般来说，进行网络操作时可以使用以上三个模块任意一种，但是就功能上来说，requests较为强大，对底层模块进行了封装，使用更为简便，我们重点来讨论一下requestshttp请求有几种类型，最常用的是get与post，get请求向指定的资源请求数据，GET 请求可被缓存，GET 请求保留在浏览器历史记录中，GET 请求可被收藏为书签，GET 请求不应在处理敏感数据时使用，GET 请求有长度限制，GET 请求只应当用于取回数据。post请求向指定的资源提交数据，POST 请求不会被缓存，POST 请求不会保留在浏览器历史记录中，POST 不能被收藏为书签，POST 请求对数据长度没有要求。还有一个区别是，使用get请求时，参数直接显示在url中，安全性不高，而post请求将参数包含在请求体中。

#### 使用requests

##### 发出get与post请求

```
In [8]: res = requests.get('http://www.baidu.com')
In [9]: res2 = requests.post('http://www.baidu.com')
```

##### 设置请求参数

通过params参数设置请求参数，需要传进一个字典，且值为none的键不会出现在url中

```python
In [10]: para = {'username':'xiaozhi','password':'testpass'}
In [11]: res3 = requests.get('http://www.baidu.com',params=para)
In [12]: res3.url
Out[12]: u'http://www.baidu.com/?username=xiaozhi&password=testpass'
```

##### 为post请求传递数据

使用data参数

```
In [3]: data = {'key':'value'}
In [4]: res = requests.post('http://httpbin.org/post', data=data)
```

```
In [38]: payload = (('key1', 'value1'), ('key1', 'value2'))
In [39]: r = requests.post('http://httpbin.org/post', data=payload)
```

##### 获取响应内容

字符串内容

```
In [5]: res.text
Out[5]: u'{"args":{},"data":"","files":{},"form":{"key":"value"},"headers":{"Accept":"*/*","Accept-Encoding":"gzip, deflate","Connection":"close","Content-Length":"9","Content-Type":"application/x-www-form-urlencoded","Host":"httpbin.org","User-Agent":"python-requests/2.18.4"},"json":null,"origin":"113.140.11.6","url":"http://httpbin.org/post"}\n'
```

查看与设置内容编码

```
In [8]: res.encoding
In [9]: res.encoding='utf-8'
```

使用content属性可以查看返回内容的字节内容，python会自动为我们解码gzip压缩的数据

```
In [15]: res.content
Out[15]: '{"args":{},"data":"","files":{},"form":{"key":"value"},"headers":{"Accept":"*/*","Accept-Encoding":"gzip, deflate","Connection":"close","Content-Length":"9","Content-Type":"application/x-www-form-urlencoded","Host":"httpbin.org","User-Agent":"python-requests/2.18.4"},"json":null,"origin":"113.140.11.6","url":"http://httpbin.org/post"}\n'
```

json对象

```
In [16]: res.json()
Out[16]: 
{u'args': {},
 u'data': u'',
 u'files': {},
 u'form': {u'key': u'value'},
 u'headers': {u'Accept': u'*/*',
  u'Accept-Encoding': u'gzip, deflate',
  u'Connection': u'close',
  u'Content-Length': u'9',
  u'Content-Type': u'application/x-www-form-urlencoded',
  u'Host': u'httpbin.org',
  u'User-Agent': u'python-requests/2.18.4'},
 u'json': None,
 u'origin': u'113.140.11.6',
 u'url': u'http://httpbin.org/post'}
```

查看返回状态码

```
res.status_code
```

原始数据

```python
In [31]: res = requests.get('https://api.github.com/events', stream=True)

In [32]: with open('temp.txt', 'wb') as fd:
    ...:     for chunk in res.iter_content(512):
    ...:         fd.write(chunk)
```

查看返回的http头部

```python
In [44]: r.headers
Out[44]: {'Content-Length': '351', 'Via': '1.1 vegur', 'Server': 'gunicorn/19.8.1', 'Connection': 'keep-alive', 'Access-Control-Allow-Credentials': 'true', 'Date': 'Thu, 24 May 2018 12:13:11 GMT', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
```

使用headers参数定制请求头

```
In [33]: headers = {'user-agent':'myapp'}
In [34]: res = requests.get('http://www.baidu.com', headers=headers)
```

返回对象的cookies属性保存了会话cookie，当需要重用cookies时，将cookie对象作为参数传递给请求的cookies参数

```
res = requests.get(url,cookies=res.cookies)
```

使用cookie模拟登陆豆瓣网站

```
cookies = {}

In [57]: raw_cookies='bid=-aa9Pl9eMB0; _pk_ref.100001.8cb4=%5B%22%22%2C%22%22%2C1527208498%2C%22http
    ...: s%3A%2F%2Fwww.baidu.com%2Flink%3Furl%3DFpVInsn4IT_ak-F56yaoXBUJPtBtueoUd3nVtc4NWZV4QBO8sdnc
    ...: vDJTEYLuefv5%26ck%3D1583.5.192.64.190.324.478.646%26shh%3Dwww.baidu.com%26wd%3D%26eqid%3D89
    ...: b868ea00032e0c000000035b06b157%22%5D; _pk_id.100001.8cb4=83b586dcea10d0e5.1519446169.2.1527
    ...: 209320.1519446169.; __utma=30149280.2141300691.1527208503.1527208503.1527208503.1; __utmz=3
    ...: 0149280.1527208503.1.1.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; ll="118371"; _pk_ses.1
    ...: 00001.8cb4=*; __utmb=30149280.9.10.1527208503; __utmc=30149280; ps=y; push_noty_num=0; push
    ...: _doumail_num=0; __utmv=30149280.13784; ap=1; dbcl2="137847261:LmaeCQEh7Eo"; ck=x-vi; __utmt
    ...: =1'

In [58]: for line in raw_cookies.split(';'):
    ...:     key,value = line.split('=', 1)
    ...:     cookies[key] = value
In [64]: url = 'https://www.douban.com/people/xiaozhiAXX/'

In [65]: res = requests.get(url,cookies=cookies)

In [66]: res.status_code
Out[66]: 200

```

使用proxies参数设置代理,访问google

```
In [1]: import requests

In [2]: proxy = {'http':'http://127.0.0.1:8118','https':'https://127.0.0.1:8118'}

In [3]: res = requests.get('https://www.google.com', proxies=proxy)

In [4]: res.status_code
Out[4]: 200
```

### 网络客户端

#### 电子邮件

python发送电子邮件时，使用标准库中的smtplib和email，smptlib中有一个SMTP类，需要发送邮件时，初始化该类返回smtpserver对象，使用login登陆MUA，使用sendmail方法发送邮件，邮件的正文用email.mime.text.MIMEText对象进行描述

##### 简单电子邮件发送程序

```
from email.mime.text import MIMEText
msg = MIMEText('hello message','plain', 'utf-8')
from_addr = 'yourPhone@163.com'
to_addr = 'yourQQ@qq.com'
sub_msg = 'hello'
smtp_server = 'smtp.163.com'
import smtplib
# 初始化smtp对象，传入服务器地址与端口号
server = smtplib.SMTP(smtp_server,25)
# 设置调试模式可以让我们看到发送邮件过程中的信息
server.set_debuglevel(1)
# 登陆MUA，使用账户与授权码登陆
server.login(from_addr, 'yourpassword')
msg['From'] = from_addr
msg['To'] = to_addr
msg['Subject'] = 'important message'
server.sendmail(from_addr, [to_addr], msg.as_string())
```

邮件被放入垃圾邮件中，如下
![](https://upload-images.jianshu.io/upload_images/10339396-9facc1f5f15763a4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
发送带附件的电子邮件

```
 from email.mime.text import MIMEText
 from smtplib import SMTP
 from email.mime.multipart import MIMEMultipart
 
 
 from_addr = '18392136027@163.com'
 to_addr = '1786614260@qq.com'
 smtp_server = 'smtp.163.com'
 smtp_port = 25
 subject_msg = 'subject'

 mul_msg = MIMEMultipart()
 mul_msg['From'] = from_addr
 mul_msg['To'] = to_addr
 mul_msg['Subject'] = subject_msg

 msg = MIMEText('\n\rimportant message\n\r', 'plain', 'utf-8')
 mul_msg.attach(msg)

 att1 = MIMEText(open('program.txt','rb').read(), 'base64', 'utf-8')
 att1['Content-Type'] = 'application/octet-stream'
 att1["Content-Disposition"] = 'attachment;filename="program.txt"'
 mul_msg.attach(att1)

 smtp = SMTP(smtp_server, smtp_port)
 smtp.login(from_addr, 'youpass')
 smtp.set_debuglevel(1)
 smtp.sendmail(from_addr, to_addr, mul_msg.as_string())
 smtp.close()
```

![](https://upload-images.jianshu.io/upload_images/10339396-1be1e54d045af6db.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
使用第三方开源库yagmail发送电子邮件

```
import yagmail
yag = yagmail.SMTP(user='youQQ@qq.com', password='you pass', host='smtp.qq.com', port=25)
contents = ['import message','program.txt']
yag.send(to='dest', subject='subject', contents=contents)
```

使用pop3协议用网易邮箱发送邮件时，容易被网易识别为垃圾邮件，可以使用qq邮箱

## 正则表达式



### 特殊字符

-   元字符
    ![](https://upload-images.jianshu.io/upload_images/10339396-deb32b700e261023.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
-   特殊字符
    ![](https://upload-images.jianshu.io/upload_images/10339396-42be8d0271b547b5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
-   使用|来分隔多个正则符号
-   使用.来匹配单个字符
    `f.o -> f和o之间有任意单个字符`
-   开头^结尾$边界\b\B
    ^test 匹配test开头的字符串
    test$ 匹配test结尾的字符串
    ^$ 匹配空行
    \btest 匹配以test开始的字符串
    \btest\b 匹配单词test
    \Btest匹配包含test但不以test开头的字符串
-   使用[]匹配字符集合
    [abc]
    [a-z]
    [^a-z]



### 正则表达式中的分组

重复单个字符只需在该单个字符后加上需要重复的次数（*?{}），当重复多个字符时，将该多个字符用（）括起来，后面跟上重复次数即可,这里我们看一个匹配ip地址的范例，从ifconfig输出结果匹配到ip地址，在vim中匹配如下，由于（）{}在shell中是特殊字符，所以使用\来转义`\(\d\{1,3\}\.\)\{3\}\d\{1,3\}`
![](https://upload-images.jianshu.io/upload_images/10339396-5c6f19ce91613fbb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
使用在线工具测试
![](https://upload-images.jianshu.io/upload_images/10339396-6e40ca20875eacca.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

由于ip地址限制每个域不能超过255，使用`((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)`
    ![](https://upload-images.jianshu.io/upload_images/10339396-8331f07d826a6022.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 后向引用

默认情况下，每个（）括起来的分组会被分配一个从1开始的组号，特殊的分组0代表整个正则表达式
使用（）匹配一个子表达式后，匹配这个子表达式的文本，可以在后续正则中继续使用，\1表示分组一匹配的文本
![](https://upload-images.jianshu.io/upload_images/10339396-6a02f1663df7c773.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
常用的分组语法如下
![](https://upload-images.jianshu.io/upload_images/10339396-b91a56bd42f8843a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
使用命名分组（\k<name>）
![](https://upload-images.jianshu.io/upload_images/10339396-3144a662e1a995bc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 零宽断言

有时候我们想匹配某个模式之前或之后的部分，匹配的部分必须满足特定条件。

-   (?=exp)该位置后面可以匹配exp，返回除了exp的部分
    `\b\w+(?=ing\b)`
    ![](https://upload-images.jianshu.io/upload_images/10339396-1f7de055092d20c9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
-   (?<=exp)该位置前面可以匹配exp，同样返回除了exp的部分
    `(?<=broad)\w+\b`
    ![](https://upload-images.jianshu.io/upload_images/10339396-f0c4ee09c879cce0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 负向零宽断言

断言某位置前或后不能出现某些字符，我们也可以使用反义，但是问题在于使用反义时，[^]总会占用一个字符空间，可以匹配到单词分隔符。

-   (?!exp)断言此位置后不匹配exp
    ![](https://upload-images.jianshu.io/upload_images/10339396-9e99c23072778006.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
-   (?<!exp>)断言此位置前不匹配exp
    ![](https://upload-images.jianshu.io/upload_images/10339396-8174e7aaae27edbf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 贪婪匹配与懒惰匹配

当我们的正则表达式有表示重复次数的元字符时，默认情况下总是会自动匹配最长，比如ababab,用a.*b来匹配，会匹配到整个字符串，这就是贪婪匹配，容易理解懒惰匹配就是匹配最短。通过在元字符后加上？来将贪婪匹配变为懒惰匹配。如下
![](https://upload-images.jianshu.io/upload_images/10339396-3982676bfa2deeef.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![](https://upload-images.jianshu.io/upload_images/10339396-546da4d279c18ebb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### python中的正则表达式re

#### 核心函数与表达式

![](https://upload-images.jianshu.io/upload_images/10339396-4fd48bb345a8e9a2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

-   compile()对给出的pattern进行编译，加快后续处理的速度，该过程不是必须的，search，match函数可以直接使用字符串来进行匹配，但是使用编译过后的字节码对象可以加快处理的速度

-   匹配对象的group和groups方法
    re模块的match和search方法会返回一个匹配对象，该对象保存了模式匹配的结果，可以使用该对象的groups和group方法获取匹配的结果.group方法返回所有匹配对象或根据要求返回特定子组匹配的对象

-   match(pattern,string)从string开头匹配pattern
    ![](https://upload-images.jianshu.io/upload_images/10339396-7c50e46093a65317.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    如果开头不匹配，返回None
    ![](https://upload-images.jianshu.io/upload_images/10339396-99349c2d25d50af8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

-   search(pattern,string)从string中搜索pattern第一次出现的位置
    ![](https://upload-images.jianshu.io/upload_images/10339396-c70dfe99352849f0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

-   findall(pattern, string)从string中查找所有匹配，返回匹配字符串列表
    ![](https://upload-images.jianshu.io/upload_images/10339396-d782eb9d59d0005e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

-   sub(pattern, repl, string)将匹配pattern的部分替换为repl
    ![](https://upload-images.jianshu.io/upload_images/10339396-397ebf7cd5ba7cb6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

-   re.split(pattern,string)使用pattern指定的字符分隔string，可以指定多个字符
    ![](https://upload-images.jianshu.io/upload_images/10339396-01fffd5d8c11c85f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

-   在匹配时，通过指定flag参数为re.I可以忽略大小写匹配

    ```
    In [8]: m = re.compile('a', re.I)
    
    In [9]: m.findall('abcAAbbc')
    Out[9]: ['a', 'A', 'A']
    ```

​      



