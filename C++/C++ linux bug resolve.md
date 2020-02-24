# C++ linux bug resolve

-   编译C程序时   /tmp/cchqZ9uq.o:(.data.DW.ref.__gxx_personality_v0[DW.ref.__gxx_personality_v0]+0x0): undefined reference to `__gxx_personality_v0' collect2: error: ld returned 1 exit status，原因是使用了C++库，编译时添加-lstdc++选项
-   编译pthread代码时，要添加-lpthread库支持编译选项，编译包含各个库的代码时，都需要引入对应库
-   引入对应库文件时，要将对应头文件与源文件包含进来，此时，可以使用pkg-config获得需要的cflags选项，如`pkg-config --cflags glib-2.0`
    ![1551712437974](/home/xiaozhi/Documents/notes/C++/image/1551712437974.png)

