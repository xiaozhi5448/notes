# 七、示例

1. 检测密码强度，包括长度检测，大小写字母与数字
    ```
    def checkio(data):
    import re
    # re模块的search函数，匹配data中的partten，如果找不到匹配，则返回None
    lower = re.search('[a-z]', data)
    upper = re.search('[A-Z]', data)
    digit = re.search('[0-9]', data)
    return all((lower, upper, digit, len(data)>= 10))
    ```
2. 查找字符序列中最常出现的字母，忽略大小写，且忽略标点符号、特殊字符
    ```
     from collections import Counter
     import string
     import re
     
     def checkio(text):
         # 得到文本中的字符序列，过滤掉特殊字符
         re_letter = re.compile('[a-zA-Z]')
         text_letter = re_letter.findall(text.lower())
         # 对字符出现的次数进行统计
         c = Counter(text_letter)
         statistics_text = c.most_common()
         # 获取出现次数最多的字符出现的次数
         times = statistics_text[0][1]
         # 获取出现次数最多的字符的列表
         most_list = [statistics_text[i][0] for i in range(len(statistics_text))
                      if statistics_text[i][1] == times]
         # 忽略大小写进行排序
         most_list_sorted = sorted(most_list, key=str.lower)
         return most_list_sorted[0]
    ```
3. 删除数字列表中仅出现一次的元素
    ```
    from collections import Counter
    def checkio(data):
        counter_data = Counter(data)
        uniq_items = [i for i in data if counter_data[i] == 1]
        for i in range(len(uniq_items)):
            data.remove(uniq_items[i])
    
    return data
    ```
4. 查找字符串中敏感单词个数，或出现了哪些敏感单词
    ```
     import re
     def count_words(text, words):
         text_lower = text.lower()
         count = 0
         for word in words:
             if re.search(word, text_lower):
                 count += 1
         return count
    ```
    更简单的方法
    ```
    return sum([ w in text.lower() for w in words])
    ```