---
title: docker安装teamcity
date: 2020-05-13 03:46:21
categories:
- TeamCity
tags:
- TeamCity
---

## Install teamcity-server

``` bash
docker pull jetbrains/teamcity-server:latest
```

使用`docker search teamcity-server`命令可以搜索

``` bash
docker run -itd --name teamcity -p 8111:8111 \
    -v teamcity_server:/data/teamcity_server/datadir \
    -v /opt/teamcity/logs:/opt/teamcity/logs \
    jetbrains/teamcity-server
```

## Install teamcity-agent

``` bash
docker pull jetbrains/teamcity-agent:latest
```

``` bash
docker run -itd --name teamcity-agent \
    -e SERVER_URL="http://192.168.222.133:8111"  \
    -u 0 \
    -v teamcity_agent:/data/teamcity_agent/conf \
    -v /var/run/docker.sock:/var/run/docker.sock  \
    -v /opt/buildagent/work:/opt/buildagent/work \
    -v /opt/buildagent/temp:/opt/buildagent/temp \
    -v /opt/buildagent/tools:/opt/buildagent/tools \
    -v /opt/buildagent/plugins:/opt/buildagent/plugins \
    -v /opt/buildagent/system:/opt/buildagent/system \
    jetbrains/teamcity-agent
```

### 启动teamcity-agent

``` bash
docker exec -it teamcity-agent /bin/bash
```

``` bash
sh run-agent.sh start
```

## 相关链接

* [TeamCity Agent安装](https://www.cnblogs.com/lishan1/p/10680036.html 'TeamCity Agent安装')
