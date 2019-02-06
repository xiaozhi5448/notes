1. pthread线程库
    线程操作，包括线程的创建，线程的设置，线程同步，线程取消等操作。程序中多线程操作多适用于同时执行某些任务的情况下。一般将需要进行的任务写入某些函数定义，以该函数为载体，创建线程，执行完毕后返回一个结果，与函数的区别就是，执行函数时，调用者会被阻塞直到函数执行完毕，但线程运行时主线程不会被阻塞。
2. 要点
    理解线程操作函数，包括pthread_create/pthread_exit/pthread_cancel，使用man查看该系列函数帮助
3. 一个创建线程的简单事例
    ```
    #include<stdio.h>
    #include<stdlib.h>
    #include<string.h>
    #include<pthread.h>
    #include<unistd.h>
    #include<sys/types.h>
    char message[50] = "THREAD_TEST";
    void* thread_func(void *arg);
    int main(){
        pthread_t t_thread;
        void *thread_result;
        int res;
        res = pthread_create(&t_thread, NULL, thread_func, (void*)message);
        if(res != 0){
            perror("线程创建失败！");
            exit(EXIT_FAILURE);
        }
        printf("wait for the thread!\n");
        pthread_join(t_thread, &thread_result);
        printf("线程已结束，返回值为%s\n", (char*)thread_result);
        printf("message的值为%s\n", message);
        free(thread_result);
        exit(EXIT_SUCCESS);
    }
    
    void* thread_func(void *arg){
        printf("线程正在运行，参数为%s\n", (char*)arg);
        sleep(3);
        strcpy(message, "线程修改");
        char* buf = (char*)malloc(strlen("线程执行完毕！"));
        strcpy(buf, "线程执行完毕！");
        pthread_exit(buf);
    }
    ```
    一个取消线程的简单事例
    ```
    #include<stdio.h>
    #include<string.h>
    #include<pthread.h>
    #include<stdlib.h>
    #include<unistd.h>
    void *thread_func(void *arg){
        int res;
        res = pthread_setcancelstate(PTHREAD_CANCEL_ENABLE, NULL);
        if(res != 0){
            perror("设置线程取消失败");
            exit(EXIT_FAILURE);
        }
        if((res = pthread_setcanceltype(PTHREAD_CANCEL_DEFERRED, NULL)) != 0){
            perror("设置线程取消类型失败！");
            exit(EXIT_FAILURE);
        }
        printf("子线程正在运行！\n");
        for(int i = 0; i < 10; i++){
            sleep(1);
            printf("子线程正在运行！\n");
        }
        pthread_exit(EXIT_SUCCESS);
    }
    int main(){
        int res;
        pthread_t thread;
        if((res = pthread_create(&thread, NULL, thread_func, NULL)) != 0){
            perror("线程创建失败！");
            exit(EXIT_FAILURE);
        }
        sleep(3);
        printf("取消线程！\n");
        if((res = pthread_cancel(thread)) != 0){
            perror("取消线程失败！");
            exit(EXIT_FAILURE);
        }
        exit(EXIT_SUCCESS);
    }
    ```
