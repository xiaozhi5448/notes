# deepin 配置深度学习GPU加速

python版本管理使用pyenv，深度学习环境管理使用anaconda3，anaconda3以pyenv的虚拟环境的方式存在，需要使用深度学习环境时，先激活anaconda3环境，再激活对应的anaconda3虚拟环境

此次配置过程中，pyenv中有anaconda3，anaconda3中右创建了deep_learn_3.6。

显卡配置使用bumblebee，需要使用独显时使用optirun指令运行程序即可

## 安装对应软件

使用nvidia的gpu功能，需要安装cuda工具包，与cudnn库，以及对应版本的python驱动，对应版本的tensorflow-gpu

```shell
sudo apt-get install nvidia-smi
sudo apt install nvidia-cuda-dev nvidia-cuda-toolkit nvidia-nsight nvidia-visual-profiler  
```

查看cuda版本

```
nvcc --version
```

![1567349345857](/home/xiaozhi/Documents/notes/python/deeplearn/assets/1567349345857.png)

查看nvidia显卡驱动版本

```shell
sudo dpkg -l | grep nvidia
```

所以我们的cuda toolkit版本为9.1，我们取nvidia官网找到对应版本的cudnn库

```
https://developer.nvidia.com/rdp/cudnn-archive
```

![1567349709218](/home/xiaozhi/Documents/notes/python/deeplearn/assets/1567349709218.png)

下载完成后解压，得到cuda文件夹

## 安装python对应库

安装tensorflow 1.12.0 以及对应的gpu版本，安装过程会自动安装cuda与cudnn的python库(python=3.6)

```
conda install tensorflow=1.12.0 tensorflow-gpu=1.12.0
```

## 移动库文件

将刚才下载的cuda库文件，添加到tensorflow目录下，

```shell
sudo cp include/cudnn.h /usr/local/include/
cp lib64/* ~/.pyenv/versions/anaconda3-5.0.0/envs/deep_learn_3.6/lib/python3.7/site-packages/tensorflow/python/
```

第二个lib目录根据自己的环境进行调整，因为这里anaconda3是pyenv的一个虚拟环境，而deep_learn_3.6又是anaconda3的一个虚拟环境，所以目录如上所示

随后在终端中，进行测试

```
optirun ipython
import tensorflow as tf
tf.Session()
```

未报错就说明配置成功

## 配置jupyter使用gpu

配置jupyter运行命令的参数，目录是

```
vim ~/.pyenv/versions/anaconda3-5.0.0/envs/deep_learn_3.6/share/jupyter/kernels/python3/kernel.json
```

![1567350168407](/home/xiaozhi/Documents/notes/python/deeplearn/assets/1567350168407.png)

在最前面加上optirun，这样在jupyter中就可以使用独显了

版本说明表格如下

![1567350444508](/home/xiaozhi/Documents/notes/python/deeplearn/assets/1567350444508.png)



