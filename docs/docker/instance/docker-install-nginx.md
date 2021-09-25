# docker安装nginx

```bash
docker search nginx
```

```bash
docker pull nginx
```

```bash
docker run --name nginx -p 80:80 \
    -v /srv/nginx/etc/conf.d:/etc/nginx/conf.d \
    -v /srv/nginx/html:/usr/share/nginx/html \
    -d nginx 
```

* `-v /srv/nginx/etc/conf.d:/etc/nginx/conf.d` 将容器中的`/etc/nginx/conf.d`目录映射到宿主机的`/srv/nginx/etc/conf.d`目录，`conf.d`实际是`nginx.conf`文件中包含进来的目录

如果需要加密证书访问，还需要映射`443`端口。如果是用的证书文件，还可以将存放证书的目录映射到宿主机

```bash
docker run --name nginx -p 80:80 -p 443:443 \
-v /srv/nginx/etc/conf.d:/etc/nginx/conf.d \
-v /srv/nginx/etc/cert:/etc/nginx/cert \
-v /srv/nginx/html:/usr/share/nginx/html \
-d nginx 
```
