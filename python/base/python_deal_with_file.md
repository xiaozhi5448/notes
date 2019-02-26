#  二、python文件处理

1. 文件读写
    文件读写部分，python有一个基本的内置文件读取函数open
     `open(filename, mode)`其中mode可以是r、w、x、a，模式a表示打开文件会在文件末尾追加内容，使用w模式打开文件，如果文件存在会将文件清空，再写入，如果使用x模式打开文件，如果文件存在会抛出异常。open函数返回文件对象，当操作完成时，使用close方法关闭文件流，另一个优美的做法是使用上下文管理器

    ```python
    with open("test.txt") as f:
        print f.read()
    ```

2. 常见文件读写函数
    - read([size])读取指定长度文件内容，如果size为空，读取所有
    - readline()读取文件一行
    - readlines()读取文件所有内容到一个列表
    - seek(offset[,whence])函数更改文件指针的位置，whence表示从何处偏移，默认值是0，表示从文件头开始
    - write(str)将str写入文件
    - writelines(strlist)将字符串列表写入文件
    - 读取文件内容常用迭代（python文件对象是可迭代的）
        ```python
        with open("test.txt") as f:
            for line in f:
                print line
        ```
    -  示例：将文件中所有单词首字母变大写
        ```python
        with open("program_log.txt") as inf, open("program.txt", 'w') as outf:
             for line in inf:
                 outf.write(" ".join([word.capitalize() for word in line.split()]))
                 outf.write("\n")
        ```

3. os.path中的路径与文件管理函数
    - os模块
      - os.listdir(dir)列出dir下所有的目录与文件
      - os.getcwd()获取当前工作目录
      - os.chdir(dir)改变工作目录
      - os.rmdir('dir')删除空目录
      - os.mkdir(dir)创建目录
      - rename()重命名目录或文件
      - os.chmod(file, mod)更改文件权限
      - os.access(file, auth)判断用户对该文件是否有指定权限
        其中auth可以取os.R_OK,os.W_OK,os.X_OK
    - 拆分
      - os.path.split(path)将path拆分为目录与文件名称，并返回二元组
      - os.path.dirname(path)获取path中的目录名称
      - os.path.filename(path)获取path中的文件名称
      - os.path.splitext(path)获取path中文件扩展名和去处扩展名后的二元组
    - 构建
      - os.path.join(dir...)接收可变参数，组合为完整路径
      - os.path.abspath(dir)得到某文件绝对路径
      - os.path.expanduser(path)展开用户目录
        `os.path.expanduser('~/test/txt')`
    - 获取文件属性
      - os.path.getsize(file)获取文件大小
      - os.path.{getctime(),getatime(),getmtime()}
    - 判断文件类型
      - os.path.exists(file)是否存在
      - os.path.isfile(file)是否是文件
      - os.path.isdir(file)是否是目录
      - os.path.islink()
      - os.path.ismount()
    - 示例
      - 获取用户目录下所有的文件列表
        `[ name for name in os.listdir(os.path.expanduser('~')) if os.path.isfile(name)]`
      - 获取用户目录下所有的目录列表
        `[ name for name in os.listdir(os.path.expanduser('~')) if os.path.isdir(name)]`
      - 获取用户目录下目录到绝对路径之间的字典
        `{name: os.path.abspath(name) for name in os.listdir(os.path.expanduser('~')) if os.path.isdir(name)}`
      - 获取最常用的10条命令
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

