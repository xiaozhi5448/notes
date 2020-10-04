# linux使用手记

## 下载工具

 - wget
   1. 使用wget进行断点续传，使用-c参数即可
      `wget -c http://mirrors.163.com/ubuntu-releases/9.10/ubuntu-9.10-desktop-amd64.iso  `
   2. 使用wget进行下载限速，使用--limit-rate=300k参数
      `wget -c --limit-rate=300k http://mirrors.163.com/ubuntu-releases/9.10/ubuntu-9.10-desktop-amd64.iso `
- 下载管理器uget
- bt下载管理器qBittorrent

## 好玩的工具

#### cmatrix矩阵

```
cmatrix
```

![1576900516452](/home/xiaozhi/Documents/notes/linux/assets/1576900516452.png)

#### xeyes眼睛

```
xeyes
```

![1576900579228](/home/xiaozhi/Documents/notes/linux/assets/1576900579228.png)

#### toilet艺术字

```
toilet
```

![1576900648288](/home/xiaozhi/Documents/notes/linux/assets/1576900648288.png)

#### oneko追随指针的小猫

```
oneko
```

![1576900713551](/home/xiaozhi/Documents/notes/linux/assets/1576900713551.png)

#### sl跑火车

```
sl
```

![1576900745910](/home/xiaozhi/Documents/notes/linux/assets/1576900745910.png)

#### cowsay,lolcat,fortune 

cowsay可以指定图案显示指定文字

![1576900857258](/home/xiaozhi/Documents/notes/linux/assets/1576900857258.png)

还可以指定动物

![1576900881534](/home/xiaozhi/Documents/notes/linux/assets/1576900881534.png)

![1576900923086](/home/xiaozhi/Documents/notes/linux/assets/1576900923086.png)

fortune显示名人名言,lolcat可以使输出结果变为彩色

```
fortune | cowsay -f dragon | lolcat
```

![1576901011260](/home/xiaozhi/Documents/notes/linux/assets/1576901011260.png)

#### pv使输出模拟打字机

![1576901011260](/home/xiaozhi/Documents/notes/linux/assets/pv.gif)