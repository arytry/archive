---
title: Hexo生成github page
date: 2020-04-29 05:24:32
categories: Hexo
tags:
- Hexo
---
Welcome to [Hexo](https://hexo.io/)! This is your very first post. Check [documentation](https://hexo.io/docs/) for more info. If you get any problems when using Hexo, you can find the answer in [troubleshooting](https://hexo.io/docs/troubleshooting.html) or you can ask me on [GitHub](https://github.com/hexojs/hexo/issues).

## 前期准备

要使用hexo，首先你需要检测电脑上是否已经安装下列应用程序：

[Node.js](https://nodejs.org/ 'Node')
[Git](https://git-scm.com/ 'Git')

<!-- ，如果你的计算机上已经安装了它们，那么可以[跳过这一步](#quick-start)。 -->
如果已经安装上述必备程序，那么接下来只需要使用 npm 即可完成 Hexo 的安装。

``` bash
npm install -g hexo-cli
```

## Quick Start

### Initial project

``` bash
hexo init blog
```

### Create a new post

``` bash
hexo new "My New Post"
```

More info: [Writing](https://hexo.io/docs/writing.html)

### Run server

``` bash
hexo server
```

Or

``` bash
hexo s
```

More info: [Server](https://hexo.io/docs/server.html)

## Deploy

### Install git deploy plugin

``` bush
npm install hexo-deployer-git --save
```

### Configure

open file "_config.yml" in the project at first level, and configure deploy node.

``` bash
deploy:
type: git
repo: git url
branch: master
```

### Clean browser cache

``` bash
hexo clean
```

### Generate static files

``` bash
hexo generate
```

Or

``` bash
hexo g
```

More info: [Generating](https://hexo.io/docs/generating.html)

### Deploy to remote sites

``` bash
hexo deploy
```

Or

``` bash
hexo d
```

More info: [Deployment](https://hexo.io/docs/one-command-deployment.html)

> There is no details about github page configure, about more info please google.

## Releated Links

[GitHub Page+Hexo+nexT 搭建个人博客](https://zhuanlan.zhihu.com/p/46096258)
