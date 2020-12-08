# PyQt基础

## 实例

### HelloWorld

使用designer绘制一个对话框，保存为ui文件后，使用pyuic将其转换为代码

```python
# Form implementation generated from reading ui file 'test.ui'
#
# Created by: PyQt5 UI code generator 5.11.3
#
# WARNING! All changes made in this file will be lost!

from PyQt5 import QtCore, QtGui, QtWidgets

class Ui_Dialog(object):
    def setupUi(self, Dialog):
        Dialog.setObjectName("Dialog")
        Dialog.resize(400, 283)
        self.buttonBox = QtWidgets.QDialogButtonBox(Dialog)
        self.buttonBox.setGeometry(QtCore.QRect(30, 240, 341, 32))
        self.buttonBox.setOrientation(QtCore.Qt.Horizontal)
        self.buttonBox.setStandardButtons(QtWidgets.QDialogButtonBox.Cancel|QtWidgets.QDialogButtonBox.Ok)
        self.buttonBox.setObjectName("buttonBox")

        self.retranslateUi(Dialog)
        self.buttonBox.accepted.connect(Dialog.accept)
        self.buttonBox.rejected.connect(Dialog.reject)
        QtCore.QMetaObject.connectSlotsByName(Dialog)

    def retranslateUi(self, Dialog):
        _translate = QtCore.QCoreApplication.translate
        Dialog.setWindowTitle(_translate("Dialog", "Dialog"))

```

新建类，继承该类，

```python
from PyQt5.QtWidgets import QApplication, QMainWindow, QLabel, QVBoxLayout, QFileDialog, QLabel, QDialog
from PyQt5.QtCore import QStringListModel, QThread, pyqtSignal, QCoreApplication
import sys
from ui_Dialog import Ui_Dialog


class MainWindow(QDialog, Ui_Dialog):
    def __init__(self, parent=None):
        super(MainWindow, self).__init__(parent)
        self.setupUi(self)


if __name__ == '__main__':
    app = QApplication(sys.argv)
    myWin = MainWindow()
    myWin.setFixedSize(myWin.width(), myWin.height())

    myWin.show()
    sys.exit(app.exec_())
```

运行可看到对话框

![image-20201208170654536](PyQt%E5%9F%BA%E7%A1%80.assets/image-20201208170654536.png)



### 源码

先从一个例子开始看起，一个监听网络接口过滤数据包信息的例子。

sniffer

```python
import scapy.all as scapy
import psutil
import scapy_http.http
import re
import subprocess
import logging
from collections import defaultdict
import re
logging.basicConfig(level=logging.DEBUG)



# 获取本机网卡列表，用于选择监听在哪一个接口上
def get_netcard():

    netcards = []
    card_info = psutil.net_if_addrs()
    for k,v in card_info.items():
        for item in v:
            if item[0] ==2 and  item[1] != '127.0.0.1':
                print(item[1])
                netcards.append(k + " " + item[1])

    
    logging.info(card_info)
    
    return netcards


# 解析数据包
def parse_pkt( pkt):
    # 如果数据包包含HTTPRequest层
    if pkt.haslayer("HTTPRequest"):
        res = defaultdict(str)
        header = str(pkt['HTTPRequest'].fields['Headers'])
        headers = {item.split(':')[0]: item.split(':')[1] for item in header.split(r'\r\n')}
        try:
            os_info = re.split(r'[()]', headers['User-Agent'])
        except KeyError:
            logging.info(headers)
            return
        if len(os_info) == 1:
            res['OS: '] = os_info[0]
        else:
            try:
                res['IP '] = pkt['IP'].src
                res['MAC '] = pkt['Ether'].src
                res['OS '] = os_info[1].strip()
                res['webkit '] = os_info[2].strip()
                res['client '] = os_info[4].strip()
            except IndexError:
                logging.info(os_info)
        logging.info(res)
        return res
    else:
        return None

# 解析数据包文件的代码
def parse_pcap(filename:str):
    pcap_name = filename
    res = []
    pkts = scapy.rdpcap(pcap_name)
    for pkt in pkts:
        info = parse_pkt(pkt)
        if info:
            res.append(info)
    return res

# sniff函数测试代码
def parse_pkt_forever(iface):
    scapy.sniff(iface=iface, filter="tcp dst port 80", prn=parse_pkt)


# 函数测试代码
if __name__ == '__main__':
    logging.info(get_netcard())
    #parse_pcap('baidu.pcap')
    parse_pkt_forever('本地连接* 2')
```

