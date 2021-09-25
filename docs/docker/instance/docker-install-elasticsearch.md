---
title: docker安装elasticsearch
date: 2020-08-09 21:24:20
categories:
- elasticsearch
tags:
- elasticsearch
---

## Docker 部署 ElasticSearch

* 拉取镜像

docker仓库里面没有`latest`标签，目前最新版本是`7.8.1`

``` bash
docker pull docker.elastic.co/elasticsearch/elasticsearch:7.8.1
```

* 运行容器

``` bash
docker run -d --name es -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" elasticsearch:7.8.1
```

* 配置跨域

首先进入容器

``` bash
docker exec -it es /bin/bash
```

修改配置信息

``` bash
# 显示当前目录文件和文件夹
ls
# 进入config文件夹
cd config
# 显示config下的文件
ls
# 修改elasticsearch.yml文件
vim elasticsearch.yml

# 在最后面加入跨域配置
http.cors.enabled: true
http.cors.allow-origin: "*"
```

* 重启容器

由于修改了配置信息，需要重启才能生效

``` bash
docker restart es
```

> ***现在就可以通过`9200`端口访问了***

如果你看到如下结果，说明已经成功部署

``` json
{
  "name" : "884c4caf7982",
  "cluster_name" : "docker-cluster",
  "cluster_uuid" : "M2J0arXPSA-8QL3JcYNV2g",
  "version" : {
    "number" : "7.8.1",
    "build_flavor" : "default",
    "build_type" : "docker",
    "build_hash" : "b5ca9c58fb664ca8bf9e4057fc229b3396bf3a89",
    "build_date" : "2020-07-21T16:40:44.668009Z",
    "build_snapshot" : false,
    "lucene_version" : "8.5.1",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```

## Docker 部署 ElasticSearch-Head

> ~~*Google Chrome提供了ElasticSearch Head插件，可以替代以下操作*~~

`ElasticSearch-Head`是一个管理界面，可以查看ElasticSearch的相关信息

``` bash
docker pull mobz/elasticsearch-head:5
```

``` bash
docker run -d --name es_admin -p 9100:9100 mobz/elasticsearch-head:5
```

> 通过访问`9100`端口就可以查看管理界面，然后在文本框输入`elasticsearch`的访问地址（`9200`端口），点击连接即可看到相关信息

## 相关链接

[Docker 简单部署 ElasticSearch](https://www.cnblogs.com/jianxuanbing/p/9410800.html 'Docker 简单部署 ElasticSearch')

[ElasticSearch入门 附.Net Core例子](https://www.cnblogs.com/CoderAyu/p/9601991.html 'ElasticSearch入门 附.Net Core例子')
