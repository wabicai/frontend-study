# 参数

setTimeout(fn, delaly , param1, param2);

# 为什么不推荐使用 setInterval, 而是 setTimeout

1. setInterval 的 delay 时间初始化后就不能修改
2. setInterval 有可能因为前面代码被添加入队列还未执行，然后又添加进入队列，导致定时器代码连续运行多次，导致问题：
   1. 某些间隔被跳过；（发现定时器代码正在执行的时候，不会加入队列）
   2. 多个定时器的代码执行之间的间隔可能比预期的小

# 使用 setTimeout 容易出现的问题：this 指向隐式丢失

- 函数别名

```js
var a = 0;
function foo() {
	console.log(this.a);
}
var obj = {
	a: 2,
	foo: foo,
};
//把obj.foo赋予别名bar，造成了隐式丢失，因为只是把foo()函数赋给了bar，而bar与obj对象则毫无关系
var bar = obj.foo;
bar(); //0

//等价于
var a = 0;
var bar = function foo() {
	console.log(this.a);
};
bar(); //0
```

- 参数传递

```js
var a = 0;
function foo() {
	console.log(this.a);
}
function bar(fn) {
	fn();
}
var obj = {
	a: 2,
	foo: foo,
};
//把obj.foo当作参数传递给bar函数时，有隐式的函数赋值fn=obj.foo。与上例类似，只是把foo函数赋给了fn，而fn与obj对象则毫无关系
bar(obj.foo); //0
//等价于
var a = 0;
function bar(fn) {
	fn();
}
bar(function foo() {
	console.log(this.a);
});
```

- 内置函数

```js
var a = 0;
function foo() {
	console.log(this.a);
}
var obj = {
	a: 2,
	foo: foo,
};
setTimeout(obj.foo, 100); //0

//等价于
var a = 0;
setTimeout(function foo() {
	console.log(this.a);
}, 100); //0
```

- 间接引用

```js
function foo() {
	console.log(this.a);
}
var a = 2;
var o = { a: 3, foo: foo };
var p = { a: 4 };
o.foo(); // 3
//将o.foo函数赋值给p.foo函数，然后立即执行。相当于仅仅是foo()函数的立即执行
(p.foo = o.foo)(); // 2
```

## 隐式绑定

- 若想获得 obj 对象中的 a 属性值，可以将 obj.foo 函数放置在定时器中的匿名函数中进行隐式绑定

```js
var a = 0;
function foo() {
	console.log(this.a);
}
var obj = {
	a: 2,
	foo: foo,
};
setTimeout(function () {
	obj.foo();
}, 100); //2
```

- 或者显式绑定

```js
var a = 0;
function foo() {
	console.log(this.a);
}
var obj = {
	a: 2,
	foo: foo,
};
setTimeout(obj.foo.bind(obj), 100); //2
```
