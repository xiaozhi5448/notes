## 一、git简介

## 需求分析

当我们一个人独自编写程序时，对程序的改动是实时的，修改某一部分，即修改某一部分，十分准确，但是当我们出错时，想要将项目恢复到之前的状态，普通编辑器爱莫能助，需要一种方式记录我们对项目所作的种种改动，以便于我们可以随时回到某个时间点的状态；当团队共同协作一个项目时，版本控制是重要的内容，如何协调大家对源代码的更改使数据一致，如何恢复错误是我们需要关心的问题。linux操作系统之父开发出git版本控制系统并在开源技术推动下得到IT界的广泛使用

## git的安装

在linux中安装git十分简单，使用对应的软件包管理工具安装git包即可

```
sudo dnf install git -y # for fedora
```
## 创建版本仓库

新建立一个空目录，切换到该目录下，使用init子目录使该目录成为一个版本仓库。

```
[xiaozhi@localhost ~/code/learngit]
$ pwd
/home/xiaozhi/code/learngit
[xiaozhi@localhost ~/code/learngit]
$ git init
Initialized empty Git repository in /home/xiaozhi/code/learngit/.git/
```
该操作会在当前目录下创建.git目录，如下
```
[xiaozhi@localhost ~/code/learngit]
$ ls -a
.  ..  .git  temp.txt
[xiaozhi@localhost ~/code/learngit]
$ ls .git
branches  config  description  HEAD  hooks  info  objects  refs
```
可以使用add子命令向仓库中提交文件，并使用commit子命令来提交我们的更改
```
[xiaozhi@localhost ~/code/learngit]
$ cat readme.txt 
Git is a version control system
Git is Free Software
[xiaozhi@localhost ~/code/learngit]
$ git add readme.txt 
[xiaozhi@localhost ~/code/learngit]
# commit表示将该操作写入git目录的配置文件中进行记录，-m选项指定了该操作的说明
$ git commit -m "add readme file"
[master (root-commit) 07606de] add readme file
 1 file changed, 2 insertions(+)
 create mode 100644 readme.txt
```
git中工作区和暂存区的概念十分重要，工作区即是我们用作版本库的目录，在使用init命令初始化repository时，会在工作区创建.git目录，这个目录是git的版本库，我们对仓库所作的修改都保存在.git目录下，.git目录中有一个区域叫暂存区，用于临时存放我们对版本库的更改，git自动为我们创建主分支master以及指向该分支的指针HEAD，分支与HEAD后面再说。使用add时，是将操作放在暂存区中，使用commit时，将暂存区的操作提交到分支中
![](https://upload-images.jianshu.io/upload_images/10339396-985162ea6fa8eefe.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
向readme文件中添加一行，并新建文件，使用status子命令查看git仓库的状态
![](https://upload-images.jianshu.io/upload_images/10339396-4d3be3e6957ad020.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
将新建的文件和修改过的文件添加到暂存区，再查看状态
![](https://upload-images.jianshu.io/upload_images/10339396-a33e0342587027c2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
提交到分支以后再查看状态
![](https://upload-images.jianshu.io/upload_images/10339396-138db178aaa85fc5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 版本修改与管理

修改readme文件，使用status查看状态，并使用diff子命令查看文件更改的部分
![](https://upload-images.jianshu.io/upload_images/10339396-5180c46864155570.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
同样的使用add和commit将其提交到版本库中。每使用commit提交一次，我们就在该文件的时间线上做了一个标记，当发现出错时，可以返回该时间点的状态，或者说该次提交的状态。使用git log查看仓库的提交历史
![](https://upload-images.jianshu.io/upload_images/10339396-56162457232539bb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
每次commit后，都会有一个commit ID与该状态对应，使用reset指令回到之前版本
![](https://upload-images.jianshu.io/upload_images/10339396-ce72d17aef1375e4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
可以使用reflog查看历史commit操作，并以此撤销某次更改（回到未来）
![](https://upload-images.jianshu.io/upload_images/10339396-305774258f7bd1d4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
git管理的是我们对文件的修改操作，修改某文件，添加该次操作到暂存区，使用commit提交暂存区的内容，是我们修改文件的一般步骤。当我们在工作区中做了一些操作，突然发现出错了，想要撤销，该如何做呢？git checkout -- <file>可以将某文件恢复到add或者commit之前的状态，即恢复到和暂存区或版本库同样的状态，撤销工作区的更改
![](https://upload-images.jianshu.io/upload_images/10339396-dcbf7a671d92bd4d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
有时候已经将操作提交到暂存区了，如何撤销呢？使用reset
![](https://upload-images.jianshu.io/upload_images/10339396-5204b43d254567bc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
当我们要删除一个文件时，可以在磁盘上删除该文件，但是在版本库中该文件还存在，要同步的话应该使用git rm file从版本库中删除文件。另一种情况是误删，可以使用checkout恢复到版本库中的状态
![](https://upload-images.jianshu.io/upload_images/10339396-a971300dcdcaa873.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
误删文件的恢复
![](https://upload-images.jianshu.io/upload_images/10339396-79aa0c754ebf66a3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



## 配置git显示中文路径

```
 git config --global core.quotepath false
```

![1567351029952](/home/xiaozhi/Documents/notes/git/assets/1567351029952.png)


