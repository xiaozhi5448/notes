# numpy

## 数组创建与元素选择

### 创建

#### 使用array

![1565577157909](/home/xiaozhi/Documents/notes/python/deeplearn/assets/1565577157909.png)

传入列表或元组对象皆可

![1565577219742](/home/xiaozhi/Documents/notes/python/deeplearn/assets/1565577219742.png)

#### arange

![1565577272387](/home/xiaozhi/Documents/notes/python/deeplearn/assets/1565577272387.png)

#### linspace

![1565577329456](/home/xiaozhi/Documents/notes/python/deeplearn/assets/1565577329456.png)

### 元素获取

#### 数组切片

```python
In [129]: a                                                                                                         
Out[129]: 
array([[11, 12, 13, 14, 15],
       [16, 17, 18, 19, 20],
       [21, 22, 23, 24, 25],
       [26, 27, 28, 29, 30],
       [31, 32, 33, 34, 35]])

In [130]: a[2,2]                                                                                                    
Out[130]: 23

In [131]: a[0, 1:4]                                                                                                 
Out[131]: array([12, 13, 14])

In [132]: a[1:4, 0]                                                                                                 
Out[132]: array([16, 21, 26])

In [133]: a[::2,::2]                                                                                                
Out[133]: 
array([[11, 13, 15],
       [21, 23, 25],
       [31, 33, 35]])

In [134]: a[:,1]                                                                                                    
Out[134]: array([12, 17, 22, 27, 32])

```

## 数组属性

包括dtype，size，shape，itemsize，ndim，nbytes

```python
In [135]: a.dtype                                                                                                   
Out[135]: dtype('int64')

In [136]: a.size                                                                                                    
Out[136]: 25

In [137]: a.shape                                                                                                   
Out[137]: (5, 5)

In [138]: a.itemsize                                                                                                
Out[138]: 8

In [139]: a.ndim                                                                                                    
Out[139]: 2

In [140]: a.nbytes                                                                                                  
Out[140]: 200
```

## 数组运算

+，-，×，/都表示数组中对应元素的计算



## numpy中的关键函数

reshape

sum

min

max

cumsum

copy

argmax

tile

sort

argsort