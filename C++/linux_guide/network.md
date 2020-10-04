1. 网络编程基础
    网络编程，首先了解计算机网络体系结构是有必要的，着重掌握TCP、IP协议，理解socket的概念，理解数据报方式和流式套接字的原理，熟练掌握相关数据结构的使用
2. 数据报和流式套接字的工作过程
    ![](https://upload-images.jianshu.io/upload_images/10339396-b8b36537afb03808.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
3. 基本概念
    linux操作系统一切皆文件的概念在socket通信过程中体现的十分完整，通过一个文件描述符来索引一个socket，创建socket的系统调用为
    ![](https://upload-images.jianshu.io/upload_images/10339396-1b395adc05d01ef6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    相关参数的含义可查看manual文档，其中domain比较特殊，可取下表
    ![](https://upload-images.jianshu.io/upload_images/10339396-c7516e494c271289.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    一般我们使用的AF_INET域中的套接字地址
    ![](https://upload-images.jianshu.io/upload_images/10339396-e54360e021af10d1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    ![](https://upload-images.jianshu.io/upload_images/10339396-6a38e04ea4a38e1e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
4. 一个简单的例子
    server.c
    ```c
    #include<stdio.h>
    #include<unistd.h>
    #include<arpa/inet.h>
    #include<sys/socket.h>
    #include<sys/types.h>
    #include<netinet/in.h>
    int main(){
        int server_fd, client_fd;
        int server_addr_len, client_addr_len;
        struct sockaddr_in server_addr, client_addr;
        server_addr_len = sizeof(server_addr);
        server_fd = socket(AF_INET, SOCK_STREAM, 0);
        server_addr.sin_family = AF_INET;
        server_addr.sin_addr.s_addr = inet_addr("127.0.0.1");
        server_addr.sin_port = 8000;
        bind(server_fd, (struct sockaddr *)&server_addr, server_addr_len);
        listen(server_fd, 5);
        while(1){
            printf("服务器等待消息！\n");
            char ch;
            client_addr_len = sizeof(client_addr);
            client_fd = accept(server_fd, 
                (struct sockaddr *) &client_addr, 
                (socklen_t *)&client_addr_len);
            read(client_fd, &ch, 1);
            ch++;
            write(client_fd, &ch, 1);
            close(client_fd);
        }
        return 0;
    }
    ```
    client.c
    ```c
    #include<stdio.h>
    #include<netinet/in.h>
    #include<sys/types.h>
    #include<sys/socket.h>
    #include<unistd.h>
    #include<arpa/inet.h>
    #include<stdlib.h>
    #include<string.h>
    int main(){
        struct sockaddr_in server_addr;
        int server_addr_len = sizeof(sockaddr_in);
        server_addr.sin_addr.s_addr = inet_addr("127.0.0.1");
        server_addr.sin_family = AF_INET;
        server_addr.sin_port = 8000;
        int socket_fd = socket(AF_INET, SOCK_STREAM, 0);
        char ch = 'A';
        int res;
        
       
        if((res = connect(socket_fd, (sockaddr*) &server_addr, (socklen_t) server_addr_len)) == -1){
            perror("连接目的地址出错！");
            exit(1);
        }
        printf("请输入字符：\n");
        scanf("%c", &ch);
        
        write(socket_fd, &ch, 1);
        read(socket_fd, &ch, 1);
        printf("%c\n", ch);
        close(socket_fd);
        return 0;
    }
    ```
5. 熟悉以下用来初始化socket地址的函数
    inet_ntoa/inet_aton
    inet_addr
    htonl/htons/ntohl/ntohs
6. 异步I、O之epoll
    有时为了处理大量的文件句柄，需要一种机制，在单线程中也可以处理多个socket请求，轮询的机制可以实现但是对系统的负载较高，epoll是linux系统用来处理类似socket这样的文件句柄的读写等操作的一种IO复用机制。服务端维护一个socket列表，使用epoll调用来取出准备好读或写的socket，随后可以对socket句柄进行操作
    用到的系统调用epoll_create/epoll_ctl/epoll_wait
    用到的数据结构epoll_event/epoll_data_t
    查阅manual了解函数用法
    一个简单的例子
    common.h
    ```c
    //include the header file socket,io,epoll,list,string,unistd,stdlib
    #include<iostream>
    #include<stdio.h>
    #include<stdlib.h>
    #include<unistd.h>
    #include<fcntl.h>
    #include<string.h>
    #include<list>
    #include<errno.h>
    #include<sys/epoll.h>
    #include<sys/types.h>
    #include<sys/socket.h>
    #include<netinet/in.h>
    #include<arpa/inet.h>
    
    
    //namespace
    using namespace std;
    //client list, C++ stl list<T>
    list<int> client_list;
    //macro statement server_ip,server_port,epollsize,buf_size,Welcome string,server_string
    #define SERVER_IP "127.0.0.1"
    #define SERVER_PORT 8888
    #define EPOLL_SIZE 500
    #define BUF_SIZE 2048
    #define WELCOME_STRING "Welcome to join the chat room, your chat ID is: Client# %d"
    #define SERVER_STRING "Client id #%d say >> %s"
    #define CAUTION "only one client in the chat room"
    //set fd in nonblocking io mode, using fnctl
    void setNonBlocking(int fd){
        int res = fcntl(fd, F_SETFD, fcntl(fd, F_GETFD) | O_NONBLOCK);
        if(res != 0){
            perror("set fd nonblock failed");
            return;
        }
    }
    //add fd to the epoll,with epoll_ctl
    void addFdToEpoll(int epollfd, int sockfd, bool enable_et){
        struct epoll_event event;
        event.events = EPOLLIN;
        if(enable_et){
            event.events = EPOLLIN | EPOLLET;
        }
        event.data.fd = sockfd;
        if(epoll_ctl(epollfd, EPOLL_CTL_ADD, sockfd, &event) != 0){
            perror("add fd to epoll failed");
        };
        setNonBlocking(sockfd);
    }
    //send broadcast message to the client in clients list, except for which we received the data
    void sendBroadcastMessage(int sockfd){
        char buf[BUF_SIZE], message[BUF_SIZE];
        //initialize the space
        bzero(buf, BUF_SIZE);
        bzero(message, BUF_SIZE);
    
        int rlen = recv(sockfd, buf, BUF_SIZE, 0);
        printf("read data from Client #%d: %s\n", sockfd, buf);
        
        if(rlen == 0){
            close(sockfd);
            client_list.remove(sockfd);
            printf("client #%ld closed, Now, there are %d clients in the chatroom\n",sockfd, client_list.size());
            
        }else{
            if(client_list.size() == 1){
                int slen = send(sockfd, CAUTION, strlen(CAUTION), 0);
                return;
            }
            sprintf(message, SERVER_STRING, sockfd, buf);
            printf("will send:%s\n", message);
            list<int>::iterator iter;
            for( iter = client_list.begin(); iter != client_list.end(); iter++ ){
                puts("sending data...");
                if(*iter != sockfd){
                    send(*iter, message, BUF_SIZE, 0);
                }
            }
        }
    }
    ```
    server.c
    ```c
    #include "common.h"
    int main(){
        //socket address statement
        struct sockaddr_in server_addr;
        //initialize the address
        server_addr.sin_addr.s_addr = inet_addr(SERVER_IP);
        server_addr.sin_port = htons(SERVER_PORT);
        server_addr.sin_family = AF_INET;
        //create server socket
        int listener = socket(AF_INET, SOCK_STREAM, 0);
        //bind the server address
        if(bind(listener, (struct sockaddr*)&server_addr, sizeof(server_addr)) != 0){
            perror("bind failed");
            return 1;
        }
        //listen on the address
        if(listen(listener, 5) != 0){
            perror("listen failed");
            return 2;
        }
        //create epoll
        int epollfd = epoll_create(EPOLL_SIZE);
        if(epollfd < 0){
            perror("create epollfd failed");
            return 3;
        }
        //add server fd to epoll
        addFdToEpoll(epollfd, listener, true);
        //epoll_event array
        static struct epoll_event events[EPOLL_SIZE];
        //main loop
        int clientfd;
        while(1){
            //epoll_wait
            puts("waiting clients...");
            int event_count = epoll_wait(epollfd,events, EPOLL_SIZE, -1);
            printf("epoll event count is %d\n", event_count);
            for(int i = 0; i< event_count; i++){
                clientfd = events[i].data.fd;
                 //if fd is serverfd, accept a connection, print information, add new sockfd to epoll
                if(clientfd == listener){
                    struct sockaddr_in client_addr;
                    socklen_t addrlen = sizeof(struct sockaddr_in);
                    int newfd = accept(listener, (struct sockaddr*)&client_addr, &addrlen);
                    if(newfd < 0){
                        perror("accept new connections failed");
                        exit(EXIT_FAILURE);
                    }
                    printf(
                        "new connection from %s:%d, client id #%d\n",
                        inet_ntoa(client_addr.sin_addr),
                        ntohs(client_addr.sin_port),
                        newfd
                    );
                    addFdToEpoll(epollfd, newfd, true);
                    client_list.push_back(newfd);
                    printf("welcome message\n");
                    char message[BUF_SIZE];
                    bzero(message, BUF_SIZE);
                    sprintf(message, WELCOME_STRING, newfd);
                    send(newfd, message, strlen(message), 0);
                }//if not, sendbroadcast message
                else{
                    sendBroadcastMessage(clientfd);
                }
            }
        }
    }
    ```
    client.c
    ```c
    #include"common.h"
    int main(){
        //server address statement
        struct sockaddr_in server_addr;
        //initilize server address
        server_addr.sin_family = AF_INET;
        server_addr.sin_port = htons(SERVER_PORT);
        server_addr.sin_addr.s_addr = inet_addr(SERVER_IP);
        //create sock
        int sock = socket(AF_INET, SOCK_STREAM, 0);
        if(sock < 0){
            perror("create socket failed");
            return 1;
        }
        if(connect(sock, (struct sockaddr*)&server_addr, sizeof(struct sockaddr_in)) != 0){
            perror("connect server failed");
            return 0;
        }
        int pipefd[2];
        if(pipe(pipefd) != 0){
            perror("create pipe failed");
            return 2;
        }
        int epollfd = epoll_create(EPOLL_SIZE);
        if(epollfd< 0){
            perror("create epollfd failed");
            return 3;
        }
        addFdToEpoll(epollfd, sock, true);
        addFdToEpoll(epollfd, pipefd[0], true);
        pid_t pid = fork();
        if(pid < 0){
            perror("create child process failed");
            return 4;
        }
        int client_running = 1;
        char message[BUF_SIZE];
        char buf[BUF_SIZE];
        struct epoll_event events[2];
        
        if(pid == 0){
            close(pipefd[0]);
            printf("please input your message, and type exit to terminate\n");
            while(client_running){
    
                //printf("input>");
                bzero(message, BUF_SIZE);
                //bzero(buf, BUF_SIZE);
                fgets(message, BUF_SIZE, stdin);
                if(strncmp(message, "exit", strlen("exit")) == 0){
                    client_running = 0;
                    close(sock);
                    close(pipefd[1]);
                    return 0;
                    
                }else{
                    write(pipefd[1], message, strlen(message));
                }
            }
        }else{
            close(pipefd[1]);
            while(client_running){
                int event_count = epoll_wait(epollfd, events, 2, -1);
                for(int i = 0; i < event_count; i++){
                    if(events[i].data.fd == pipefd[0]){
                        bzero(buf, BUF_SIZE);
                        if(read(pipefd[0], buf, BUF_SIZE) == 0){
                            client_running = 0;
                        }else{
                            printf("\nyour input:%s\n", buf);
                            send(sock, buf, strlen(buf) - 1, 0);
    
                        }
                    }else{
                        recv(sock, buf, BUF_SIZE, 0);
                        printf("\nServer message:%s\n", buf);
                    }
                }
            }
        }
    
        close(sock);
        if(pid){
            close(pipefd[0]);
        }else{
            close(pipefd[1]);
        }
        return 0;
    }
    ```
7. 异步IO之libevent事件框架
    事件驱动相比较于轮询更有效
    参见[libevent文档](https://aceld.gitbooks.io/libevent/content/chapter1.html)



