1. 与文件存储有关的系统调用
    - write
    - read
    - open
    - close
    - ioctl
    - lseek
    - fstat，stat，lstat
    - dup，dup2
      ```
      #include<fcntl.h>
      #include<sys/types.h>
      #include<sys/stat.h>
      #include<unistd.h>
      #include<stdio.h>
      #include<stdlib.h>
      #include<dirent.h>
      #include<string.h>
      using namespace std;
      int main(){
          int fp;   
          mode_t fp_mode;
          fp_mode = S_IRUSR | S_IWUSR | S_IRGRP | S_IWGRP | S_IROTH;
          fp = open("test.txt", O_RDWR | O_CREAT, fp_mode);
          if ( fp != -1 ){
              printf("file created successfully!\n");
          }else{
              printf("failed!");
          }
      
          struct stat *buf = (struct stat*)malloc(sizeof(struct stat));
          if ( buf != NULL ){
              printf("buffer created successfully!\n");
          }else{
              printf("buffer created failed!\n");
          }
          fstat(fp, buf);
          if(buf->st_mode & S_IRUSR){
              printf("owner has read access!\n");
          }
          if(buf->st_mode & S_IWGRP){
              printf("group has write access!\n");
          }else{
              puts("group has no write access!");
          }
          close(fp);
          chmod("test.txt", 0664);
          stat("test.txt", buf);
          if(buf->st_mode & S_IWGRP){
              puts("group has write access!");
          }
          free(buf);
      
      
      
          char *dir = (char*)malloc(50);
          if(dir != NULL){
              getcwd(dir, 50);
              printf("current dir:%s\n", dir);
          }
          if(mkdir("test", 775) != -1){
              puts("dir created successfully!");
              chdir("test");
              puts("change workspace to test");
          }else{
              puts("couldn't create test dir!");
          }
          free(dir);
          return 0;
      }
      ```
      ```
      #include<stdio.h>
      #include<unistd.h>
      #include<stdlib.h>
      #include<fcntl.h>
      #include<sys/types.h>
      #include<error.h>
      #define LENGTH 2000
      void copy(char* oldfile, char* newfile);
      int main(int argc, char* argv[])
      {
          
          if(argc != 3){
              puts("invalid arguments!\n");
              return 1;
          }
          copy(argv[1], argv[2]);
          return 0;
      }
      void copy(char* oldfile, char* newfile)
      {
          char buf[LENGTH];
          int f1,f2,i, j=0;
          mode_t f_mode = S_IRUSR | S_IWUSR | S_IRGRP;
          f1 = open(oldfile, O_RDONLY);
          if(f1!= -1){
              puts("file opened successfully!\n");
              i = read(f1, buf, LENGTH);
              if(i>0){
                  printf("%s\n",buf);
              }
              f2 = open(newfile, O_WRONLY|O_CREAT, f_mode);
              if(f2 != -1){
                  write(f2, buf, i);
              }else{
                  puts("create file failed!\n");
              }
              puts("write completed!\n");
              close(f2);
          }else{
              puts("read file failed!");
              perror("file:");
          }
          close(f1);   
      }
      ```
2. 文件存取库函数
    - fopen，fclose
    - fread，fwrite
    - fflush
    - fseek
    - fgetc，getc，getchar
    - fputc， putc，putchar
    - fgets，gets
      ```
      #include<stdio.h>
      #define SIZE 65535
      #define LENGTH 1024
      int main(){
          FILE *fp,*fp_copy;
          char buf[SIZE];
          fp = fopen("test.cpp","r");
          if(fp != NULL){
              puts("文件打开成功！");
              if(fread(buf, LENGTH, SIZE/LENGTH, fp) > 0){
                  puts("文件读取成功！");
              }else{
                  puts("文件读取失败!");
              }
          }else{
              perror("open file:");
              return 1;
          }
          fp_copy = fopen("test.txt", "w");
          if(fp_copy != NULL){
              puts("正在写入文件！");
              if(fwrite(buf, LENGTH, SIZE/LENGTH, fp_copy) >0){
                  puts("文件写入成功！");
              }else{
                  puts("写入失败！");
              }
          }
          if(fclose(fp)!= -1 && fclose(fp_copy) != -1){
              puts("文件关闭成功！");
          }else{
              perror("close file:");
              return 1;
          }
          return 0;
      }
      ```
