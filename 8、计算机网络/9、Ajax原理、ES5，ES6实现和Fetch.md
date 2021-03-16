选自：
[Ajax原理一篇就够了](https://segmentfault.com/a/1190000017396192)
[fetch 如何请求常见数据格式](https://juejin.cn/post/6844903619356000263)
[Ajax的面向对象的封装(ES5和ES6)ajax+php](https://blog.csdn.net/liliang250/article/details/109239333)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210309104232938.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FidWFuZGVu,size_16,color_FFFFFF,t_70)


@[TOC]

# 一、什么是Ajax

1. Ajax是一种**异步请求数据**的web开发技术，对于改善用户的体验和页面性能很有帮助。
2. 简单地说，在**不需要重新刷新页面的情况下**，Ajax 通过异步请求加载后台数据，并在网页上呈现出来。
3. 常见运用场景有表单验证是否登入成功、百度搜索下拉框提示和快递单号查询等等。
4. Ajax的目的是提高用户体验，较少网络数据的传输量。
5. 同时，由于**AJAX请求获取的是数据而不是HTML文档**，因此它也节省了网络带宽，让互联网用户的网络冲浪体验变得更加顺畅。

# 二、Ajax原理是什么

在解释Ajax原理之前，我们不妨先举个“领导想找小李汇报一下工作”例子，领导想找小李问点事，就委托秘书去叫小李，自己就接着做其他事情，直到秘书告诉他小李已经到了，最后小李跟领导汇报工作。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210309104442169.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FidWFuZGVu,size_16,color_FFFFFF,t_70)
Ajax请求数据流程与“领导想找小李汇报一下工作”类似。其中最核心的依赖是浏览器提供的**XMLHttpRequest**对象，它扮演的角色相当于秘书，使得浏览器可以发出HTTP请求与接收HTTP响应。浏览器接着做其他事情，等收到XHR返回来的数据再渲染页面。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210309104525258.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FidWFuZGVu,size_16,color_FFFFFF,t_70)

# 三、Ajax的使用

## 1.创建Ajax核心对象XMLHttpRequest(记得考虑兼容性)

```js
    1. var xhr=null;  
    2. if (window.XMLHttpRequest)  
    3.   {// 兼容 IE7+, Firefox, Chrome, Opera, Safari  
    4.   xhr=new XMLHttpRequest();  
    5.   } else{// 兼容 IE6, IE5 
    6.     xhr=new ActiveXObject("Microsoft.XMLHTTP");  
    7.   } 
```

## 2.向服务器发送请求

```javascript
    1. xhr.open(method,url,async);  
    2. send(string);//post请求时才使用字符串参数，否则不用带参数。
```

- method：请求的类型；GET 或 POST
- url：文件在服务器上的位置
- async：true（异步）或 false（同步）

**注意：post请求一定要设置请求头的格式内容**
例如：

```javascript
xhr.open("POST","test.html",true);  
xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");  
xhr.send("fname=Henry&lname=Ford");  //post请求参数放在send里面，即请求体
```

## 3.服务器响应处理（区分同步跟异步两种情况）

responseText 获得字符串形式的响应数据。

responseXML 获得XML 形式的响应数据。

### **①同步处理**

```javascript
    1. xhr.open("GET","info.txt",false);  
    2. xhr.send();  
    3. document.getElementById("myDiv").innerHTML=xhr.responseText; //获取数据直接显示在页面上
```

### **②异步处理**

相对来说比较复杂，要在请求状态改变事件中处理

```javascript
    1. xhr.onreadystatechange=function()  { 
    2.    if (xhr.readyState==4 &&xhr.status==200)  { 
    3.       document.getElementById("myDiv").innerHTML=xhr.responseText;  
    4.      }
    5.    } 
```

#### 什么是readyState？

readyState是XMLHttpRequest对象的一个属性，用来标识当前XMLHttpRequest对象处于什么状态。
readyState总共有5个状态值，分别为0~4，每个值代表了不同的含义

- 0：未初始化 -- 尚未调用.open()方法；
- 1：启动 -- 已经调用.open()方法，但尚未调用.send()方法；
- 2：发送 -- 已经调用.send()方法，但尚未接收到响应；
- 3：接收 -- 已经接收到部分响应数据；
- 4：完成 -- 已经接收到全部响应数据，而且已经可以在客户端使用了；

#### 什么是status？

HTTP状态码(status)由三个十进制数字组成，第一个十进制数字定义了状态码的类型，后两个数字没有分类的作用。HTTP状态码共分为5种类型：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210309105229513.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FidWFuZGVu,size_16,color_FFFFFF,t_70)
常见状态码：

