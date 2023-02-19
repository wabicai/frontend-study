@[TOC](目录)

# promise 的优缺点

优点：

1. 对象的状态不受外界的影响，只有异步操作的结果可以决定是那种状态；
2. 状态一旦改变，就不会再次改变。任何时候都可以得到这个结果。在这里跟（event）事件不同，如果错过了这个事件结果再去监听，是监听不到 event 事件的。

缺点：

1. promise 一旦执行无法取消。 如果不设置回调函数 promise 内部抛出的错误，不会反映到外部。
2. 当处于 pending（进行中）的状态时，无法得知进行到那一阶段（刚开始或者即将完成）。

# 三、 怎么用 Promise

## resolve 的用法

> resolve 方法：将现有对象转为 promise 对象，它的参数分为四种情况：
>
> 1. 参数是一个 promise 实例；如果参数是 promise 实例，则不作修改，原样返回。
> 2. 参数是一个 thenable 对象，是指有 then 方法的对象；该方法会将这个对象转为 promise 对象，然后立即执行 then 方法。
> 3. 如果不是具有 then 方法的对象或者根本不是对象；如果参数是一个原始值，或者是一个不具有 then 方法的对象，则 promise。resolve 方法返回一个新的 promise 对象，状态为 resolved
> 4. 不带有任何参数；如果不带有任何参数会直接返回一个 resolved 状态的 promise 对象。

### 实现间隔两次两秒打印函数

```javascript
function timeout(ms) {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, ms, "done");
	});
}
timeout(2000)
	.then((value) => {
		console.log(value); //done
		return timeout(2000);
	})
	.then((value) => {
		console.log(value);
	});
```

### 实现 Promise 的取消或打断

> 取消 promise 执行和取消请求是一样的，并不是真的终止了代码的执行，而是对结果不再处理。

```js
// 1、Promises/A+标准：原Promise对象的状态将跟新对象保持一致。利用这一特性，当新对象保持“pending”状态时，原Promise链将会中止执行
Promise.resolve()
	.then(() => {
		console.log("ok1");
		return new Promise(() => {}); // 返回“pending”状态的Promise对象
	})
	.then(() => {
		// 后续的函数不会被调用
		console.log("ok2");
	})
	.catch((err) => {
		console.log("err->", err);
	});
// 2、Promise.race竞速方法
// 3、当Promise链中抛出一个错误时，错误信息沿着链路向后传递，直至被捕获。
Promise.resolve()
	.then(() => {
		console.log("ok1");
		throw "throw error1";
	})
	.then(
		() => {
			console.log("ok2");
		},
		(err) => {
			// 捕获错误
			console.log("err->", err);
		}
	)
	.then(() => {
		// 该函数将被调用
		console.log("ok3");
		throw "throw error3";
	})
	.then(() => {
		// 错误捕获前的函数不会被调用
		console.log("ok4");
	})
	.catch((err) => {
		console.log("err->", err);
	});
```
