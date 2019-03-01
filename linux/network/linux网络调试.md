

# linux网络调试



## 1. nc命令使用指南

nc是linux中一款老牌网络工具，用于在两台计算机之间建立连接并发送数据，描述起来一句话，但是它可以实现的功能非常丰富

### 1.1 协议支持

常用的有TCP、udp、ssl

### 1.2 应用基础

#### 1.2.1 端口扫描

端口扫描功能可以使用nmap执行，此处略过

#### 1.2.2 chat server

---

pc1:192.168.56.101 pc2:192.168.56.102

nc的-l选项可以在nc监听在本地的某个socket接口上，在另一台机子上使用nc连接它，两台机子便可交换数据。在pc2上执行

```shell
nc -l 8888
```

在pc1上执行

```shell
nc 192.168.56.102 8888 # 连接到对应主机的socket
```

两台主机算是建立了一条双向通道，可以互相发送数据，方式为全双工

>[root@openvpn_server ~]# nc -l 8888
>
>testinformation
>
>info
>test

>[root@openvpn_client ~]# nc 192.168.56.102 8888
>testinformation
>info
>test



#### 1.2.3 传输文件

---

使用shell的输入输出重定向传输文件

```shell
nc -l 8888 < server.txt #pc1
nc -n 192.168.56.102 8888 > server.txt #pc2
```

其中-n选项用于跳过dns解析



#### 1.2.4 传输目录

---

使用tar命令压缩某一目录，将得到的文件数据以管道的形式发送给nc进程在另一个主机上使用nc命令接受数据使用管道发送给tar命令解压

```shell
tar -cvf - iptables | nc -l 8888 iptables #pc1
nc 192.168.56.102 8888 | tar -xvf - # pc2
```

不过传输目录与文件使用专用的命令比如scp更好

#### 1.2.5 打开一个shell

---

-e参数可以让nc在接收到连接后执行指定命令

```shell
nc -l 8888 -e "/bin/bash -i" #pc1
nc 192.168.56.102 8888		#pc2
```

这样，在pc2连接到pc1时可以得到一个pc1的shell运行环境，在pc1上执行shell命令

假设服务端nc不支持-e选项，那我们可以使用mkfifo命名管道来处理shell

```shell
mkfifo /tmp/temp_fifo # 在服务端创建命名管道
cat /tmp/temp_fifo | /bin/sh -i 2>&1 | nc -l 8888 > /tmp/temp_fifo 
```

管道数据用于输入输出，当cat遇到fifo文件末尾时会阻塞等待数据，temp_fifo文件中存放了nc接收过来的数据，即客户端发送过来的命令

```shell
nc 192.168.56.102 8888
```

也可以在服务端获取一个客户端的shell，称为反向shell

```shell
nc -l 8888 #pc1
nc 192.168.56.102 8888 -e /bin/bash # pc2
```
## 2. socat简介

socat也是用于在两个socket通信端点建立连接的工具，基本用法如下

```
socat [options] <address> <address>
```

在addr1与addr2之间建立数据通道，常用的addr描述方式

-   -,STDIN,STDOUT 表示标准输入输出，可以就用一个横杠代替。
-   /var/log/syslog 打开一个文件作为数据流，可以是任意路径。
-   TCP:: 建立一个 TCP 连接作为数据流，TCP 也可以替换为 UDP 。
-   TCP-LISTEN: 建立 一个 TCP 监听端口，TCP 也可以替换为 UDP。
-   EXEC: 执行一个程序作为数据流。

这些描述方式后面可以附加一些选项

如 fork，reuseaddr，stdin，stdout，ctty 等

### 2.1 应用

#### 2.1.1 读取文件

```shell
socat - filename
```

#### 2.1.2 连接远程端口

```
socat - TCP:192.168.56.101:8888
```

来自标准输入的数据会被发送到该socket，从该socket读取到的数据会被发送到标准输出

#### 2.1.3 监听一个端口

```
socat TCP-LISTEN:8888 -
```

