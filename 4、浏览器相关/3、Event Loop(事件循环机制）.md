选自：
[带你彻底弄懂Event Loop](https://segmentfault.com/a/1190000016278115)

[什么是 Event Loop？](http://www.ruanyifeng.com/blog/2013/10/event_loop.html)
# Event Loop是什么
>"Event Loop是一个程序结构，用于等待和发送消息和事件。（a programming construct that waits for and dispatches events or messages in a program.）"
>简单说，就是在程序中设置两个线程：一个负责程序本身的运行，称为"主线程"；
>另一个负责主线程与其他进程（主要是各种I/O操作）的通信，被称为"Event Loop线程"（可以译为"消息线程"）
>![在这里插入图片描述](https://img-blog.csdnimg.cn/20210305113641120.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FidWFuZGVu,size_16,color_FFFFFF,t_70)
>上图主线程的绿色部分，还是表示运行时间，而橙色部分表示空闲时间。每当遇到I/O的时候，主线程就让Event Loop线程去通知相应的I/O程序，然后接着往后运行，所以不存在红色的等待时间。等到I/O程序完成操作，Event Loop线程再把结果返回主线程。主线程就调用事先设定的回调函数，完成整个任务。
>这里建议直接看： [什么是 Event Loop？](http://www.ruanyifeng.com/blog/2013/10/event_loop.html)

**event loop是一个执行模型，在不同的地方有不同的实现。浏览器和NodeJS基于不同的技术实现了各自的Event Loop。**

 - 浏览器的Event Loop是在html5的规范中明确定义。
 - NodeJS的Event Loop是基于libuv实现的。可以参考Node的官方文档以及libuv的官方文档。 
 - libuv已经对Event Loop做出了实现，而HTML5规范中只是定义了浏览器中Event Loop的模型，具体的实现留给了浏览器厂商。


# 宏队列和微队列
## **宏队列，macrotask，也叫tasks。** 
一些异步任务的回调会依次进入macro task queue，等待后续被调用，这些异步任务包括：

 1. setTimeout 
 2. setInterval 
 3. setImmediate (Node独有)
 4.  requestAnimationFrame  (浏览器独有)
 5.  I/O 
 6. UI rendering (浏览器独有)

## **微队列，microtask，也叫jobs。** 
另一些异步任务的回调会依次进入micro task queue，等待后续被调用，这些异步任务包括：

 7. process.nextTick (Node独有)
 8.  Promise 
 9. Object.observe 
 10. MutationObserver
**（注：这里只针对浏览器和NodeJS）**

# 浏览器的Event Loop
我们先来看一张图，再看完这篇文章后，请返回来再仔细看一下这张图，相信你会有更深的理解。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210305105849896.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FidWFuZGVu,size_16,color_FFFFFF,t_70)
这张图将浏览器的Event Loop完整的描述了出来，我来讲执行一个JavaScript代码的具体流程：

 1. 执行全局Script同步代码，这些同步代码有一些是同步语句，有一些是异步语句（比如setTimeout等）；
 2. 全局Script代码执行完毕后，调用栈Stack会清空； 
 3.  从微队列microtask queue中取出位于队首的回调任务，放入调用栈Stack中执行，执行完后microtask queue长度减1；
 4. 继续取出位于队首的任务，放入调用栈Stack中执行，以此类推，直到直到把microtask queue中的所有任务都执行完毕。
 5. 注意，如果在执行microtask的过程中，又产生了microtask，那么会加入到队列的末尾，也会在这个周期被调用执行；
 6. microtask queue中的所有任务都执行完毕，此时microtask queue为空队列，调用栈Stack也为空；
 7. 取出宏队列macrotask queue中位于队首的任务，放入Stack中执行； 执行完毕后，调用栈Stack为空；
 8. 重复第3-7个步骤； 
 9. 重复第3-7个步骤； ......
**可以看到，这就是浏览器的事件循环Event Loop**

**这里归纳3个重点：**

 1. 宏队列macrotask一次只从队列中取一个任务执行，执行完后就去执行微任务队列中的任务；
 2. 微任务队列中所有的任务都会被依次取出来执行，直到microtask queue为空； 
 3. 图中没有画UI rendering的节点，因为这个是由浏览器自行判断决定的，但是只要执行UI rendering，它的节点是在执行完所有的microtask之后，下一个macrotask之前，紧跟着执行UI render。

- 好了，概念性的东西就这么多，来看几个示例代码，测试一下你是否掌握了:

```javascript
console.log(1);

setTimeout(() => {
  console.log(2);
  Promise.resolve().then(() => {
    console.log(3)
  });
});

new Promise((resolve, reject) => {
  console.log(4)
  resolve(5)
}).then((data) => {
  console.log(data);
})

setTimeout(() => {
  console.log(6);
})

console.log(7);
```

```javascript
// 正确答案
1
4
7
5
2
3
6
```

**我们来分析一下整个流程：**

**Step 1**

```javascript
console.log(1)
```
Stack Queue: [console]

Macrotask Queue: []

Microtask Queue: []
>打印结果：
>1


**Step 2**

```javascript
setTimeout(() => {
  // 这个回调函数叫做callback1，setTimeout属于macrotask，所以放到macrotask queue中
  console.log(2);
  Promise.resolve().then(() => {
    console.log(3)
  });
});
```
Stack Queue: [setTimeout]

Macrotask Queue: [callback1]

Microtask Queue: []
>打印结果：
>1

**Step 3**

```javascript
new Promise((resolve, reject) => {
  // 注意，这里是同步执行的
  console.log(4)
  resolve(5)
}).then((data) => {
  // 这个回调函数叫做callback2，promise属于microtask，所以放到microtask queue中
  console.log(data);
})
```
Stack Queue: [promise]

Macrotask Queue: [callback1]  //宏队列

Microtask Queue: [callback2]  //微队列
>打印结果：
>1
>4

**Step 4**

```javascript
setTimeout(() => {
  // 这个回调函数叫做callback3，setTimeout属于macrotask，所以放到macrotask queue中
  console.log(6);
})
```
Stack Queue: [setTimeout]

Macrotask Queue: [callback1, callback3]

Microtask Queue: [callback2]
>打印结果：
>1
>4

**Step 5**
console.log(7)
> 打印结果：
> 1
> 4
> 7
- 好啦，全局Script代码执行完了，进入下一个步骤，从microtask queue中依次取出任务执行，直到microtask queue队列为空。

Stack Queue: [console]

Macrotask Queue: [callback1, callback3]

Microtask Queue: [callback2]

**Step 6**
console.log(data)       // 这里data是Promise的决议值5

Stack Queue: [callback2]

Macrotask Queue: [callback1, callback3]

Microtask Queue: []

```javascript
打印结果：
1
4
7
5
```
- 这里microtask queue中只有一个任务，执行完后开始从宏任务队列macrotask queue中取位于队首的任务执行


**Step 7**

```javascript
console.log(2)
```
Stack Queue: [callback1]

Macrotask Queue: [callback3]

Microtask Queue: []
- 但是，执行callback1的时候又遇到了另一个Promise，Promise异步执行完后在microtask queue中又注册了一个callback4回调函数
**Step 8**

```javascript
Promise.resolve().then(() => {
  // 这个回调函数叫做callback4，promise属于microtask，所以放到microtask queue中
  console.log(3)
});
```
Stack Queue: [promise]

Macrotask v: [callback3]

Microtask Queue: [callback4]
- 取出一个宏任务macrotask执行完毕，然后再去微任务队列microtask queue中依次取出执行

**Step 9**

```javascript
console.log(3)
```
Stack Queue: [callback4]

Macrotask Queue: [callback3]

Microtask Queue: []
- 微任务队列全部执行完，再去宏任务队列中取第一个任务执行

- 以上，全部执行完后，Stack Queue为空，Macrotask Queue为空，Micro Queue为空 


再来一个例子：

```javascript
console.log(1);

setTimeout(() => {
  console.log(2);
  Promise.resolve().then(() => {
    console.log(3)
  });
});

new Promise((resolve, reject) => {
  console.log(4)
  resolve(5)
}).then((data) => {
  console.log(data);
  
  Promise.resolve().then(() => {
    console.log(6)
  }).then(() => {
    console.log(7)
    
    setTimeout(() => {
      console.log(8)
    }, 0);
  });
})

setTimeout(() => {
  console.log(9);
})

console.log(10);
// 正确答案
1
4
10
5
6
7
2
3
9
8
```

**在执行微队列microtask queue中任务的时候，如果又产生了microtask，那么会继续添加到队列的末尾，也会在这个周期执行，直到microtask queue为空停止。**

注：当然如果你在microtask中不断的产生microtask，那么其他宏任务macrotask就无法执行了，但是这个操作也不是无限的，拿NodeJS中的微任务process.nextTick()来说，它的上限是1000个