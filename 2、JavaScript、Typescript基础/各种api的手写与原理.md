## New字符的原理

```js
function new(func) {
    let target = {};
    target.__proto__ = func.prototype;
    let res = func.call(target);
    if (typeof(res) == "object" || typeof(res) == "function") {
    	return res;
    }
    return target;
}
```

1. 创建一个空对象，构造函数中的this指向这个空对象

2. 这个新对象被执行 [[原型]] 连接

3. 执行构造函数方法，属性和方法被添加到this引用的对象中

4. 如果构造函数中没有返回其它对象，那么返回this，即创建的这个的新对象，否则，返回构造函数中返回的对象。

## bind、call、apply原理



## Promise.all

```js
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
```



## Promise.race

```js
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
```



## Promise.finally

```js
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
```



