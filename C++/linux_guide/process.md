1. 创建、结束进程
    创建进程使用fork系统调用，结束进程使用exit。理解fork调用的意义，理解vfork调用的意义
    ```c
    #include<stdio.h>
    #include<fcntl.h>
    #include<sys/uio.h>
    #include<sys/stat.h>
    #include<sys/types.h>
    #include<unistd.h>
    #include<string.h>
    #include<sys/wait.h>
    #include<stdlib.h>
    int main(){
        pid_t chpid;
        int fd;
        char buf[50];
        int status;
        if((fd=open("temp", O_CREAT | O_RDWR | O_TRUNC, 0664)) == -1){
            perror("创建文件：");
            return 1;
        }
        if((chpid = fork() == 0)){
            puts("子进程正在运行\n");
            strcpy(buf, "子进程数据！");
            printf("子进程pid：%d\n", getpid());
            printf("父进程pid：%d\n", getppid());
            write(fd, buf, strlen(buf));
            close(fd);
            exit(0);
        }else{
            puts("父进程正在运行！\n");
            strcpy(buf, "父进程数据!");
            printf("子进程pid：%d\n", chpid);
            printf("父进程pid：%d\n", getpid());
            write(fd, buf, strlen(buf));
            close(fd);
        } 
        wait(&status);
        return 0;
    }
    ```
2. 进程的执行、等待、同步
    进程中执行其他可执行程序时可用exec，等待其他进程执行完毕使用wait，进程间同步使用信号量，互斥量等，进程睡眠使用sleep
    ```c
    #include<unistd.h>
    #include<stdio.h>
    extern char **environ;
    int main(int argc, char* argv[]){
        puts("输出执行参数:\n");
        for(int i = 0; i < argc; i++){
            printf("参数%d:%s\n", i, argv[i]);
        }
        puts("输出环境变量:\n");
        for(int i = 0;environ[i] != NULL; i++){
            printf("%s\n", environ[i]);
        }
        return 0;
    }
    ```
    ```c
    #include<unistd.h>
    #include<stdio.h>
    extern char **environ;
    int main(int argc, char* argv[]){
        puts("first information\n");
        fflush(stdout);
        execve("beexec", argv, environ);
        puts("information two!");
        return 0;
    }
    ```
3. 进程信息获取
    理解getuid，getgid，getpid，getppid调用的作用，以及chdir，chroot，nice
