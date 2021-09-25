# docker安装consul

## 单机版

```bash
docker run -d -p 8500:8500 --name consul consul agent -server -bootstrap -ui -client='0.0.0.0'
```

## 集群安装

`docker-compose.yaml`如下：

```yaml
version: '3'

services:
  cs1: 
    image: consul
    command: agent -server -client=0.0.0.0 -bootstrap-expect=3 -node=cs1 -data-dir=/data
    volumes:
      - /usr/local/docker/consul/data/cs1:/data
  cs2:
    image: consul
    command: agent -server -client=0.0.0.0 -retry-join=cs1 -node=cs2 -data-dir=/data
    volumes:
      - /usr/local/docker/consul/data/cs2:/data
    depends_on:
      - cs1
  cs3:
    image: consul
    command: agent -server -client=0.0.0.0 -retry-join=cs1 -node=cs3 -data-dir=/data
    volumes:
      - /usr/local/docker/consul/data/cs3:/data
    depends_on:
      - cs1
  cc1:
    image: consul
    command: agent -client=0.0.0.0 -retry-join=cs1 -ui -node=cc1 -data-dir=/data  
    ports:
      - 8500:8500
    volumes:
      - /usr/local/docker/consul/data/cc1:/data
    depends_on:
      - cs2
      - cs3
```

* `-server` 设置为 Server 类型节点，不加则为 Client 类型节点
* `-client` 注册或者查询等一系列客户端对它操作的IP，默认是127.0.0.1
* `bootstrap-expect` 集群期望的 Server 节点数，只有达到这个值才会选举 Leader
* `-node` 指定节点名称
* `-data-dir` 数据存放位置
* `-retry-join` 指定要加入的节点地址（组建集群）
* `-ui` 启用 UI 界面

## 相关链接

[.NET Core + Consul：服务注册与发现](https://www.jianshu.com/p/4aaaee6e9ce1 '.NET Core + Consul：服务注册与发现')
