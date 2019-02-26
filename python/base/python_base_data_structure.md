# 一、python基本数据结构



####数字

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

####序列

1. 序列是一种通用数据结构，比如数组，列表等，有一些操作序列的通用函数，如下
   - in /not in 成员关系操作符判断某元素是否属于某序列
   - seq[ind] 获取下标为ind的元素
   - seq[start:stop:step] 获取下标为start到下标为stop-1的元素集合,步长为step
   - seq * expr   重复序列expr次
   - seq1 + seq2 连接序列seq1与seq2

2. 通用内建函数
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

3. 字符串
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
           >fill 表示填充字符，默认是空格
           >align 表示对齐方式 '<' 左对齐 '>' 右对齐 '^'居中
           >sign 在显示数字时，规定是否显示+ -号，'-'默认取值，正数省略，负数显示'-'号
           >width显示的宽度
           >precision显示的精度
           >type显示的类型
           >一些示例

          - 通过参数位置访问
            `'{} is better than {}'.format('beautiful', 'ugly')`
          - 通过下标访问
            `'{0} is better than {1}'.format('beautiful', 'ugly')`
          - 使用字典
            ![](https://upload-images.jianshu.io/upload_images/10339396-69846005cbfdc426.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


4. 列表
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

5. 元组
   - 元组是不可变类型
   - 浅拷贝使用完全切片操作[:]，使用工厂函数list(),turple()，使用copy函数，浅拷贝拷贝对象的引用，深拷贝使用deepcopy（）

6. 字典
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


7. 集合
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