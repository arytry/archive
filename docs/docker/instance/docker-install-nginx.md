# docker安装nginx

首先拉取`nginx`镜像

```bash
docker pull nginx
```

然后运行一个名称为`nginx-test`的容器

```bash
docker run --name nginx-test -p 8080:80 -d nginx
```

* `--name nginx-test` 将容器名称命名为`nginx-test`
* `-p 8080:80` 将容器的`80`端口映射到宿主机的`8080`端口
* `-d` 在后台运行容器

现在访问`http://宿主机ip:8080`地址，如果可以看到一个nginx的默认页面，说明nginx已经成功运行

> ***如何将自己的网页发布到nginx呢？***

## 认识Nginx

nginx中最重要的一个配置文件是`nginx.conf`，目录位置为`/etc/nginx/`，我们可以进入容器看看该文件

首先执行如下命令进入容器

```bash
docker exec -it nginx-test bash
```

然后进入`nginx.conf`文件所在的目录位置并查看该文件

```bash
cd /etc/nginx & cat nginx.conf
```

可以看到该文件内容大体如下

```nginx
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
}
```

在`http`块中可以看到一行代码`include /etc/nginx/conf.d/*.conf;`，意思是将`/etc/nginx/conf.d/`目录下面所有的`.conf`文件包含进来

进入该目录可以看到其中有一个`default.conf`的默认配置文件，看一下大概内容

```nginx
server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;

    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }
    
    .............
}
```

* `listen` 监听的端口号，默认为web默认端口`80`。**这其实就是运行容器时的匹配端口**
* `server_name` `localhost`或`域名`
  * `localhost` 通过IP地址访问站点（上面运行容器后我们运行的就是ip地址）
  * `域名` 做了域名解析后就可以通过该域名访问站点了
* `location /`
  * `root` 站点目录，需要访问自己的站点就可以在这里实现
  * `index` 默认首页

::: tip 提示
增加站点，在`conf.d`文件夹中添加`.conf`文件即可
:::

## 目录映射

前面了解了nginx的知识点，知道要发布自己的站点只需要把自己的站点放在指定目录即可，但是在docker中没做目录映射我们是无法将文件存放在容器中的

我们把之前的容器移除并重新运行一个新的容器

```bash
# 停止容器
docker stop nginx-test

# 移除容器
docker rm nginx-test
```

运行一个带有目录映射的容器

```bash:{2,3}
docker run --name nginx -p 80:80 \
    -v /srv/nginx/etc/conf.d:/etc/nginx/conf.d \
    -v /srv/nginx/html:/usr/share/nginx/html \
    -d nginx 
```

* `-v /srv/nginx/etc/conf.d:/etc/nginx/conf.d` 将容器中的`/etc/nginx/conf.d`目录映射到宿主机的`/srv/nginx/etc/conf.d`目录
* `-v /srv/nginx/html:/usr/share/nginx/html` 将容器中的站点目录映射到宿主机的`/srv/nginx/html`目录

这样我们在宿主机对这两个目录的配置和修改即可同步到容器中

::: tip 提示
修改配置后需要重启conf文件或者nginx容器才能生效
:::

## 加密证书

如果需要加密证书访问，还需要映射`443`端口。如果是用的证书文件，还可以将存放证书的目录映射到宿主机

```bash:{3}
docker run --name nginx -p 80:80 -p 443:443 \
-v /srv/nginx/etc/conf.d:/etc/nginx/conf.d \
-v /srv/nginx/etc/cert:/etc/nginx/cert \
-v /srv/nginx/html:/usr/share/nginx/html \
-d nginx 
```

还需要修改对应的站点配置文件

```nginx:{6-14}
server {
    listen       443 ssl;
    listen  [::]:443 ssl;
    server_name  localhost;

    # ssl证书地址
    ssl_certificate     /etc/nginx/cert/cert.pem;  # pem文件的路径
    ssl_certificate_key  /etc/nginx/cert/cert.key; # key文件的路径

    # ssl验证相关配置
    ssl_session_timeout  5m;    #缓存有效期
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;    #加密算法
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;    #安全链接可选的加密协议
    ssl_prefer_server_ciphers on;   #使用服务器端的首选算法

    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    ......
}
```

这样就可以通过带有`https`加密方式访问站点了

如果想把非加密方式访问直接跳转到加密方式可以再加一个`server`配置

```nginx
server{
    listen 80;
    server_name www.example.com;
    rewrite ^(.*)$ https://$host$1 permanent;
}
```

## 重定向

重定向有两种方式：`proxy_pass`和`rewrite`

### proxy_pass

访问`server_name`时，自动代理到`proxy_pass`地址

#### 用法

```nginx
server{
    listen  80;  
    server_name test.example.com; # 绑定域名
    location / {  
         proxy_pass http://127.0.0.1:8000;  # 指定端口号 8000
    }  
}
```

#### 说明

* 浏览器地址不会变化
* 请求`http://test.example.com`，会被自动代理到`http://127.0.0.1:8000`地址

### rewrite

#### 用法

```nginx
rewrite ^(.*)$ https://$host$1 permanent;
```

此用法和以下代码相同

```nginx
return 301 https://$server_name$request_uri;
```

#### 说明

* 浏览器地址显示重定向后的url
* 参数
  |参数  |状态码|说明|
  |---|:---:|----|
  |last|302|结束当前的请求处理，用替换后的URI重新匹配location|
  |break|302|结束当前的请求处理，使用当前资源，不再执行location里余下的语句|
  |redirect|302|临时跳转|
  |permanent|301|永久跳转|

#### 示例

跳转到https协议请求

```nginx
server{
    listen 80;
    server_name www.example.com;
    rewrite ^(.*)$ https://$host$1 permanent;
}
```

## 强制跳转到https

不管访问`http://example.com`、`https://example.com`还是`http://www.example.com`都跳转到`https://www.example.com`

```nginx
server{
    listen 80;
    listen 443;
    server_name example.com www.example.com;
    set $flag 0;
    if ($scheme != 'https'){
     set $flag 1;
    }
    if ($host != 'www.example.com'){
     set $flag 1;
    }
    if ($flag = 1){
        rewrite ^/(.*)$ https://www.example.com/$1 permanent;
        # return 301 https://www.example.com$request_uri;
    }
}
```
