1. 批量生成随机字符文件名称
    生成固定模式包含随机字符的文件名称，首先获得随机字符，拼接字符串，通过touch命令创建文件
    - 获取随机字符，使用openssl命令，组合cut获取随机字符
      `openssl rand -base64 40 | sed 's/[A-Z]//g' | cut -c 4-15`
      `6j9no4tea293`
    - 完整示例
      ```
      rand=""
      [ -d "randDir" ] || {
          mkdir randDir
      }
      for i in `seq 10`
      do
          rand=`openssl rand -base64 40 | sed 's/[^a-z]//g' | cut -c 4-15`
          echo rand=$rand
          touch randDir/${rand}_xiaozhi.txt
          echo "/randDir/${rand}_xiaozhi.txt created!"
      done
      ```
2. 批量改名
    对1中生成的文件名称进行更改，xiaozhi替换为xiaozhi2，txt替换为TXT
    - 替换字符串使用sed或变量替换
      `ls | head -n 1 | sed 's/xiaozhi/xiaozhi2/'`
      或
      `${file//xiaozhi/xiaozhi2}`
      txt可用同样的方式替换
    - 完整示例
      ```
      dir="randDir"
      cd $dir || exit 2
      for item in `ls`
      do
              temp1=$(echo $item | sed 's/xiaozhi/xiaozhi2/')
          temp2=$(echo $temp1 | sed 's/txt/TXT/')
          touch $temp2
      done
      ```
3. 扫描指定日志文件查找访问过于频繁的ip地址，并对其进行封禁
    apache日志文件格式如下
    ![image.png](https://upload-images.jianshu.io/upload_images/10339396-72b43aeb3b691174.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
4. 分库备份mysql数据库
