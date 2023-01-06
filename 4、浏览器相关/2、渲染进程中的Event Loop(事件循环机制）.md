选自：
[带你彻底弄懂Event Loop](https://segmentfault.com/a/1190000016278115)

[什么是 Event Loop？](http://www.ruanyifeng.com/blog/2013/10/event_loop.html)

# 宏队列和微队列

## 为什么消息队列要有宏队列和微队列之分

1. 宏任务可以满足我们大部分的日常需求，但是宏任务的时间粒度比较大，执行的时间间隔是不能精确控制的，

## **宏队列，macrotask，也叫tasks。** 

一些异步任务的回调会依次进入macro task queue，等待后续被调用，这些异步任务包括：

1. setTimeout 
2. setInterval 
3. setImmediate (Node独有)
4. requestAnimationFrame  (浏览器独有)
5. I/O 
6. UI rendering (浏览器独有)

## **微队列，microtask，也叫jobs。** 

另一些异步任务的回调会依次进入micro task queue，等待后续被调用，这些异步任务包括：

 7. process.nextTick (Node独有)
 8.  Promise 
 9. Object.observe 
 10. MutationObserver（用来监视 DOM 变动。比如节点的增减、属性的变动、文本内容的变动。）
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
    1. 所以导致一个问题：微任务，如果添加速度大于执行速度，并且一直添加，则微队列一直不为空，它就会阻塞UI线程 

* 好了，概念性的东西就这么多，来看几个示例代码，测试一下你是否掌握了:

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

> 打印结果：
> 1

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

> 打印结果：
> 1

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

> 打印结果：
> 1
> 4

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

> 打印结果：
> 1
> 4

**Step 5**
console.log(7)

> 打印结果：
> 1
> 4
> 7

* 好啦，全局Script代码执行完了，进入下一个步骤，从microtask queue中依次取出任务执行，直到microtask queue队列为空。

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

* 这里microtask queue中只有一个任务，执行完后开始从宏任务队列macrotask queue中取位于队首的任务执行

**Step 7**

```javascript
console.log(2)
```

Stack Queue: [callback1]

Macrotask Queue: [callback3]

Microtask Queue: []
* 但是，执行callback1的时候又遇到了另一个Promise，Promise异步执行完后在microtask queue中又注册了一个callback4回调函数
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
* 取出一个宏任务macrotask执行完毕，然后再去微任务队列microtask queue中依次取出执行

**Step 9**

```javascript
console.log(3)
```

Stack Queue: [callback4]

Macrotask Queue: [callback3]

Microtask Queue: []
* 微任务队列全部执行完，再去宏任务队列中取第一个任务执行

* 以上，全部执行完后，Stack Queue为空，Macrotask Queue为空，Micro Queue为空 

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

###  进阶题目：

1. 

```js
//2 3 5 6 4 7 8 1
setTimeout(() => {
    console.log(1);
}, 0);
console.log(2);
async1()

async function async1() {
    console.log(3);
    await async2();
    console.log(4);
    //对await进行改写
    // new Promise((resolve)=>{
    //     async2()
    //     resolve()
    // }).then(()=>{
    //     console.log(4);
    // })
}
requestAnimationFrame(() => {
    console.log(8);
})
async function async2() {
    console.log(5);
}
new Promise((resolve, reject) => {
    console.log(6);
    resolve();
}).then(() => {
    console.log(7);
})
```

2. 

```js
   async function async1() {
       console.log('async1 start');
       await async2();
       console.log('async1 end');
   }

   async function async2() {
       console.log('async2 start');
       return new Promise((resolve, reject) => {
           resolve();
           console.log('async2 promise');
       })
   }

   console.log('script start');

   setTimeout(function() {
       console.log('setTimeout');
   }, 0);

   async1();

   new Promise(function(resolve) {
       console.log('promise1');
       resolve();
   }).then(function() {
       console.log('promise2');
   }).then(function() {
       console.log('promise3');
   });

   console.log('script end');
```

3. 

```js
   new Promise((resolve, reject) => {
       console.log("async1 start");
       console.log("async2");
       resolve(Promise.resolve());
   }).then(() => {
       console.log("async1 end");
   });

   new Promise(function(resolve) {
       console.log("promise1");
       resolve();
   }).then(function() {
       console.log("promise2");
   }).then(function() {
       console.log("promise3");
   }).then(function() {
       console.log("promise4");
   });
```

   
