1. 变量定义
  使用`name=value`形式，并且=两侧不能有空格
2. 环境变量
    一般指用于export导出的变量，用于定义shell的运行环境，保证shell命令的正确执行，环境变量一般采用大写命名，使用env,declare,set命令可以查看系统环境变量。使用下列方法定义环境变量
    ```
    export name='value'
    name='value' ; export name
    declare -x name='value'
    ```
    使用echo打印环境变量
    `echo $name`
    使用unset消除环境变量
    `unset name`
3. 一般变量定义与引用
  定义,注意‘与“在shell脚本中的区别，’表示强引用，类似于python字符串前的r，表示原始字符串，而“为弱引用，可以包含特殊字符
   ```
   name=value
   name='value'
   name="value"
   ```
   引用
   ```
   $name
   ${name}
   ```
   取得命令执行结果赋值给某一变量
   ```
   name=$(command)
   name=`command`
   ```
   比如
   ![](https://upload-images.jianshu.io/upload_images/10339396-4ed9f26fefb8f208.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
4. shell中的特殊变量
    >$0 表示当前执行脚本的文件名称，可以使用basename和dirname命令得到目录名称和文件名称
    >$n 获取第n个参数值，当n大于9时，使用${n}的形式
    >$# 运行shell脚本时后面所接参数的个数
    >$* 获取脚本所有的运行参数，当不加双引号时，和$@相同，表示所有参数，当加上双引号时，"$*"表示将所有参数列表当作一个字符串，相当于"$1 $2 ... $n","$@"表示单个参数列表 "$1" "$2" ... "$n"
    >$@ 获取脚本所有的运行参数
    >另外set -- para1 para2 para3表示清除所有的参数变量，并重新设为para1 para2 para3
    >$? 表示上一条命令的返回值
    >$$ 当前进程pid

5. 一些与变量相关的命令
    - echo打印字符串
        - -n可以不换行输出
        - -e可打印特殊字符"\n \r \t \b \v"
    - eval args执行args表示的内容
      ![](https://upload-images.jianshu.io/upload_images/10339396-c5b510b8fcc32060.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - exec args在不创建子进程的情况下，执行给出的命令，当执行完后退出当前环境
      ![](https://upload-images.jianshu.io/upload_images/10339396-faf5757be3fea2dc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - read 读取用户输入
      ![](https://upload-images.jianshu.io/upload_images/10339396-222561d30ff74243.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - shift 使shell参数变量左移

6. shell变量子串
    ```
    ${parameter} 获取变量parameter的内容
    ${#parameter}获取parameter的长度
    ${parameter:offset}提取从offset开始到最后的子字符串
    ${parameter:offset:length}提取从offset开始的length个字符串
    ${parameter#word}从开头删除最短匹配word的字符串
    ${parameter##word}最长
    ${parameter%word}从结尾删除最短匹配word的字符串
    ${parameter%%word}最长
    ${parameter/pattern/string}用string代替第一个匹配的pattern
    ${parameter//pattern/string}用string代替所有匹配的pattern
    ```
    ![](https://upload-images.jianshu.io/upload_images/10339396-13af48a951a85241.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    ![](https://upload-images.jianshu.io/upload_images/10339396-af3d599f6862e579.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

7. shell特殊扩展变量
  ![](https://upload-images.jianshu.io/upload_images/10339396-9e30adc1dff4f629.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
8. shell数组
    定义数组
    `array=(1 2 3)`
    `array=($(command))`
    `array=(`command`)`
    输出所有元素
    `echo ${array[*]}`或`echo ${array[@]}`
    输出单个元素
    `echo ${array[1]}`
    获得数组长度
    `echo ${#array[*]}`
    输出长度满足要求的字符串
    ```
    str=(the test string is used to testsetset)
    for word in ${str[*]}
    do
        if [ `expr length $word` -lt 6 ]
        then
    	    echo $word
        fi
    done
    ```





