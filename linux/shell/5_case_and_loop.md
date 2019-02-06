1. case语法
    ```
    case "var" in 
        value1 )
            command_block1
            ;;
        value2 )
            command_block2
            ;;
        * )
            command_block3
    esac
    ```
    示例
    ```
    read -p "please input a number in [0-9]>" num
    case $num in 
        1)
        	    echo "you typed 1!"
    	    ;;
        2)
    	    echo "you typed 3!"
    	    ;;
        [3-9])
    	    echo "you typed $num"
    	    ;;
        *)
    	    echo "invalid augument!"
    esac
    ```
2. while循环
    语法格式
    ```
    while condition
    do
        command_block
    done
    
    until condition
    do 
        command_block
    done
    ```
    while会在条件成立时进入循环体，直到条件不成立退出，until会在条件不成立时进入循环体，直到条件成立退出
    while循环按行读取文件
    ```
    exec <test.sh
    while read line
    do
        echo $line
    done
    
    cat test.sh | while read line
    do
    	    echo $line
    done
    ```

3. for循环与select,select用于菜单选项执行,循环过程中取值列表可省略，表示$@
    ```
    for var in (val1 val2 val3)
    do 
        command_block
    done
    
    for((exp1;exp2;exp3))
    do
        command_block
    done
    
    select var in [ var list ]
    do
        command_block
    done
    ```
    select示例（PS3代表命令提示符，$REPLY代表选择的数字)
    ```
    PS3="select a num for menu>"
    select name in xiaoming xiaohong xiaobai
    do
        echo "you selected : $REPLY)$name"
    done	
    ```
 4. continue、break、return、exit对比其他语言理解