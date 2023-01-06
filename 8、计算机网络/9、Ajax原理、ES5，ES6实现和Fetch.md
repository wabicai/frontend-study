选自：
[Ajax原理一篇就够了](https://segmentfault.com/a/1190000017396192)
[fetch 如何请求常见数据格式](https://juejin.cn/post/6844903619356000263)
[Ajax的面向对象的封装(ES5和ES6)ajax+php](https://blog.csdn.net/liliang250/article/details/109239333)
<img src="https://img-blog.csdnimg.cn/20210309104232938.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FidWFuZGVu,size_16,color_FFFFFF,t_70" alt="在这里插入图片描述" style="zoom:80%; " />

@[TOC]

# XMLHttpRequest

## 什么是status？

HTTP状态码(status)由三个十进制数字组成，第一个十进制数字定义了状态码的类型，后两个数字没有分类的作用。HTTP状态码共分为5种类型：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210309105229513.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FidWFuZGVu,size_16,color_FFFFFF,t_70)

常见状态码：

* 200 表示从客户端发来的请求在服务器端被正常处理了。
* 204 表示请求处理成功，但没有资源返回。
* 301 表示永久性重定向。该状态码表示请求的资源已被分配了新的URI，以后应使用资源现在所指的URI。
* 302 表示临时性重定向。
* 304 表示客户端发送附带条件的请求时（指采用GET方法的请求报文中包含if-matched, if-modified-since, if-none-match, if-range, if-unmodified-since任一个首部）服务器端允许请求访问资源，但因发生请求未满足条件的情况后，直接返回304Modified（服务器端资源未改变，可直接使用客户端未过期的缓存）
* 400 表示请求报文中存在语法错误。当错误发生时，需修改请求的内容后再次发送请求。
* 401 表示未授权（Unauthorized)，当前请求需要用户验证
* 403 表示对请求资源的访问被服务器拒绝了
* 404 表示服务器上无法找到请求的资源。除此之外，也可以在服务器端拒绝请求且不想- 说明理由时使用。
* 500 表示服务器端在执行请求时发生了错误。也有可能是Web应用存在的bug或某些临时的故障。
* 503 表示服务器暂时处于超负载或正在进行停机维护，现在无法处理请求。
# 四、Ajax封装

## ES6

```javascript
// 0：未初始化 -- 尚未调用.open()方法；
// 1：启动 -- 已经调用.open()方法，但尚未调用.send()方法；
// 2：发送 -- 已经调用.send()方法，但尚未接收到响应；
// 3：接收 -- 已经接收到部分响应数据；
// 4：完成 -- 已经接收到全部响应数据，而且已经可以在客户端使用了；
class ajax {
    constructor(options) {
        // 对象的解构赋值
        let {
            method = "get", url, data = ""
        } = options

        // 创建xhr
        this.xhr = new XMLHttpRequest()

        // 判断
        if (method === "get") {
            this.get(url, data)
        } else {
            this.post(url, data)
        }
    }
    // 在ES6的class类中的写法，原型上的方法是和构造器同级的
    get(url, data) {
        this.xhr.open("get", url + "?" + data, true)
        this.xhr.send()
    }
    post(url, data) {
        this.xhr.open("post", url, true)
        this.xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded")
        this.xhr.send(data)
    }
    then(fn) {
        this.xhr.onreadystatechange = () => {
            if (this.xhr.readyState === 4 && this.xhr.status === 200) {
                fn(this.xhr.responseText)
            }
        }
    }
}
```

# 一、Fetch API: 序言

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210309110800398.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FidWFuZGVu,size_16,color_FFFFFF,t_70)

# 二、与Ajax对比

使用Ajax请求一个 JSON 数据一般是这样：

```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', url / file, true);
xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var data = xhr.responseText;
                console.log(data);
            }
        };
        xhr.onerror = function() {
            console.log("Oh, error");
        };
        xhr.send();
```

同样我们使用fetch请求JSON数据：

