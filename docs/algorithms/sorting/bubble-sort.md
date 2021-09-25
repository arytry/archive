# 冒泡排序

## 代码实现

```js
function bubbleSort(arr) {
    varlen = arr.length;
    for(vari = 0; i < len - 1; i++) {
        for(varj = 0; j < len - 1 - i; j++) {
            if(arr[j] > arr[j+1]) {       // 相邻元素两两对比
                vartemp = arr[j+1];       // 元素交换
                arr[j+1] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}
```

## 相关链接

* [十大经典排序算法（动图演示）](https://www.jianshu.com/p/080a962c35b6 '十大经典排序算法（动图演示）')
