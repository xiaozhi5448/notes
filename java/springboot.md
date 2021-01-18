# SpringBoot自动配置框架

`<https://docs.spring.io/spring-boot/docs/2.2.6.RELEASE/reference/html/index.html>`

## 开发环境

### vscode

使用vscode开发java代码需要的依赖包

- java extension pack
- spring boot extension pack

![image-20210108155227817](springboot.assets/image-20210108155227817.png)

可以像idea一样运行调试程序

## 初识springboot

springboot是一个java 自动配置框架，在使用java+maven开发的项目中，有一些框架需要繁琐复杂的配置，比如ssm，要编写mybatis配置文件，每个pojo也要编写操作接口和对应的mapper，spring配置文件，springmvc配置文件，开发流程中程序化工作非常多，springboot的出现简化了框架的配置操作，让我们更方便快速的开发应用程序。springboot的应用理念是约定优先于配置。有众多配置是大家约定好，用户需要修改的时候再去定制

spingboot可以让我们

- 简化spring应用开发
- 整合spring技术
- j2ee一站式解决方案

### helloworld

idea中使用new project 选择spring initiliazer，创建springboot项目，选择依赖，会从spring 官网下载项目模板，一个springboot脚手架，启用maven autoimport功能后，系统会自动导入maven依赖，位置取决于主机环境maven仓库的位置

![1587694259922](assets/1587694259922.png)

启动类代码如下

```java
@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

}

```

SpringBootApplication注解包含了许多其他内容

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = { @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
		@Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
```

这里启用了自动配置，自动组件扫描

编写一个简单的controller

```java
package example.demo.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @RequestMapping("/")
    String hello(){
        return "hello wrold!";
    }
}

```

直接运行主类，访问8080

即可看到helloworld的返回

#### 打包

使用mvn package命令打包，maven会将项目依赖的所有jar包压缩放入最终生成的jar包中

#### 运行、调试

springboot中所有的代码都可以打断点调试，跟踪调试可以了解springboot框架原理

#### 脚手架解析

父项目

```xml
<parent>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-parent</artifactId>
<version>2.3.7.RELEASE</version>
<relativePath/> <!-- lookup parent from repository -->
</parent>
```

其内容

![image-20210108160455174](springboot.assets/image-20210108160455174.png)

在springboot-dependencies中定义了所有依赖的版本

![image-20210108160541342](springboot.assets/image-20210108160541342.png)



springboot将不同功能场景进行抽取，定义了多个starter，当我们开发web应用，需要在pom文件中导入

![image-20210108160702797](springboot.assets/image-20210108160702797.png)

称为web启动器，开发不同功能时，导入不同启动器即可

## 自动配置

### 主程序类

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

}
```

#### springbootApplication

