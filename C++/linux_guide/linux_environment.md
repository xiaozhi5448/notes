1. argc and argv
    main函数原型
    `int main(int argc, char* argv[])`
    argc代表命令行参数的个数，argv保存命令行参数内容
    ```c
      #include<stdio.h>
      int main(int argc, char* argv[]){
          printf("program name:%s\n", argv[0]);
          for(int i = 1; i < argc ; i++){
              if(argv[i][0] == '-'){
                  printf("option:%s\n", argv[i] + 1);
              }else{
                  printf("argument:%s\n", argv[i]);
              }
      
          }
          return 0;
      }
    ```

2. 使用getopt处理命令行参数
    ![](https://upload-images.jianshu.io/upload_images/10339396-03f3271b70fc499b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

    ```c
    #include<stdio.h>
    #include<unistd.h>
    extern char *optarg;
    extern int opterr, optind, optopt;
    int main(int argc, char *argv[]){
        int opt;
        while((opt = getopt(argc, argv, "if:rs")) != -1){
            switch(opt){
                case 'i': 
                case 'r': 
                case 's': 
                    printf("option:%c\n", opt);
                    break;
                case 'f': 
                    printf("filename:%s\n", optarg);
                default: 
                    printf("unknown argument!\n");
                    break;
            }
        }
        for(;optind < argc; optind++){
            printf("argument:%s\n", argv[optind]);
        }
        return 0;
    }
    ```
    当getopt返回-1后，全局变量optind中存放了第一个位置参数在argv中的下标

    使用getopt_long处理长参数类型

    ```c
    #include<stdio.h>
    #include<unistd.h>
    #include<getopt.h>
    #define _GNU_SOURCE
    extern char* optarg;
    extern int optopt, optind, opterr;
    int main(int argc, char* argv[]){
        int opt;
        struct option options[] = {
            {"initialize", 0, NULL, 'i'},
            {"restart", 0, NULL, 'r'},
            {"stop", 0, NULL, 's'},
            {"file", 1, NULL, 'f'}
        };
        while((opt = getopt_long(argc, argv, "irsf:", options, NULL)) != -1){
            switch(opt){
                case 'i': 
                case 'r': 
                case 's': 
                    printf("option:%c\n", opt);
                    break;
                case 'f': 
                    printf("filename:%s\n", optarg);
                    break;
                default:
                    printf("unknown arguments!");
                    break;
            }
        }
        for(;optind < argc; optind++){
            printf("other argument:%s\n", argv[optind]);
        }
        return 0;
    }
    ```

3. 使用getenv与putenv获取并设置环境变量
    ```c
    #include<stdio.h>
    #include<stdlib.h>
    #include<string.h>
    int main(int argc, char* argv[]){
        if(argc == 1 || argc > 3){
            fprintf(stderr, "invalid argument!");
            exit(1);
        }
        char *var = argv[1];
        char *value = getenv(var);
        if(value){
            printf("The environment variable %s has value %s\n", var, value);
        }else{
            printf("The environment variable %s has no value!\n", var);
        }
    
        if(argc == 3){
            value = argv[2];
            char *string = (char*)malloc(strlen(var) + strlen(value) + 2);
            if(string != NULL){
                strcpy(string, var);
                strcat(string, "=");
                strcat(string, value);
            }
            printf("calling putenv with string %s\n", string);
            if(putenv(string) != 0){
                fprintf(stderr, "putenv failed!\n");
                free(string);
                exit(1);
            }
            value = getenv(var);
            if(value){
                printf("new value of %s is %s\n", var, value);
            }else{
                printf("calling get env failed!\n");
            }
        }
        return 0;
    }
    ```
    获取所有环境变量
    ```c
    #include<stdlib.h>
    #include<stdio.h>
    extern char** environ;
    int main(int argc, char *argv[]){
        char **env = environ;
        while(*env != NULL){
            printf("%s\n", *env);
            env++;
        }
        return 0;
    }
    ```

4. 日期与时间
    - time函数获取时间，返回time_t类型的长整型数，表示某一特定时间到现在的秒数
      ![](https://upload-images.jianshu.io/upload_images/10339396-3e1b74e026725385.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      ```c
      #include<time.h>
      #include<stdio.h>
      #include<unistd.h>
      int main(int argc, char *argv[]){
          int i;
          time_t the_time;
          for(i = 0;i<10; i++){
              the_time = time((time_t*)0);
              printf("time is:%ld\n", the_time);
              sleep(2);
          }
          return 0;
      }
      ```
    - gmtime可以从time_t类型的数据中获取当前时间数据
      ![](https://upload-images.jianshu.io/upload_images/10339396-109efd6ee583132c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      返回tm结构体类型的指针，其中包含了我们需要的各种信息
      ![](https://upload-images.jianshu.io/upload_images/10339396-91a4fd90a07012ae.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      ```c
      #include<stdio.h>
      #include<time.h>
      int main(){
          time_t the_time;
          time(&the_time);
          struct tm* tm_ptr = gmtime(&the_time);
          printf("the row time is:%ld\n", the_time);
          printf("the gmtime gives:\n");
          printf("date: %02d/%02d/%02d\n", tm_ptr->tm_year, tm_ptr->tm_mon + 1, tm_ptr->tm_mday);
          printf("time: %02d:%02d:%02d\n", tm_ptr->tm_hour, tm_ptr->tm_min, tm_ptr->tm_sec);
          return 0;
      }
      ```
    - localtime 用来返回time_t类型代表的本地时间
      ```c
      #include<stdio.h>
      #include<time.h>
      int main(){
          time_t the_time;
          time(&the_time);
          struct tm* tm_ptr = localtime(&the_time);
          printf("the row time is:%ld\n", the_time);
          printf("the localtime gives:\n");
          printf("date: %02d/%02d/%02d\n", tm_ptr->tm_year, tm_ptr->tm_mon + 1, tm_ptr->tm_mday);
          printf("time: %02d:%02d:%02d\n", tm_ptr->tm_hour, tm_ptr->tm_min, tm_ptr->tm_sec);
          return 0;
      }
      ```
    - mktime从一个tm结构体构造一个等价的time_t值，失败时返回-1
      ![](https://upload-images.jianshu.io/upload_images/10339396-513449d4aada2e94.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - asctime and ctime
      ![](https://upload-images.jianshu.io/upload_images/10339396-fb081c80780f62e0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      ```c
      #include<time.h>
      #include<stdio.h>
      int main(){
          struct tm* tm_ptr;
          time_t the_time;
          time(&the_time);
          printf("asctime gives:%s\n", asctime(localtime(&the_time)));
          printf("ctime gives:%s\n", ctime(&the_time));
          return 0;
      }
      ```

5. 临时文件
    - 使用tmpnam生成临时文件名称
      ![](https://upload-images.jianshu.io/upload_images/10339396-206d962d7772c292.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      使用tmpfile打开临时文件
      ![](https://upload-images.jianshu.io/upload_images/10339396-6428b55f2c32d824.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      ```c
      #include<stdio.h>
      int main(){
          char tmpname[L_tmpnam];
          char* filename;
          FILE* tempfile;
          filename = tmpnam(tmpname);
          printf("the tmp file name is:%s\n", filename);
          tempfile = tmpfile();
          if(tempfile){
              puts("open stream to tmpfile successfully!");
          }else{
              puts("open file failed!");
          }
          return 0;
      }
      ```
      使用mktemp与mkstemp
      ![](https://upload-images.jianshu.io/upload_images/10339396-79cd5f19007a5e5a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

6. 使用syslog记录日志
    ```c
    #include<syslog.h>
    #include<stdio.h>
    int main(){
        FILE* f = fopen("no_exist", "r");
        if(!f){
            syslog(LOG_ALERT | LOG_USER, "oops - %m\n");
            puts("log successfully!\n");
        }
        return 0;
    }
    ```
    ![](https://upload-images.jianshu.io/upload_images/10339396-3870bfc31be3017b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    掌握理解，openlog, setlogmask
    ```c
    #include<syslog.h>
    #include<stdio.h>
    #include<unistd.h>
    int main(){
        int logmask;
        openlog("test logmask", LOG_PID|LOG_CONS, LOG_USER);
        syslog(LOG_DEBUG, "test debug log, this message should exist!");
        syslog(LOG_INFO, "program pid is %d\n", getpid());
        logmask = setlogmask(LOG_UPTO(LOG_INFO));
        syslog(LOG_DEBUG, "this message should not exist!\n");
        return 0;
    }
    ```
    ![](https://upload-images.jianshu.io/upload_images/10339396-5b982d1e152e11d4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)








