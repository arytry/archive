---
# title: ASP.NET Core 健康检查
date: 2021-01-20 16:02:19
categories:
tags:
---

# ASP.NET Core 健康检查

::: tip 提示
工具：`VS2019`

框架：`ASP.NET Core5.0`

说明：.net core5.0之前和5.0版本的健康检查有一定差异，这里只讲解5.0版本的使用
:::

## 健康检查HealthChecks

### 基本操作

首先引入包`Microsoft.Extensions.Diagnostics.HealthChecks`

在`Startup.ConfigureServices`中使用`AddHealthChecks`注册运行状况检查服务。 通过在`Startup.Configure`中调用`MapHealthChecks`来创建运行状况检查终结点。
在示例应用中，在`/health`处创建运行状况检查终结点

```C#
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddHealthChecks();
    }

    public void Configure(IApplicationBuilder app)
    {
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapHealthChecks("/health");
        });
    }
}
```

启动项目，通过访问`/health`路径查看应用状态，这样一个简单的健康检查其实就算完了

### 自定义检查

通过`AddCheck`方法实现自定义检查

```C#
services.AddHealthChecks()
    .AddCheck("Example", _ =>
        HealthCheckResult.Healthy("Example is OK!"), tags: new[] { "example" });
```

也可以调用该方法的泛型模式，首先需要定义一个继承自`IHealthCheck`的接口

```C#
public class ExampleHealthCheck : IHealthCheck
{
    public Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default(CancellationToken))
    {
        var healthCheckResultHealthy = true;

        if (healthCheckResultHealthy)
        {
            return Task.FromResult(
                HealthCheckResult.Healthy("A healthy result."));
        }

        return Task.FromResult(
            HealthCheckResult.Unhealthy("An unhealthy result."));
    }
}
```

然后通过调用该接口实现自定义健康检查

```C#
services.AddHealthChecks()
    .AddCheck<ExampleHealthCheck>("example_health_check");
```

### 健康检查库

可以对数据库、redis等进行检查，比如mysql，需要先引入`HealthChecks.MySql`库，然后在`ConfigureServices`方法中添加如下代码即可

```C#
public void ConfigureServices(IServiceCollection services)
{
    services.AddHealthChecks()
        .AddMySql(
            connectionString: this.Configuration.GetConnectionString("MySqlConnection"),
            name: "mysql",
            failureStatus: HealthStatus.Degraded,
            tags: new string[] { "db", "sql", "mysql" });
}
```

> 如果要对Redis进行检查，先引入`HealthChecks.Redis`库，然后照猫画虎直接在后面调用`AddRedis()`，还有其它多种检查也是一样

### 自定义输出

#### 全部输出

现在我们知道健康检查可以对多种业务进行检查，如果一个项目有多项检查，此时通过访问`/health`地址其实只能看到一个输出值，这其实是没有意义的，要想看到完整的输出结果，只需要稍微改造一下代码即可

在`Startup.Configure`中，将`HealthCheckOptions.ResponseWriter`选项设置为编写响应的委托：

```C#
public void Configure(IApplicationBuilder app)
{
    app.UseEndpoints(endpoints =>
    {
        endpoints.MapHealthChecks("/health", new HealthCheckOptions
        {
            Predicate = _ => true,
            ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
        });
    });
}
```

现在访问`/health`地址就能看到一串json数据，该数据包含了所有检查项目的健康状况

#### 部分输出

如果我们实现了多项健康检查，现在想输出部分结果，比如提供给consul做心跳包检测，可以对`HealthCheckOptions`的`Predicate`参数做过滤

```C#
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddHealthChecks()
            .AddCheck("self", _ =>
                HealthCheckResult.Healthy(), tags: new[] { "self" });;
    }

    public void Configure(IApplicationBuilder app)
    {
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapHealthChecks("/liveness", new HealthCheckOptions
            {
                Predicate = r => r.Name.Contains("self")
            });
        });
    }
}
```

## 引入UI

> **UI独立于健康检查，可以远程调用，只需要知道前面提到的`/health`地址完整的输出结果，一定要是完整的结果才行**

### 注册

首先引入`HealthChecks.UI`库，然后在`Starup.ConfigureServices`中使用`AddHealthChecksUI`注册，在`Startup.Configure`中调用`MapHealthChecksUI`创建UI终结点

```C#
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddHealthChecksUI()
            .AddInMemoryStorage();  // 将记录存储到内存中
    }

    public void Configure(IApplicationBuilder app)
    {
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapHealthChecksUI();
        });
    }
}
```

### 配置文件

* 调用`AddHealthChecksUI()`方法默认读取的配置文件，所以还需要在appsettings.json中添加配置信息，以下添加了2个站点的健康检查终结点

```json
{
  "HealthChecksUI": {
    "HealthChecks": [
      {
        "Name": "Example1",
        "Uri": "http://localhost:57941/health"
      },
      {
        "Name": "Example2",
        "Uri": "http://localhost:52382/health"
      }
    ],
    "Webhooks": [
      {
        "Name": "",
        "Uri": "",
        "Payload": "",
        "RestoredPayload": ""
      }
    ],
    "EvaluationTimeInSeconds": 10,
    "MinimumSecondsBetweenFailureNotifications": 60
  }
}

```

* 当然我们也可以不用配置文件的方式，而直接通过传参的方式来调用

```C#
services.AddHealthChecksUI(setup =>
{
    setup.AddHealthCheckEndpoint("endpoint1", "http://localhost:8001/health");
    setup.AddHealthCheckEndpoint("endpoint2", "http://remoteendpoint:9000/health");
    setup.AddWebhookNotification("webhook1", uri: "http://httpbin.org/status/200?code=ax3rt56s", payload: "{...}");
});
```

到这里整个UI的配置和代码就已经完成了，现在我们可以启动该站点访问`/healthchecks-ui`路径查看效果

### 健康状况记录存储

ASP.NET Core 5.0中健康检查UI展示结果是从前面指定的`/health`地址获取，但是每一项检查的健康状态都可能会发生变化，为了看到每一项的健康状况记录，UI自身指定了结果存储集，可以存储到内存、数据库等数据集中，通过引入不同的库（`HealthChecks.UI.XXX.Storage`）来指定

以下示例展示保存结果到MySQL中，首先引入`HealthChecks.UI.MySql.Storage`库

```C#
public void ConfigureServices(IServiceCollection services)
{
    services.AddHealthChecksUI()
        .AddMySqlStorage(this.Configuration.GetConnectionString("MySqlConnection"));
}
```

### 跳转到UI

因为我是单独起的一个项目来展示UI，所以为了方便做了一个跳转

```C#
public void Configure(IApplicationBuilder app)
{
    endpoints.MapGet("/", async context =>
    {
        // 直接跳转到健康检查UI首页
        context.Response.Redirect("/healthchecks-ui");
        await Task.CompletedTask;
    });

    app.UseEndpoints(endpoints =>
    {
        endpoints.MapHealthChecksUI();
    });
}
```

## 相关链接

* [HEALTH CHECKS IN ASP.NET CORE](https://blog.zhaytam.com/2020/04/30/health-checks-aspnetcore/ 'HEALTH CHECKS IN ASP.NET CORE')
* [AspNetCore.Diagnostics.HealthChecks](https://github.com/Xabaril/AspNetCore.Diagnostics.HealthChecks 'AspNetCore.Diagnostics.HealthChecks')
* [ASP.NET Core 中的运行状况检查](https://docs.microsoft.com/zh-cn/aspnet/core/host-and-deploy/health-checks?view=aspnetcore-5.0 'ASP.NET Core 中的运行状况检查')