核心注解SpringBootApplication是一个组合注解

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration // springboot 配置类
@EnableAutoConfiguration
@ComponentScan(excludeFilters = { @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
		@Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
```

##### SpringBootConfiguration

![image-20210108161942005](springboot.assets/image-20210108161942005.png)

表明是一个配置组件

##### EnableAutoConfiguation

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage
@Import(AutoConfigurationImportSelector.class)
```

实现自动配置

###### **AutoConfigurationPackage**

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@Import(AutoConfigurationPackages.Registrar.class) // spring 底层注解import，给容器中导入一个组件
```

在AutoConfigurationPackages中，有静态类Register

```java
	static class Registrar implements ImportBeanDefinitionRegistrar, DeterminableImports {

		@Override
		public void registerBeanDefinitions(AnnotationMetadata metadata, BeanDefinitionRegistry registry) {
			register(registry, new PackageImports(metadata).getPackageNames().toArray(new String[0]));
		}

		@Override
		public Set<Object> determineImports(AnnotationMetadata metadata) {
			return Collections.singleton(new PackageImports(metadata));
		}

	}
```

会将所有主包下的组件扫描进spring 容器

在register一行打上断点，调试

![image-20210108163417439](springboot.assets/image-20210108163417439.png)

###### AutoConfigurationImportSelector

控制导入哪些组件，将需要导入的组件以全类名的方式返回

```java
	protected AutoConfigurationEntry getAutoConfigurationEntry(AnnotationMetadata annotationMetadata) {
		if (!isEnabled(annotationMetadata)) {
			return EMPTY_ENTRY;
		}
		AnnotationAttributes attributes = getAttributes(annotationMetadata);
		List<String> configurations = getCandidateConfigurations(annotationMetadata, attributes);
		configurations = removeDuplicates(configurations);
		Set<String> exclusions = getExclusions(annotationMetadata, attributes);
		checkExcludedClasses(configurations, exclusions);
		configurations.removeAll(exclusions);
		configurations = getConfigurationClassFilter().filter(configurations);
		fireAutoConfigurationImportEvents(configurations, exclusions);
		return new AutoConfigurationEntry(configurations, exclusions);
	}
```

![image-20210108164243220](springboot.assets/image-20210108164243220.png)

获取了相关的自动配置类

待续···

## springboot配置文件

配置项可以参考官方文档中的说明（appendix）

https://docs.spring.io/spring-boot/docs/2.4.1/reference/htmlsingle/#appendix

springboot默认使用两种类型的配置文件，properties与yml

- application.properties
- application.yml

配置文件用于修改springboot应用的默认值

### 配置文件值的获取

导入starter

```xml
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-configuration-processor</artifactId>
			<scope>annotationProcessor</scope>
		</dependency>


```

#### ConfigurationProperties

使用ConfigurationProperties注解将配置文件中的值注入到bean中。我们先新建两个java bean，Dog与Person，并且生成对应的getter与setter

```java

@Component
@ConfigurationProperties(prefix = "person")
public class Person {
    String lastName;
    Integer age;
    Boolean boss;
    java.util.Date birth;
    Map<String, Object> maps;
    List<Object> lists;
    Dog dog;

}


public class Dog {
    String lastName;
    Integer age;

}


```

这里省略了getter与setter方法，@Component表示是spring组件，会被springboot自动发现，ConfigurationProperties表示从配置文件中读取对应属性，prefix制定了父元素

在配置文件中

```yml
person:
    lastName: zhangsan
    age: 18
    boss: false
    birth: 2017/12/12
    maps: 
        k1: v1
        k2: v2
    lists:
        - lisi
        - name
    dog:
        lastName: dog
        age: 2
```

在springboot的test中，测试我们注入的bean

![image-20210108173006875](springboot.assets/image-20210108173006875.png)

![image-20210108173019253](springboot.assets/image-20210108173019253.png)

数据被成功注入

使用@Value注解也可以获取配置文件的值，二者稍有不同

如果某个业务逻辑需要获取一个简单的配置文件的值，使用@Value

如果获取的配置项较多，封装为ConfigurationProperties比较好

#### PropertySource

从指定路径加载配置文件进行值的注入

```java
@Component
@PropertySource(value = { "classpath:person.properties" })
@ConfigurationProperties(prefix = "person")
```

#### ImportResource

导入spring配置文件

#### 配置文件占位符

使用随机数:${random.int}

配置属性引用${person.name}, person.name之前已定义

### 给容器中注入组件

#### 配置类

使用@Bean注解而不是配置文件

```java
@Configuration
public class MyConfig {

    @Bean
    public HelloService helloService() {
        return new HelloService();
    }

}
```

容器中会存在一个名为helloService的组件

### 多配置文件

有时开发与生产环境会使用不同的配置文件，需要我们在运行时指定或在配置文件中指定

比如有application-dev.yml 与application-prod.yml

激活方式有如下三种

1、在配置文件中指定 spring.profiles.active=dev
2、命令行：
java -jar spring-boot-02-config-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev；
可以直接在测试的时候，配置传入命令行参数
3、虚拟机参数；
-Dspring.profiles.active=dev

也可以使用yml文档块

```yml
spring:
	profiles:
		active: prod
‐‐‐
server:
	port: 8083
spring:
	profiles: dev
‐‐‐
server:
	port: 8084
spring:
	profiles: prod #指定属于哪个环境
```

#### 配置文件加载位置

springboot 启动会扫描以下位置的application.properties或者application.yml文件作为Spring boot的默认配置文
件
**–file:./config/**
**–file:./**
**–classpath:/config/**
**–classpath:/**
优先级由高到底，高优先级的配置会覆盖低优先级的配置

我们还可以通过**spring.config.location**来改变默认的配置文件位置
项目打包好以后，我们可以使用命令行参数的形式，启动项目的时候来指定配置文件的新位置；指定配置文件和默
认加载的这些配置文件共同起作用形成互补配置；
java -jar spring-boot-02-config-02-0.0.1-SNAPSHOT.jar **--spring.config.location**=G:/application.properties

#### 外部配置加载顺序

SpringBoot也可以从以下位置加载配置； 优先级从高到低；高优先级的配置覆盖低优先级的配置，所有的配置会
形成互补配置
1. 命令行参数
**所有的配置都可以在命令行上进行指定**
java -jar spring-boot-02-config-02-0.0.1-SNAPSHOT.jar --server.port=8087 --server.context-path=/abc
多个配置用空格分开； --配置项=值
2. 来自java:comp/env的JNDI属性
3.Java系统属性（System.getProperties()）
4.操作系统环境变量
5.RandomValuePropertySource配置的random.*属性值
由jar包外向jar包内进行寻找；
优先加载带profile
6.jar包外部的application-{profile}.properties或application.yml(带spring.profile)配置文件
7.jar包内部的application-{profile}.properties或application.yml(带spring.profile)配置文件
再来加载不带profile
8.jar包外部的application.properties或application.yml(不带spring.profile)配置文件
9.jar包内部的application.properties或application.yml(不带spring.profile)配置文件
10.@Configuration注解类上的@PropertySource
11.通过SpringApplication.setDefaultProperties指定的默认属性

## springboot日志框架

springboot中的日志框架是面向接口的模式，我们配置springboot使用某种日志接口（slf4j），导入该接口的一个实现（Logback）

slf4j日志系统结构图

![image-20210111191806114](springboot.assets/image-20210111191806114.png)



### 初步使用

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
public class HelloWorld {
public static void main(String[] args) {
Logger logger = LoggerFactory.getLogger(HelloWorld.class);
logger.info("Hello World");
}
}
```

### 冲突

当我们引入第三方库，它可能使用了与slf4j不同的日志框架实现，这种情况需要我们将原有的日志框架移除，引入适配包，将原有日志接口的调用转换为slf4j接口的调用

![image-20210111192301983](springboot.assets/image-20210111192301983.png)

### 配置

日志输出格式：
%d表示日期时间，
%thread表示线程名，
%‐5level：级别从左显示5个字符宽度
%logger{50} 表示logger名字最长50个字符，否则按照句点分割。
%msg：日志消息，
%n是换行符
‐‐>
%d{yyyy‐MM‐dd HH:mm:ss.SSS} [%thread] %‐5level %logger{50} ‐ %msg%n

```properties
logging.level.com.atguigu=trace
#logging.path=
# 不指定路径在当前项目下生成springboot.log日志
# 可以指定完整的路径；
#logging.file=G:/springboot.log
# 在当前磁盘的根路径下创建spring文件夹和里面的log文件夹；使用 spring.log 作为默认文件
logging.path=/spring/log
# 在控制台输出的日志的格式
logging.pattern.console=%d{yyyy‐MM‐dd} [%thread] %‐5level %logger{50} ‐ %msg%n
# 指定文件中日志输出的格式
logging.pattern.file=%d{yyyy‐MM‐dd} === [%thread] === %‐5level === %logger{50} ==== %msg%n
```

如果使用不同的日志实现，在类路径下放对应的日志配置文件即可

## web

### 静态资源映射

- 所有/webjars/ ，都去classpath:/META-INF/resources/webjars/找资源
  webjars以jar包的方式引入静态资源
- 静态资源文件夹
  "classpath:/META‐INF/resources/",
  "classpath:/resources/",
  "classpath:/static/",
  "classpath:/public/"
  "/"：当前项目的根路径
- 欢迎页
  静态资源文件夹下所有的index.html
- 图标
  favicon.ico都在静态资源文件夹找

### 模板引擎

thymeleaf

引入

```xml
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring‐boot‐starter‐thymeleaf</artifactId>
2.1.6
</dependency>
切换thymeleaf版本
<properties>
<thymeleaf.version>3.0.9.RELEASE</thymeleaf.version>
<!‐‐ 布局功能的支持程序 thymeleaf3主程序 layout2以上版本 ‐‐>
<!‐‐ thymeleaf2 layout1‐‐>
<thymeleaf‐layout‐dialect.version>2.2.2</thymeleaf‐layout‐dialect.version>
</properties>
```



### spring MVC



### 定制错误数据



### 异常处理

ControllerAdvice注解与ExceptionHandler的使用,使用ControllerAdvice时最好指定controller，否则会处理所有异常

#### 创建异常实体类

包装异常信息

ErrorResponse.java

```java
package com.example.demo.exception;

public class ErrorResponse {
    String message;
    String errorTypeName;
    public ErrorResponse(Exception e){
        message = e.getMessage();
        errorTypeName = e.getClass().getName();
    }
    public ErrorResponse(String type, String msg){
        message = msg;
        errorTypeName = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getErrorTypeName() {
        return errorTypeName;
    }

    public void setErrorTypeName(String errorTypeName) {
        this.errorTypeName = errorTypeName;
    }
}

```

#### 自定义异常信息

一般我们处理的都是 `RuntimeException` ，所以如果你需要自定义异常类型的话直接集成这个类就可以了

```java
package com.example.demo.exception;
// 继承RuntimeException异常
public class ResourceNotFoundException extends  RuntimeException {
    String message;
    public ResourceNotFoundException(){
        super();
    }
    public ResourceNotFoundException(String msg){
        super(msg);
        this.message = msg;
    }

    @Override
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

```

#### 异常处理类

我们只需要在类上加上`@ControllerAdvice`注解这个类就成为了全局异常处理类，当然你也可以通过 `assignableTypes `指定特定的 `Controller `类，让异常处理类只处理特定类抛出的异常。

```java
package com.example.demo.exception;

import com.example.demo.controller.ExceptionController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

@ControllerAdvice(assignableTypes = {ExceptionController.class})
@ResponseBody
public class GlobalExceptionHandler {
    ErrorResponse e1 = new ErrorResponse(new IllegalArgumentException("参数错误"));
    ErrorResponse e2 = new ErrorResponse(new ResourceNotFoundException("资源未找到"));
    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<ErrorResponse> exceptionHandler(Exception e){
        if(e instanceof IllegalArgumentException){
            return ResponseEntity.status(400).body(e1);
        }else if(e instanceof  ResourceNotFoundException){
            return ResponseEntity.status(400).body(e2);
        }
        return null;
    }
}

```

#### 抛出异常

ExceptionController.java

```java
package com.example.demo.controller;

import com.example.demo.exception.ResourceNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController 
@RequestMapping("/exception")
public class ExceptionController {
    @GetMapping("/illegalArgument")
    public void throwIllegalArgu(){
        throw new IllegalArgumentException();
    }

    @GetMapping("/ResourceNotFound")
    public void throwResourceNotFound(){
        throw new ResourceNotFoundException();
    }
}

```

访问指定接口即可看到对应异常信息

![image-20210115132704187](springboot.assets/image-20210115132704187.png)

#### ResponseStatusException

```java
 @GetMapping("/resourceNotFoundException2")
    public void throwException3() {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Sorry, the resourse not found!", new ResourceNotFoundException());
    }
```

![image-20210115143450769](springboot.assets/image-20210115143450769.png)



### 过滤器

Filter 过滤器这个概念应该大家不会陌生，特别是对与从 Servlet 开始入门学 Java 后台的同学来说。那么这个东西我们能做什么呢？Filter 过滤器主要是用来过滤用户请求的，它允许我们对用户请求进行前置处理和后置处理，比如实现 URL 级别的权限控制、过滤非法请求等等。Filter 过滤器是面向切面编程——AOP 的具体实现（AOP切面编程只是一种编程思想而已）。

另外，Filter 是依赖于 Servlet 容器，`Filter`接口就在 Servlet 包下面，属于 Servlet 规范的一部分。所以，很多时候我们也称其为“增强版 Servlet”。

如果我们需要自定义 Filter 的话非常简单，只需要实现 `javax.Servlet.Filter` 接口，然后重写里面的 3 个方法即可

其对请求的处理流程如下

![image-20210118213556164](springboot.assets/image-20210118213556164.png)

#### 自定义filter

##### 自己注册配置

编写filter组件

```java
package com.example.demo.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class HelloFilter implements Filter {
    Logger logger = LoggerFactory.getLogger(HelloFilter.class);

    @Override
    public void init(FilterConfig filterConfig) {
        logger.info("初始化过滤器！");
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        // TODO Auto-generated method stub
        // 对请求进行预处理
        logger.info("过滤器开始对请求进行预处理：");
        HttpServletRequest servletRequest = (HttpServletRequest) request;
        String requestUri = servletRequest.getRequestURI();
        System.out.println("请求的接口为：" + requestUri);
        long startTime = System.currentTimeMillis();
        // 通过 doFilter 方法实现过滤功能
        chain.doFilter(request, response);
        // 上面的 doFilter 方法执行结束后用户的请求已经返回
        long endTime = System.currentTimeMillis();
        System.out.println("该用户的请求已经处理完毕，请求花费的时间为：" + (endTime - startTime));
    }

    @Override
    public void destroy() {
        logger.info("销毁过滤器");
    }
}

```

编写配置组件

```sql
package com.example.demo.config;

import java.util.ArrayList;
import java.util.Arrays;

import com.example.demo.filter.HelloFilter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {
    @Autowired
    HelloFilter helloFilter;

    @Bean
    public FilterRegistrationBean<HelloFilter> thirdFilter() {
        FilterRegistrationBean<HelloFilter> filterRegistrationBean = new FilterRegistrationBean<>();

        filterRegistrationBean.setFilter(helloFilter);

        filterRegistrationBean.setUrlPatterns(new ArrayList<>(Arrays.asList("/hello")));

        return filterRegistrationBean;
    }
}
```

![image-20210118213818259](springboot.assets/image-20210118213818259.png)

##### 使用预定义注解

在自己的过滤器的类上加上`@WebFilter` 然后在这个注解中通过它提供好的一些参数进行配置。

```sql
@WebFilter(filterName = "helloFilter", urlPatterns = "/hello")
```

另外，为了能让 Spring 找到它，你需要在启动类上加上 `@ServletComponentScan` 注解。

##### 多个拦截器的执行顺序

通过`FilterRegistrationBean` 的`setOrder` 方法可以决定 Filter 的执行顺序

```java
@Configuration
public class FilterConfig {
    @Autowired
    HelloFilter helloFilter;

    @Autowired
    HelloFilter2 helloFilter2;

    @Bean
    public FilterRegistrationBean<HelloFilter> thirdFilter() {
        FilterRegistrationBean<HelloFilter> filterRegistrationBean = new FilterRegistrationBean<>();
        filterRegistrationBean.setOrder(1);
        filterRegistrationBean.setFilter(helloFilter);

        filterRegistrationBean.setUrlPatterns(new ArrayList<>(Arrays.asList("/hello")));

        return filterRegistrationBean;
    }

    @Bean
    public FilterRegistrationBean<HelloFilter2> secondFilter() {
        FilterRegistrationBean<HelloFilter2> filterRegistrationBean = new FilterRegistrationBean<>();
        filterRegistrationBean.setOrder(2);
        filterRegistrationBean.setFilter(helloFilter2);

        filterRegistrationBean.setUrlPatterns(new ArrayList<>(Arrays.asList("/hello")));

        return filterRegistrationBean;
    }
}
```



## servlet 容器

springboot默认使用嵌入式servlet容器，根据官网描述，最新版springboot支持的servlet容器

![1587693307710](assets/1587693307710.png)



## springboot DAO





### jdbc



### mybatis



### springData JPA

需要的依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
```

配置springboot jpa数据源

```yml
spring:
  profiles: prod
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/person
    username: root
    password: wodemima
    driver-class-name: "com.mysql.cj.jdbc.Driver"
  jpa:
    properties:
      hibernate:
        enable_lazy_load_no_trans: true
    show-sql: true
    hibernate:
      ddl-auto: update
    open-in-view: false
  h2:
    console:
      enabled: true
```

其中ddl_auto:

1. `create`:每次重新启动项目都会重新创新表结构，会导致数据丢失
2. `create-drop`:每次启动项目创建表结构，关闭项目删除表结构
3. `update`:每次启动项目会更新表结构
4. `validate`:验证表结构，不对数据库进行任何更改

实体类

```java
package com.example.demo.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String name;
    private Integer age;

    public Person(String name, Integer age) {
        this.name = name;
        this.age = age;
    }
}
```

创建repository

```java
package com.example.demo.repository;

import com.example.demo.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
    Optional<Person> findAllByAgeAfter(Integer age);
    Optional<Person> findPersonByNameStartingWith(String prefix);
    @Query("select p.name from Person p where p.id= :id")
    String findPersonNameById(@Param("id") Long id);
}
```

可以使用repository进行增删查改的操作

test

```java
package com.example.demo.repository;

