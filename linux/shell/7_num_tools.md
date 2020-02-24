### 数字序列

```
seq 5 -1 1 | xargs
```
![](https://upload-images.jianshu.io/upload_images/10339396-c294484c44c5fc46.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 使用{..}生成数值序列

```
echo {1..9}
输出
1 2 3 4 5 6 7 8 9
```
### 随机数

- 使用$RANDOM生成范围在0-32767之间的随机数，为保证随机性，可使用md5sum命令产生随机序列并截取其中某些位
    `echo $RANDOM | md5sum | cut -c 8-15` 
    `75d6c028`
- 使用openssl产生随机数
    `openssl rand -base64 8`
    `WJeQaLlePm8=`