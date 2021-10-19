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

## 配置管理
