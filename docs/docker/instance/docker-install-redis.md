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
* `auth ****` 认证登录密码，提示`(error) NOAUTH Authentication required.`时需要先认证才能执行其它命令

::: tip 提示
`Redis Desktop Manager`可视化工具可以查看管理Redis
:::
