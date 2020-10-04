# openvpn使用详解

1.  openvpn是什么
    openvpn是一款可以让用户建立安全隧道的开源vpn软件。认证方式有静态秘钥和数字证书两种，基于数字证书又有用户名密码认证的方式。使用数字证书时，双方经过TLS协商，实现认证过程。使用静态秘钥，则是使用双方事先约定好的秘钥，对加密数据进行传输

2.  静态密钥配置（server：192.168.56.102 client:192.168.57.3 gateway:192.168.56.1)

    1.  在服务端生成静态秘钥

        ```shell
        openvpn --genkey --secret static.key
        ```

    2.  将秘钥分发至客户端

        ```shell
        scp /etc/openvpn/server/static.key root@192.168.56.101:/etc/openvpn/client/static.key
        ```

    3.  分别编辑服务端与客户端配置文件
        server

        ```config
        # define the work model
        dev tun
        # config the ip addr of two peers
        ifconfig 10.8.0.1 10.8.0.2
        # config encrypt with static.key
        secret static.key
        keepalive 10 60
        ping-timer-rem
        persist-tun
        persist-key
        
        # compress the data
        comp-lzo
        
        # push gateway route message to client
        push "redirect-gateway def1 bypass-dhcp"
        
        # log file 
        log openvpn.log
        
        # drop super privileges
        user nobody
        group nobody
        # run as a daemon
        daemon
        ```

        client

        ```
        remote 192.168.56.102
        dev tun
        ifconfig 10.8.0.2 10.8.0.1
        
        # static key authrize
        secret static.key
        
        # Make the link more resistent to connection failures
        keepalive 10 60
        ping-timer-rem
        persist-tun
        persist-key
        comp-lzo
        
        log openvpn.log
        # Allow client to reach entire server subnet
        # route 192.168.56.0 255.255.255.0
        # drop super privileges
        user nobody
        group nobody
        # run as a daemon
        daemon
        redirect-gateway def1
        dhcp-option DNS 8.8.8.8
        dhcp-option DNS 8.8.4.4
        ```

    4.  在server端开启端口转发
        在/etc/sysctl.conf中添加一行`net.ipv4.ip_forward = 1`,随后执行sysctl -p更新该参数
        在iptables的nat表中添加一条规则

        ```shell
        iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -j SNAT --to-source 192.168.56.102
        ```

        

    5.  使用openvpn的–config参数指定配置文件即可(client and server)

        ```shell
        openvpn --config static_key_config.ovpn
        ```

        正常的话，在服务端与客户端可以看到一个虚拟的网络接口tun0，分别被分配了10.8.0.2与10.8.0.1，client可以ping通server，并且，client所有的外出流量，经过server流出

        在client上ping一下网关192.168.56.1,在server端使用tcpdump可以看到该icmp数据

        ```
        22:26:52.766759 IP 10.8.0.2 > 192.168.56.1: ICMP echo request, id 4085, seq 1, length 64
        22:26:52.767090 IP 192.168.56.1 > 10.8.0.2: ICMP echo reply, id 4085, seq 1, length 64
        22:26:53.768784 IP 10.8.0.2 > 192.168.56.1: ICMP echo request, id 4085, seq 2, length 64
        22:26:53.769287 IP 192.168.56.1 > 10.8.0.2: ICMP echo reply, id 4085, seq 2, length 64
        22:26:54.771348 IP 10.8.0.2 > 192.168.56.1: ICMP echo request, id 4085, seq 3, length 64
        22:26:54.771598 IP 192.168.56.1 > 10.8.0.2: ICMP echo reply, id 4085, seq 3, length 64
        22:26:55.773599 IP 10.8.0.2 > 192.168.56.1: ICMP echo request, id 4085, seq 4, length 64
        22:26:55.773892 IP 192.168.56.1 > 10.8.0.2: ICMP echo reply, id 4085, seq 4, length 64
        ```

        静态秘钥配置生效