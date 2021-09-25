---
title: Ubuntu基础操作
date: 2020-06-12 11:42:54
categories:
- Ubuntu
tags:
- Ubuntu
---

> 系统版本：ubuntu-18.04.4-live-server

## root用户

### sudo -i

默认情况下，系统安装之后只能以普通用户的方式登录，然后通过`sudo`命令执行一些超级权限命令。不过我们可以通过输入如下命令切换到root用户

``` bash
sudo -i
```

然后输入当前用户的密码就可以进入到root用户

## root登录

要使用root用户登录，需要先设置root用户密码

``` bash
sudo passwd root
```

根据提示输入root用户的密码并确认即可
现在通过`su`命令输入密码就可以切换到root用户

## ssh远程登录

Ubuntu默认是不支持ssh远程连接的，如果要支持ssh我们需要先安装`openssh-server`

### 安装`openssh-server`

``` bash
sudo apt install openssh-server
```

正常安装好`openssh-server`之后，就可以用普通用户的身份进行远程连接了

### 远程连接示例

> 假设目标主机的
>
> * ip为`192.168.222.133`
> * 用户名为`cnbank`

执行如下命令即可实现远程连接

``` bash
ssh cnbank@192.168.222.133
```

> *如果前面已经设置了root用户的密码，试试通过root用户远程连接，是不是不能登录？*

### 启用root用户远程连接

上述简单操作之后，可以实现以普通用户的身份进行远程登录，但是无法实现以root用户的身份登录，如果要实现root用户连接还需要做一点配置修改

* **修改ssh配置文件**

``` bash
sudo vim /etc/ssh/sshd_config
```

找到`PermitRootLogin`配置项，取消注释并修改参数值为`yes`，保存配置文件

> * `vi`、`vim`命令打开文本后，输入`i`可进入编辑模式，`:q`可退出
> * 编辑文本后，点击`ESC`退出编辑模式，输入`:wq`命令可保存并退出，`:q!`强制退出不保存文本

* **重启ssh服务**

``` bash
sudo service ssh restart
```

现在目标主机就支持root用户远程连接了。

## 相关链接

[Ubuntu 启用允许ssh远程登录root用户](https://www.jianshu.com/p/0e69b4e73a8c 'Ubuntu 启用允许ssh远程登录root用户')