- 200 表示从客户端发来的请求在服务器端被正常处理了。
- 204 表示请求处理成功，但没有资源返回。
- 301 表示永久性重定向。该状态码表示请求的资源已被分配了新的URI，以后应使用资源现在所指的URI。
- 302 表示临时性重定向。
- 304 表示客户端发送附带条件的请求时（指采用GET方法的请求报文中包含if-matched,if-modified-since,if-none-match,if-range,if-unmodified-since任一个首部）服务器端允许请求访问资源，但因发生请求未满足条件的情况后，直接返回304Modified（服务器端资源未改变，可直接使用客户端未过期的缓存）
- 400 表示请求报文中存在语法错误。当错误发生时，需修改请求的内容后再次发送请求。
- 401 表示未授权（Unauthorized)，当前请求需要用户验证
- 403 表示对请求资源的访问被服务器拒绝了
- 404 表示服务器上无法找到请求的资源。除此之外，也可以在服务器端拒绝请求且不想- 说明理由时使用。
- 500 表示服务器端在执行请求时发生了错误。也有可能是Web应用存在的bug或某些临时的故障。
- 503 表示服务器暂时处于超负载或正在进行停机维护，现在无法处理请求。

### ③GET和POST请求数据区别

1. 使用Get请求时,参数在URL中显示,而使用Post方式,则放在send里面
2. 使用Get请求发送数据量小,Post请求发送数据量大
3. 使用Get请求安全性低，会被缓存，而Post请求反之
   ![在这里插入图片描述](https://img-blog.csdnimg.cn/20210309105550886.png)
   ![在这里插入图片描述](https://img-blog.csdnimg.cn/20210309105600614.png)

# 四、Ajax封装

综上所述：完成一个基本的Ajax只需要四步

1. 创建异步对象：

   `let xhr = new XMLHttpRequest();`

2. 指定请求的方式/端口/文件：

   ` xhr.open('get','./a.txt',true);`

3. 发送请求：

   `xhr.send();`

4. 异步对象监听状态的变化(通过状态码)：

```js
       xhr.addEventListener('readystatechange',function(e){
                  if( xhr.readyState == 4 ){
                           console.log(xhr.responseText);
                  }

         } ,false);
```

这是最基本的实现，然后接下来进行对ajax的封装，使用es5和es6的两种方式进行面向对象的封装：

```javascript
//实现这里的代码
<script>
		let a = new ajax({
			url:"./../地址",// 必填
			method:"post",// 选填
			data:"数据"    // 这是 参数
			//相当于 对象参数的一样的参数
		}).then(function(data){
			// data就是后台响应回来的数据
			console.log(data)
		})
	</script>
```

## ES5的方式

```javascript
 
function ajax(options){
	// 初始化数据
	this.url = options.url
	this.method = options.method || "get"
	this.data = options.data || {}
 
	// 创建xhr
	this.xhr = new XMLHttpRequest()
 
	if( this.method === "get" ){// get
		this.get()
	}else{// post
		this.post()
	}
}
 
// 构造函数原型上的属性和方法将来都可以被该构造函数下所创建的对象所共有
ajax.prototype.get = function(){
	// 对象的方法 this 指向了对象本身
	this.xhr.open("get",this.url+"?"+this.data,true)
	this.xhr.send()
}
ajax.prototype.post = function(){
	// 对象的方法 this 指向了对象本身
	this.xhr.open("post",this.url)
	this.xhr.setRequestHeader("content-type","application/x-www-form-urlencoded")
	this.xhr.send(this.data)
}
ajax.prototype.then = function(fn){
	this.xhr.onreadystatechange = function(){
		// this指向了事件的触发者， a.xhr
		if( this.readyState === 4 && this.status === 200 ){
			fn(this.responseText)
		}
	}
}
 
```

## ES6

```javascript
class ajax{
	constructor(options){
		// 对象的解构赋值
		let{ method="get",url,data="" } = options
 
		// 创建xhr
		this.xhr = new XMLHttpRequest()
 
		// 判断
		if( method === "get" ){
			this.get(url,data)
		}else{
			this.post(url,data)
		}
	}
	// 在ES6的class类中的写法，原型上的方法是和构造器同级的
	get(url,data){
		this.xhr.open("get",url+"?"+data,true)
		this.xhr.send()
	}
	post(url,data){
		this.xhr.open("post",url,true)
		this.xhr.setRequestHeader("content-type","application/x-www-form-urlencoded")
		this.xhr.send(data)
	}
	then(fn){
		this.xhr.onreadystatechange = ()=>{
			if( this.xhr.readyState === 4 && this.xhr.status === 200 ){
				fn(this.xhr.responseText)
			}
		}
	}
}
```

# 一、Fetch API:序言

在 传统Ajax 时代，进行 API 等网络请求都是通过XMLHttpRequest或者封装后的框架进行网络请求,然而配置和调用方式非常混乱，对于刚入门的新手并不友好。今天我们介绍的Fetch提供了一个更好的替代方法，它不仅提供了一种简单，合乎逻辑的方式来跨网络异步获取资源，而且可以很容易地被其他技术使用，例如 Service Workers。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210309110800398.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FidWFuZGVu,size_16,color_FFFFFF,t_70)

# 二、与Ajax对比

使用Ajax请求一个 JSON 数据一般是这样：

```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', url/file,true);
xhr.onreadystatechange = function() {
   if(xhr.readyState==4){
        if(xhr.status==200){
            var data=xhr.responseText;
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
fetch(url).then(response => response.json())//解析为可读数据
  .then(data => console.log(data))//执行结果是 resolve就调用then方法
  .catch(err => console.log("Oh, error", err))//执行结果是 reject就调用catch方法

```

从两者对比来看，fetch代码精简许多，业务逻辑更清晰明了，使得代码易于维护，可读性更高。 总而言之，Fetch 优点主要有：

**1. 语法简洁，更加语义化，业务逻辑更清晰

2. 基于标准 Promise 实现，支持 async/await
3. 同构方便，使用isomorphic-fetch**

# 三 Promise复习

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210309111745540.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FidWFuZGVu,size_16,color_FFFFFF,t_70)

