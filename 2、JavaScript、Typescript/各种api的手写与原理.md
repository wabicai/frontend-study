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



### 手写Promise的All，Race方法

