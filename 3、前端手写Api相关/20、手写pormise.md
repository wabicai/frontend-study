```js
// 定义为常量好处: 复用并且写代码时有提示
const PENDING = 'pending'; // 等待
const FULFILLED = 'fulfilled'; // 成功
const REJECTED = 'rejected'; // 失败

class MyPromise {
    constructor(exectur) { // 执行器
        try {
            exectur(this.resolve, this.reject);
        } catch (error) {
            this.reject(error);
        }
    }
    /* 
      Promise 状态是每一个 Promise 独有的,所以我们定义为实例属性
      因为我们需要频繁的去使用它 这里我们可以将三种状态定义为常量
      默认为 等待状态
    */
    status = PENDING;
    // 成功之后的值
    value = undefined;
    // 失败后的原因
    reason = undefined;
    // 成功回调
    successCallback = [];
    // 失败回调
    failCallback = [];
    /*
      定义成箭头函数原因:
        调用的时候是直接调用的 如: resolve() 
        为了改变this指向,箭头函数的this指向的是执行上下文环境,在这就是指向 MyPromise的实例对象 
    */
    resolve = value => {
        // 如果状态不是等待,阻止程序向下执行
        if (this.status !== PENDING) return;
        // 将状态更改为成功
        this.status = FULFILLED;
        // 保存成功之后的值
        this.value = value;
        // 判断成功回调是否存在 如果存在 就调用
        // this.successCallback && this.successCallback(this.value);
        while (this.successCallback.length) this.successCallback.shift()();
    }
    reject = reason => {
        // 如果状态不是等待,阻止程序向下执行
        if (this.status !== PENDING) return;
        // 将状态更改为失败
        this.status = REJECTED;
        // 保存失败后的原因
        this.reason = reason;
        // 判断失败回调是否存在 如果存在 就调用
        // this.failCallback && this.failCallback(this.reason);
        while (this.failCallback.length) this.failCallback.shift()();
    }
    then(successCallback, failCallback) {
        successCallback = successCallback ? successCallback : value => value;
        failCallback = failCallback ? failCallback : reason => {
            throw reason
        };
        let promise2 = new MyPromise((resolve, reject) => {
            // 判断状态
            if (this.status === FULFILLED) {
                // 为了获得返回的 promise2对象 将代码变成异步代码
                setTimeout(() => {
                    try {
                        // 拿到成功回调的返回值
                        let x = successCallback(this.value);
                        /* 
                          判断x的值是普通值还是 promise 对象
                            普通值：直接调用 resolve
                            promise对象：查看promise对象返回的结果，再根据结果 决定调用 resolve 还是 reject
                        */
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            } else if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = failCallback(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            } else {
                // 等待状态
                // 将成功回调和失败回调存储起来
                this.successCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = successCallback(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (error) {
                            reject(error);
                        }
                    }, 0);
                });
                this.failCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = failCallback(this.reason);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (error) {
                            reject(error);
                        }
                    }, 0);
                });
            }
        });
        return promise2;
    }
    finally(callback) {
        // 得到当前 Promise对象的状态
        return this.then(value => {
            // 等待 finally中的 Promise对象执行完成后，再返回 value
            return MyPromise.resolve(callback()).then(() => value);
        }, reason => {
            return MyPromise.reject(callback()).then(() => {
                throw reason
            });
        })
    } catch (failCallback) {
        return this.then(undefined, failCallback);
    }
    static all(array) {
        // 用来存放结果的数组
        let result = [];
        let index = 0;
        return new MyPromise((resolve, reject) => {
            function addData(key, value) {
                result[key] = value;
                index++;
                /* 
                  因为参数有可能有异步状态
                  等待所有异步操作完成后才能调用resolve方法 
                */
                if (index === array.length) {
                    resolve(result);
                }
            }

            for (let i = 0, len = array.length; i < len; i++) {
                let current = array[i];
                // 判断 current是否是MyPromise 的实例
                if (current instanceof MyPromise) {
                    // promise对象
                    current.then(value => addData(i, value), reject);
                } else {
                    // 普通值
                    addData(i, current);
                }
            }
        })
    }
    // 只要有一个成功或者失败就返回
    static race(array) {
        let promise = new MyPromise((resolve, reject) => {
            for (let i = 0; i < array.length; i++) {
                let curr = array[i];
                // MyPromise实例 结果处理
                if (curr instanceof MyPromise) {
                    curr.then(resolve, reject);
                } else {
                    // 非MyPromise实例处理
                    resolve(curr);
                }
            }
        });
        return promise;
    }
    static resolve(value) {
        if (value instanceof MyPromise) return value;
        return new MyPromise(resolve => resolve(value));
    }
    static reject(reason) {
        // 如果是MyPromise 实例 则直接返回
        if (reason instanceof MyPromise) return reason;
        // 如果不是MyPromise 实例 否则返回一个 MyPromise实例
        return new MyPromise((resolve, reject) => reject(reason));
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
    }
    // 判断 x是否是MyPromise 的实例
    if (x instanceof MyPromise) {
        // promise对象
        // x.then(value => resolve(value),reason => reject(reason));
        // => 简化
        x.then(resolve, reject);
    } else {
        // 普通值
        resolve(x);
    }
}

module.exports = MyPromise;


function p2() {
    return new MyPromise((resolve, reject) => {
        // resolve('p2 resolve');
        reject('p2 reject');
    })
}

p2().then(value => {
    console.log(value);
}).catch(reason => {
    console.log(reason);
})
```