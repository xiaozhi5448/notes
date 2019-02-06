1. 信号是什么
    信号作为一种进程间通信的方式，是linux进程管理使用最为广泛的方式，通过给进程发送信号，来传递信息，比如按下crtl-c，向当前进程发送INT信号，linux常见信号列表如下
    ![](https://upload-images.jianshu.io/upload_images/10339396-9c9749ec53b3aec2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    重要信号说明
    ![](https://upload-images.jianshu.io/upload_images/10339396-1ca4afa6a216dbf8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2. 使用trap命令管理应用进程信号
    `trap command signal`
    command表示捕捉到signal时执行的命令，使用信号名称时需要省略SIG前缀
    ```
    trap 'ls /tmp/xiaozhi_* | xargs rm -f && exit' INT
    while true
    do
        touch /tmp/xiaozhi_`date +%F-%H:%M:%S`.txt
        sleep 3
        ls /tmp/xiaozhi_*
    done
    ```