3. format input and output
    - printf, sprintf, fprintf
    - scanf, sscanf, fscanf
      ```
      #include<stdio.h>
      #include<fcntl.h>
      typedef struct{
          char name[20];
          char address[50];
          char stu_id[15];
      } student;
      int main(){
          student stu1;
          FILE *fp;
          if(creat("info.txt",0664) == -1){
              perror("创建文件失败！");
              return 1;
          }
          fp = fopen("info.txt","w");
          if(fp != NULL){
              fprintf(fp,"<name>:%s <address>:%s <stu_id>:%s","xiaoming", "Beijing", "1010101");
              puts("输出信息成功!");
          }
          fclose(fp);
          fp = fopen("info.txt","r");
          fscanf(fp,"<name>:%s <address>:%s <stu_id>:%s", stu1.name, stu1.address, stu1.stu_id);
          fclose(fp);
          printf("%s,%s,%s\n",stu1.name,stu1.address,stu1.stu_id);
          return 0;
      }
      ```
4. file des position
    - fgetpos, fsetpos
    - ftell
    - rewind
    - freopen
    - setvbuf
    - remove
      ```
      #include<stdio.h>
      #include<sys/types.h>
      #include<fcntl.h>
      #include<stdlib.h>
      #define CTIME 3
      typedef struct{
          int length;
          fpos_t fpos;
      } pos_t;
      int main(){
          pos_t pos[CTIME];
          FILE *fp;
          if(creat("temp",0664) == -1){
              perror("创建文件失败！");
              return 1;
          }
          fp = fopen("temp","rw+");
          for(int i = 0; i< CTIME; i++){
              fgetpos(fp, &pos[i].fpos);
              pos[i].length = fprintf(fp, "第%d次输出的数据！\n", i);
          }
          fflush(fp);
          printf("文件总长度:%d\n", ftell(fp));
          rewind(fp);
          char *buf;
          for(int i =0; i < CTIME ; i++){
              fsetpos(fp, &pos[i].fpos);
              buf = (char*)malloc(pos[i].length + 1);
              *(buf + pos[i].length +1) = '\0';
              fread(buf, pos[i].length, 1, fp);
              printf("%s",buf);
              free(buf);
          }
          fclose(fp);
          return 0;
      
      }
      ```
5. error detect
    - ferror
    - feof
    - clearerr
6. Streams and file descriptors
    - fileno
      get fd from Stream
    - fdopen
      open a stream from fd
7. file and directory maintence
    - chmod
      ![](https://upload-images.jianshu.io/upload_images/10339396-f86bfa73784370bf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - chown
      ![](https://upload-images.jianshu.io/upload_images/10339396-ffcca06cf754a8dd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - link
      ![](https://upload-images.jianshu.io/upload_images/10339396-a5df3831dc44548c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    - rmdir, mkdir
    - chdir, getcwd
8. scan dir
    - opendir, closedir
    - readdir, telldir, seekdir
      ```
      #include<fcntl.h>
      #include<unistd.h>
      #include<dirent.h>
      #include<stdlib.h>
      #include<stdio.h>
      #include<string.h>
      #include<sys/stat.h>
      #include<sys/types.h>
      void scan_dir(char *dir, int depth);
      int main(){
          puts("scan dir /boot\n");
          scan_dir("/boot",0);
          puts("scan completed!\n");
          return 0;
      }
      void scan_dir(char *dir, int depth){
          DIR *dp;
          struct dirent *entry;
          struct stat statbuf;
          if(dir==NULL){
              puts("you must input a dirname!");
              return;
          }
          if((dp = opendir(dir)) == NULL){
              printf("couldn't open the folder:%s\n", dir);
              return;
          }else{
              chdir(dir);
              while((entry = readdir(dp)) != NULL){
                  lstat(entry->d_name, &statbuf);
                  if(S_IFDIR & statbuf.st_mode){
      
                      if(strcmp(entry->d_name,".")==0 || strcmp(entry->d_name,"..")==0){
                          continue;
                      }
                      printf("%*s%s/\n",depth, " ",entry->d_name);
                      scan_dir(entry->d_name,depth+4);
                  }else{
                      printf("%*s%s\n", depth," ", entry->d_name);
                  }
      
              }
              chdir("..");
              closedir(dp);
          }
      }
      ```
9. error process
    - strerror,perror

