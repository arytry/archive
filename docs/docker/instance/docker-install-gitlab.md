---
# title: docker安装gitlab
date: 2021-01-25 18:24:22
categories:
- gitlab
tags:
- gitlab
---

# docker安装gitlab

::: warning 提示
gitlab的坑比较奇葩，如果已经了解过，可以直接查看[完整安装步骤](#完整安装配置)
:::

## 安装运行

搜索gitlab

```bash
docker search gitlab
```

拉取gitlab镜像，其中gitlab-ce为社区版，gitlab-ee为企业版，这里我们拉取社区版即可

```bash
docker pull gitlab/gitlab-ce
```

运行gitlab-ce容器

### 使用默认端口启动gitlab

```bash
docker run -d --name gitlab \
    -p 443:443 -p 80:80 -p 22:22 \
    --restart always \
    -v /srv/gitlab/etc:/etc/gitlab \
    -v /srv/gitlab/log:/var/log/gitlab \
    -v /srv/gitlab/opt:/var/opt/gitlab \
    gitlab/gitlab-ce
```

* `-v /srv/gitlab/etc:/etc/gitlab` 配置文件目录映射
* `-v /srv/gitlab/log:/var/log/gitlab` 日志文件目录映射到
* `-v /srv/gitlab/opt:/var/opt/gitlab` 数据文件目录映射

### 使用非默认端口启动gitlab（推荐）

使用默认端口我们经常会遇到以下端口占用问题，即便没有占用，一般也会预留出来：

* `80`端口为web服务的默认端口，nginx等服务都是使用的此端口；
* `22`端口为远程ssh默认端口，基本上Linux服务器都会开启

```bash
docker run -d --name gitlab \
    -p 443:443 -p 10080:80 -p 222:22 \
    --restart always \
    -v /srv/gitlab/etc:/etc/gitlab \
    -v /srv/gitlab/log:/var/log/gitlab \
    -v /srv/gitlab/opt:/var/opt/gitlab \
    gitlab/gitlab-ce
```

此时我们就可以通过访问`http://ip:10080`地址查看gitlab UI了，首次打开需要修改初始密码，默认登录账号为`root`

## 配置

### 仓库地址

默认情况下，当我们创建一个项目后，在Clone的时候显示的仓库地址为容器ID，这显然在外部是无法访问的，需要改成宿主机IP+端口才行。

* 查找gitlab.rb文件

1. 容器中查找

    如果容器没有做`配置文件`目录映射，可以进入容器修改

    ```bash
    docker exec -it gitlab /bin/bash
    ```

    容器内的`gitlab.rb`文件路径为`/etc/gitlab/gitlab.rb`

2. 宿主机查找

    如果做了`配置文件`目录映射，可以直接在宿主机中找到该文件修改即可，具体请查看`配置文件`映射目录

* 修改gitlab.rb文件

将`external_url`参数设置为外部主机地址

```bash
# 这段为原始需要修改的代码，找到该行代码修改
# external_url 'GENERATED_EXTERNAL_URL'

# 假设宿主机IP为`192.168.222.136`
# 配置http协议所使用的访问地址，这里端口号也指向内部映射端口号，所以在映射时需要指定相同的端口号
external_url 'http://192.168.222.136:10080'

# 配置ssh协议所使用的访问地址和端口
gitlab_rails['gitlab_ssh_host'] = '192.168.222.136'
gitlab_rails['gitlab_shell_ssh_port'] = 222
```

* 重启gitlab

修改gitlab.rb文件后，需要重启gitlab才会生效

```bash
docker restart gitlab
```

> *等待重启成功后再次访问`http://ip:10080`地址试试，是不是连UI都不能打开了？*

其实这是gitlab的一个坑，原因是使用非默认http端口`80`映射，如果修改`external_url`地址为`http://ip:10080`，相当于也将（容器）内部的端口号修改为`10080`了，而此时映射的端口号还是`80`，自然就无法访问了

要解决此问题只需要把映射的容器端口改为`10080`。可以通过[docker容器端口映射](/docker-container-nat/)修改容器端口号，或者直接移除容器然后重新安装启动

## 完整安装配置

* 安装启动gitlab

```bash
docker run -d --name gitlab \
    -p 443:443 -p 10080:10080 -p 222:22 \
    --restart always \
    -v /srv/gitlab/etc:/etc/gitlab \
    -v /srv/gitlab/log:/var/log/gitlab \
    -v /srv/gitlab/opt:/var/opt/gitlab \
    gitlab/gitlab-ce
```

* 修改gitlab.rb

```bash
vim /srv/gitlab/etc/gitlab.rb
```

```bash
# 配置http协议所使用的访问地址，这里端口号也指向内部映射端口号，所以在映射时需要指定相同的端口号
external_url 'http://192.168.222.136:10080'

# 配置ssh协议所使用的访问地址和端口
gitlab_rails['gitlab_ssh_host'] = '192.168.222.136'
gitlab_rails['gitlab_shell_ssh_port'] = 222
```

* 重启gitlab

```bash
docker restart gitlab
```

## 相关链接

* [docker下gitlab安装配置使用(完整版)](https://www.jianshu.com/p/080a962c35b6 'docker下gitlab安装配置使用(完整版)')

* [Docker - 解决 gitlab 容器上的项目进行 clone 时，IP 地址显示一串数字而不是正常 IP 地址的问题](https://www.cnblogs.com/poloyy/p/13968683.html 'Docker - 解决 gitlab 容器上的项目进行 clone 时，IP 地址显示一串数字而不是正常 IP 地址的问题')

* [Docker 安装 Gitlab，external_url非80端口无法访问](https://www.jianshu.com/p/230699d9c183 'Docker 安装 Gitlab，external_url非80端口无法访问')
