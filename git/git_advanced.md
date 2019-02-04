## 二、git操作进阶

1. 远程仓库
    github网站是著名的开源分布式代码托管网站，结合git工具，可以让我们在团队管理代码时十分方便
    首先注册一个github账号，随后在账号设置中添加自己的公钥。新建仓库，和本地代码关联，随后将本地资源推送到github
    ```
    # 在本地添加远程库，并与刚才创建的learn_git相关联
    git remote add origin git@github.com:xiaozhi5448/learn_git.git
    # 将本地内容推送至origin库，使用了-u选项，将本地master与origin master分支相关联
    # 随后推送时使用git push origin master 即可
    git push -u origin master
    ```
    ![](https://upload-images.jianshu.io/upload_images/10339396-b4700143d53faed3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    使用git clone可以从github克隆资源
2. 分支管理
    分支就好像时间线，一条分支就是一条时间线上我们做的操作集合，在不影响主分支的情况下，创建我们自己的分支，其他人不可见，我们可以在自己创建的分支上作出修改，最后在进行合并使修改可见，这样做的好处是可以在不影响原先代码使用的情况下，对代码进行修改。
    当我们没有进行分支操作时，默认在主分支上操作，git将我们的commit连接成一条时间线，HEAD是一个指向master的指针，指向当前分支，由于默认分支为master，所以master指向最近的一次commit
    ![](https://upload-images.jianshu.io/upload_images/10339396-7fe5225739b3af96.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    当我们新建分支dev，git帮我们新建一个指针dev，并把HEAD执行dev，并将dev当作当前分支
    ![](https://upload-images.jianshu.io/upload_images/10339396-aad91a48bf81a71e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    每作出一次更改，dev指针往前移动一步，master指针不变
    ![](https://upload-images.jianshu.io/upload_images/10339396-feb629e716096a87.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    当我们完成了修改，想要将该操作提交到版本库中，使master指向dev指针指向的地方即可，这个过程叫做分支合并
    ![](https://upload-images.jianshu.io/upload_images/10339396-3ab453a9943e98c4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    合并完成之后可以删除dev分支，就是删除dev指针。
    git的branch子命令查看所有分支，前面有*号的表示当前分支，如果后面跟分支名称，可以新建分支，checkout子命令切换分支。新建并切换分支的命令也可以由git checkout -b dev替代
    ![](https://upload-images.jianshu.io/upload_images/10339396-e13730b2949f7cfa.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    在dev分支中，修改readme文件，并正常提交
    ![](https://upload-images.jianshu.io/upload_images/10339396-2c94f04b471eec68.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    切换回master中，查看readme文件，发现刚才的修改不见了
    ![](https://upload-images.jianshu.io/upload_images/10339396-df32b300861e432c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    随后我们合并dev分支到当前master分支，查看文件变化
    ![](https://upload-images.jianshu.io/upload_images/10339396-376d6eca56b8ff73.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    随后删除dev分支
    `git branch -d dev`
    有时候我们在不同分支中改变了相同文件的同一部分，在分支合并时会出现冲突，解决冲突的办法，就是手动修改冲突文件为我们需要的内容，提交后冲突可以得到解决
    首先我们新建分支dev，在dev中修改readme文件最后一行后提交，回到master分支以后，修改readme文件最后一行（内容不同），提交后尝试合并
    ![](https://upload-images.jianshu.io/upload_images/10339396-d534febcb3474251.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    使用status查看merge的状态，告诉我们--abort可以取消此次合并，使用add添加合适的文件可以解决这个问题
    ![](https://upload-images.jianshu.io/upload_images/10339396-4f0e40d29d859c8a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    修改readme文件为想要的内容后，使用add，commit提交单个文件
    ![](https://upload-images.jianshu.io/upload_images/10339396-3f3ef459222f20eb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    可以查看分支图解
    ![](https://upload-images.jianshu.io/upload_images/10339396-8983c5f29762ab39.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    分支管理合并的时侯，有时候我们并不想抹除要合并的分支，可是根据之前的图解，合并以后master与dev指向相同的位置
    ![](https://upload-images.jianshu.io/upload_images/10339396-7f7d7d257a5b7431.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    删除dev分支后，便不能再看到该次更改的信息了。合并分支时有两种方式，一种Fast-Forward，仅仅更改master指针，另一种即是普通方式，将master与dev当前指向的内容进行合并，并新执行一次提交。在合并分支时指定--no-ff选项指定以普通方式合并。图解类似于
    ![](https://upload-images.jianshu.io/upload_images/10339396-07ecb0f9d6ce9739.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    在实际的开发过程中，应该多使用分支，master分支是主要分支，用来发布新版本，dev分支用来开发，每个开发者都有自己的分支，做了一些事情之后就合并到dev分支，随后接着在自己的分支上工作，以此实现团队合作
    ![](https://upload-images.jianshu.io/upload_images/10339396-92ad815302def4da.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    bug是程序开发过程中经常遇到的错误，有时候我们在dev分支上干活，但是突然被告知master分支上已经发布的版本有一个bug，要立刻解决，我们要新建并切换分支，在该分支完成修复bug的操作，随后将该分支与master分支合并，完成bug修复，在此之前，我们应该先将当前分支的工作提交，但是我们的公所还没有完成，无法提交，该如何呢？git中的stash子命令可以让我们将当前工作区的状态保存起来，恢复到上次提交之后的状态，当返回此分支时，使用stash pop弹出内容，恢复到我们之前的工作状态，实践如下，使用stash保存当前工作状态，新建分支issue-001在其中完成bug修复工作
    ![](https://upload-images.jianshu.io/upload_images/10339396-1d3dc1cad84a82b9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    修复完成后，切换会master分支进行合并，随后返回dev分支，
    ![](https://upload-images.jianshu.io/upload_images/10339396-89485fec506daf59.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    使用stash pop恢复之前工作状态
    ![](https://upload-images.jianshu.io/upload_images/10339396-9012c418a42e6623.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    使用git stash apply可以将保存的特定空间的内容应用于当前，但是，使用这种方式stash中的内容不会被删除，需要使用git stash drop显式删除
    ![](https://upload-images.jianshu.io/upload_images/10339396-d0208ba9c2163a63.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    当软件新添加一个功能时，最后也新建一个分支，在该分支中添加新功能，添加完成后，于master分支合并，并删除该分支，但是有时候，在未合并时，事情有变，不需要该分支了，则需要删除，使用-D选项强制删除一个没有合并过的分支