这个文件用于解析网络数据包

在qtdesigner中绘制该界面

![image-20201208163746113](PyQt%E5%9F%BA%E7%A1%80.assets/image-20201208163746113.png)

保存为.ui文件，使用pyuic5将ui文件生成python code

```shell
pyuic5 ui_MainWindow.ui -o MainWindow.py
```

在我们要写的主文件中继承MainWindow中的类

DBconn（封装数据库连接）

```python

import MySQLdb

class DBconn(object):
    def __init__(self, hostname, username,  database, password, port=3306):
        self.hostname = hostname
        self.database = database
        self.username = username
        self.password = password
        self.port = port
        self.db =  MySQLdb.connect(self.hostname, self.username, self.password, self.database)
    def getcursor(self):
        return self.db.cursor()
    
    
    
    def destory(self):
        self.db.close()
```

```python
from MainWindow import *
import re
import scapy.all as scapy
import psutil
import scapy_http.http
import sys, os, logging
import MySQLdb
from PyQt5.QtWidgets import QApplication, QMainWindow, QLabel, QVBoxLayout, QFileDialog, QLabel
from PyQt5.QtCore import QStringListModel, QThread, pyqtSignal, QCoreApplication
from sniffer import get_netcard, parse_pcap, parse_pkt_forever
from Connection import DBconn
from collections import defaultdict


# 使用css设置label样式
label_info_css = """
background-color:rgb(242, 253, 194);
border-radius: 5px;
padding-left: 5px;
padding-top: 5px;
margin: 5px;
font-weight: bold;
"""


# 设置程序日志级别，如果不想看到太多信息可以设置为INFO级别
logging.basicConfig(level=logging.DEBUG)
# 主窗体类
class MyMainWindow(QMainWindow, Ui_MainWindow):
    def __init__(self, parent=None):
        super(MyMainWindow, self).__init__(parent)
        self.pcapFileName = ''
        self.setupUi(self)
        self.fileSelectBtn.clicked.connect(self.chooseFileSlot)
        self.deviceInfo = []
        self.vboxLayout = QVBoxLayout()
        self.vboxLayout.addStretch()
        self.scrollAreaWidgetContents.setStyleSheet("background-color: #bfa;")
        
        self.parseFileThread = ParseFile(self)
        self.parseFileThread.breakSignal.connect(self.update_ui)
        
        self.parseRealTime = ParseRealTime(self)
        self.parseRealTime.breakSignal.connect(self.update_ui)
        
        self.queryDataThread = QueryData(self)
        self.queryDataThread.breakSignal.connect(self.update_ui)
        self.queryDataThread.msgSignal.connect(self.showMsg)
        
        self.storeDataThread = StoreData(self)
        self.storeDataThread.breakSignal.connect(self.showMsg)
        
        self.fileInputEdit.returnPressed.connect(self.parsePcapFile)
        self.interfaceSelecter.addItems(get_netcard())
        
        self.exitBtn.clicked.connect(self.quit)
        
    # 退出应用
    def quit(self):
        QCoreApplication.quit()
    
    # 在窗体的状态栏显示一条消息，用于消息提示
    def showMsg(self, msg):
        self.statusBar().showMessage(msg)
        
    # 更新ui界面，将获取到的数据包显示到界面上
    def update_ui(self, device_info_list):
        if device_info_list is None:
            return
        for device_info in device_info_list:
            try:
                if  len(self.deviceInfo) and  device_info['IP '] in [device['IP '] for device in self.deviceInfo]:
                    continue
            
                else:
                    self.deviceInfo.append(device_info)            
                    info_msg = ''
                    for key in device_info.keys():
                        info_msg += key.ljust(25)
                        info_msg += ':'.ljust(5)
                        info_msg += device_info[key].ljust(30)
                        info_msg += '\r\n'
                    logging.info('get device info \r\n{}'.format(info_msg))
                    msgLabel = QLabel()
                    msgLabel.setText(info_msg)
                    msgLabel.setAlignment(QtCore.Qt.AlignLeft | QtCore.Qt.AlignVCenter)
                    msgLabel.setStyleSheet(label_info_css)
                    self.vboxLayout.insertWidget(self.vboxLayout.count() - 1, msgLabel)
            except KeyError:
                logging.info(device_info)
                continue
        self.scrollAreaWidgetContents.setLayout(self.vboxLayout)

    # 解析数据包文件
    def parsePcapFile(self):
        self.parseFileThread.start()
        self.statusBar().showMessage('解析pcap文件.......')
        
    # 监听借口
    def parseForever(self):
        self.parseRealTime.start()
        self.statusBar().showMessage('正在监听数据........')

    # 文件选择
    def chooseFileSlot(self):
        fileName, fileType = QFileDialog.getOpenFileName(self, "选取数据包文件", os.getcwd(),"Pcap File(*.pcap)")
        if fileName == '':
            logging.info("{}: 未选择文件！".format(sys._getframe().f_code.co_name))
        else:
            self.pcapFileName = fileName
            logging.info("{}: 选择pcap文件：{}".format(sys._getframe().f_code.co_name, fileName))
            self.fileInputEdit.setText(fileName)

    # 数据保存至数据库
    def storeData(self):
        self.storeDataThread.start()
    
    # 查询数据库中的数据
    def queryData(self):
        self.queryDataThread.start()

# 解析数据包文件的线程类
class ParseFile(QThread):
    breakSignal = pyqtSignal(list)
    def __init__(self, myWin:MyMainWindow):
        super(ParseFile, self).__init__()
        self.myWin = myWin
        
    def run(self):
        # 获取文件输入框的文件名
        pcapFileName = self.myWin.fileInputEdit.text()
        logging.debug('{}: get file name from fileinputEdit: {}'.format('', pcapFileName))
        print('{}: get file name from fileinputEdit: {}'.format(sys._getframe().f_code.co_name, pcapFileName))
        # 解析数据包
        deviceInfos = parse_pcap(pcapFileName)
        logging.debug('{}: parse pcap file complete, {} records was found!'.format(sys._getframe().f_code.co_name, len(deviceInfos)))
        print('{}: parse pcap file complete, {} records was found!'.format(sys._getframe().f_code.co_name, len(deviceInfos)))
        # 发射数据包解析完成信号
        self.breakSignal.emit(deviceInfos)
        # 显示数据包解析完成的信息
        self.myWin.statusBar().showMessage('pcap文件解析完毕！')



# 实时解析数据包的线程类
class ParseRealTime(QThread):
    breakSignal = pyqtSignal(list)
    def __init__(self, myWin:MyMainWindow):
        super(ParseRealTime, self).__init__()
        self.myWin = myWin
        
        
    def run(self):
        interface = self.myWin.interfaceSelecter.currentText().split()[0]
        # 监听在interface接口，filter指定了数据包过滤语句，prn指定了数据包处理方法
        scapy.sniff(iface=interface, filter="tcp dst port 80", prn=self.parse_pkt)
        
    # 解析数据包的方法
    def parse_pkt(self, pkt):
        # 如果数据包含有httprequest层，就执行下列操作（由于位置信息被ssl加密，能获取的，只有http请求中的user-agent头信息，提取该信息即可)
        if pkt.haslayer("HTTPRequest"):
            #logging.debug(pkt.show())
            res = defaultdict(str)
            #logging.info('ip addr : {}'.format(pkt['IP'].src))
            header = str(pkt['HTTPRequest'].fields['Headers'])
            headers = {item.split(':')[0]: item.split(':')[1] for item in header.split(r'\r\n')}
            try:
                os_info = re.split(r'[()]', headers['User-Agent'])
            except KeyError:
                logging.info(headers)
                return
            if len(os_info) == 1:
                res['OS: '] = os_info[0]
            else:
                try:
                    res['IP '] = pkt['IP'].src
                    res['MAC '] = pkt['Ether'].src
                    res['OS '] = os_info[1].strip()
                    res['webkit '] = os_info[2].strip()
                    res['client '] = os_info[4].strip()
                except IndexError:
                    logging.info(os_info)
            logging.info(res)
            self.breakSignal.emit([res])
        else:
            return None

# 存储数据的线程类
class StoreData(QThread):
    breakSignal = pyqtSignal(str)
    def __init__(self, myWin:MyMainWindow):
        super(StoreData, self).__init__()
        self.myWin = myWin
    
    def run(self):
        host = self.myWin.addressLineEdit.text()
        if not host:
            host = 'localhost'
        self.breakSignal.emit('数据存储中......')
        storeDeviceInfo(host, self.myWin.deviceInfo)
        self.breakSignal.emit('数据存储完成!')
    
# 存储数据到数据库
def storeDeviceInfo(host, deviceinfo):
    dbconn = MySQLdb.connect(host, 'xiaozhi', 'wodemima', 'snifferdb')
    cursor = dbconn.cursor()
    sql_template = "insert into sniffer(IP,MAC,OS,client,webkit) values('{}', '{}', '{}', '{}','{}')"
    for device in deviceinfo:
        query_str = sql_template.format(device['IP '], device['MAC '], device['OS '], device['client '], device['webkit '])
        cursor.execute(query_str)
    dbconn.commit()
    dbconn.close()

# 查询数据的线程类
class QueryData(QThread):
    breakSignal = pyqtSignal(list)
    msgSignal = pyqtSignal(str)
    def __init__(self, myWin:MyMainWindow):
        super(QueryData, self).__init__()
        self.myWin = myWin
    
    def run(self):
        host = self.myWin.addressLineEdit.text()
        if not host:
            host = 'localhost'
        self.msgSignal.emit('正在查询数据......')
        results = queryDeviceInfo(host)
        self.msgSignal.emit('查询数据成功')
        self.breakSignal.emit(results)

# 查询设备信息
def queryDeviceInfo(host):
    dbconn = MySQLdb.connect(host, 'xiaozhi', 'wodemima', 'snifferdb')
    cursor = dbconn.cursor()
    query_str = "select * from sniffer"
    cursor.execute(query_str)
    results = cursor.fetchall()
    resdev = []
    for row in results:
        res = defaultdict(str)
        logging.info(row)
        res['IP '] = row[1]
        res['MAC '] = row[2]
        res['OS '] = row[3]
        if len(row) == 6:           
            res['client '] = row[4]
            res['webkit '] = row[5]
        resdev.append(res)
    return resdev


# 应用程序启动代码
if __name__ == '__main__':
    app = QApplication(sys.argv)
    myWin = MyMainWindow()
    myWin.setFixedSize(myWin.width(), myWin.height())
    myWin.analyseBtn.clicked.connect(myWin.parsePcapFile)
    myWin.startListenBtn.clicked.connect(myWin.parseForever)
    myWin.storeBtn.clicked.connect(myWin.storeData)
    myWin.readRecordBtn.clicked.connect(myWin.queryData)
    
    myWin.show()
    sys.exit(app.exec_())
```

### 解析

使用python编写简单的qt程序，一般先使用qtdesigner设计窗口的界面，在界面设计完成后，使用pyuic命令，将ui文件转换为py源代码，随后在编写类继承该类，添加需要的事件处理机制。如果有需要，最后使用pyinstaller打包程序。