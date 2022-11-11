[「硬核JS」深入了解异步解决方案 - 掘金]https://juejin.cn/post/6844904064614924302

ES6 Generator

promise中reslove后面的执行吗？执行，且同步

settimeout和setImmediate谁先执行 

做题输出
https://ychzx.top/guide/Interview/result.html#_13-%E4%BB%A3%E7%A0%81%E8%BE%93%E5%87%BA%E7%BB%93%E6%9E%9C
promise
13
14？
18 async中 awiat async2() 会同步执行async2()中的同步部分
20
24 注意p.then在first.then前执行
26 答案不对，应该是fulfilled,不是resolved 
* promise三种状态 pending fulfilled rejected
* finally的返回值如果在没有抛出错误的情况下默认会是上一个 Promise 的返回值，没有返回值就是undefined
30 无论是 then 还是 catch 中，只要 throw 抛出了错误，就会被 catch 捕获，如果没有 throw 出错误，就被继续执行后面的 then。

promise中的同步内容，在定义时就会执行吗
promise中reslove或者 reject过之后，不会再执行reslove或者 reject，但如果没有return还是会执行后面的输出
async中的同步内容，在调用async函数时才会开始执行

this
6
7
9
10
13

三 作用域闭包提升
5.
7 todo
8

四原型链
1.
8 todo

# promise
取消promise
一个正在执行中的promise怎样被取消？
其实就像一个执行中的ajax要被取消一样，ajax有abort()进行取消，而且fetch api 也有了相关的规范。
# **fetch 怎样取消？**
先来看下如何取消一个fetch请求 AbortController abort()
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
    });
}
```
方案1 - 借助reject 方法
方案2 - 借助 Promise.race() 方法
代码很简单，其实够短小精悍。
```javascript
//传入一个正在执行的promise
function getPromiseWithAbort(p){
    let obj = {};
    //内部定一个新的promise，用来终止执行
    let p1 = new Promise(function(resolve, reject){
        obj.abort = reject;
    });
    obj.promise = Promise.race([p, p1]);
    return obj;
}
```
调用
```javascript
var promise  = new Promise((resolve)=>{
 setTimeout(()=>{
  resolve('123')
 },3000)
})

var obj = getPromiseWithAbort(promise)

obj.promise.then(res=>{console.log(res)})

//如果要取消
obj.abort('取消执行')
```
其实取消promise执行和取消请求是一样的，并不是真的终止了代码的执行，而是对结果不再处理。另外fetch api虽然增加了新的标准实现，但仍然存在兼容问题，而且只能在浏览器中使用。那么非浏览器的环境中呢？比如RN？所以如果想要达到一种通用的方式，那么本文的取消promise的方式应该是个不错的方式。