4. 进程同步使用信号量与互斥量
    信号量
    掌握理解操作信号量的函数调用sem_init/sem_post/sem_wait/sem_destory，一个简单事例
    ```
    #include<stdio.h>
    #include<stdlib.h>
    #include<unistd.h>
    #include<string.h>
    #include<pthread.h>
    #include<semaphore.h>
    //thread_func declaration
    void *thread_func(void* arg);
    //semaphore global var
    sem_t semth;
    //buff used to receive the user input
    #define BUFSIZE 1024
    char buf[BUFSIZE];
    //man function
    int main(){
        //var declaration:int res, pthread_t used to create pthread,void thread_res used to join
        int res;
        pthread_t thread;
        void *thread_res;
    
        if((res = sem_init(&semth, 0, 0)) != 0){
            perror("create semaphore failed");
            exit(EXIT_FAILURE);
        }
    //pthread create with error detection
        if((res = pthread_create(&thread, NULL, thread_func, NULL)) != 0){
            perror("create thread failed");
            exit(EXIT_FAILURE);
        }
    //prompt information
        printf("Please input string information and type 'end' to exit!");
    //get user input and make a P operation on sem_t
        while(strncmp(buf, "end", 3) != 0){
            fgets(buf, BUFSIZE, stdin);
            sem_post(&semth);
        }
    //join the thread
        if((res = pthread_join(thread, &thread_res)) != 0){
            perror("thread join failed");
            exit(EXIT_FAILURE);
        }
    //destory the semaphore
        if((res = sem_destroy(&semth)) != 0){
            perror("destory semaphore failed");
            exit(EXIT_FAILURE);
        }
    //exit
        exit(EXIT_SUCCESS);
    }
    
    //thread_func definition
    void *thread_func(void *arg){
    //make V operation on sem_t
        sem_wait(&semth);
    //while loop , get user info from buff, and make V operation on sem_t
        while(strncmp(buf, "end", 3) != 0){
            printf("you type:%s\n", buf);
            sem_wait(&semth);
        }
        fputs("exiting...\n", stdout);
    //pthread_exit
        pthread_exit(0);
    }
    ```
    result
    ![](https://upload-images.jianshu.io/upload_images/10339396-5fe81dac7bdb1008.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
5. 使用互斥量进行数据同步
    理解互斥量的概念，掌握相关系统调用。
    pthread_mutex_init/pthread_mutex_lock/pthread_mutex_unlock/pthread_mutex_destory
    一个简单的示例如下
    ```
    #include<stdio.h>
    
    #include<stdlib.h>
    
    #include<string.h>
    #include<unistd.h>
    #include<pthread.h>
    #include<semaphore.h>
    // global var declaration
    pthread_mutex_t mutex;//global mutex lock
    int exit_time = 1;//running symbol
    char work_area[1024];
    void* thread_func(void* arg){
        printf("子线程正在执行，对互斥量加锁\n");
        pthread_mutex_lock(&mutex);
        while(strncmp(work_area, "end", 3) != 0){
            printf("len:%d\n", strlen(work_area) - 1);
            work_area[0] = '\0';
            printf("解锁互斥量\n");
            pthread_mutex_unlock(&mutex);
            puts("睡眠1秒！\n");
            sleep(1);
            printf("判断信息是否为空\n");
            
            while(work_area[0] == '\0'){
                printf("轮询直到有信息传送！\n");
                if(work_area[0] == '\0'){
                    sleep(1);
                }else{
                    pthread_mutex_lock(&mutex);
                    break;
                }
                
            }
        }
        exit_time = 0;
        work_area[0] = '\0';
        pthread_mutex_unlock(&mutex);
        pthread_exit(EXIT_SUCCESS);
    }
    
    int main(){
        pthread_t thread;
        int res;
        void * thread_res;
        
        pthread_mutex_init(&mutex, NULL);
        pthread_mutex_lock(&mutex);
        if((res = pthread_create(&thread, NULL, thread_func, NULL)) != 0){
            perror("创建线程失败！");
            exit(EXIT_FAILURE);
        }
        
        while(exit_time){
            printf("type your string:\n");
            fgets(work_area, 1024, stdin);
            pthread_mutex_unlock(&mutex);
            while(1){
                if(work_area[0] != '\0'){
                    puts("数据未被取出");
                    sleep(1);
                }else{
    
                    pthread_mutex_lock(&mutex);
                    break;
    
                }
            }
            
        }
        pthread_mutex_unlock(&mutex);
        printf("wait for the thread exit!\n");
        if((res = pthread_join(thread, thread_res)) != 0){
            perror("等待线程结束出错！");
            exit(EXIT_FAILURE);
        }
        printf("thread exited!");
        pthread_mutex_destroy(&mutex);
        exit(EXIT_SUCCESS);
    }
    ```