---
title: docker安装jenkins
date: 2021-01-21 15:20:11
categories:
- jenkins
tags:
- jenkins
---

>***暂时未解决在docker内的jenkins中执行宿主机docker命令部署***
---
> ***目前已经不推荐使用jenkins，更不推荐docker下跑jenkins***

分步执行以下命令

``` bash
# 搜索Jenkins
docker search jenkins

# jenkins镜像为官方镜像，docker hub中提到已经弃用[deprecated]，推荐使用jenkins/jenkins
docker pull jenkins/jenkins[:latest]
```

``` bash
docker run -d --name jenkins \
    -p 8080:8080 -p 50000:50000 \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v $(which docker):/bin/docker \
    -v jenkins:/var/jenkins_home \
    jenkins/jenkins
```

* `-v jenkins:/var/jenkins_home` 将docker里jenkins工作目录`/var/jenkins_home`挂载到本地`/var/lib/docker/volumes`下面的`jenkins`目录，
* `-v /var/run/docker.sock:/var/run/docker.sock -v $(which docker):/bin/docker` 将jenkins容器内的docker命令指向了宿主机
