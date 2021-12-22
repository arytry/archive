# docker安装redis

Redis 是一个开源的使用 ANSI C 语言编写、支持网络、可基于内存亦可持久化的日志型、Key-Value 的 NoSQL 数据库，并提供多种语言的 API。

## 拉取镜像

```bash
docker pull redis
```

## 运行容器

```bash
docker run -itd --name redis-test -p 6379:6379 redis
```

设置密码

```bash
docker run -itd --name redis-test -p 6379:6379 redis --requirepass 123456
```

* `--requirepass 123456` 设置redis密码为123456

## redis-cli

`redis-cli`是redis的运行命令

通过`redis-cli`连接测试使用redis服务示例如下
  
```bash
# 进入redis容器
[root@sadf09234lwe ~]$ docker exec -it redis-test bash
# 运行redis-cli
root@d83b613fdfeb:/data$ redis-cli
# 执行命令
127.0.0.1:6379> set abc 123
OK
127.0.0.1:6379> get abc
"123"
```

### 执行命令

* `set key value` 设置`key`的值为`value`
* `get key` 获取`key`的值
* `config get requirepass` 查看redis密码
* `config set requirepass ****` 设置或修改redis密码
* `auth ****` 认证登录密码，执行其它命令提示`(error) NOAUTH Authentication required.`时需要先认证

::: tip 提示
`Redis Desktop Manager`可视化工具可以查看管理Redis
:::

## 配置文件

[Redis官网](https://redis.io/topics/config)中有这么一段话

> Redis is able to start without a configuration file using a built-in default configuration, however this setup is only recommended for testing and development purposes.
>
> The proper way to configure Redis is by providing a Redis configuration file, usually called redis.conf.

翻译一下就是：

> Redis可以在没有配置文件的情况下使用内置的默认配置启动，但是这种设置仅用于测试和开发目的。
>
> 而正确的方法是提供一个Redis配置文件，通常称为`Redis.conf`。

这是什么意思呢？就是说通过默认的配置文件启动Redis是不安全的，只适合于测试和开发，要上生产还得使用配置文件的方式来启动

官网也根据Redis各个版本提供了不同的配置文件，可以先把文件下载到主机中，然后通过目录映射的方式启动Redis

创建`/srv/redis/etc`目录

```bash
mkdir -p /srv/redis/etc
```
下载redis.conf文件

```bash
cd /srv/redis/etc
wget http://download.redis.io/redis-stable/redis.conf
```

> ***由于网络原因可以在本地创建`redis.conf`文件，然后将官网配置文件的内容直接复制到该文件***

在`/srv/redis/etc`目录中新建`redis.conf`文件

```bash
touch /srv/redis/etc/redis.conf
```

把官网配置文件内容复制到该文件，然后我们根据需要对部分参数进行修改

* `bind [127.0.0.1/*]` 允许访问Redis服务的IP地址，如果需要远程访问修改为需要访问此数据库的`IP地址`或直接`注释`或改为`bind *`，这个属性和`protected-mode`控制了是否可以远程访问
* `protected-mode [yes/no]` 保护模式，该模式控制外部网是否可以连接redis服务
* `daemonize [yes/no]` 守护进程方式运行，如果启用守护进程则会在后台运行。如果docker run命令加了`-d`，这里就要改为no，否则无法启动
* `requirepass [password]` 添加访问密码
* `appendonly [yes/no]` 每次更新操作后进行日志记录，Redis默认是异步把数据写入磁盘，如果不启用可能会在断电时导致一段时间内的数据丢失
* `port [6379]` 容器服务的端口号，默认为6379(MERZ)

**运行docker**

```bash
docker run --name redis \
    -p 6379:6379 \
    -v /srv/redis/etc/redis.conf:/etc/redis/redis.conf \
    -v /srv/redis/data:/data \
    -itd redis \
    redis-server /etc/redis/redis.conf
```

**docker-compose.yml**

```bash
version: "3"
services:
  redis:
    image: redis
    container_name: redis
    restart: always
    ports:
      - 6380:6379
    volumes:
      - /srv/redis/data:/data:rw
      - /srv/redis/etc/redis.conf:/etc/redis/redis.conf:rw
    command:
      redis-server /etc/redis/redis.conf
```