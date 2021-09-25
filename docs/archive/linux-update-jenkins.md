---
title: linux下更新jenkins
date: 2020-09-22 16:29:59
categories:
- jenkins
tags:
- jenkins
---

> *本操作基于Ubuntu的Linux环境进行*

在Jenkins有新的更新时，我们在Jenkins的管理Jenkins（Manage Jenkins）功能页应该是会有提示新版本更新的。

更新其实很简单，就是替换新版本的`.war`文件即可。

## war路径

一般情况下，war的安装路径在`/usr/share/jenkins`目录下，可以通过`管理Jenkins(Manage Jenkins)`——>`状态信息(Status Information)`——>`系统信息(System Information)`查找`.war`文件。

|  名称⬇  | 值  |
|  ----  | ----  |
| executable-war  | /usr/share/jenkins/jenkins.war |
| ... | ... |
| java.class.path  | /usr/share/jenkins/jenkins.war |

## war替换

> ***替换文件之前请记得对原文件做备份操作，以防万一***

先进入war目录备份原文件，以防万一

``` bash
# 进入.war目录
cd /usr/share/jenkins
# 修改原文件名
mv jenkins.war jenkins.war.back
```

在Jenkins的管理页会有官网下载路径（如果有更新），我们可以直接下载该文件。由于大家都懂的原因，如果没有速度可以通过三方镜像下载，这里就不提供链接，大家自行搜索吧。

这里要说的主要是替换方式。

- Ubuntu系统可以使用`wget`直接下载

``` bash
# 路径请自行替换最新版本
wget https://updates.jenkins-ci.org/download/war/2.46.3/jenkins.war
```

- 如果Linux环境下载太慢，可以先下载到本地，然后通过winscp等软件上传到Linux环境的`.war`文件目录下进行替换

## 重启Jenkins

文件替换后，我们还需要重启Jenkins服务才能生效

重启Jenkins服务可以通过Jenkins自带的方式，也可以使用Linux命令

### Jenkins自带方式

Jenkins为我们提供了通过路径请求方式实现服务的停止，启动以及重新加载配置等功能

- 关闭Jenkins服务

浏览器输入<http://192.168.222.133:8080/exit>（路径请自行替换，后面加上/exit），然后点击post提交即可

- 重启Jenkins服务

浏览器输入<http://192.168.222.133:8080/restart>

- 重新加载Jenkins配置

> *升级Jenkins无需进行此操作，这里只是备注*

<http://192.168.222.133:8080/reload>

### Linux命令

```bash
# 重启服务
service jenkins restart

# 查看状态
service jenkins status
```

## 相关链接

[Jenkins技巧：如何更新Jenkins到最新版本](https://www.cnblogs.com/dzblog/p/6962000.html 'Jenkins技巧：如何更新Jenkins到最新版本')
[Jenkins的关闭、重启](https://blog.csdn.net/itfootball/article/details/44876517 'Jenkins的关闭、重启')
