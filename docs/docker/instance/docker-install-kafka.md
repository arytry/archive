# docker安装kafka

## kafka

### 下载zookeeper镜像

kafka需要zookeeper管理，所以需要先安装zookeeper。可以下载官方的`zookeeper`或者`wurstmeister/zookeeper`版本，建议下载`wurstmeister/zookeeper`，kafka也是选择的`wurstmeister/kafka`版本

``` bash
docker pull zookeeper:latest
```

or

``` bash
docker pull wurstmeister/zookeeper:latest
```

### 运行zookeeper容器

``` bash
docker run --name zookeeper -p 2181:2181 -d zookeeper
```

or

``` bash
docker run --name zookeeper -p 2181:2181 -d wurstmeister/zookeeper
```

### 下载kafka镜像

``` bash
docker pull wurstmeister/kafka:latest
```

### 运行kafka容器

``` bash
docker run -t -d --name kafka -p 9092:9092 \
    -e KAFKA_BROKER_ID=0 \
    -e KAFKA_ZOOKEEPER_CONNECT=192.168.222.133:2181 \
    -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://192.168.222.133:9092 \
    -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 \
    wurstmeister/kafka
```

这里主要设置4个参数

* `-e KAFKA_BROKER_ID=0` 在kafka集群中，每个kafka都有一个BROKER_ID来区分自己
* `-e KAFKA_ZOOKEEPER_CONNECT=192.168.222.133:2181/kafka` 配置zookeeper管理kafka的路径
* `-e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://192.168.222.133:9092` 把kafka的地址端口注册给zookeeper
* `-e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092` 配置kafka的监听端口

> 第2点和第3点的ip换成服务器ip
代码后面还可以加上`-v /etc/localtime:/etc/localtime`用于指定容器时间同步虚拟机的时间

### 进入kafka容器

``` bash
docker exec -it kafka /bin/bash
```

### 进入所在目录

``` bash
cd opt/kafka_2.12_2.5.0/bin
```

> kafka的版本根据不同时期可能有所不同，可以先通过`cd opt`，然后通过`ls`命令查看kafka当前版本。

## kafka管理器

### 安装kafka-manager

``` bash
docker pull sheepkiller/kafka-manager:latest
```

### 运行kafka-manager

``` bash
docker run -d --name kafka-manager \
    --link zookeeper:zookeeper \
    --link kafka:kafka -p 9000:9000 \
    --restart=always \
    --env ZK_HOSTS=zookeeper:2181 \
    sheepkiller/kafka-manager
```

## 相关链接

* [docker安装kafka和zookeeper](https://blog.csdn.net/weixin_40910372/article/details/103962237 'docker安装kafka和zookeeper')
* [docker安装kafka](https://www.jianshu.com/p/e8c29cba9fae 'docker安装kafka')
* [Docker搭建Zookeeper&Kafka集群](https://www.cnblogs.com/Jacian/p/11421114.html 'Docker搭建Zookeeper&Kafka集群')
