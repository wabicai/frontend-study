## New字符的原理

```js
    function _new() {
        var obj = {} // 创建一个新的对象
        let [fn, ...parms] = [...arguments]
        // 传入参数第一个是构造函数，后面的是构造函数的参数
        obj.__proto__ = fn.prototype
        // 执行构造函数 将构造函数的原型赋给 实例对象的__proto__,这样构造函数的属性就全都给实例了
        let res = fn.apply(obj, parms)
        // 如果构造函数的执行结果返回的是一个 对象 那么就返回这个对象
        if (res && typeof res == 'object' || typeof res === 'function') {
            return res
        }
        // 如果构造函数返回的是正常我们常见的那种（不是对象）,或者没有返回对象， 那么返回这个新创建的对象
        return obj
    }
```

1. 创建一个空对象，构造函数中的this指向这个空对象

2. 这个新对象被执行 [[原型]] 连接

3. 执行构造函数方法，属性和方法被添加到this引用的对象中

4. 如果构造函数中没有返回其它对象，那么返回this，即创建的这个的新对象，否则，返回构造函数中返回的对象。

## bind、call、apply原理和用法

### 用法

```js
apply:
fn.apply(thisObj,数组参数）
定义：应用某一个对象的一个方法，用另一个对象替换当前对象
说明：如果参数不是数组类型的，则会报一个TypeError错误。

call:
fn.call(thisObj, arg1, arg2, argN)
apply与call的唯一区别就是接收参数的格式不同。

bind:
fn.bind(thisObj, arg1, arg2, argN)
bind()方法创建一个新的函数，在bind()被调用时，这个新函数的this被bind的第一个参数指定，其余的参数将作为新函数的参数供调用时使用。
```

### 原理

```js
apply的实现：
	// apply:参数以数组形式传递，apply之后不会改变this指向
    // apply 原理
    Function.prototype.myApply = function (context) {
        context = context ? Object(context) : window
        // 函数调用apply,context的this就指向那个函数。
        context.fn = this
        let args = [...arguments][1]
        if (!args) {
            // 一定要删除这个this（调用的函数）。
            const res = context.fn()
            delete context.fn;
            return res
        }
        let r = context.fn(...args)
        delete context.fn;
        return r
    }

call实现：与apply的唯一区别就是参数格式不同

    // apply 原理
    Function.prototype.myCall = function (context) {
        context = context ? Object(context) : window
        context.fn = this
        let obj = [...arguments].splice(1)
        if (!obj) {
             context.fn()
            delete context.fn;
            return
        }
        let r = context.fn(...obj)
        delete context.fn;
        return r
    }

bind 实现：
https://github.com/yygmind/blog/issues/23
	// 这是是原生bind实现的方案也就是博客里面的第四步。但是这样会导致修改原型的时候，也修改了其他对象原型上的属性。也就是说，他们公有同个原型祖先
    Function.prototype.myBind = function () {
        var self = this // this 指向调用者
        const [context, ...parms] = [...arguments]
        var fn = function () {
            //实现函数科里化，这时的arguments是指bind返回的函数传入的参数
            co parms2 = [...arguments]
            //当作为构造函数时，this 指向实例，此时 this instanceof fBound 结果为 true，可以让实例获得来自绑定函数的值，即上例中实例会具有 habit 属性。
            //当作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 context
            return self.apply(this instanceof fn ? this : context, parms.concat(parms2))
        }
        fn.prototype = this.prototype;
        return fn // 返回一个函数。
    }

// 测试用例
var value = 2;
var foo = {
    value: 1
};
function bar(name, age) {
    this.habit = 'shopping';
    console.log(this.value);
    console.log(name);
    console.log(age);
}
bar.prototype.friend = 'kevin';

var bindFoo = bar.bind(foo, 'Jack'); 
var obj = new bindFoo(20); // 返回正确
// undefined
// Jack
// 20

obj.habit; // 返回正确
// shopping

obj.friend; // 返回正确
// kevin

obj.__proto__.friend = "Kitty"; // 修改原型

bar.prototype.friend; // // Kitty，返回错误，这里被修改了

// 完善的方法就是第五步。
```



## Promise

### Promise.all

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



### Promise.allSettled

```js
    static allSettled(array) {
		let resArr = [];
	    let index = 0;
        return new Promise(resolve => {
            function addToRes(key, value) {
                resArr[key] = value;
                index++
                if (index === array.length) {
                    resolve(resArr)
                }
            }
            for (let i = 0; i < array.length; i++) {
                array[i].then(res => {
                    addToRes(i, res)
                }).catch(err => {
                    index++
                    console.log(err);
                })
            }
        })
    }
```



### Promise.race

```js
    static race(array) {
        return new MyPromise((resolve, reject) => {
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
    }
```





### Promise.finally

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



