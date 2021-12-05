# docker安装rabbitmq

:::warning 说明
以下内容需要有一定的docker基础，并且需要在已经安装了`docker`环境中运行
:::

## 安装

```bash
docker pull rabbitmq
```

这样默认拉取的是`latest`版本，该版本默认没有管理界面，如果需要管理界面我们可以构建容器后在容器中启用控制台插件

或者直接拉取`management`版本

```bash
docker pull rabbitmq:management
```

## 运行

### 最小化构建

默认`latest`版本

```bash
docker run --name=rabbitmq -p 15672:15672 -p 5672:5672 -d rabbitmq
```

* `--name=rabbitmq` 容器命名为rabbitmq
* `-p 15672:15672` 将容器的15672端口映射到宿主机的15672端口，`15672`是管理界面端口
* `-p 5672:5672` 将容器的5672端口映射到宿主机的5672端口，`5672`是服务端口

如果我们拉取的是`management`版本，记得在容器后面加上`management`标签

```bash
docker run --name=rabbitmq -p 15672:15672 -p 5672:5672 -d rabbitmq:management
```

:::warning 备注
如果拉取的是`management`版本，但是构建容器时没有加该标签，系统会先拉取`latest`版本后再运行
:::

如果是通过`management`标签构建的容器，现在我们就可以访问`http://宿主机ip:15672`打开管理控制台界面了，当然如果环境有端口限制还需要先启用`15672`端口才行

### 控制台插件

如果是用默认`latest`版本构建容器，也是可以打开控制台界面的，进入容器通过命令启用控制台插件，然后重启容器即可

```bash
# 进入容器
docker exec -it rabbitmq /bin/bash

# 启用控制台插件
rabbitmq-plugins enable rabbitmq_management

# 重启容器
docker restart rabbitmq
```

### 初始账号

如果运行容器时没有设置账号，rabbitmq会给我们创建一个默认账号：`guest/guest`

如果不想用默认的`guest`，可以在构建容器时指定其它账号

```bash
docker run --name=rabbitmq \
    -p 15672:15672 -p 5672:5672 \
    -e RABBITMQ_DEFAULT_USER=admin \
    -e RABBITMQ_DEFAULT_PASS=admin \
    -d rabbitmq
```

* `-e RABBITMQ_DEFAULT_USER=admin` 默认账号为admin
* `-e RABBITMQ_DEFAULT_PASS=admin` 默认密码为admin

:::details 提示
登录进入控制台后，可以通过`Admin`菜单添加、更改账户信息
:::

## 问题

点击`Channels`菜单，提示`Stats in management UI are disabled on this node`

或者

点击`Exchanges`菜单，随意点击一个`exchange name`提示`Management API returned status code 500 -`

解决办法：
进入容器，进入`/etc/rabbitmq/conf.d`目录，修改`management_agent.disable_metrics_collector.conf`文件中的`management_agent.disable_metrics_collector = false`，然后退出重启容器即可

```bash
# 进入容器
docker exec -it rabbitmq /bin/bash

# cd到以下路径
cd /etc/rabbitmq/conf.d/

# 修改 management_agent.disable_metrics_collector = false
echo management_agent.disable_metrics_collector = false > management_agent.disable_metrics_collector.conf

# 退出容器
exit

# 重启容器
docker restart rabbitmq
```
