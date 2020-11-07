1. debian系列包管理工具
    dpkg、apt、apt-get、aptitude
    - 安装软件包
      ```
      dpkg -i install packagename # local install deb package
      apt-get install packagename
      aptitude install packagename
      apt-get install package --reinstall
      aptidude reinstall package
      ```
    - 删除软件包
      ```
      dpkg -r package
      apt-get remove package # remove the package
      aptitude remove package 
      dpkg -P package # remove package with its config file
      apt-get remove package --purge
      aptitude purge package
      apt-get autoremove # 自动删除不需要的软件包
      apt-get clean # 清理下载的软件包
      ```
    - update system
      ```
      apt-get update # update package list
      apt-get upgrade # update package
      apt-get dist-upgrade # update system
      ```
    - search package
      ```
      apt-cache search package # search package from package list
      ```
    - information of package
      ```
      apt-cache show package
      dpkg -L package # list all file contained by package
      dpkg -S file # show which package include the file
      ```
2. redhat系列包管理工具
    rpm、yum、dnf

      