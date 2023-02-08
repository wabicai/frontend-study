选自：
[Ajax 原理一篇就够了](https://segmentfault.com/a/1190000017396192)
[fetch 如何请求常见数据格式](https://juejin.cn/post/6844903619356000263)
[Ajax 的面向对象的封装(ES5 和 ES6)ajax+php](https://blog.csdn.net/liliang250/article/details/109239333)
<img src="https://img-blog.csdnimg.cn/20210309104232938.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FidWFuZGVu,size_16,color_FFFFFF,t_70" alt="在这里插入图片描述" style="zoom:80%; " />

@[TOC]

# Ajax 封装

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
		let { method = "get", url, data = "" } = options;

		// 创建xhr
		this.xhr = new XMLHttpRequest();

		// 判断
		if (method === "get") {
			this.get(url, data);
		} else {
			this.post(url, data);
		}
	}
	// 在ES6的class类中的写法，原型上的方法是和构造器同级的
	get(url, data) {
		this.xhr.open("get", url + "?" + data, true);
		this.xhr.send();
	}
	post(url, data) {
		this.xhr.open("post", url, true);
		this.xhr.setRequestHeader(
			"content-type",
			"application/x-www-form-urlencoded"
		);
		this.xhr.send(data);
	}
	then(fn) {
		this.xhr.onreadystatechange = () => {
			if (this.xhr.readyState === 4 && this.xhr.status === 200) {
				fn(this.xhr.responseText);
			}
		};
	}
}
```

# 一、Fetch API: 序言

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210309110800398.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FidWFuZGVu,size_16,color_FFFFFF,t_70)

# 二、与 Ajax 对比

使用 Ajax 请求一个 JSON 数据一般是这样：

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

同样我们使用 fetch 请求 JSON 数据：

```javascript
fetch(url)
	.then((response) => response.json()) //解析为可读数据
	.then((data) => console.log(data)) //执行结果是 resolve就调用then方法
	.catch((err) => console.log("Oh, error", err)); //执行结果是 reject就调用catch方法
```

从两者对比来看，fetch 代码精简许多，业务逻辑更清晰明了，使得代码易于维护，可读性更高。 总而言之，Fetch 优点主要有：

1. 语法简洁，更加语义化，业务逻辑更清晰
2. 基于标准 Promise 实现，支持 async/await
3. 同构方便，使用 isomorphic-fetch

# 四 请求常见数据格式

接下来将介绍如何使用 fetch 请求本地文本数据，请求本地 JSON 数据以及请求网络接口。其实操作相比与 Ajax，简单很多。

## fetch 请求网络接口

获取 `https://api.github.com/users` 中的数据，做法与获取本地 JSON 的方法类似, 得到数据后，同样要经过处理

```javascript
document.getElementById("button3").addEventListener("click", getExternal);

function getExternal() {
	fetch("https://api.github.com/users")
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
			let output = "";
			data.forEach((user) => {
				output += `<li>${user.login}</li>`;
			});
			document.getElementById("output").innerHTML = output;
		})
		.catch((err) => console.log(err));
}
```

# 五、ajax、axios、fetch 优缺点对比

## $.ajax

> ajax 即 Asynchronous Javascript And XML（异步 JS 和 XML），是指一种创建交互式网页应用的网页开发技术

缺点：

- 本身是针对 `MVC` 的变成，不符合现在前端 `MVVM` 的浪潮
- 基于原生的 `XHR` 开发， `XHR` 本身架构不清晰，已经有了 `fetch` 的替代方案
- `JQ` 项目太大，单纯使用 `ajax` 就要引入 `jq` 非常不合理
- 无法防御 `XSS` 和 `CSRF`

- 不符合关注点分离原则

## fetch

> 号称 `ajax` 的替代品，是在 `ES6` 中出现的，使用了 `ES6` 中的 `Promise` 对象。
>
> fetch 是基于 `Promise` 设计的

```md
fetch 不是 ajax 的进一步封装，而是使用原生 js，没有使用 XHR
```

优点：

- 符合关注分离，没有将输入、输出和用时间来跟踪的状态混杂在一个对象里
- 更好更方便的写法
- 更加体层，提供的 `API` 丰富
- 脱离了 `XHR` ，是 `ES` 规范里新的实现
- 只对网络请求报错，对 `400` 、 `500` 都当作成功的请求，需要封装去处理

缺点：

- 默认不会带 `cookie` ，需要添加配置项
- 不支持 `abort` ，不支持超时控制，使用 `setTimeout` 及 `Promise.reject` 的实现的超时控制并不能阻止请求过程继续在后台运行，造成了量得浪费
- 没有办法原生检测请求的进度，而 `XHR` 可以

## axios

> axios 是基于 `Promise` 用于浏览器和 `node.js` 的 `http` 客户端

优点：

- 从 `node.js` 创建 `http` 请求
- 支持 `Promise API`
- 在浏览器中创建 `XHR` ，在 `node.js` 中则创建 `http` 请求（自动性强）
- 支持拦截请求和响应
- 转换请求和响应数据
- 支持取消请求
- 自动转换 `JSON` 数据
- 支持防御 `XSS` 和 `CSRF`
- 既提供了并发的封装，也没有 `fetch` 的各种问题，体积也比较小。

## axios 怎么取消重复请求

1. 根据当前请求的请求方式、请求 URL 地址和请求参数来生成一个唯一的 key，作为 cancelToken
2. 在响应拦截器 Map 遍历 pedingRequest 是否有该请求，进行移除。AbortController 接口可以中止请求（中止下载也可以）
3. 需要注意的是已取消的请求可能已经达到服务端，针对这种情形，服务端的对应接口需要进行幂等控制

## fetch 请求 怎样取消？

先来看下如何取消一个 fetch 请求 AbortController abort()

```javascript
const url = "https://bigerfe.com/api/xxxx"
let controller;
let signal;

function requestA(){
 if (controller !== undefined) {
        controller.abort(); //终止请求
    }

    if ("AbortController" in window) {
        controller = new AbortController;
        signal = controller.signal;
    }

    fetch(url, {signal})
        .then((response) => {
            //do xxx
            updateAutocomplete()
        })
        .catch((error) => {
            //do xxx
            handleError(error);
        })
    };
}
```

方案 1 - 借助 reject 方法
方案 2 - 借助 Promise.race() 方法
代码很简单，其实够短小精悍。

```javascript
//传入一个正在执行的promise
function getPromiseWithAbort(p) {
	let obj = {};
	//内部定一个新的promise，用来终止执行
	let p1 = new Promise(function (resolve, reject) {
		obj.abort = reject;
	});
	obj.promise = Promise.race([p, p1]);
	return obj;
}
```

调用

```javascript
var promise = new Promise((resolve) => {
	setTimeout(() => {
		resolve("123");
	}, 3000);
});

var obj = getPromiseWithAbort(promise);

obj.promise.then((res) => {
	console.log(res);
});

//如果要取消
obj.abort("取消执行");
```

其实取消 promise 执行和取消请求是一样的，并不是真的终止了代码的执行，而是对结果不再处理。另外 fetch api 虽然增加了新的标准实现，但仍然存在兼容问题，而且只能在浏览器中使用。那么非浏览器的环境中呢？比如 RN？所以如果想要达到一种通用的方式，那么本文的取消 promise 的方式应该是个不错的方式。

## 参考链接

- [ajax、axios、fetch 之间优缺点重点对比](https://zhuanlan.zhihu.com/p/58062212)
- [ajax 和 axios、fetch 的区别](https://www.jianshu.com/p/8bc48f8fde75)