import com.example.demo.entity.Person;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
@RunWith(SpringRunner.class)
public class PersonRepositoryTest {
    @Autowired
    PersonRepository personRepository;
    Long id;
    @Before
    public void setUp() {
        assertNotNull(personRepository);
        Person person = new Person("SnailClimb", 23);
        Person savedPerson = personRepository.saveAndFlush(person);// 更新 person 对象的姓名
        savedPerson.setName("UpdatedName");
        personRepository.save(savedPerson);

        id = savedPerson.getId();
    }
    @Test
    public void should_get_person() {
        Optional<Person> personOptional = personRepository.findById(id);
        assertTrue(personOptional.isPresent());
        assertEquals("UpdatedName", personOptional.get().getName());
        assertEquals(Integer.valueOf(23), personOptional.get().getAge());

//        List<Person> personList = personRepository.findByAgeGreaterThan(18);
//        assertEquals(1, personList.size());
        // 清空数据库
        personRepository.deleteAll();
    }

    @Test
    public void should_get_person_use_custom_query() {
        // 查找所有字段
        Optional<Person> personOptional = personRepository.findAllByAgeAfter(3);

        System.out.println(personOptional.toString());
//        Optional<Person> personOptional = personRepository.findByNameCustomeQuery("SnailClimb");
//        assertTrue(personOptional.isPresent());
//        assertEquals(Integer.valueOf(23), personOptional.get().getAge());
//        // 查找部分字段
        String personName = personRepository.findPersonNameById(id);
        assertEquals("UpdatedName", personName);
//        System.out.println(id);
//        // 更新
//        personRepository.updatePersonNameById("UpdatedName", id);
//        Optional<Person> updatedName = personRepository.findByNameCustomeQuery("UpdatedName");
//        assertTrue(updatedName.isPresent());
        // 清空数据库
        personRepository.deleteAll();
    }
}
```

repository中可以自定义sql查询语句，详情可参考

https://docs.spring.io/spring-data/jpa/docs/2.4.3/reference/html/#jpa.query-methods



#### 关联查询



## restful



## 原理解析





## 缓存





## 消息



## 检索-elasticsearch



## 定时任务



## 安全

### 登录认证

### 权限控制



## 分布式



## maven配置

指定jdk

```xml
<profile>
    <id>jdk‐1.8</id>
    <activation>
        <activeByDefault>true</activeByDefault>
        <jdk>1.8</jdk>
    </activation>
    <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>
    </properties>
</profile>

```

指定maven镜像

```xml
<mirror>
    <id>nexus-aliyun</id>
    <mirrorOf>central</mirrorOf>
    <name>Nexus aliyun</name>
    <url>http://maven.aliyun.com/nexus/content/groups/public</url>
</mirror>

```

