# 四、正则表达式



1. 正则表达式
    - 元字符
      ![](https://upload-images.jianshu.io/upload_images/10339396-deb32b700e261023.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - 特殊字符
      ![](https://upload-images.jianshu.io/upload_images/10339396-42be8d0271b547b5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2. 使用|来分隔多个正则符号
3. 使用.来匹配单个字符
    `f.o -> f和o之间有任意单个字符`
4. 开头^结尾$边界\b\B
    ^test 匹配test开头的字符串
    test$ 匹配test结尾的字符串
    ^$ 匹配空行
    \btest 匹配以test开始的字符串
    \btest\b 匹配单词test
    \Btest匹配包含test但不以test开头的字符串
5. 使用[]匹配字符集合
    [abc]
    [a-z]
    [^a-z]
6. 正则表达式中的分组
    重复单个字符只需在该单个字符后加上需要重复的次数（*?{}），当重复多个字符时，将该多个字符用（）括起来，后面跟上重复次数即可,这里我们看一个匹配ip地址的范例，从ifconfig输出结果匹配到ip地址，在vim中匹配如下，由于（）{}在shell中是特殊字符，所以使用\来转义`\(\d\{1,3\}\.\)\{3\}\d\{1,3\}`
    ![](https://upload-images.jianshu.io/upload_images/10339396-5c6f19ce91613fbb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    使用在线工具测试
    ![](https://upload-images.jianshu.io/upload_images/10339396-6e40ca20875eacca.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

由于ip地址限制每个域不能超过255，使用`((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)`
    ![](https://upload-images.jianshu.io/upload_images/10339396-8331f07d826a6022.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

7. 后向引用
    默认情况下，每个（）括起来的分组会被分配一个从1开始的组号，特殊的分组0代表整个正则表达式
    使用（）匹配一个子表达式后，匹配这个子表达式的文本，可以在后续正则中继续使用，\1表示分组一匹配的文本
    ![](https://upload-images.jianshu.io/upload_images/10339396-6a02f1663df7c773.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    常用的分组语法如下
    ![](https://upload-images.jianshu.io/upload_images/10339396-b91a56bd42f8843a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    使用命名分组（\k<name>）
    ![](https://upload-images.jianshu.io/upload_images/10339396-3144a662e1a995bc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
8. 零宽断言
    有时候我们想匹配某个模式之前或之后的部分，匹配的部分必须满足特定条件。
    - (?=exp)该位置后面可以匹配exp，返回除了exp的部分
      `\b\w+(?=ing\b)`
      ![](https://upload-images.jianshu.io/upload_images/10339396-1f7de055092d20c9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - (?<=exp)该位置前面可以匹配exp，同样返回除了exp的部分
      `(?<=broad)\w+\b`
      ![](https://upload-images.jianshu.io/upload_images/10339396-f0c4ee09c879cce0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
9. 负向零宽断言
    断言某位置前或后不能出现某些字符，我们也可以使用反义，但是问题在于使用反义时，[^]总会占用一个字符空间，可以匹配到单词分隔符。
    - (?!exp)断言此位置后不匹配exp
      ![](https://upload-images.jianshu.io/upload_images/10339396-9e99c23072778006.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - (?<!exp>)断言此位置前不匹配exp
      ![](https://upload-images.jianshu.io/upload_images/10339396-8174e7aaae27edbf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
10. 贪婪匹配与懒惰匹配
    当我们的正则表达式有表示重复次数的元字符时，默认情况下总是会自动匹配最长，比如ababab,用a.*b来匹配，会匹配到整个字符串，这就是贪婪匹配，容易理解懒惰匹配就是匹配最短。通过在元字符后加上？来将贪婪匹配变为懒惰匹配。如下
    ![](https://upload-images.jianshu.io/upload_images/10339396-3982676bfa2deeef.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    ![](https://upload-images.jianshu.io/upload_images/10339396-546da4d279c18ebb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

11. python中的正则表达式re
     - 核心函数与表达式
       ![](https://upload-images.jianshu.io/upload_images/10339396-4fd48bb345a8e9a2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
     - compile()对给出的pattern进行编译，加快后续处理的速度，该过程不是必须的，search，match函数可以直接使用字符串来进行匹配，但是使用编译过后的字节码对象可以加快处理的速度
     - 匹配对象的group和groups方法
       re模块的match和search方法会返回一个匹配对象，该对象保存了模式匹配的结果，可以使用该对象的groups和group方法获取匹配的结果.group方法返回所有匹配对象或根据要求返回特定子组匹配的对象
     - match(pattern,string)从string开头匹配pattern
       ![](https://upload-images.jianshu.io/upload_images/10339396-7c50e46093a65317.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
       如果开头不匹配，返回None
       ![](https://upload-images.jianshu.io/upload_images/10339396-99349c2d25d50af8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
     - search(pattern,string)从string中搜索pattern第一次出现的位置
       ![](https://upload-images.jianshu.io/upload_images/10339396-c70dfe99352849f0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
     - findall(pattern, string)从string中查找所有匹配，返回匹配字符串列表
       ![](https://upload-images.jianshu.io/upload_images/10339396-d782eb9d59d0005e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
     - sub(pattern, repl, string)将匹配pattern的部分替换为repl
       ![](https://upload-images.jianshu.io/upload_images/10339396-397ebf7cd5ba7cb6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
     - re.split(pattern,string)使用pattern指定的字符分隔string，可以指定多个字符
       ![](https://upload-images.jianshu.io/upload_images/10339396-01fffd5d8c11c85f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
     - 在匹配时，通过指定flag参数为re.I可以忽略大小写匹配
       ```
       In [8]: m = re.compile('a', re.I)
       
       In [9]: m.findall('abcAAbbc')
       Out[9]: ['a', 'A', 'A']
       ```


​      

