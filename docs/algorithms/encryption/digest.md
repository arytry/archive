# 摘要算法

## 概述

摘要算法又称**哈希算法**、**散列算法**。它通过一个函数，把任意长度的数据转换为一个长度固定的数据串（通常用16进制的字符串表示）

这个过程是不可逆的，因此严格意义上来说**摘要算法不属于加密算法**

常见的摘要算法有MD5、SHA1等

## MD5

MD5（Message Digest Algorithm 5）中文名为`消息摘要算法第五版`

```c#
public string MD5Hash(byte[] bytes)
{
    var hash = MD5.Create();
    var hashBytes = hash.ComputeHash(bytes);
    // 转换为十六进制字符串
    var hashHex = BitConverter.ToString(hashBytes)
        .Replace("-", string.Empty);
    return hashHex;
}
```

## SHA1

```c#
public string MD5Hash(byte[] bytes)
{
    var hash = SHA1.Create();
    var hashBytes = hash.ComputeHash(bytes);
    // 转换为十六进制字符串
    var hashHex = BitConverter.ToString(hashBytes)
        .Replace("-", string.Empty);
    return hashHex;
}
```

::: details 小技巧
以下两种方式都可以将字节数组转换为十六进制字符串
```c#
var hashHex = BitConverter.ToString(hashBytes)
    .Replace("-", string.Empty);
```

```c#
var hashHex = hashBytes.Aggregate(string.Empty,
    (current, next) => $"{current}{next:X2}");
```
:::