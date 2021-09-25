---
# title: docker nginx添加端口映射
home: false
date: 2020-08-23 23:21:26
categories:
- nginx
- docker nginx
tags:
- nginx
---

# docker nginx添加端口映射

::: tip 提示
**一般我们通过docker运行nginx容器的时候，都只会将`80`或者`443`端口映射到宿主机，因为不知道后期在实现反向代理的时候具体会指定什么端口号，所以大部分时候会在后期修改端口映射**
:::

假如在运行容器时执行的命令如下

``` bash
# -p 80:80  端口映射：容器80端口映射到宿主机的80端口
docker run --name nginx -p 80:80 -v /etc/nginx/conf.d:/etc/nginx/conf.d -d nginx
```

如果我们想实现反向代理，代理监听端口只有80端口才能被访问，因为非80端口没有做宿主机映射，即便实现了反向代理，外部也不能通过该端口访问到容器内的代理地址。如果需要被外部访问，可以有以下几种方式：

## 移除容器然后添加端口映射重新运行

``` bash
# 停止容器。删除容器之前必需先停止
docker stop nginx

docker rm nginx

# -p 9797:9797  假设9797就是我们实现反向代理需要监听的端口
docker run --name nginx -p 80:80 -p 9797:9797 -v /etc/nginx/conf.d:/etc/nginx/conf.d -d nginx
```

## 修改容器配置添加端口映射

> *此操作步骤同[docker容器端口映射](/docker-container-nat)*

### 首先找到容器ID

执行命令

``` bash
# nginx 容器名称
docker inspect nginx

# 或者

docker ps
```

输出

``` json
[
    {
        "Id": "c7d153b66564a7cb2157d8582d4018d60882ac144192174e92302f1c8c380b43", // hash_of_the_container
        "Created": "2020-08-21T09:41:36.597993005Z",
        "Path": "/docker-entrypoint.sh",
        "Args": [
            "nginx",
            "-g",
            "daemon off;"
        ],
        "State": {
...

// 或者

CONTAINER ID        IMAGE          ...        NAMES
c7d153b66564        nginx          ...        nginx
```

### 停止容器

> **修改之前一定要先停掉容器，否则自动还原**

``` bash
docker stop nginx
```

### 修改配置文件`hostconfig.json`和`config.v2.json`

容器路径一般在`/var/lib/docker/containers/`目录下面

``` bash
cd /var/lib/docker/containers/c7d153b66564a7cb2157d8582d4018d60882ac144192174e92302f1c8c380b43 # container id
vim hostconfig.json
```

找到如下配置节点

``` json
"PortBindings":{
    "80/tcp":[
        {
            "HostIp": "",
            "HostPort": "80"
        }
    ]
}
...
```

键盘按下`i`切换为文本输入模式，添加映射端口

``` json
"PortBindings":{
    "80/tcp":[
        {
            "HostIp": "",
            "HostPort": "80"
        }
    ],
    "9797/tcp":[
        {
            "HostIp": "",
            "HostPort": "9797"
        }
    ]
}
...

```

修改完成后按下`ESC`,然后输入`:wq`保存文件并退出编辑模式

然后同路径下打开`config.v2.json`文件，找到`ExposedPorts`节点并添加映射端口

``` json
"ExposedPorts": {
    "80/tcp": {},
    "9797/tcp": {}
},
...
```

### 保存、退出、重启容器

``` bash
sudo systemctl restart docker.service # 重启docker服务
docker start nginx
```

## 相关链接

[Docker教程：使用Docker容器运行Nginx并实现反向代理](https://www.cnblogs.com/dotnet261010/p/12596185.html 'Docker教程：使用Docker容器运行Nginx并实现反向代理')

[Docker给nginx添加端口映射](https://www.cnblogs.com/chengshuai5421/p/13544614.html 'Docker给nginx添加端口映射')
