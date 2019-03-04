# linux网络基础

## 1. 路由设置

添加一条路由表

```shell
ip route add 192.168.0.0/24 via 192.168.0.1
ip route add 192.168.1.1 dev 192.168.0.1
或
route add -net 192.168.0.0/24 gw 192.168.0.1
route add -host 192.168.1.1 dev 192.168.0.1
```

添加默认路由

```sehll
route add default gw gateway_addr
或
ip route add default via 192.168.0.1 dev eth0
```

