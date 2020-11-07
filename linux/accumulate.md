# liunx 操作积累

### wine运行时指定中文环境

```shell
env LANG=zh_CN.utf8 wine
```

pyqt5中文输入

```
cp /usr/lib/x86_64-linux-gnu/qt5/plugins/platforminputcontexts/libfcitxplatforminputcontextplugin.so ~/.pyenv/versions/QT5_envs/lib/python3.7/site-packages/PyQt5/Qt/plugins/platforminputcontexts/
```

查看nvidia显卡驱动版本

```
sudo dpkg --list | grep nvidia-*	
```

查看cuda版本

```
nvcc --version
```

http://ai.stanford.edu/~amaas/data/sentiment/aclImdb_v1.tar.gz