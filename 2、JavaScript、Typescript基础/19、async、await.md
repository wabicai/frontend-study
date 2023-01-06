选自：
[理解 JavaScript 的 async/await](https://segmentfault.com/a/1190000007535316)

[async 函数的含义和用法](http://www.ruanyifeng.com/blog/2015/05/async.html)
@[TOC]

# 1. async 和 await 在干什么

## 1.1. async 起什么作用

这个问题的关键在于，async 函数是怎么处理它的返回值的！

```js
async function testAsync() {
    return "hello async";
}

const result = testAsync();
console.log(result);
```

看到输出就恍然大悟了——输出的是一个 Promise 对象。

```javascript
Promise {
    'hello async'
}
```

async 函数返回的是一个 ` Promise 对象` 。
* 如果在函数中 return 一个直接量，async 会把这个直接量通过 `Promise.resolve() `封装成 Promise 对象。
* 如果return 一个函数，则返回的就是这个函数而已

> **补充知识点**
> Promise.resolve(x) 可以看作是 new Promise(resolve => resolve(x))
> 的简写，可以用于快速封装字面量对象或其他对象，将其封装成 Promise 实例。

现在回过头来想下，如果 async 函数没有返回值，又该如何？很容易想到，它会返回 `Promise.resolve(undefined)` 。

联想一下 Promise 的特点—— `无等待` ，所以**在没有 await 的情况下执行 async 函数，它会立即执行**，返回一个 Promise 对象，并且，**绝不会阻塞后面的语句**。这**和普通返回 Promise 对象的函数并无二致**。

## 1.2. await 到底在等啥

不过按语法说明，**await 等待的是一个表达式**，这个**表达式的计算结果是 Promise 对象或者其它值**（换句话说，就是**没有特殊限定**）。
**await 后面实际是可以接普通函数调用或者直接量的**。所以下面这个示例完全可以正确运行。
如果await 一个普通的setTimeout，await这个关键词其实没有起作用，只要在遇到 `promise` 类，才会等待。

```javascript
function getSomething() {
    return "something";
}

async function testAsync() {
    return Promise.resolve("hello async");
}

async function test() {
    const v1 = await getSomething();
    const v2 = await testAsync();
    console.log(v1, v2);
}

test();
```

# 2、async/await 帮我们干了啥

## 2.1 async/await 的优势在于处理 then 链

Promise 通过 then 链来解决多层回调的问题，现在又用 async/await 来进一步优化它

## 2.4. 并发执行多个请求

```javascript
async function dbFuc(db) {
    let docs = [{}, {}, {}];
    let promises = docs.map((doc) => db.post(doc));

    let results = await Promise.all(promises);
    console.log(results);
}

// 或者使用下面的写法

async function dbFuc(db) {
    let docs = [{}, {}, {}];
    let promises = docs.map((doc) => db.post(doc));

    let results = [];
    for (let promise of promises) {
        results.push(await promise);
    }
    console.log(results);
}
```

## 2.5. 如果结果是reject怎么办

await 命令后面的 Promise 对象，运行结果可能是 rejected，所以最好把 await 命令放在 try...catch 代码块中。

```javascript
async function myFunction() {
    try {
        await somethingThatReturnsAPromise();
    } catch (err) {
        console.log(err);
    }
}

// 另一种写法

async function myFunction() {
    await somethingThatReturnsAPromise().catch(function(err) {
        console.log(err);
    });
}
```

# 3、await怎么捕获异常
1. 除了使用 .catch 来错误异常，还可以使用 try/catch 来捕获异常

```js
async handleSubmit() {
    await Promise.all([a(), b()]).then(r => {
        console.log(r)
    }).catch(err => {
        console.log(err)
    })
}
async handleSumbit() {
    try {
        await Promise.all([a(), b()])
        return true
    } catch (err) {
        console.log(err)
        return false
    }
}
async validate() {
    try {
        await Promise.all([...validators.map(vm => vm.validate())])
        return true
    } catch (err) {
        return false
    }
},
```

2. throw  new Error()
# 4、Promise.all的缺陷
* promise.all如果有一个失败了不会继续执行，会直接进入catch，失败原因的是第一个失败 `promise` 的结果

1. 这样的话会导致关联性太强，解决办法？

   1. 解决：方法一：在每一个promise后面设置catch，里面返回一个resolve就行了（本质就是返回一个resolve，还有其他方法实现，都是基于这个原理）

```js
      const p1 = new Promise(resolve => {
          const a = b;
          resolve(a);
      }).catch(() => {
          return Promise.resolve('aaab')
      });
      const p2 = new Promise(resolve => {
          const a = 1;
          return resolve(a);
      }).catch(() => {
          return Promise.resolve('aaa')
      });

      Promise.all([p1, p2]).then((data) => {
          console.log('then 成功', data);
      }).catch((err) => {
          console.log('333');
          console.log('errr', err);
      })
```

   2. 方法二：用allSettled。

# 5. async/await实现原理
* generator