#### 2.1.4转发tcp

```shell
socat -d -d TCP4-LISTEN:8000,bind=192.168.56.101,reuseaddr,fork TCP4:192.168.56.1:103:8888
#转发udp原理同上
```

做端口转发实验时，一定要具备端口转发条件，基础设施要配置好，防火墙打开对应端口，操作系统打开端口转发的选项，方法是在sysctl.conf中添加参数设置，随后执行sysctl -p

```shell
net.ipv4.ip_forward=1
```



## 3. 使用ssh做端口转发

### 3.1 本地端口转发

将本地端口通过ssh连接，映射到远程主机的另一端口，访问本地映射端口，数据会被转发到远程映射端口。用于将远程服务转发到本地

```shell
ssh -L local_hostname:local_port:remote_host:remote_port user@hostname
```

将本地local_hostname的local_port数据通过主机user@hostname转发到remote_host：remote_port

要求remote_host与主机user@hostname可以连通。比如主机A1，A2是本地主机，B1，B2是远程主机

a1<->a2,a1<->b1,b1<->b2

在a2上访问b2上的服务，通过ssh本地端口转发可以实现，通过a1与b1之间的ssh连接，将远程主机b2的服务映射到本地主机a1，然后在a2上访问a1即可

```shell
ssh -L a1:a1_port:b2:b2_port user@b1    # execute on a1
```



### 3.2 远程端口转发

将远程端口，通过ssh连接，映射到本地某一端口，从而实现其他计算机访问远程服务器的远程端口时，请求会被转发到本地,用于将本地服务映射到远程

```shell
ssh -R remote_server:remote_port:dest_server:dest_port user@hostname
```

remote_server是暴露出去的计算机，dest_server是真正运行服务的计算机，remote_server与hostname相同，使发送到remote——server的请求都被转发到dest_server

问题，指定了remote_server以后，其只能绑定在本地127.0.0.1

### 3.3 动态端口转发

将本地端口接收到的请求通过ssh发送到远程主机，指定本地端口，并不指定远程端口，收到的请求信息会原封不动的发送到目标主机，由目标主机处理该请求，相当于一个socks代理

```
ssh -D localhost:localport user@hostname
```



## 4. 使用iptables做端口转发

使用iptables中的SNAT与DNAT做端口转发，假设192.168.56.103:80（S1）运行有httpd服务，在192.168.56.102（G1）上配置端口转发，使发送到102上的请求被转发到103上，在G1上执行

```shell
iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 192.168.56.103
iptables -t nat -A POSTROUTING -p tcp --dport 80 -j SNAT --to-source 192.168.56.101
```

在192.168.56.101上访问G1

curl 192.168.56.102:80

即可得到响应



## 5. 使用tcpdump过滤网络数据包

命令行工具tcpdump可以用来调试网络应用，查看网络数据包

### 5.1 常用选项如下

-   -A 将每个数据包的ascii打印出来，除去包头，经常用于显示网页数据
-   -c 抓取指定数量的数据包
-   -i 指定监听在哪一个网络设备
-   -e打印链路层信息
-   -r -w 分别用于从文件中读取数据包与将数据包写入文件
-   -l 行缓冲
-   -n 显示ip地址，而不是主机名
-   -s 数据包截断
-   -v -vv -vvv verbose mode
-   -X与-XX用来查看数据包ascii与hex内容

### 5.2 过滤语句

基本组成

类型 +方向　＋协议

类型主要有host，port，net，方向dst，src，协议 ether,ip,ip6,arp,rarp,tcp,udp

可以通过逻辑运算对条件进行组合

`or || and && not !`

### 5.3 实例

抓取带有syn标记的数据包

```shell
sudo tcpdump -i eth0 'host 172.16.0.11 andhost google.com and tcp[tcpflags]&tcp-syn!=0' -c 3 -nn
```

tcp数据包有如下标识字段

`tcp-fin, tcp-syn, tcp-rst, tcp-push, tcp-ack, tcp-urg`