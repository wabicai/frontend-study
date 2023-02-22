## bind、call、apply 原理和用法

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
	Function.prototype.myCall = function (context, ...args) {
		context = context ? context : window;
		context.fn = this;
		if (!args) {
			// 一定要删除这个this（调用的函数）。
			let res = context.fn();
			delete context.fn;
			delete context.fn;
			return res
		}
		let res = context.fn(...args);
		delete context.fn;
		return res;
	};

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
