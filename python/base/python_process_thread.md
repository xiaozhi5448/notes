# 五、多线程与多进程



1. 进程
    进程的概念是需要理解的，进程是操作系统中正在运行的一个程序实例，操作系统通过进程操作原语来对其进行调度。操作系统得到调用某个进程指令时，将硬盘上的程序调入内存，分配空间，初始化进程堆栈，然后进程开始运行。有时候我们有同时运行多个程序的需求，如果你的电脑只能做一件事，那是一件很抓狂的事。操作系统通过进程调度算法调度进程运行，使计算机看起来同时运行了很多程序。
2. python中多进程实现
    - fork，fork是linux下创建新进程的机制，通过fork父进程复制出一个相似，通过fork返回值判断执行子进程代码
      ```python
       import os
       def main():
           print 'current Process {} start...'.format(os.getpid())
           pid = os.fork()
           if pid < 0:
               print 'fork error!'
               exit(1)
           elif pid == 0:
               print 'child Process {} starting... , and my parent process is {}'.format(os.getpid(), os.getppid())
       
           else:
               print 'I({}) created the child({})'.format(os.getpid(), pid)
       if __name__ == '__main__':
               main()
      ```
      得到如下输出
      ```python
      current Process 5351 start...
      I(5351) created the child(5352)
      child Process 5352 starting... , and my parent process is 5351
      ```
    - 使用multiprocess模块创建子进程，模块提供一个Process对象描述进程，创建进程时，只需要传入一个可调用的函数，以及函数运行时的参数即可
      ```
       import os
       import multiprocessing
       
       
       def run_proc(name):
           print 'child process {}({}) running...'.format(name, os.getpid())
       
       def main():
           print 'main process starting... {}'.format(os.getpid())
           processes = []
           for i in range(5):
               p = multiprocessing.Process(target=run_proc, args=(str(i),))
               processes.append(p)
               print 'process {} will start'
               p.start()
       
           for p in processes:
               p.join()
           print 'processes end'
       if __name__ == '__main__':
           main()
      ```
      - 使用进程池限制进程个数。multiprocessing模块中的Pool对象，用来表示进程池，Pool对象的apply_async函数用于创建进程，同样的给出可调用的函数与函数运行需要的参数
        ```
         import os
         from multiprocessing import Pool
         
         def run_proc(name):
             print 'child process {}({}) running...'.format(name, os.getpid())
         
         def main():
             print 'main process starting... {}'.format(os.getpid())
             processes = Pool(processes=3)
             for i in range(5):
                 processes.apply_async(run_proc,(str(i),))
             processes.close()
             processes.join()
         
         
             print 'processes end'
         if __name__ == '__main__':
             main()
        ```
    - 进程间通信
      - 通过队列。
        队列，即multiprocessing模块中的Queue对象，队列中有某种资源，可以向队列中放入数据，另一个进程从队列中取出数据，当无数据可用时，消费者应该决定是阻塞等待资源还是返回一个错误，当队列已满，生产者应决定是阻塞等待可用空间还是返回错误。Queue对象有两个主要方法，get和put，get从队列中取出数据，put向队列中添加数据。blocked参数决定当队列不满足条件时是阻塞等待还是返回错误，默认为True，表示阻塞等待。timeout指定了队列阻塞的时间，如果超时，同样返回异常
        ```
         from multiprocessing import Queue, Process
         import os, time, random
         
         def Proc_writer(q, urls):
             print 'Process {} is writing...'.format(os.getpid())
             for url in urls:
                 q.put(url)
                 print 'put {} to the Queue'.format(url)
                 time.sleep(random.random())
         
         def Proc_reader(q):
             print 'Process {} is reading...'.format(os.getpid())
             while True:
                 url = q.get(True)
                 print 'get the {} from the Queue'.format(url)
         
         def main():
             print 'main process {} is running...'.format(os.getpid())
             q = Queue()
             process_1 = Process(target=Proc_writer, args=(q,['url_1', 'url_2', 'url_3']))
             process_2 = Process(target=Proc_writer, args=(q,['url_4', 'url_5', 'url_6']))
             process_3 = Process(target=Proc_reader, args=(q,))
             process_1.start()
             process_2.start()
             process_3.start()
             process_1.join()
             process_2.join()
             process_3.terminate()
             print 'done'
         
         
         if __name__ == '__main__':
             main()
        
        ```
      - 通过管道
        multiprocessing模块的Pipe方法，返回一个二元组（conn1，conn2），Pipe方法有一个duplex参数，为True时代表管道连接是全双工的，为False时代表管道连接是单方向的，只能由conn2发送到conn1。send和recv方法用于发送与接受消息，如果没有消息可接受，recv阻塞，如果管道关闭，recv会抛出EOFError
        ```python
         import multiprocessing
        import os, time, random
         
        def proc_send(pipe, urls):
             print 'process {} is read to send urls'.format(os.getpid())
            for url in urls:
                 pipe.send(url)
                print 'process {}: send {}'.format(os.getpid(), url)
                 time.sleep(random.random())
         
        def proc_recv(pipe):
            print 'process {} is ready to recv urls'.format(os.getpid())
            while True:
                print 'process {}: recv {}'.format(os.getpid(), pipe.recv())
                time.sleep(random.random())
         
         def main():
             pipe = multiprocessing.Pipe()
             process_send = multiprocessing.Process(
                 target=proc_send,
                 args=(pipe[0], ['url_' + str(i) for i in range(10)]))
             process_recv = multiprocessing.Process(
                 target=proc_recv,
                 args=(pipe[1],)
             )
             process_send.start()
             process_recv.start()
             process_send.join()
             process_recv.join()
             print 'done'
         
         if __name__ == '__main__':
             main()
        ```
    - 分布式多进程
      分布式也是一个比较重要的概念，通过将负载高的计算分摊到多台计算机上来提高系统性能。使用python完成分布式计算功能是简单的。需要用到的一个数据结构是队列，联想一下操作系统中的生产者消费者模型，一些进程放入数据，一些进程取出数据。程序开始需要在服务端维护一个网络队列管理器，服务端程序注册操作网络队列的方法，随后使用该方法从网络上获取队列，对该队列的操作，对网络上的其他进程是可见的。队列的put和get方法用于放入取出数据，注意服务端和客户端注册的接口方法需统一。
      使用multiprocessing子模块managers管理网络队列，其中的BaseManager类是一个基本的管理器，新建类继承该类。使用该类的register方法注册操作队列的方法，随后监听信道。如下例程
      server
      ```
       #!/usr/bin/env python
       import Queue
       from multiprocessing.managers import BaseManager
       
       # 创建队列实体
       task_queue = Queue.Queue()
       result_queue = Queue.Queue()
       
       class Queuemanager(BaseManager):
           pass
       
       # 注册方法
       print 'register the func'
       Queuemanager.register('get_task_queue', callable=lambda:task_queue)
       Queuemanager.register('get_result_queue', callable=lambda:result_queue)
       
       # 创建manager对象
       print 'initialing the task manager'
       manager = Queuemanager(address=('192.168.56.1', 8000), authkey='password')
       
       # 开始监听
       manager.start()
       # 从网络得到队列
       print 'get the queue from network...'
       task = manager.get_task_queue()
       result = manager.get_result_queue()
       # 向队列中放入数据等待处理
       print 'put urls to the task queue'
       for url in ['ImageUrl_' + str(i) for i in range(10)]:
           print 'put {} in task'.format(url)
           task.put(url)
       # 从队列中取出数据，阻塞等待
       for i in range(10):
           print 'result is {}'.format(result.get())
       
       manager.shutdown()
      ```
      client
      ```
            #!/usr/bin/env python
      from multiprocessing.managers import BaseManager
      import Queue
      
      
      class Queuemanager(BaseManager):
          pass
      
      Queuemanager.register('get_task_queue')
      Queuemanager.register('get_result_queue')
      
      server = '192.168.56.1'
      port = 8000
      key = 'password'
      print 'try to connect to {}'.format(server)
      manager = Queuemanager(address=(server, port), authkey=key)
      manager.connect()
      
      task = manager.get_task_queue()
      result = manager.get_result_queue()
      
      while not task.empty():
          image_url = task.get(True, timeout=10)
          print 'run task download {}'.format(image_url)
          result.put(image_url + '------>completed!')
      
      print 'worker exit!'
      ```

