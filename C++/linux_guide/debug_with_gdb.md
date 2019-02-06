1. gdb是linux操作系统特有的调试工具，可以完成一般IDE提供的所有调试功能。使用gdb调试程序之前，必须使用gcc的-g选项编译程序，使生成的可执行文件中附带有源代码文件的信息。
2. 编写例程如下，随后使用gdb调试该程序
    ```c
    #include<stdio.h>
    int add_range(int min, int max){
        int sum ;
        for(int i = min; i < max + 1 ; i++){
            sum = sum + i;
        }
        return sum;
    }
    int main(){
        int range[5];
        range[0] = add_range(1, 10);
        range[1] = add_range(1, 100);
        printf("range[0]=%d\n", range[0]);
        printf("range[1]=%d\n", range[1]);
        return 0;
    }
    ```
    gdb exec_name进入调试界面，使用help查看当前可用的命令种类
    ![](https://upload-images.jianshu.io/upload_images/10339396-d54e8c1466e382fb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    使用l（list）查看源代码，一次10行，当我们在gdb中直接回车，默认执行上次命令
    ![](https://upload-images.jianshu.io/upload_images/10339396-2aaafefeec36d6eb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    使用start命令开始执行程序，程序停留在main函数第一行
    ![](https://upload-images.jianshu.io/upload_images/10339396-f8de750625d18f8f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    n（next）可以单步执行程序，s（step）命令可以跳入函数中查看函数执行的细节
    ![](https://upload-images.jianshu.io/upload_images/10339396-aba957a246f932b3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    使用bt（backtrace）命令查看程序栈帧，可以在不同栈帧中切换来查看不同环境的变量值。使用i（info）查看变量值
    ![](https://upload-images.jianshu.io/upload_images/10339396-bb375b8e2947a816.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    切换至main堆栈，查看main函数中本地变量的值
    ![](https://upload-images.jianshu.io/upload_images/10339396-776d674c4db37eef.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    p（print）打印某变量的值
    ![](https://upload-images.jianshu.io/upload_images/10339396-34cf1d6af4e4d8e5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    display可以现实每步程序运行之后某变量的值
    ![](https://upload-images.jianshu.io/upload_images/10339396-bba73780b2414415.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    如果不再需要display的结果，可以使用undisplay取消显示
    ![](https://upload-images.jianshu.io/upload_images/10339396-6dccf34137f5a8a8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    finish使当前函数运行至return返回
    ![](https://upload-images.jianshu.io/upload_images/10339396-53d79cb595e8952f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    在程序中，如果发现某变量赋值不当，可以直接在调试中更改该变量的值，查看程序运行结果set var name=value
    ![](https://upload-images.jianshu.io/upload_images/10339396-6c1e61f35fdb9fbb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    初步调试指令如下
    backtrace\finish\frame\info\list\next\print\set var\start\step
3. 断点
    编写例程如下
    ```c
    #include<stdio.h>
    #include<string.h>
    int main(){
        char num[10];
        int sum = 0;
        while(1){
            scanf("%s", num);
            long sum = 0;
            if(strcmp(num, "q") == 0){
                break;
            }
            for( int i = 0; i< strlen(num); i++ ){
                sum = sum*10 + num[i] - '0';
            }
            printf("sum=%d\n", sum);
        }
        return 0;
    }
    ```
    使用gdb调试程序，break命令在某行设置一个断点
    ![](https://upload-images.jianshu.io/upload_images/10339396-01736750fac00312.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    break后不仅可以跟行号，还可以跟函数名称，使用continue命令继续执行程序，遇到断点自动停止。使用disable breakpoints num可以暂时禁用某个断点
    ![](https://upload-images.jianshu.io/upload_images/10339396-08a15c759355d698.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    可以使用delete breakpoints num删除断点，使用break（b）查看当前断点分布
    ![](https://upload-images.jianshu.io/upload_images/10339396-2301086c4878a939.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    断点调试常用指令
    break n\break function_name\break ... if ...\continue\ delete breakpoints num\disable breakpoints num\enable num\run\
4. 观察点
    观察点可以让我们监视某个内存单元，当单元的内容改变时，提示我们它发生了那些变化，常用在程序某个变量发生改变，但我们又不知道它何时发生了改变的情况
    使用watch设置观察点，查看某个变量的变化情况
    ![](https://upload-images.jianshu.io/upload_images/10339396-b847f038f3f550b8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    使用info watchpoints查看当前观察点
    ![](https://upload-images.jianshu.io/upload_images/10339396-64481f35b1a4d2b7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    x命令用来打印内存空间的值，b表示按字节，5表示打印5组
    ![](https://upload-images.jianshu.io/upload_images/10339396-4994844965dbef20.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
5. 使用gdb的backtrace指令可以让我们容易发现段错误由何引起
    ![](https://upload-images.jianshu.io/upload_images/10339396-c71a6ad59606355e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)














​    


