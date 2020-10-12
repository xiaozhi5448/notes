## 三、git远程协作

## 远程托管

一般项目托管在github上，每个人完成功能后便提交到github。从远程仓库克隆数据时，git自动将本地master分支与远程master分支相关联，远程库名称默认为origin。可以使用`git remote`查看远程库信息，添加-v选项可以查看详细信息，origin后面的内容给出了抓取和推送origin库的地址
![](https://upload-images.jianshu.io/upload_images/10339396-ae59b6ef2f4ebc78.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
分支在本地修改完毕以后需要推送到云，推送的时侯指定分支名称和远程库名称，一般来说，master分支用来发布新版本，dev分支用来开发，这两个分支必须保证开发人员的同步，但其余分支不必
![](https://upload-images.jianshu.io/upload_images/10339396-68a783f0544c3988.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 分支的抓取

当我们使用git clone克隆版本库时，默认仅仅克隆master分支
![](https://upload-images.jianshu.io/upload_images/10339396-01924de1bd7dfe9a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
但是我们是需要在dev分支下工作的，使用checkout的-b选项创建远程的dev分支到本地。下图中的命令表示以远程库origin中的dev分支为起点，在当前目录创建dev分支，并使其相关联
![](https://upload-images.jianshu.io/upload_images/10339396-d77238c08e077200.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 远程冲突的解决

团队中的开发者，在dev分支上进行分工合作，当多人更改同一文件时，会出现冲突的情况，要解决这种冲突，和解决本地分支冲突一样，修改引起冲突的文件，随后再push到远程
队员1在dev分支修改了readme文件并进行了推送
![](https://upload-images.jianshu.io/upload_images/10339396-c76e77c18cd644c9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
自己在dev分支修改相同的文件，尝试push出错
![](https://upload-images.jianshu.io/upload_images/10339396-35086238be44bae4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
此时我们需要将远程的最新提交抓取下来，修改冲突以后，再次提交，再拉取资源时出现了错误，git告诉我们，应该设置本地dev分支和远程dev分支的连接，随后才能拉取
![](https://upload-images.jianshu.io/upload_images/10339396-c2ceedbe3449d9e0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
随后我们修改readme文件，然后提交
![](https://upload-images.jianshu.io/upload_images/10339396-43512ddac1e39fa9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 标签

标签具有良好的可读性，可以用于标识版本号，git中标签与commit相关联

创建标签如下
![](https://upload-images.jianshu.io/upload_images/10339396-9edde0562ba60af2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
如果要对某个commit添加标签，在命令后加上commit id即可
![](https://upload-images.jianshu.io/upload_images/10339396-0cc60d66f3565936.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
使用`git show tagname`查看标签详细信息
![](https://upload-images.jianshu.io/upload_images/10339396-fbc6b594cdbfb1de.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
添加标签时，可以指定commit，与tag名称
![](https://upload-images.jianshu.io/upload_images/10339396-d98157109a39d072.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
删除某标签，将本地标签推送到github
![](https://upload-images.jianshu.io/upload_images/10339396-d9b323ce4cb2208c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 文件管理

有时候本地文件仓库中放了某个文件，但是我们并不想将它当作版本库的一部分，可以使用.gitignore文件指定需要忽略的文件
再版本库中新建文件，如果不添加，则会提示错误如下
![](https://upload-images.jianshu.io/upload_images/10339396-96bdf28e00816e4a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
编写gitignore文件忽略该文件，并将gitignore文件添加版本库，随后该错误就看不到了，默认忽略了test.txt
![](https://upload-images.jianshu.io/upload_images/10339396-cf7316db9eae9f1e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)