# 用法示例

```html
<template>
    <div id="example">{{message}}</div>
</template>
<script>
    var vm = new Vue({
        el: '##example',
        data: {
            message: '123'
        }
    })
    vm.message = 'new message' // 更改数据
    console.log(vm.$el.innerHTML) // '123'
    Vue.nextTick(function() {
        console.log(vm.$el.innerHTML) // 'new message'
    })
</script>
```

## 功能实现

* 宏任务(macro task) 有 setTimeout、MessageChannel、postMessage、setImmediate；
* 微任务(micro task）有MutationObsever 和 Promise.then。

### 能力检测（针对异步队列的实现）

> Vue 在内部对异步队列尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，
> 如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替。

```JS
/* 对于宏任务(macro task) */
// 检测是否支持原生 setImmediate(高版本 IE 和 Edge 支持)
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    macroTimerFunc = () => {
        setImmediate(flushCallbacks)
    }
    // 检测是否支持原生的 MessageChannel
} else if (typeof MessageChannel !== 'undefined' && (
        isNative(MessageChannel) ||
        // PhantomJS
        MessageChannel.toString() === '[object MessageChannelConstructor]'
    )) {
    const channel = new MessageChannel()
    const port = channel.port2
    channel.port1.onmessage = flushCallbacks
    macroTimerFunc = () => {
        port.postMessage(1)
    }
    // 都不支持的情况下，使用setTimeout
} else {
    macroTimerFunc = () => {
        setTimeout(flushCallbacks, 0)
    }
}

/* 对于微任务(micro task) */
// 检测浏览器是否原生支持 Promise
if (typeof Promise !== 'undefined' && isNative(Promise)) {
    const p = Promise.resolve()
    microTimerFunc = () => {
        p.then(flushCallbacks)
    }
}
// 不支持的话直接指向 macro task 的实现。
else {
    // fallback to macro
    microTimerFunc = macroTimerFunc
}
```

### 执行回调队列

```js
export function nextTick(cb ? : Function, ctx ? : Object) {
    let _resolve
    // 将回调函数推入回调队列
    callbacks.push(() => {
        if (cb) {
            try {
                cb.call(ctx)
            } catch (e) {
                handleError(e, ctx, 'nextTick')
            }
        } else if (_resolve) {
            _resolve(ctx)
        }
    })
    // 如果异步锁未锁上，锁上异步锁，调用异步函数，准备等同步函数执行完后，就开始执行回调函数队列
    if (!pending) {
        pending = true
        if (useMacroTask) {
            macroTimerFunc()
        } else {
            microTimerFunc()
        }
    }
    // 如果没有提供回调，并且支持Promise，返回一个Promise
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(resolve => {
            _resolve = resolve
        })
    }
}
```

### tips

1. 如何保证只在接收第一个回调函数时执行异步方法？

nextTick源码中使用了一个异步锁的概念，即接收第一个回调函数时，先关上锁，执行异步方法。此时，浏览器处于等待执行完同步代码就执行异步代码的情况。

2. 执行 flushCallbacks 函数时为什么需要备份回调函数队列？执行的也是备份的回调函数队列？

因为，会出现这么一种情况：nextTick 的回调函数中还使用 nextTick。如果 flushCallbacks 不做特殊处理，直接循环执行回调函数，会导致里面nextTick 中的回调函数会进入回调队列。

3. 为什么要优先使用微任务

微任务一定比宏任务优先执行，如果nextTick是微任务，它会在当前同步任务执行完立即执行所有的微任务，也就是修改DOM的操作也会在当前调用栈内执行。
如果nextTick是宏任务，它会被推进宏任务队列，并且在本轮tick执行完之后的某一轮执行，注意，它并不一定是下一轮，因为你不确定宏任务队列中它之前还有多少个宏任务在等待着。
