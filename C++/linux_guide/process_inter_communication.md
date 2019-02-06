1. 信号
    - 信号是linux操作系统进程间通信的一种方式，一个应用进程可以接受、发送信号给另一个进程，当进程捕获到某个信号时，可以执行某些特定的动作。
    - 与信号操作有关的函数位于signal.h头文件中，一个重要的函数声明如下
      ![](https://upload-images.jianshu.io/upload_images/10339396-06fb8ab2ede292d6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      该函数设置sig表示的信号由func表示的函数来处理，返回一个与func同类型的函数，或以下两个信号之一
      ![](https://upload-images.jianshu.io/upload_images/10339396-afd16001b591ccd6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - 一个简单的例子
      ```c
      #include<stdio.h>
      #include<signal.h>
      #include<stdlib.h>
      #include<unistd.h>
      void ouch(int sig){
          printf("Oh, I got signal %d\n", sig);
          (void) signal(SIGINT, SIG_DFL);
      }
      int main(){
          (void) signal(SIGINT, ouch);
          while(1){
              printf("hello world!\n");
              sleep(1);
          }
      }
      ```
      ![](https://upload-images.jianshu.io/upload_images/10339396-2db4c4bd56fb499d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - 可以使用kill函数向指定进程发送信号
      ![](https://upload-images.jianshu.io/upload_images/10339396-982777b3150b5590.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      看一个简单的例子
      ```c
      #include<stdio.h>
      #include<stdlib.h>
      #include<signal.h>
      #include<sys/types.h>
      #include<unistd.h>
      static int alarm_handled = 0;
      void ding(int sig){
          alarm_handled = 1;
      }
      int main(){
          printf("process %d starting...\n", getpid());
          (void) signal(SIGALRM, ding);
          switch(fork()){
              case -1:
                  perror("create process failed!");
                  break;
              case 0:
                  sleep(2);
                  kill(getppid(), SIGALRM);
                  exit(0);
                  break;
          }
          printf("waiting for SIGALRM...\n");
          pause();
          if(alarm_handled){
              printf("catched the alarm sig!\n");
          }
          return 0;
      }
      ```
      ![](https://upload-images.jianshu.io/upload_images/10339396-b48a55a5df5de6e5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - 使用更加健壮的signal接口，sigaction
      ![](https://upload-images.jianshu.io/upload_images/10339396-6dfc44ace65619cd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      ![](https://upload-images.jianshu.io/upload_images/10339396-a0491c79aaaf7758.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      使用sigaction改写第一个例子
      ```c
      #include<stdio.h>
      #include<stdlib.h>
      #include<sys/types.h>
      #include<unistd.h>
      #include<signal.h>
      void ouch(int sig){
          printf("Oh, I got sig %d\n", sig);
          (void)signal(SIGINT, SIG_DFL);
      }
      int main(){
          struct sigaction act;
          act.sa_handler = ouch;
          act.sa_flags = 0;
          sigemptyset(&act.sa_mask);
          sigaction(SIGINT, &act, 0);
          while(1){
              printf("Hello world!\n");
              sleep(1);
          }
          return 0;
      }
      ```
    - 还需要了解一些操作sigset_t的一些函数
      ![](https://upload-images.jianshu.io/upload_images/10339396-d7efb59247d6159b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      ![](https://upload-images.jianshu.io/upload_images/10339396-6ba397a7dc84c326.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      ![](https://upload-images.jianshu.io/upload_images/10339396-42c36ae2106785bd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      ![](https://upload-images.jianshu.io/upload_images/10339396-61d06d5cb13dcefe.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      ![](https://upload-images.jianshu.io/upload_images/10339396-0c1b00b2b106793f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
2. 管道-pipe
    管道是应用进程之间的单向数据通道，进程可以通过管道发送数据给另一个进程，通过popen系统调用，可以打开一个连接某个程序的管道，可以是r，也可以是w
    ![](https://upload-images.jianshu.io/upload_images/10339396-3c58abc562fbd8fd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    一个读取信息的例子
    ```c
    #include<stdio.h>
    #include<stdlib.h>
    int main(){
        char info[50];
        FILE* fp = popen("uname -a", "r");
        if(fp == NULL){
            perror("create pipe to uname failed!");
            exit(0);
        }
        int num = fread(info, sizeof(char), 50, fp);
        printf("got information: - \n%s\n", info);
        return 0;
    }
    ```

    ![](https://upload-images.jianshu.io/upload_images/10339396-4068b8612845bc29.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    一个写数据的例子
    ```c
    #include<stdio.h>
    #include<stdlib.h>
    #include<string.h>
    int main(){
        FILE* fp_write = popen("od -c", "w");
        char info[50];
        sprintf(info, "once upon a time, there was ...");
        if(fp_write != NULL){
            fwrite(info, sizeof(char), strlen(info), fp_write);
            pclose(fp_write);
        }
        return 0;
    }
    ```
    ![](https://upload-images.jianshu.io/upload_images/10339396-3b72d137c29e5e91.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    一个读取更多数据的例子
    ```c
    #include<stdio.h>
    #include<stdlib.h>
    int main(){
        FILE* fp_read = popen("ps -ax", "r");
        if(fp_read == NULL){
            perror("create pipe to ps failed");
            exit(EXIT_FAILURE);
        }
        char info[1024];
        int num_char = fread(info, sizeof(char), 1024, fp_read);
        while(num_char>0){
            info[num_char - 1] = '\0';
            printf("got info: - \n%s\n", info);
            num_char = fread(info, sizeof(char), 1024, fp_read);
        }
        pclose(fp_read);
        exit(EXIT_SUCCESS);
    }
    ```
    一个重要的系统调用是pipe，如同shell中的管道操作符
    ![](https://upload-images.jianshu.io/upload_images/10339396-5d977096ccd73bf4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    初始化两个文件描述符组成的数组，一个用于读，一个用于写，一个简单的例子如下
    ```c
    #include<stdio.h>
    #include<stdlib.h>
    #include<unistd.h>
    #include<string.h>
    #include<sys/types.h>
    int main(){
        int fd[2];
        char buf[200];
        int chpid;
        int len;
        //使用pipe系统调用创建一个管道，fd[0]用于读取，fd[1]用于写入
        if(pipe(fd) == -1){
            perror("创建管道出错：");
            exit(1);
        }
        if((chpid = fork()) == 0){
            close(fd[1]);
            //从fd[0]中读取数据到buf缓冲区
            len = read(fd[0], buf, sizeof(buf));
            buf[len] = 0;
            printf("子进程从管道读取数据：%s\n", buf);
            exit(0);
        }else{
            close(fd[0]);
            //sprintf函数将格式化数据写入缓冲区中
            sprintf(buf, "父进程为子进程（pid=%d）创建的数据！\n", chpid);
            //使用write系统调用将buf中的数据写入fd[1]指向的管道中
            write(fd[1], buf, strlen(buf));
            exit(0);
        }
        return 0;
    }
    ```
    ![](https://upload-images.jianshu.io/upload_images/10339396-174fc9a37ee947df.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    如上，pipe创建的管道操作符仅仅用于相互有联系的一组进程，比如，父子进程。当我们在没有特殊联系的进程中想要相互联系，可以通过命名管道fifo，fifo是linux操作系统中一类特殊的文件,用于进程间通信
    ![](https://upload-images.jianshu.io/upload_images/10339396-719ddda5fab07e6a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    mode_t可以取
    ![](https://upload-images.jianshu.io/upload_images/10339396-58f405bdf74e13c7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    看一个生产者与消费者的例子
    fifo_producer.c
    ```c
    #include<stdio.h>
    #include<unistd.h>
    #include<stdlib.h>
    #include<sys/types.h>
    #include<sys/stat.h>
    #include<string.h>
    #include<fcntl.h>
    #include<limits.h>
    #define BUF_SIZE 4096
    #define TEN_SEG (1024 * 10)
    
    #define FIFO_NAME "/tmp/my_fifo"
    int main(){
        int open_mode = O_WRONLY;
        int fifo_fd;
        int res;
        char buf[BUF_SIZE + 1];
        if(access(FIFO_NAME, F_OK) == -1){
            res = mkfifo(FIFO_NAME, 0777);
            if(res == -1){
                fprintf(stderr, "can't create fifo file %s\n", FIFO_NAME);
                exit(EXIT_FAILURE);
            }
        }
        printf("process %d open fifo O_WRONLY!\n", getpid());
        fifo_fd = open(FIFO_NAME, open_mode);
        printf("process %d result %d\n", getpid(), fifo_fd);
        int bytes_sent = 0;
        if(fifo_fd != -1){
            do{
                res = write(fifo_fd, buf, BUF_SIZE);
                if(res == -1){
                    perror("error write data to fifo file");
                    exit(EXIT_FAILURE);
                }
                bytes_sent += res;
            }while(bytes_sent < TEN_SEG);
            (void)close(fifo_fd);
        }else{
            exit(EXIT_FAILURE);
        }
        printf("process %d finished\n%d bytes sent!", getpid(), bytes_sent);
        exit(EXIT_SUCCESS);
    }
    ```
    fifo_consumer.c
    ```c
    #include<stdio.h>
    #include<unistd.h>
    #include<stdlib.h>
    #include<string.h>
    #include<sys/types.h>
    #include<sys/stat.h>
    #include<limits.h>
    #include<fcntl.h>
    #define BUF_SIZE 4096
    #define FIFO_NAME "/tmp/my_fifo"
    int main(){
        int res;
        int pipe_fd;
        int mode = O_RDONLY;
        if(access(FIFO_NAME, F_OK) == -1){
            perror("fifo file not exists! exiting...");
            exit(EXIT_FAILURE);
        }
        char recv[BUF_SIZE + 1];
        int bytes_recv;
        printf("process %d open fifo file with mode O_RDONLY!\n", getpid());
        pipe_fd = open(FIFO_NAME, mode);
        printf("open fifo file with result %d\n", pipe_fd);
        if(pipe_fd != -1){
            do{
                res = read(pipe_fd, recv, BUF_SIZE);
                bytes_recv += res;
            }while(res > 0);
            printf("%d bytes received!\n", bytes_recv);
            close(pipe_fd);
        }else{
            exit(EXIT_FAILURE);
        }
        exit(EXIT_SUCCESS);
    }
    ```
    result
    ![](https://upload-images.jianshu.io/upload_images/10339396-9e742bcf926008ac.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    命名管道可用于多个进程间相互通信，客户机服务器模式程序示例如下
    client.h
    ```c
    #include<stdio.h>
    #include<stdlib.h>
    #include<unistd.h>
    #include<string.h>
    #include<limits.h>
    #include<fcntl.h>
    #include<sys/types.h>
    #include<sys/stat.h>
    
    #define SERVER_FIFO_NAME "/tmp/server_fifo"
    #define CLIENT_FIFO_NAME "/tmp/cli_%d_fifo"
    
    #define BUF_SIZE 50
    struct data_to_pass_st{
        pid_t pid;
        char some_data[BUF_SIZE - 1];
    };
    ```
    server.c
    ```c
    #include"client.h"
    #include<ctype.h>
    int main(){
        int serv_fifo_fd, cli_fifo_fd;
        struct data_to_pass_st data;
        char buf[BUF_SIZE];
        char cli_fifo_name[50];
        int mode_serv;
        int mode_cli;
        serv_fifo_fd = mkfifo(SERVER_FIFO_NAME, 0777);
        if(serv_fifo_fd == -1){
            perror("create server fifo failed!");
            exit(EXIT_FAILURE);
        }
        puts("create server fifo");
    
        mode_serv = O_RDONLY;
        serv_fifo_fd = open(SERVER_FIFO_NAME, mode_serv);
        if(serv_fifo_fd == -1){
            perror("open server fifo failed!");
            exit(EXIT_FAILURE);
        }
        puts("open server fifo");
    
        sleep(1);
    
        printf("read to receive data!\n");
        int read_bytes;
        char* tmp_ptr;
        do{
            read_bytes = read(serv_fifo_fd, &data, sizeof(data));
            if(read_bytes > 0){
                tmp_ptr = data.some_data;
                while(*tmp_ptr){
                    *tmp_ptr = toupper(*tmp_ptr);
                    tmp_ptr++;
                }
                sprintf(cli_fifo_name, CLIENT_FIFO_NAME, data.pid);
                cli_fifo_fd = open(cli_fifo_name, O_WRONLY);
                if(cli_fifo_fd != -1){
                    write(cli_fifo_fd, &data, sizeof(data));
                    close(cli_fifo_fd);
                }
            }
        }while(read_bytes > 0);
        close(serv_fifo_fd);
        unlink(SERVER_FIFO_NAME);
        exit(EXIT_SUCCESS);
    }
    ```
    client.c
    ```c
    #include"client.h"
    #include<ctype.h>
    int main(){
        struct data_to_pass_st data;
        char buf[BUF_SIZE];
        char cli_fifo_name[50];
        int serv_fifo_fd, cli_fifo_fd;
    
    
        serv_fifo_fd = open(SERVER_FIFO_NAME, O_WRONLY);
        puts("client : open server fifo");
        if(serv_fifo_fd == -1){
            perror("open server fifo failed");
            exit(EXIT_FAILURE);
        }
    
        data.pid = getpid();
        sprintf(cli_fifo_name, CLIENT_FIFO_NAME, data.pid);
        mkfifo(cli_fifo_name, 0777);
        puts("client : create client fifo");
    
        int read_bytes;
    
        sprintf(data.some_data, "data from %d", data.pid);
        printf("%d sent: %s, ", data.pid, data.some_data);
        write(serv_fifo_fd, &data, sizeof(data));
    
        cli_fifo_fd = open(cli_fifo_name, O_RDONLY);
        if(cli_fifo_fd == -1){
            perror("open client fifo failed");
            exit(EXIT_FAILURE);
        }
        if(cli_fifo_fd != -1){
            read_bytes = read(cli_fifo_fd, &data, sizeof(data));
            printf("received:%s\n", data.some_data);
        }else{
            perror("open client fifo to read failed");
            exit(EXIT_FAILURE);
        }
    
        close(cli_fifo_fd);
        close(serv_fifo_fd);
        exit(EXIT_SUCCESS);
    }
    ```
    result
    ![](https://upload-images.jianshu.io/upload_images/10339396-b3a3eaca70f6b25b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
3. 信号量，有时使用信号量完成进程或线程同步 
    了解四个信号量操作函数
    sem_init\sem_post\sem_wait\sem_destroy
    example
    ```c
    #include<stdio.h>
    #include<stdlib.h>
    #include<semaphore.h>
    #include<string.h>
    #include<pthread.h>
    char work_area[1024];
    sem_t semaphore;
    void* thread_func(void* arg){
        sem_wait(&semaphore);
        while(strncmp(work_area, "end", 3) != 0){
            printf("len:%d\n", strlen(work_area) - 1);
            sem_wait(&semaphore);
        }
        pthread_exit(EXIT_SUCCESS);
    }
    int main(){
        int res;
        pthread_t thread;
        void* thread_res;
        res = sem_init(&semaphore, 0, 0);
        if(res != 0){
            perror("初始化信号量失败！");
            exit(EXIT_FAILURE);
        }
        if((res = pthread_create(&thread, NULL, thread_func, NULL)) != 0){
            perror("线程创建失败");
            exit(EXIT_FAILURE);
        }
        printf("please input a string:\n");
        while(strncmp(work_area, "end", 3) != 0){
            fgets(work_area, 1024, stdin);
            sem_post(&semaphore);
        }
        printf("wait for the thread exit!\n");
        if((res = pthread_join(thread, &thread_res)) != 0){
            perror("等待线程结束出错！");
            exit(EXIT_FAILURE);
        }
        printf("线程已退出！\n");
        sem_destroy(&semaphore);
        exit(EXIT_SUCCESS);
    }
    ```
4. 共享内存
    顾名思义，就是一块两者都可以访问的内存，进程通过原子性的写入操作保证数据完整性。
    要点：理解创建与操作共享内存的系统调用，使用manual
    ![](https://upload-images.jianshu.io/upload_images/10339396-60ce12aa2853990e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    看一个服务进程与客户进程的例子
    server.c
    ```c
        #include"common.h"
    int main(){
        int running = 1;
        void *share_mem;
        struct share_mem_st *data;
        int shmid;
        char buf[50];
    
        shmid = shmget((key_t)1234, sizeof(struct share_mem_st), 0666 | IPC_CREAT);
        if(shmid == -1){
            perror("create share_memory failed");
            exit(EXIT_FAILURE);
        }
    
        share_mem = shmat(shmid, (void*)0, 0);
        if(share_mem == (void*)-1){
            perror("attach the mem failed");
            exit(EXIT_FAILURE);
        }
        printf("share memory attached at %X\n", share_mem);
        
        data = (struct share_mem_st*)share_mem;
        data->controller = 0;
        while(running){
            while(data->controller == 1){
                printf("wait for client...\n");
                sleep(1);
            }
            puts("type the message:");
            //fgets(buf, 50, stdin);
            memset(buf, '\0', 50);
            scanf("%s", buf);
            memset(data->message, '\0', TEXT_SIZE);
            strncpy(data->message, buf, strlen(buf));
            data->controller = 1;
            if(strncmp(buf, "end", 3) == 0){
                running = 0;
            }
            
        }
    
        printf("exiting...\n");
        if(shmdt(share_mem) == -1){
            perror("error between unttach the share_meme");
            exit(EXIT_FAILURE);
        }
        exit(EXIT_SUCCESS);
    }
    ```
    client.c
    ```c
    #include"common.h"
    int main(){
        int shmid;
        struct share_mem_st* data;
        void* share_mem;
        int running = 1;
        char buf[50];
    
        if((shmid = shmget((key_t)1234, sizeof(struct share_mem_st), 0666 | IPC_CREAT)) == -1){
            perror("create share mem failed");
            exit(EXIT_FAILURE);
        }
    
        if((share_mem = shmat(shmid, (void*)0, 0)) == (void*)-1){
            perror("attach the share mem failed");
            exit(EXIT_FAILURE);
        }
        printf("share mem attach at %X\n", share_mem);
        data = (struct share_mem_st*)share_mem;
        data->controller = 1;
        while(running){
            if(data->controller == 1){
                strncpy(buf, data->message, strlen(data->message));
                printf("message:%s\n", buf);
                sleep(2);
                data->controller = 0;
                if(strncmp(buf, "end", 3) == 0){
                    running = 0;
                }
            }else{
                printf("waiting for server...\n");
                sleep(1);
            }
        }
        if(shmdt(share_mem) == -1){
            perror("unattach the share mem failed");
            exit(EXIT_FAILURE);
        }
        if(shmctl(shmid, IPC_RMID, 0) == -1){
            perror("error with release the share mem");
            exit(EXIT_FAILURE);
        }
        exit(EXIT_SUCCESS);
    
    }
    ```
5. 消息队列
    队列是一种先进先出的数据结构，用于进程间通信时较为灵活，可以设计为分布式，十分适合与网络应用进程通信，爬虫程序就是一个很好的例子
    首先需要理解创建和使用消息队列的一些系统调用-manual
    ![](https://upload-images.jianshu.io/upload_images/10339396-2fd7ece9377e99cb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    一个使用消息队列相互通信的例子
    common.h
    ```c
    #include<stdio.h>
    #include<unistd.h>
    #include<stdlib.h>
    #include<string.h>
    #include<errno.h>
    
    #include<sys/types.h>
    #include<sys/ipc.h>
    #include<sys/msg.h>
    
    #define BUF_SIZE 1024
    struct msg_st{
        long int msg_type;
        char data[BUF_SIZE];
    };
    ```
    server.c
    ```c
    #include"common.h"
    int main(){
        int running = 1;
        struct msg_st msg_data;
        int msg_id;
        long int msg_type_receive = 1;
    
        if((msg_id = msgget((key_t)1234, 0666| IPC_CREAT)) == -1){
            perror("server:can't create message queue");
            exit(EXIT_FAILURE);
        }
        printf("get message queue with id:%d\n", msg_id);
    
        while(running){
            if(msgrcv(msg_id, (void*)&msg_data, BUF_SIZE, msg_type_receive, 0) == -1){
                perror("recv data from queue failed");
                exit(EXIT_FAILURE);
            }
            printf("you wrote:%s\n", msg_data.data);
            if(strncmp(msg_data.data, "end", 3) == 0){
                printf("exiting...\n");
                running = 0;
    
            }
        }
        msgctl(msg_id, IPC_RMID, 0);
        exit(EXIT_SUCCESS);
    }
    ```
    client.c
    ```c
    #include"common.h"
    int main(){
        int running = 1;
        struct msg_st msg_data;
        long int msg_type_receive = 0;
        char buf[BUF_SIZE];
        int msg_id;
    
        if((msg_id = msgget((key_t)1234, 0666 | IPC_CREAT)) == -1){
            perror("client:get message queue failed");
            exit(EXIT_FAILURE);
        }
        printf("get message queue with id:%d\n", msg_id);
        int length = 0;
        while(running){
            memset(msg_data.data, '\0', BUF_SIZE);
            printf("input some text:");
            fgets(buf, BUFSIZ, stdin);
            length = strlen(buf);
            msg_data.msg_type = 1;
            strncpy(msg_data.data, buf, length -1);
            msg_data.data[length] = '\0';
            if(msgsnd(msg_id, (void*)&msg_data, BUF_SIZE, 0) == -1){
                perror("error with send data");
                exit(EXIT_FAILURE);
            }
            printf("you send:%s\n", msg_data.data);
            if(strncmp(buf, "end", 3) == 0){
                printf("exiting...\n");
                running = 0;
            }
        }
    
        exit(EXIT_SUCCESS);
    
    }
    ```
    client
    ![](https://upload-images.jianshu.io/upload_images/10339396-e725101df8f89fb9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    server
    ![](https://upload-images.jianshu.io/upload_images/10339396-c4300a55604bbd80.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
6. 总结
    信号、管道、命名管道、共享内存、消息队列以及信号量是进程间通信的重要手段，我们需要了解他们分别适用于何种情形，优缺点，如何使用，如何处理错误，碰到不记得的函数用法，可以通过manual查看该函数声明，数据结构等等信息。









​    










