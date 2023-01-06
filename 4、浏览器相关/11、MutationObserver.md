# 如何监听DOM变化

以前： 
1. setTimeout 或者 setInterval 来定时检测 DOM 是否有改变。
    - 缺点：
      1. 如果时间间隔设置过长，DOM 变化响应不够及时；
      2. 如果时间间隔设置过短，又会浪费很多无用的工作量去检查 DOM，会让页面变得低效。

现在：
1. 2000年引入Mutation Event，Mutation Event 采用了观察者的设计模式，当 DOM 有变动时就会立刻触发相应的事件，这种方式属于同步回调。
   1. 但是因为每次 DOM 变动，渲染引擎都会去调用 JavaScript，这样会产生较大的性能开销。

2. 后来改用MutationObserver 
   1. 通过异步操作解决了同步操作的性能问题；
   2. 通过微任务解决了实时性的问题。（每次微任务队列执行完成，就到UI渲染线程）

# MutationObserverAPI和EventTargetAPI的addEventListener

共同点: 两者的回调函数执行都是异步任务，都要在主执行栈之后执行；

不同点：

1. addEventListener的回调函数会进入宏任务队列；

MutationObserver的回调函数会进入微任务队列

2. addEventListener的触发方式是同步触发；比如，点击后，回调函数立即进入宏任务队列。

MutationObserver的监听是异步触发，在所有的DOM操作完成后才触发使回调函数进入微任务队列。

比如，程序中有10个修改DOM的操作，只有在第十个处理完之后，回调函数才进入微任务队列。

# 用法
* 待总结