3. 线程
    线程是一个存在于进程中的概念，用于在进程中并行完成不同的工作。线程与进程的不同另做介绍
4. python中的多线程
    - threading推荐使用的多线程模块
      threading中的模块对象
      ![](https://upload-images.jianshu.io/upload_images/10339396-db94b1ac2597e6c2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      threading中的常见方法
      ![](https://upload-images.jianshu.io/upload_images/10339396-beb9d59aeef3d735.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

      Thread类
      ![](https://upload-images.jianshu.io/upload_images/10339396-e2542ecc8aa6022f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
      初始化一个thread类来创建一个线程，我们可以
        - 初始化Thread类，传入我们要运行的函数与参数
        - 初始化Thread类，传入可调用对象，比如自定义可调用类
        - 创建类继承Thread，覆盖run函数
    - threading模块实例
      直接使用thread类
      ```
      #!/usr/bin/env python
      import threading
      from time import ctime, sleep
      ```


      secLoop = [6, 4]
      def loop(sec, i):
          print 'loop', i, 'start at', ctime()
          sleep(sec)
          print 'loop', i, 'finished at', ctime()


      def main():
          nloop = range(len(secLoop))
          threads = []
          for i in nloop:
              threads.append(threading.Thread(target=loop, args=(secLoop[i], i)))
    
          for i in nloop:
              threads[i].start()
    
          for i in nloop:
              threads[i].join()
    
      if __name__ == '__main__':
          main()
      ```
      自定义可调用类
      ```
      import threading
      from time import ctime, sleep


~~~python
  secLoop = [6, 4]
  def loop(sec, i):
      print 'loop', i, 'start at', ctime()
      sleep(sec)
      print 'loop', i, 'finished at', ctime()

  class ThreadFunc(object):
      def __init__(self, func, args):
          self.func = func
          self.args = args

      def __call__(self):
          apply(self.func,self.args)

  def main():
      nloop = range(len(secLoop))
      threads = []
      for i in nloop:
          threads.append(threading.Thread(target=ThreadFunc(loop,(secLoop[i],i))))

      for i in nloop:
          threads[i].start()

      for i in nloop:
          threads[i].join()

  if __name__ == '__main__':
      main()
  ```
~~~
