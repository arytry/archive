# 链表反转

## 单链表

很多公司的面试题库中都有这道题，有的公司明确题目要求不能使用额外的节点存储空间，有的没有明确说明，但是如果面试者使用了额外的节点存储空间做中转，会得到一个比较低的分数。如何在不使用额外存储节点的情况下使一个单链表的所有节点逆序？我们先用迭代循环的思想来分析这个问题，链表的初始状态如图所示：

![初始状态](/assets/img/linked-node-reverse-1.jpg "初始状态")

初始状态，prev是NULL，head指向当前的头节点A，next指向A节点的下一个节点B。首先从A节点开始逆序，将A节点的next指针指向prev，因为prev的当前值是NULL，所以A节点就从链表中脱离出来了，然后移动head和next指针，使它们分别指向B节点和B的下一个节点C（因为当前的next已经指向B节点了，因此修改A节点的next指针不会导致链表丢失）。逆向节点A之后，链表的状态如图所示：

![第一次迭代](/assets/img/linked-node-reverse-2.jpg "第一次迭代")

从初始状态到第一次迭代状态共做了四个操作，这四个操作的伪代码如下：

```c#
head.next = prev;
prev = head;
head = next;
next = next.next;
```

这四行伪代码就是循环算法的迭代体了，现在用这个迭代体对第一次迭代的状态再进行一轮迭代，就得到了如下的状态：

![第二次迭代](/assets/img/linked-node-reverse-3.jpg "第二次迭代")

那么循环终止条件呢？现在对第二次迭代的状态再迭代一次得到如下的状态：

![第三次迭代](/assets/img/linked-node-reverse-4.jpg "第三次迭代")

此时可以看出，在第三次迭代的基础上再进行一次迭代就可以完成链表的逆序，因此循环迭代的终止条件就是当前的head指针是NULL。

现在来总结一下，循环的初始条件是：

```c#
prev = null;
```

循环迭代体是：

```c#
head.next = prev;
prev = head;
head = next;
next = next.next;
```

循环终止条件是：

```c#
head = null;
```

根据以上分析结果，逆序单链表的循环算法如下所示：

```java
/// <summary>
/// 定义一个链表结构体
/// </summary>
class Node
{
    public int Id { get; set; }

    public Node Next { get; set; }
}

/// <summary>
/// 链表结构逆序算法
/// </summary>
/// <param name="head"></param>
Node Reverse(Node head)
{
    Node prev = null;
    var next = head.Next;
    while (head != null)
    {
        //改变head的next节点
        head.Next = prev;
        prev = head;
        head = next;
        //最后一次循环时，head为null，next已经为null，所以next.next不存在，需要判断
        next = next?.Next;
    }
}
```

::: tip 总结
需要三个变量才能保证迭代后的所有信息不会丢失，通过图片其实已经能够很好的理解到原理
:::

## 相关链接

[单链表逆序](https://blog.csdn.net/autumn20080101/article/details/7607148 '单链表逆序')
