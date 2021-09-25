---
title: Docker常用命令
date: 2020-05-14 12:26:49
categories:
- Docker
tags:
- Docker
---

## 安装/运行

### 查找镜像

``` bash
docker search <image_name>
```

* `image_name` 镜像名称

``` bash
# 查找helloword镜像
docker search helloworld
```

### 拉取镜像到本地

``` bash
docker pull <image_name><:tag>
```

* `image_name` 镜像名称。
* `:tag` 镜像标签，表示拉取指定tag的镜像，比如`image_name:1.0`，默认为`latest`

``` bash
# 拉取最新的helloworld镜像
docker pull helloworld:latest
```

### 运行容器

``` bash
docker run -itd -rm --name <container_name> -p 80:80 <image_name>
```

* `--name container_name` 容器命名为`<container_name>`
* `-rm` 容器在退出时自动删除
* `-d` 后台运行容器，并返回容器ID
* `_e` 设置容器参数（环境变量）
* `-p 80:80` 将本地计算机上的端口`80`映射到容器中的端口`80`
* `-v xx:xxx` 将本地路径绑定到容器中的路径
* `image_name` 镜像名称

#### 示例一

``` bash
# 运行helloworld镜像，这里没有指定--name，系统将随机命名容器
docker run helloworld
```

#### 示例二

``` bash
# --name alsync.web 容器命名为alsync.web
# -rm 容器在退出时自动删除
# -d 后台运行
# -p 5000:80 将本地计算机上的端口 5000 映射到容器中的端口 80
docker run -it --rm -p 5000:80 --name alsync.web alsync.web
```

## 显示容器/镜像

### 显示容器

``` bash
docker ps <-a|-q|-aq>
```

* `-a` 显示所有的容器，包括未运行的
* `-q` 静默模式，只显示容器编号

``` bash
# 显示所有的容器，默认为运行中的
docker ps
```

``` bash
# 显示所有的容器，包括未运行的
docker ps -a
```

``` bash
# 显示所有容器的编号
docker ps -aq
```

### 显示镜像

``` bash
docker images
```

## 启动/停止容器

``` bash
docker start/stop <container>
```

* `container` 容器名称或者容器ID

### 批量启动所有容器

``` bash
docker start $(docker ps -a | awk '{ print $1}' | tail -n +2)
```

### 批量停止所有容器

``` bash
docker stop $(docker ps -a | awk '{ print $1}' | tail -n +2)
```

## 删除容器/镜像

### 删除容器

``` bash
docker rm <container>
```

* `container` 容器名称或者容器ID

### 删除所有的容器

``` bash
docker rm $(docker ps -a -q)
# 或者
docker rm $(docker ps -aq)
```

### 删除镜像

``` bash
docker rmi <image>
```

* `image` 镜像ID或者名称

### 删除所有untagged镜像

``` bash
docker rmi $(docker images | grep "^<none>" | awk "{print $3}")
```

### 删除所有镜像

``` bash
docker rmi $(docker images -q)
```

## 进入容器

部分容器有bash命令，我们还可以通过执行bash进入到容器中查看文件信息

``` bash
docker exec -it <container_name> /bin/bash
```

* `container_name` 容器名称

启动某个服务/代理

``` bash
sh <agent/services.sh> start
```

* `agent/services.sh` 服务/代理文件名

## 重启docker服务

``` bash
sudo systemctl restart docker.service # 重启docker服务
```

> *重启后所有的docker容器都退出了，需要重新启动*

## daemon.json

docker配置文件，如果刚安装完docker该文件应该是不存在的，需要手动`vi(m) daemon.json`创建，位于`/etc/docker`目录下面

``` bash
{
    # docker镜像源，官方镜像地址如果不能下载可更换
    "registry-mirrors": [
        "http://hub-mirror.c.163.com",
        "http://f1361db2.m.daocloud.io"
    ],
    "insecure-registries":["192.168.222.135:5000"],
    "log-driver": "json-file",
    "log-opts":
    {
        # 日志最大文件为10m
        "max-size": "10m",
        "max-file": "5"
    }
}

```

## 远程管理

docker支持远程管理，比如portainer连接，需要开启2375端口

### 修改docker.service

```bash
vim /lib/systemd/system/docker.service

# 找到ExecStart参数并替换为下面代码
ExecStart=/usr/bin/dockerd -H unix:///var/run/docker.sock -H tcp://0.0.0.0:2375
```

> *实际有三种方法可以修改，具体实现方式可自行Google*

### 重启

```bash
systemctl daemon-reload
systemctl restart docker
```

## 相关链接

* [Docker命令大全](https://www.runoob.com/docker/docker-command-manual.html 'Docker命令大全')
* [Docker删除容器与镜像](https://blog.csdn.net/qq_32447301/article/details/79387649 'Docker删除容器与镜像')
