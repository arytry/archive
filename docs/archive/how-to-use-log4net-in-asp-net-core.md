---
title: .Net Core日志管理之Log4net
date: 2020-12-23 23:04:24
categories:
- logging
- log4net
tags:
- logging
- log4net
- .netcore
---

## 新建

新建一个基于 .net core的Web api项目

## 安装

在Nuget中搜索并安装`Microsoft.Extensions.Logging.Log4Net.AspNetCore`包

## 添加

修改`Program`文件的`CreateHostBuilder`方法

``` csharp
public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        /* 以下为新增代码片段 */
        .ConfigureLogging(loggingBuilder =>
        {
            // 过滤掉 System 和 Microsoft 开头的命名空间下的组件产生的警告级别以下的日志
            loggingBuilder.AddFilter("System", LogLevel.Warning);
            loggingBuilder.AddFilter("Microsoft", LogLevel.Warning);
            // 添加log4net，重载方法里面可以指定log4net的配置文件路径
            loggingBuilder.AddLog4Net();
        })
```

## 配置

在项目根目录下添加log4net.config，并将其“复制到输出目录”属性设置为"如果较新则复制"

> *log4net默认配置文件名称为log4net.config，如果修改了文件名，可在上面的代码`loggingBuilder.AddLog4Net();`重载方法中支持输入文件名参数*

文件的配置方式可参考网上文档，这里节选其中一种采用文件附加方式

``` xml
<?xml version="1.0" encoding="utf-8"?>
<log4net>
    <appender name="FileAppender" type="log4net.Appender.FileAppender">
        <file value="Logs/log.txt" />
        <appendToFile value="true" />
        <layout type="log4net.Layout.PatternLayout">
            <conversionPattern value="%date [%thread] %-5level %logger - %message%newline" />
        </layout>
    </appender>
    <root>
        <level value="ALL"/>
        <appender-ref ref="FileAppender" />
    </root>
</log4net>
```

## 调用

调用方式没有差别，就是直接采用logging的方式

```csharp
public class FoobarController : ControllerBase
{
    private readonly ILogger<FoobarController> _logger;

    public FoobarController(ILogger<FoobarController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public void Get()
    {
        _logger.LogError("error");
        _logger.LogWarning("warn");
        _logger.LogInformation("info");
    }
}
```

启动项目，调用当前控制器的方法。

然后我们打开项目，找到bin目录下的Logs文件夹（log4net.config中配置的路径），就可以看到一个log.txt文件，打开文件可以看到我们调用的日志信息都记录了

## 相关链接

[.NET Core 日志收集（log4net+Kafka+ELK）](https://www.jianshu.com/p/e4d3bec9e220 '.NET Core 日志收集（log4net+Kafka+ELK）')