```javascript
fetch(url).then(response => response.json()) //解析为可读数据
    .then(data => console.log(data)) //执行结果是 resolve就调用then方法
    .catch(err => console.log("Oh, error", err)) //执行结果是 reject就调用catch方法
```

从两者对比来看，fetch代码精简许多，业务逻辑更清晰明了，使得代码易于维护，可读性更高。 总而言之，Fetch 优点主要有：

1. 语法简洁，更加语义化，业务逻辑更清晰
2. 基于标准 Promise 实现，支持 async/await
3. 同构方便，使用isomorphic-fetch
# 四 请求常见数据格式

接下来将介绍如何使用fetch请求本地文本数据，请求本地JSON数据以及请求网络接口。其实操作相比与Ajax，简单很多。

## fetch请求网络接口

获取 `https://api.github.com/users` 中的数据，做法与获取本地JSON的方法类似, 得到数据后，同样要经过处理

```javascript
document.getElementById('button3').addEventListener('click', getExternal);

function getExternal() {
    fetch("https://api.github.com/users")
        .then((res) => res.json())
        .then(data => {
            console.log(data);
            let output = '';
            data.forEach((user) => {
                output += `<li>${user.login}</li>`;
            })
            document.getElementById('output').innerHTML = output;
        })
        .catch(err => console.log(err));
}
```

# 五、ajax、axios、fetch 优缺点对比

## $.ajax

> ajax 即 Asynchronous Javascript And XML（异步 JS 和 XML），是指一种创建交互式网页应用的网页开发技术

缺点：

* 本身是针对 `MVC` 的变成，不符合现在前端 `MVVM` 的浪潮
* 基于原生的 `XHR` 开发， `XHR` 本身架构不清晰，已经有了 `fetch` 的替代方案
* `JQ` 项目太大，单纯使用 `ajax` 就要引入 `jq` 非常不合理
* 无法防御 `XSS` 和 `CSRF`

* 不符合关注点分离原则

## fetch

> 号称 `ajax` 的替代品，是在 `ES6` 中出现的，使用了 `ES6` 中的 `Promise` 对象。
>
> fetch 是基于 `Promise` 设计的

```md
fetch不是ajax的进一步封装，而是使用原生js，没有使用XHR
```

优点：

* 符合关注分离，没有将输入、输出和用时间来跟踪的状态混杂在一个对象里
* 更好更方便的写法
* 更加体层，提供的 `API` 丰富
* 脱离了 `XHR` ，是 `ES` 规范里新的实现
* 只对网络请求报错，对 `400` 、 `500` 都当作成功的请求，需要封装去处理

缺点：

* 默认不会带 `cookie` ，需要添加配置项
* 不支持 `abort` ，不支持超时控制，使用 `setTimeout` 及 `Promise.reject` 的实现的超时控制并不能阻止请求过程继续在后台运行，造成了量得浪费
* 没有办法原生检测请求的进度，而 `XHR` 可以

## axios

> axios 是基于 `Promise` 用于浏览器和 `node.js` 的 `http` 客户端

优点：

* 从 `node.js` 创建 `http` 请求
* 支持 `Promise API`
* 在浏览器中创建 `XHR` ，在 `node.js` 中则创建 `http` 请求（自动性强）
* 支持拦截请求和响应
* 转换请求和响应数据
* 支持取消请求
* 自动转换 `JSON` 数据
* 支持防御 `XSS` 和 `CSRF`
* 既提供了并发的封装，也没有 `fetch` 的各种问题，体积也比较小。

## 参考链接

* [ajax、axios、fetch之间优缺点重点对比](https://zhuanlan.zhihu.com/p/58062212) 
* [ajax和axios、fetch的区别](https://www.jianshu.com/p/8bc48f8fde75) 

## axios怎么取消重复请求

1. 根据当前请求的请求方式、请求 URL 地址和请求参数来生成一个唯一的 key，作为cancelToken
2. 在响应拦截器Map遍历pedingRequest是否有该请求，进行移除。AbortController接口可以中止请求（中止下载也可以）
3. 需要注意的是已取消的请求可能已经达到服务端，针对这种情形，服务端的对应接口需要进行幂等控制
