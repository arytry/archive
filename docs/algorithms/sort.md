# 排序算法

十种常见排序算法可以分为两大类：

1. 比较类排序：通过比较来决定元素间的相对次序，由于其时间复杂度不能突破O(nlogn)，因此也称为非线性时间比较类排序。

2. 非比较类排序：不通过比较来决定元素间的相对次序，它可以突破基于比较排序的时间下界，以线性时间运行，因此也称为线性时间非比较类排序。

![排序算法](/assets/img/sort/classify.png "排序算法")

算法复杂度比较

<!--
 | 排序方法 | 时间复杂度（平均） | 时间复杂度（最坏） | 时间复杂度（最好） | 空间复杂度 | 稳定性 |
 | :------: | :----------------: | :----------------: | :----------------: | :--------: | :----: |
 | 插入排序 |       O(n^2)       |       O(n^2)       |        O(n)        |    O(1)    |  稳定  |
-->

![算法复杂度](/assets/img/sort/algorithmic-complexity.png "算法复杂度")

* 稳定：如果a原本在b前面，而a=b，排序之后a仍然在b的前面。
* 不稳定：如果a原本在b的前面，而a=b，排序之后 a 可能会出现在 b 的后面。
* 时间复杂度：对排序数据的总的操作次数。反映当n变化时，操作次数呈现什么规律。
* 空间复杂度：是指算法在计算机内执行时所需存储空间的度量，它也是数据规模n的函数。

## 冒泡排序（Bubble Sort）

冒泡排序是一种简单的排序算法。它重复地走访过要排序的数列，一次比较两个元素，如果它们的顺序错误就把它们交换过来。走访数列的工作是重复地进行直到没有再需要交换，也就是说该数列已经排序完成。这个算法的名字由来是因为越小的元素会经由交换慢慢“浮”到数列的顶端。

### 操作步骤

1. 比较相邻的元素。如果第一个比第二个大，就交换它们两个；
2. 对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对，这样在最后的元素应该会是最大的数；
3. 针对所有的元素重复以上的步骤，除了最后一个；
4. 重复步骤1~3，直到排序完成。

### 动图演示

![动图演示](/assets/img/sort/bubble-sort.gif "动图演示")

### 代码实现

```js
function bubbleSort(arr) {
    var len = arr.length;
    for(var i = 0; i < len - 1; i++) {
        for(var j = 0; j < len - 1 - i; j++) {
            if(arr[j] > arr[j+1]) {       // 相邻元素两两对比
                var temp = arr[j+1];       // 元素交换
                arr[j+1] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}
```

## 相关链接

* [十大经典排序算法（动图演示）](https://www.cnblogs.com/onepixel/articles/7674659.html '十大经典排序算法（动图演示）')