# 四 请求常见数据格式

接下来将介绍如何使用fetch请求本地文本数据，请求本地JSON数据以及请求网络接口。其实操作相比与Ajax，简单很多。

>fetch依然是借助xhr对象来实现的，跟ajax并没有本质区别，可以说依然属于ajax（异步获取数据）只是做了一点升级，api使用更加方便

```javascript
//HTML部分
  <div class="container">
    <h1>Fetch Api sandbox</h1>
    <button id="button1">请求本地文本数据</button>
    <button id="button2">请求本地json数据</button>
    <button id="button3">请求网络接口</button>
    <br><br>
    <div id="output"></div>
  </div>
  <script src="app.js"></script>

```

## 1.fetch请求本地文本数据

本地有一个test.txt文档，通过以下代码就可以获取其中的数据，并且显示在页面上。

```javascript
document.getElementById('button1').addEventListener('click',getText);
function getText(){
  fetch("test.txt")
      .then((res) => res.text())//注意：此处是res.text()
      .then(data => {
        console.log(data);
        document.getElementById('output').innerHTML = data;
      })
      .catch(err => console.log(err));
}

```

## 2.fetch请求本地JSON数据

本地有个posts.json数据，与请求本地文本不同的是，得到数据后还要用forEach遍历,最后呈现在页面上。

```javascript
document.getElementById('button2').addEventListener('click',getJson);
function getJson(){
  fetch("posts.json")
      .then((res) => res.json())
      .then(data => {
        console.log(data);
        let output = '';
        data.forEach((post) => {
          output += `<li>${post.title}</li>`;
        })
        document.getElementById('output').innerHTML = output;
      })
      .catch(err => console.log(err));
}

```

## 3.fetch请求网络接口

获取`https://api.github.com/users`中的数据，做法与获取本地JSON的方法类似,得到数据后，同样要经过处理

```javascript
document.getElementById('button3').addEventListener('click',getExternal);
function getExternal(){
  // https://api.github.com/users
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