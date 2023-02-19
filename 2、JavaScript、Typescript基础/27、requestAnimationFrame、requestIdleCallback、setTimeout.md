# 结论

1.  requestAnimationFrame 和 requestIdleCallback 既不是宏任务也不是微任务
2.  浏览器每一帧中间可能会进行多轮事件循环, 所以每一轮 Event Loop 事件循环中不一定会去重新渲染屏幕
3.  requestAnimationFrame 执行在浏览器渲染前，在微任务执行后执行
4.  requestIdleCallback 是在浏览器渲染后有空闲时间时执行，如果 requestIdleCallback 设置了第二个参数 timeout，则会在超时后的下一帧强制执行

# 浏览器任务执行顺序

1.  取出一个宏任务执行(一个 script 其实就是一个宏任务)
2.  JS 引擎线程依次执行同步任务
3.  执行所有微任务
4.  判断是否更新渲染屏幕，如果需要重新绘制，则执行步骤 5-14，如果不需要重新绘制，则流程回到步骤 1
5.  触发 resize、scroll 事件，建立媒体查询(如果有新的微任务,则先把微任务队列清空)
6.  建立 css 动画(如果有新的微任务,则先把微任务队列清空)
7.  执行 requestAnimationFrame 回调(如果有新的微任务,则先把微任务队列清空)
8.  执行 IntersectionObserver 回调(如果有新的微任务,则先把微任务队列清空)
9.  更新渲染屏幕
10. 浏览器判断当前帧是否还有空闲时间，如果有空闲时间，则执行步骤 11-13
11. 从 宏任务回调函数队列中取第一个，执行它
12. 执行微任务队列里的所有微任务
13. 流程回到步骤 9，直到 requestIdleCallback 回调函数队列清空或当前帧没有空闲时间
14. 流程回到步骤 1，这样不断循环

## requestAnimationFrame 和 setInterval

1. setTimeout 属于 JS 引擎，存在事件轮询，存在事件队列，是计时器线程单独运行
2. requestAnimationFrame 属于 GUI 引擎，发生在渲 染过程的中重绘重排部分
3. 当页面被隐藏或最小化时，定时器 setTimeout 仍在后台执行动画任 务。
4. 当页面处于未激活的状态下，该页面的屏幕刷新任务会被系统暂停，requestAnimationFrame 也会停止。
5. setTimeout 的执行时间并不是确定的。
