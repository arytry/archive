# docker安装portainer

`portainer`是管理docker容器和镜像的可视化工具

## 安装运行

目前docker中的`portainer`包含CE和EE两个版本，我们拉取免费的CE版即可

```bash
docker pull portainer/portainer-ce
```

运行容器

```bash
docker run -d --name=portainer \
    -p 8000:8000 -p 9000:9000 \
    --restart=always \
    -v /var/run/docker.sock:/var/run/docker.sock \
    portainer/portainer-ce
```

然后访问`http://宿主机ip:9000`地址就可以打开portainer管理界面，首次登录需要设置登录密码

登录成功后系统默认为我们推荐了`local`环境，只需要点击进入即可管理本机docker

## 连接管理

如果只需要管理本机docker，可以直接选择`local`即可

如果还需要管理远程主机docker，那么首先需要开启**远程主机docker的2375端口**

### 开启docker远程端口

#### 修改docker.service

```bash
vim /lib/systemd/system/docker.service

# 找到ExecStart参数并替换为下面代码
ExecStart=/usr/bin/dockerd -H unix:///var/run/docker.sock -H tcp://0.0.0.0:2375
```

::: tip 提示
实际有三种方法可以修改，具体实现方式可自行Google
:::

::: danger 风险
`ExecStart`公开2375端口意味着放开了RemoteApi权限，有病毒注入风险
:::

#### 重启docker服务

```bash
systemctl daemon-reload
systemctl restart docker
```

### 远程连接

访问portainer，选择左侧菜单`environments`，然后点击添加环境，`Environment type`选择`Docker`

* `Name` docker名称，管理列表中展示管理
* `Environment URL` 远程docker地址，端口默认是`2375`

::: warning 备注
`portainer`不同版本命名有差异，本教程以当前最新版本`2.9.2`为准
:::
