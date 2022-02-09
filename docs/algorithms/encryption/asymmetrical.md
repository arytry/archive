# 非对称加密

与对称加密不同的是，非对称加密需要两把密钥（公钥和私钥）

::: warning 备注
并不是只会通过公钥加密私钥解密。在数字签名中刚好相反，是通过私钥加密公钥解密
:::

## RSA

`RSA`是非对称加密中比较常用的方式

## 数字签名

数字签名是一个带有密钥的消息摘要算法，这个密钥包括了公钥和私钥，用于验证数据完整性、认证数据来源和抗否认，遵循OSI参考模型、`私钥签名`和`公钥验证`。也是非对称加密算法和消息摘要算法的结合体，常见的数字签名算法主要有RSA、DSA、ECDSA三种，本文对数字签名算法进行详细介绍。

![数字签名](/assets/img/algorithms/digital-signature.png "数字签名")

生成密钥对

```csharp
/// <summary>
/// Get public key and private key.
/// </summary>
public (string privateKey, string publicKey) GetKeyFromContainer(string containerName)
{
    // 如果是分开生成公钥和私钥，通过指定相同的containerName保持一致性
    // 如果是同时生成公钥和私钥，可以不提供<seealso cref="CspParameters"/>参数
    //var cp = new CspParameters
    //{
    //    KeyContainerName = containerName
    //};
    //var rsa = new RSACryptoServiceProvider(cp);

    var rsa = new RSACryptoServiceProvider();
    return (rsa.ToXmlString(true), rsa.ToXmlString(false));
}
```

```csharp
public byte[] EncryptHash(string privateKey, byte[] fileHash)
{
    var rsa = new RSACryptoServiceProvider();
    rsa.FromXmlString(privateKey);

    var rsaFormatter = new RSAPKCS1SignatureFormatter(rsa);
    rsaFormatter.SetHashAlgorithm("MD5");

    return rsaFormatter.CreateSignature(fileHash);
}
```

```csharp
public bool DecryptHash(string publicKey, byte[] fileHash, byte[] electronicSignature)
{
    var rsa = new RSACryptoServiceProvider();
    rsa.FromXmlString(publicKey);

    var rsaDeformatter = new RSAPKCS1SignatureDeformatter(rsa);
    rsaDeformatter.SetHashAlgorithm("MD5");

    return rsaDeformatter.VerifySignature(fileHash, electronicSignature);
}
```
