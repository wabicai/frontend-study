## 手写promise思路

1. 因为promise传入的是一个函数，所以要在里面执行器立即执行 excutor(resolve,reject)，执行器函数是同步执行
2. 定义resolve和reject函数
3. resolve和reject是异步函数，将回调放入callbacks队列。（判断队列长度是否为0，不为零的话，外层套一个setTimeout，执行成功的回调）
4. 回调队列里面是{onResolve(){},onReject(){}}这样的数组对象，所以在forEach的时候要调用onResolve/onReject函数
5. 因为执行器有可能会抛出异常，所以对excutor执行器套一层try,catch。
6. 在调用resove()函数的时候，他的this，是直接调用的，指向window，所以可以把this存起来。
7. then方法同步执行，then里面的参数异步回调。也就是说先把then里面的方法定义了，等遇到resolve（）的时候才调用

选自：[Promise不会？？看这里！！！史上最通俗易懂的Promise！！！](https://blog.csdn.net/weixin_33704234/article/details/91381041?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.control&dist_request_id=1328603.26757.16150104467492477&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.control)
@[TOC]

# 步骤一：实现成功和失败的回调方法
要实现上面代码中的功能，也是promise最基本的功能。首先，需要创建一个构造函数promise，创建一个promisel类，在使用的时候传入了一个执行器executor，executor会传入两个参数：成功(resolve)和失败(reject)。之前说过，只要成功，就不会失败，只要失败就不会成功。所以，默认状态下，在调用成功时，就返回成功态，调用失败时，返回失败态。代码如下：

```javascript
    //声明 class
    class myPromise {
        //声明构造方法
        constructor(executor) {
--------------------------------------------准备工作
            const self = this;
            //声明属性
            self.promiseStatus = 'pending';
            self.promiseValue = '';
            self.callbacks = [];
--------------------------------------------主要代码
            //声明函数 resolve
            function resolve(data) {
                //状态修改唯一性
                if (self.promiseStatus !== 'pending') return;
                // resolve 修改 Promise 对象状态(promiseStatus)为成功, 设置其成功的值(promiseValue)
                //修改状态
                self.promiseStatus = 'resolved';
                //修改值
                self.promiseValue = data;
                //执行成功的回调
                setTimeout(() => {
                    if (self.callbacks.length > 0) {
                        self.callbacks.forEach(callbackObj => {
                            callbackObj.onResolved(self.promiseValue);
                        });
                    }
                })
            }
            //声明函数 reject
            function reject(data) {
                //如果状态修改过, 则直接返回
                if (self.promiseStatus !== 'pending') return;
                //修改状态
                self.promiseStatus = 'rejected';
                //修改值
                self.promiseValue = data;
                //执行失败的回调
                setTimeout(() => {
                    if (self.callbacks.length > 0) {
                        self.callbacks.forEach(callbackObj => {
                            callbackObj.onRejected(self.promiseValue);
                        });
                    }
                });

            }
------------------------------------------执行函数
/**上面是定义resolve和reject函数，命名无所谓。下面的try才是执行函数*/
            try {
                executor(resolve, reject);
            } catch (e) {
                //如果抛错 则修改 promise 对象状态为失败
                reject(e);
            }
        }
```
>promise A+规范规定，在有异常错误时，则执行失败函数。


举例：

```javascript
    <div >开始异步请求</div>
    //声明 class
    class myPromise {
        //声明构造方法
        constructor(executor) {
            const self = this;
            //声明属性
            self.promiseStatus = 'pending';
            self.promiseValue = '';
            self.callbacks = [];
            //声明函数 resolve
            function resolve(data) {
                //状态修改唯一性
                if (self.promiseStatus !== 'pending') return;
                // resolve 修改 Promise 对象状态(promiseStatus)为成功, 设置其成功的值(promiseValue)
                //修改状态
                self.promiseStatus = 'resolved';
                //修改值
                self.promiseValue = data;
                //执行成功的回调
                setTimeout(() => {
                    if (self.callbacks.length > 0) {
                        self.callbacks.forEach(callbackObj => {
                            callbackObj.onResolved(self.promiseValue);
                        });
                    }
                })
            }
                        //声明函数 reject
            function reject(data) {
                //如果状态修改过, 则直接返回
                if (self.promiseStatus !== 'pending') return;
                //修改状态
                self.promiseStatus = 'rejected';
                //修改值
                self.promiseValue = data;
                //执行失败的回调
                setTimeout(() => {
                    if (self.callbacks.length > 0) {
                        self.callbacks.forEach(callbackObj => {
                            callbackObj.onRejected(self.promiseValue);
                        });
                    }
                });

            }

            //执行『执行器函数』
            try {
                executor(resolve, reject);
            } catch (e) {
                //如果抛错 则修改 promise 对象状态为失败
                reject(e);
            }
        }
     }
```


# 步骤二：then方法链式调用
then方法是promise的最基本的方法，返回的是两个回调，一个成功的回调，一个失败的回调，实现过程如下：

```javascript
        //声明 then 方法
        then(onResolved, onRejected) {
            //默认值设置
            if (onRejected === undefined) {
                onRejected = reason => {
                    throw reason
                };
            }

            if (onResolved === undefined) {
                onResolved = value => value;
            }
       }
```

为了实现这样的效果，则上一次的代码将要重新写过，我们可以把每次调用resolve的结果存入一个数组中，每次调用reject的结果存入一个数组。这就是 **为何会在上面定义两个数组,且分别在resolve()和reject()遍历两个数组的原因**。因此，在调用resolve()或者reject()之前，我们在pending状态时，会把多次then中的结果存入数组中，则上面的代码会改变为：

```javascript
        //声明 then 方法
        then(onResolved, onRejected) {
            //默认值设置
            if (onRejected === undefined) {
                onRejected = reason => {
                    throw reason
                };
            }

            if (onResolved === undefined) {
                onResolved = value => value;
            }

            return new Promise((resolve, reject) => {
                //封装函数
                let callback = (type) => {
                    //如果函数执行抛出错误
                    try {
                        //获取回调的执行结果
                        let result = type(this.promiseValue);
                        //判断
                        if (result instanceof Promise) {
                            result.then(v => {
                                resolve(v);
                            }, r => {
                                reject(r);
                            })
                        } else {
                            //状态为成功
                            resolve(result);
                        }
                    } catch (e) {
                        //如果回调抛出错误, 则修改 promise 对象状态为失败
                        reject(e);
                    }
                }
                //判断 promise 对象的状态
                //成功的状态
                if (this.promiseStatus === 'resolved') {
                    setTimeout(() => {
                        callback(onResolved);
                    });
                }

                //失败的状态
                if (this.promiseStatus === 'rejected') {
                    setTimeout(() => {
                        callback(onRejected);
                    })
                }

                //pending状态
                if (this.promiseStatus === 'pending') {
                    //保存回调函数
                    this.callbacks.push({
                        onResolved: () => {
                            callback(onResolved);
                        },
                        onRejected: () => {
                            callback(onRejected);
                        }
                    });
                }
            })
        }
```
>Promise A+规范中规定then方法可以链式调用
>
>在promise中，要实现链式调用返回的结果是**返回一个新的promise**，第一次then中返回的结果，无论是成功或失败，都将返回到下一次then中的成功态中，但在第一次then中如果抛出异常错误，则将返回到下一次then中的失败态中


**根据promise A+规范原理，promise在自己的框架中，封装了一系列的内置的方法。**

 1. 捕获错误的方法 catch()
 2.  解析全部方法 all() 
 3. 竞赛 race() 
 4. 生成一个成功的promise  resolve()
 5. 生成一个失败的promise  reject()


# 最终代码和测试
## ES6.Class实现
```javascript
   const PENDING = 'pending';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = null;
    this.reason = null;
    this.resolveCallbacks = [];
    this.rejectCallbacks = [];
    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  resolve(value) {
    if (this.status === PENDING) {
      this.value = value;
      this.status = RESOLVED;
      this.resolveCallbacks.forEach(onFulfilled => {
        onFulfilled();
      })
    }
  }

  reject(reason) {
    if (this.status === PENDING) {
      this.reason = reason;
      this.status = REJECTED;
      this.rejectCallbacks.forEach(onRejected => {
        onRejected();
      })
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : data => data;
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === PENDING) {
        this.resolveCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(x, promise2, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
        this.rejectCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(x, promise2, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
      }
      if (this.status === RESOLVED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(x, promise2, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(x, promise2, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }
    })
    return promise2;
  }
}

function resolvePromise(x, promise2, resolve, reject) {
  if (x === promise2) {
    return reject(new TypeError('Chaining cycle detected for promise!'));
  }
  if (x && (typeof x === 'object' || typeof x === 'function')) {
    let called;
    try {
      let then = x.then;
      if (typeof then === 'function') {
        then.call(x, value => {
          if (called) return ;
          called = true;
          resolvePromise(value, promise2, resolve, reject);
        }, reason => {
          if (called) return ;
          called = true;
          reject(reason);
        })
      } else {
        resolve(x);
      }
    } catch (error) {
      if (called) return ;
      called = true;
      reject(error);
    }
  } else {
    resolve(x);
  }
}

Promise.deferred = function() {
  let deferred = {};
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  })
  return deferred;
}

var promisesAplusTests = require('promises-aplus-tests');

promisesAplusTests(Promise, function (err) {
    // All done; output is in the console. Or check `err` for number of failures.
    console.log('测试用例失败', err);
});

/*
  Promise.resolve()
  Promise.reject()
  Promise.all([])
  Promise.race()
  Promise.allSettled([])
  ...
*/

module.exports = Promise;
```
## ES5实现

```javascript
//声明 class
class Promise {
    //声明构造方法
    constructor(executor) {
        const self = this;
        //声明属性
        self.promiseStatus = 'pending';
        self.promiseValue = '';
        self.callbacks = [];
        //声明函数 resolve
        function resolve(data) {
            //状态修改唯一性
            if (self.promiseStatus !== 'pending') return;
            // resolve 修改 Promise 对象状态(promiseStatus)为成功, 设置其成功的值(promiseValue)
            //修改状态
            self.promiseStatus = 'resolved';
            //修改值
            self.promiseValue = data;
            //执行成功的回调
            setTimeout(() => {
                if (self.callbacks.length > 0) {
                    self.callbacks.forEach(callbackObj => {
                        callbackObj.onResolved(self.promiseValue);
                    });
                }
            })
        }
        //声明函数 reject
        function reject(data) {
            //如果状态修改过, 则直接返回
            if (self.promiseStatus !== 'pending') return;
            //修改状态
            self.promiseStatus = 'rejected';
            //修改值
            self.promiseValue = data;
            //执行失败的回调
            setTimeout(() => {
                if (self.callbacks.length > 0) {
                    self.callbacks.forEach(callbackObj => {
                        callbackObj.onRejected(self.promiseValue);
                    });
                }
            });

        }

        //执行『执行器函数』
        try {
            executor(resolve, reject);
        } catch (e) {
            //如果抛错 则修改 promise 对象状态为失败
            reject(e);
        }
    }

    //声明 then 方法
    then(onResolved, onRejected) {
        //默认值设置
        if (onRejected === undefined) {
            onRejected = reason => { throw reason };
        }

        if (onResolved === undefined) {
            onResolved = value => value;
        }

        return new Promise((resolve, reject) => {
            //封装函数
            let callback = (type) => {
                //如果函数执行抛出错误
                try {
                    //获取回调的执行结果
                    let result = type(this.promiseValue);
                    //判断
                    if (result instanceof Promise) {
                        result.then(v => {
                            resolve(v);
                        }, r => {
                            reject(r);
                        })
                    } else {
                        //状态为成功
                        resolve(result);
                    }
                } catch (e) {
                    //如果回调抛出错误, 则修改 promise 对象状态为失败
                    reject(e);
                }
            }
            //判断 promise 对象的状态
            //成功的状态
            if (this.promiseStatus === 'resolved') {
                setTimeout(() => {
                    callback(onResolved);
                });
            }

            //失败的状态
            if (this.promiseStatus === 'rejected') {
                setTimeout(() => {
                    callback(onRejected);
                })
            }

            //pending状态
            if (this.promiseStatus === 'pending') {
                //保存回调函数
                this.callbacks.push({
                    onResolved: () => {
                        callback(onResolved);
                    },
                    onRejected: () => {
                        callback(onRejected);
                    }
                });
            }
        })
    }

    //声明 catch 方法
    catch(onRejected) {
        return this.then(undefined, onRejected);
    }

    //声明 resolve 静态方法
    static resolve(value) {
        return new Promise((resolve, reject) => {
            if (value instanceof Promise) {
                value.then(v => {
                    resolve(v);
                }, r => {
                    reject(r);
                })
            } else {
                resolve(value);
            }
        });
    }

    //声明 reject 静态方法
    static reject(reason) {
        return new Promise((resolve, reject) => {
            reject(reason);
        });
    }

    //声明 all 静态方法
    static all(promisesArr) {
        //声明数组存放成功的值
        const resultArr = [];
        //计数器
        let count = 0;
        //设置promise结构
        return new Promise((resolve, reject) => {
            //resolve 和 reject 调用的时机 ****
            for (let i = 0; i < promisesArr.length; i++) {
                //获取当前正在遍历的 promise 对象
                promisesArr[i].then(value => {
                    //将当前成功的 promise 的值 存入到数组中
                    // resultArr.push(value);// 此方法不可取
                    resultArr[i] = value;
                    //计数器加一
                    count++;
                    //判断结果数组的长度 ['ok', undefined, 'Yeah!'].length ==3   count 2
                    // ['OK','Success','Year']  count === 3  是所有 promise 成功的标志
                    if (count === promisesArr.length) {
                        //设置状态为成功
                        resolve(resultArr);
                    }
                }, reason => {
                    //如果有一个 promise 失败, 则 all 返回的状态为失败
                    reject(reason);
                })
            }
        });
    }
    
    //声明 race 静态方法
    static race(promisesArr){
        return new Promise((resolve, reject)=>{
            // resolve  reject 函数
            //遍历   标识符
            promisesArr.forEach(promise => {
                promise.then(value => {
                    //如果 promise 对象成功, 则修改返回的 promise 对象状态为成功
                    resolve(value);
                }, reason => {
                    //如果 promise 对象失败, 则修改返回的 promise 对象状态为失败
                    reject(reason);
                })
            });
        });
    }
}

```