4. 文件查找
    - 使用字符串匹配
      ```python
      [item for item in os.listdir('.') if item.endswith('txt')]
      [item for item in os.listdir('.') if item.startswith('pro')]
      ```
      ![](https://upload-images.jianshu.io/upload_images/10339396-2393460f27140d8b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - 使用fnmatch
      - fnmatch是一个文件名称匹配库，可以理解为简单的正则表达式匹配，支持的正则符号有
        - *匹配任意数量任意字符
        - ？匹配单个任意字符
        - [seq]匹配seq中的字符
        - [!seq]不匹配seq中的字符
      - 常用函数
        - fnmatch(file,pattern)判断文件是否符合特定模式
        - fnmatchcase同上，忽略大小写
        - filter(names,pat)返回输入列表中符合pat的元素组成的列表
        - 示例
          - 找到当前目录所有jpg文件
            ```
            [item for item in os.listdir('.') if fnmatch.fnmatch(item, '*.jpg')]
            ```
            ![](https://upload-images.jianshu.io/upload_images/10339396-835c0a00a80c5aab.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
          - 返回所有a-c开头的文件
            ```
            [item for item in os.listdir('.') if fnmatch.fnmatch('[a-c]*')]
            ```
            ![](https://upload-images.jianshu.io/upload_images/10339396-caabb18cbb71c48a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
          - 返回不是a-c开头的文件
            ```
            fnmatch.filter(os.listdir('.'), '[!a-c]*')
            ```
            ![](https://upload-images.jianshu.io/upload_images/10339396-8745a101945a3ff4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - 也可以直接使用glob查找文件，相当于os.listdir与fnmatch
       `glob.glob('[a-c]*.jpg')`
         ![](https://upload-images.jianshu.io/upload_images/10339396-6e11dbf56fec9aed.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - 使用os.walk遍历目录树
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

5. 使用shutil
    - 复制文件或目录
      ```python
      import shutil
      shutil.copy('a.txt', 'b.txt')
      shutil.copytree('dir1', 'dir2')
      ```
    - 移动与重命名
      ```python
      shutil.move('a.txt', 'b.txt')
      shutil.move('a.txt', 'dir')
      shutil.move('dir1', 'dir2')
      ```
    - 删除文件或目录
      ```python
      shutil.rmtree('dir')
      ```

6. 通过计算md5校验码检查文件是否是同一个
    ```python
    import hashlib
    d = hashlib.md5()
    with open('backup.py') as f:
        for line in f:
            d.update(line)
    d.hexdigest()
    ```
    查找某目录下相同文件
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

7. 压缩包管理
    - 使用tarfile创建与读取tar包
      读取tar文件
      ```python
      with tarfile.open('mess.tar') as inf:
            for mem in inf.getmembers():
                print mem
      ```
      创建tar文件
      ```python
      with tarfile.open("mess2.tar", mode='w') as outf:
          outf.add('b2.c')
      ```
      tarfile对象常用方法
      - getnames()获取tar包的文件列表
      - extract()提取单个文件
      - extractall()提取所有文件
    - 使用tarfile创建压缩包时，只需在mode参数指定压缩方式
      `tarfile.open('test.tar', mode='w:bz2')

8. 数据存储
    - 序列化与反序列化
      程序运行时，所有内容保存在内存中，有时候需要把某些变量的内容或是运行时信息保存下来，下次程序运行时读取这些保存的内容，从而可以让程序从停止的地方继续执行。把变量、对象变为通用存储格式的过程叫序列化，从磁盘上的数据恢复出变量、对象的过程叫反序列化。python中的序列化与反序列化使用pickle模块或cpickle模块，其中cpickle使用c语言实现，速度上会快很多
      - 导入
        ```
        try:
             import cPickle as pickle
        except ImportError:
             import pickle
        ```
      - dump和dumps方法可以将对象转变为存储字节字符串，其中dumps方法，接受一个对象，返回该对象的字节字符串，dump接受一个对象和一个文件句柄，直接将序列化之后的内容写入文件。
        ```python
        In [3]: fp = open('dict.txt','w')
        In [4]: test_dict = {'index_' + i: i for i in range(5)}
        In [7]: cPickle.dumps(test_dict)
        Out[7]: "(dp1\nS'index_4'\np2\nI4\nsS'index_2'\np3\nI2\nsS'index_3'\np4\nI3\nsS'index_0'\np5\nI0\nsS'index_1'\np6\nI1\ns."
        In [8]: cPickle.dump(test_dict, fp)
        In [9]: fp.close()
        ```
      - load和loads方法将字节字符串反序列化为对象，load接受一个文件句柄，解析出文件中的对象，loads接受一个字节字符串，解析出对象
        ```python
        In [10]: dict_ori = cPickle.load(open('dict.txt','r'))
        
        In [11]: dict_ori
        Out[11]: {'index_0': 0, 'index_1': 1, 'index_2': 2, 'index_3': 3, 'index_4': 4}
        In [15]: pickle.loads(pickle.dumps(test_dict))
        Out[15]: {'index_0': 0, 'index_1': 1, 'index_2': 2, 'index_3': 3, 'index_4': 4}
        ```
    - json对象存储与解析
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

9. python操作csv与office文件
    - csv文件操作使用csv模块
      csv文件是具有固定格式的一类文件，每行使用固定的行分隔符，每个域也是用固定的域分隔符（通常是','）。
      - 写入csv文件
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
      - 读取csv文件,使用普通文件读取，或使用命名元组
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





