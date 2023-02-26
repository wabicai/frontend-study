# 过程

1. 生成一个新对象{}
2. 新原型与构造函数原型相等（即`__proto__ ` === prototype
3. 执行构造函数中的属性和方法
4. 返回新对象

```js
function objectFactory(fn, ...args) {
	let newObject = null;
	let result = null;
	// 判断参数是否是一个函数
	if (typeof fn !== "function") {
		console.error("type error");
		return;
	}
	// 新建一个空对象，对象的原型为构造函数的 prototype 对象
	newObject = Object.create(fn.prototype);
	// 等价于 newObject[__proto__] = fn.prototype;

	// 将 this 指向新建对象，并执行函数
	result = fn.call(newObject, ...args);
	if (typeof result === "object" || typeof result === "function") {
		return result;
	} else {
		return newObject;
	}
}
// 使用方法
objectFactory(构造函数, 初始化参数);
```
