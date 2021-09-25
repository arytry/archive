---
title: 自定义Code First约定
date: 2020-06-03 01:13:00
categories:
- Code First
tags:
- Code First
- Conventions
---

> 我们知道在Code First中可以通过数据注解或者Flunt Api两种方式对模型进行约定。但是这种默认的约定方式也有一定的限制，比如想要配置所有模型的ID属性为主键，我们需要多个单独的实体配置，这明显是劳动力过剩，做重复的生产力工作。不过.net为我们提供了便捷的方式来解决这个问题，不过在EntityFramework和EntityFramework Core中处理的方式不同。

## EntityFramework

### 自定义约定

在模型生成器上启用约定，可以通过在上下文中重写`OnModelCreating`来访问这些约定。

``` c#
protected override void OnModelCreating(DbModelBuilder modelBuilder)
{
    modelBuilder
        .Properties()
        .Where(p => p.Name == p.DeclaringType.Name + "ID")
        .Configure(p => p.IsKey());

    // 将属性类型为byte[]并且名称为RowVersion的属性对应的字段标记为行版本（时间戳）。
    modelBuilder.Properties<byte[]>()
        .Where(m => m.Name == "RowVersion")
        .Configure(m => m.IsRowVersion());

    // 将类型为DateTime的属性对应的字段类型设置为DateTime2。
    modelBuilder.Properties<DateTime>()
        .Configure(m =>
            m.HasColumnType("DateTime2"));

    base.OnModelCreating(modelBuilder);
}
```

### 约定类

定义约定的另一种方法是使用约定类封装约定。 使用约定类时，将创建一个从`System.Data.Entity.ModelConfiguration`命名空间中的约定类继承的类型。

``` c#
public class DateTime2Convention : Convention
{
    public DateTime2Convention()
    {
        this.Properties<DateTime>()
            .Configure(c => c.HasColumnType("datetime2"));
    }
}
```

若要告诉 EF 使用此约定，请将其添加到 OnModelCreating 中的约定集合。

``` c#
protected override void OnModelCreating(DbModelBuilder modelBuilder)
{
    modelBuilder.Properties<int>()
                .Where(p => p.Name.EndsWith("Key"))
                .Configure(p => p.IsKey());

    modelBuilder.Conventions.Add(new DateTime2Convention());
}
```

如您所见，我们将约定的实例添加到约定集合。 从约定继承提供了一种在团队或项目之间进行分组和共享约定的便利方法。 例如，你可以有一个类库，其中包含所有组织项目使用的一组通用约定。

### 扩展阅读

[Custom Code First Conventions](https://docs.microsoft.com/en-us/ef/ef6/modeling/code-first/conventions/custom '自定义 Code First 约定')

## EntityFramework Core

在EF Core中约定内置在ModelBuilder里面，而没有单独的使用`Conventions`来单独指定约定。

### 约定

我们可以通过请求`ModelBuilder.Model.GetEntityTypes()`获取类型。

``` c#
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    var keyProperties = modelBuilder
        .Model
        .GetEntityTypes()
        .SelectMany(m => m.GetProperties());

    var rowVersionProperties = keyProperties.Where(
        m => m.ClrType == typeof(byte[])
        && m.Name == "RowVersion");
    foreach (var item in rowVersionProperties)
    {
        modelBuilder.Entity(item.DeclaringEntityType.Name)
            .Property(item.Name)
            .IsRowVersion()
            .IsRequired();
    }

    var dateTimeProperties = keyProperties.Where(
        m => m.ClrType == typeof(DateTime));
    foreach (var item in dateTimeProperties)
    {
       modelBuilder.Entity(item.DeclaringEntityType.Name)
           .Property(item.Name)
           .HasColumnType("DateTime2");
    }

    base.OnModelCreating(modelBuilder);
}
```

### 相关链接

[Use DbModelBuilder in .NET Core to use specify naming conventions](https://stackoverflow.com/questions/52127903/use-dbmodelbuilder-in-net-core-to-use-specify-naming-conventions 'Use DbModelBuilder in .NET Core to use specify naming conventions')
