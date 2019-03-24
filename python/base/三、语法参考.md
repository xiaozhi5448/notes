# 三、语法参考



1. 条件判断
    - if语句
      - 单分支
        ```python
        #!/usr/bin/python
        if expression and expression2:
            do something
        ```
      - if-else
        ```python
        #!/usr/bin/python
        if expression:
            do something
        else:
            do other
        ```
      - if-elif-else
        ```python
        if expression:
            do suite1
        elif expression2:
            do suite2
        else:
            do others
        ```
      - 三元条件表达式
        `x if expression else y`
2. 循环
    - while语句
      ```python
      while expression:
          do suite
      ```
    - for 循环
      ```python
      for iter_var in iterable:
          do suite
      ```
    - break,continue , pass语义与c语言相同
    - 循环中的else
      ```python
      while expression:
          do suite
      else:
          do suite2
      ```
      当循环结束时执行else语句，break语句也会跳过else语句，for循环同上
3. 理解迭代器
4. 理解列表解析
    `[ item for item in iterable]`
5. 函数
    - prammar
      ```
      def fun(args):
          do suite
          return value
      ```
    - python中的函数可以像变量一样赋值
      ![](https://upload-images.jianshu.io/upload_images/10339396-9581fc521b8f1bb2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - 参数类型
      - 位置参数
        ![](https://upload-images.jianshu.io/upload_images/10339396-d4c608015471f4fa.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      - 默认参数
        ![](https://upload-images.jianshu.io/upload_images/10339396-7ab96dd7fe78f9a6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      - 关键字参数
        关键字参数必须出现在位置参数之后
        ![](https://upload-images.jianshu.io/upload_images/10339396-c7ff0d3686db0b19.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      - 可变长度参数
        通过元组传递
        ![](https://upload-images.jianshu.io/upload_images/10339396-cdf38b554c36521c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
        还可以使用字典传递关键字参数，注意函数调用，参数列表中的顺序`fun(arg1,arg2,*argseq,**argdict)`
    - 变量作用域和名称空间
      定义在全局的变量具有全局作用域，定义在局部比如函数或者代码块中的变量具有局部作用域，全局变量除非显式删除，会一直存活直到程序结束，而局部变量存放在该代码块的栈中，随函数生灭同步。当搜索一个标志符的时候，python先从局部作用域开始，如果局部作用域中没有找到，就在全局作用域中找，如果还未找到，就抛出异常。当我们在局部名称空间定义与全局名称空间一个相同名称的变量时，全局变量会被屏蔽，而使用局部名称空间的变量。使用globa在函数中声明某个变量为全局变量，在函数中对该变量的修改将是全局的,在函数中修改函数外变量的函数称为闭包
    - 生成器的概念
      挂起返回出中间值并多次继续执行的协同程序被成为生成器。协同程序是可以运行的独立函数调用，可以暂停或挂起，并且可以从函数中止的地方重新开始
6. 异常处理
    异常处理是面向对象设计重要的一环，出现某些错误的时候，我们通过捕获异常来决定如何处理这些错误
    - 语法,一个try语句可以有多个except语句，可以使用raise显式抛出异常
      ```
      try:
          do suite
      except exception[,expression2]:
          ex suite
      finally:
          fin suite
      ```
    - 在一般的异常处理过程中，如果是文件类操作，可以使用with上下文管理器替代

7. 模块的概念
    - 模块就是表面的意思，为了将复杂的功能区分开，将实现不同功能的代码段放在不同的文件中，叫做模块，将一个模块拿到当前文件中的过程成为导入。一个文件被看作是一个单独的模块，文件是在物理层上组织模块的方法
    - 路径搜索
      模块的导入需要通过一个成为路径搜索的过程，即在文件系统预定义区域搜索以该模块名称命名的py文件，默认搜索路径是在编译或安装的时候指定的，可以通过两种方式对其进行修改,一是通过修改shell中的PYTHONPATH环境变量，另一种是直接修改sys.path列表
      ![](https://upload-images.jianshu.io/upload_images/10339396-402618dc6a2c476e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - 导入模块
      ```python
      import module
      from module import fun
      from module import fun as fun2
      ```
    - 导入和加载
      在导入一个模块的时候，该模块顶层代码将被直接执行，包括函数定义，变量定义，所以将代码放入函数中是一个明智的决定，这是一次加载，如果一个模块被导入多次，那么它只会被加载一次。可以使用内建函数load显式加载某个模块。在python中有一个运行时变量__name__当该模块被当作主程序执行时，该变量的名字是__main__,当该模块作为模块被导入到其他模块中,该变量的名字是该模块的名称。所以经常在源文件中看到
      ```
      if __name__=='__main__':
          if suite
      ```
      包的概念我们类比java中包的定义来理解,将实现相同类别的模块通过包组织到一起，在物理上就是放到同一个文件夹中，访问包中某个模块时，通过package.module的方式。如果我们不希望模块中的某个属性被导入到其他模块，可以在该属性前加上单下划线\_
      源文件编码
      ```
      #!/usr/bin/env python
      # -*- coding: UTF-8 -*-
      ```

8. 面向对象程序设计
    - 一切皆对象
      使用面向对象程序设计，可以更真实的反映生活中需要解决的问题，将物体抽象为对象，方便问题的解决。在做程序设计的时候，虽然说某种语言是纯面向对象的，但是其中或多或少都有面向过程的成分存在，因为我们的思维，本来就是面向过程的。我们定义类作为新的数据类型，定义类的方法与属性作为新数据类型的方法与属性，然后我们操作这些数据类型为我们完成一些事情。我们像使用int一样使用person类，当完成了这些设计，需要用到面向过程的思想帮助我们完成全局的工作
    - 访问权限控制
      在python中，所有类属性都是公开的，唯一能为访问权限控制做的就是混淆变量。（与java注意区分）
    - 创建类
      ```
      class ClassName(bases):
          ' class docs'
          class suite
      ```
    - 类的属性
      - 数据
        类的数据属性可以类比java语言中的静态变量，为类所有，由于没有访问权限控制，所有内容都可以访问该类的静态属性
        ![](https://upload-images.jianshu.io/upload_images/10339396-1206099e0d49188a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
        对象的数据可以动态添加
        ![](https://upload-images.jianshu.io/upload_images/10339396-35cd34026bd2a19e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
        类的特殊属性
        ![](https://upload-images.jianshu.io/upload_images/10339396-47fb41973c6b656e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
        使用dir命令来查看类的属性
        ![](https://upload-images.jianshu.io/upload_images/10339396-205977a3d2284ab7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

      - 方法
        python规定所有的方法都必须通过实例来调用
        - 构造器方法
          python对类进行实例化时，一旦对象被创建，python检查该类是否实现了\__init\__()方法，如果实现了，就执行该方法。如果有一些初始化的操作，放在这个方法里是一个不错的选择。当我们在代码中使用继承，如果重写了子类的\__init\__()方法，那么它就不会主动调用父类的\__init\__()方法,而需要我们在子类构造函数中显式调用
        - 静态方法与类方法（类比java理解）
          ```python
          class TestStaticMethod:
              @staticmethod
              def foo():
                  print "calling static method foo()"
          
          class TestClassMethod:
              @classmethod
              def foo(cls):
                  print 'calling class method foo()'
                  print 'foo() is part of class:', cls.__name__
          ```
        - 面向对象程序设计有一些共有的特性，比如继承、组合、覆盖，我们可以类比其他语言如java、c++来理解。我们重点来看一下访问权限控制，在java中为类属性提供了访问权限控制修饰符，但在python中不提供这样的修饰符。如果我们希望某个变量对外界屏蔽，那么在该变量名称前加上双下划线\__,该变量会被混淆为\__classname\__varname。如果是简单的模块级别的私有化，只需要在变量前加单下划线\_，防止被导入其他模块








