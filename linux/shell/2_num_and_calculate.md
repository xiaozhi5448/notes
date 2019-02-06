1. 算术运算命令
  在shell脚本编程中，可以使用的运算符很多，和C语言基本一致
  ![](https://upload-images.jianshu.io/upload_images/10339396-75d8962cc04488e8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
  我们需要了解掌握的是一些运算命令
   - (())用于整数计算的运算符，效率高，另外，在（（））语法中不要求有空格，但是有也不会影响结果，在(())中的变量可以不加前导符$
       ```
       ((i=i+1))       数值计算
       i=$((i+1))      同上
       ((8>7&&7>5))    条件判断
       echo $((2+1))   数值判断后输出
       ```
   - let用于整数计算，类似于(())
       ```
       let i=i+1等同于((i=i+1))
       ```
   - expr 求表达式的值
       ```
       expr 1 + 1注意空格的使用
       ```
       可以使用expr判断一个数是否为整数，$?变量保存了上一条命令的输出，使用未知变量与一个整数相加，如果返回值是0就代表该未知变量是整数，否则不是整数
      ```
       expr $a + 5 &>/dev/null
       RETRAL_A=$?
       expr $b + 5 &>/dev/null
       RETRAL_B=$?
       if [ $RETRAL_A -ne 0 -o $RETRAL_B -ne 0 ]
       then
          echo "your have input two number"
          exit 2
       fi
       ```
   - $[]整数运算
       `i=$[1+1]`
2. 条件测试
    形式如下,[]和内容，以及逻辑运算符之间至少有一个空格
    ```
    test <expression>
        test -f file || echo exist
    [ expression ]
        [ -z "$1" -a -z "$2" ]注意空格的使用
    [[ expression ]]
        [[ -f file && -f file2 ]]
    (( expression ))
        (($num<10))
    ```
    ![](https://upload-images.jianshu.io/upload_images/10339396-c779686d479c3cd6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - 文件测试
        ![](https://upload-images.jianshu.io/upload_images/10339396-3636b2fd68d29289.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - 字符串测试表达式，注意判断符号的两端要有空格，最好将变量加上双引号后进行比较测试
        ![](https://upload-images.jianshu.io/upload_images/10339396-0277b029c7b87424.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - 整数测试比较
        ![](https://upload-images.jianshu.io/upload_images/10339396-be83614c992fbef2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - 逻辑操作符
        ![](https://upload-images.jianshu.io/upload_images/10339396-211a36adb6d1e162.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - 区别总结
        ![](https://upload-images.jianshu.io/upload_images/10339396-e0e02a290585df3c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - 特殊的判断结构
      当条件1成立时执行后面的命令块儿
         ```
        test condition1 && {
        command1
        command2
        }
       [ condition1  ] && {
        command1
        command2
        }
       [[ condition1 ]]  && {
        command1
        command2
        } 
         ```
        当条件1成立时执行命令2，否则执行命令3
        ```
        [ condition1 ] && command2 || command3
        ```
3. if语句
    - 形式1（推荐）if语句可以嵌套
        ```
        if [ condition ]
        then
              command
        fi
        ```
    - 形式2
        ```
        if [ condition ] ; then
              command
        fi
        ```
    - 多分支结构
        ```
        if [ condition1 ] 
        then
            command1
        elif [ condition2 ]
        then
            command2
        else
            command3
        fi
        ```
4. 判断数字的思路
      - 使用expr根据返回值来判断
            `expr $num + 5 ; [ $? -eq 0 ]`
      - 替换变量中的所有数字，随后看字符串是否为空
            使用sed
            `[ -n " echo xiaozhi123 | sed 's/[0-9]//g' " ]`
            使用变量替换
            `${param//[0-9]/}`
5. 示例
    - 判断数据类型，使用特殊判断结构，使用expr判断数字
        ```
        while true
        do
            read -p "please input:" a
            expr $a + 5 &>/dev/null
            [ $? -eq 0 ] && echo int || echo char
        done
        ```
    - 验证数据类型，然后做四则运算
        ```
        [ $# -ne 2 ] && {
            echo -e "your must give two arguments!\n"
            exit 1
        }
        a=$1
        b=$2
        expr $a + 5 &>/dev/null
        RETRAL_A=$?
        expr $b + 5 &>/dev/null
        RETRAL_B=$?
        if [ $RETRAL_A -ne 0 -o $RETRAL_B -ne 0 ]
        then
            echo "your have input two number"
            exit 2
        fi
        
        echo "a+b=$(($a+$b))"
        echo "a-b=$(($a-$b))"
        echo "a*b=$(($a*$b))"
        echo "a/b=$(($a/$b))"
        ```
    - 判断数据类型，比较大小
        ```
        read -p "please type two num:" a b
        if [ -z "$a" -o -z "$b" ]
        then
            echo "you must type two arguments"
            exit 1
        fi
        expr $a + 5 &> /dev/null
        RETRAL_A=$?
        expr $b + 5 &> /dev/null
        RETRAL_B=$?
        if [ $RETRAL_A -eq 0 -a $RETRAL_B -eq 0 ]
        then
        	if [ $a -lt $b ]
        	then
        		echo "$a<$b"
        	elif [ $a -gt $b ]
        	then
        		echo "$a>$b"
        	else
        		echo "$a=$b"
        	fi
        else
        	echo "you must input two num"
        fi	
        ```
