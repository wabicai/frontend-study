### 1. reduce()

接收一个函数作用累加器，从左往右

```js
function getSum(total,num){
    return total + num
}
let res = numbers.reduce(getSum,0)
```



### 2. Array.from()

1. 类数组转化为数组
2. Set结构转化为真正的数组
3. Array.from第二个参数类似于map方法。



### 3.Object.keys()

`Object.keys()` 方法会返回一个由一个给定对象的**自身可枚举属性**组成的数组，数组中属性名的排列顺序和正常循环遍历该对象时返回的顺序一致 。

let in 会循环原型上的属性。

hasOwnProperty 返回是否是自身拥有的属性

```js
//如果我们希望遍历的是某个对象的自身属性，而不要去查找它的原型链上定义的属性。如何做呢
for(let key in obj) {
	if(obj.hasOwnProperty(key)) {
		console.log(key);
	}
}
// name
// age
或者:
for(let key of Object.keys(obj)) {
	console.log(key);
}
// name
// age

```

### 4. Object.assign()

- 浅拷贝

Object.assign() 方法用于将所有**可枚举属性**的值从一个或多个源对象复制到目标对象。它将返回目标对象。
Object.assign(target, ...sources)    【target：目标对象】，【souce：源对象（可多个）】




### 5. map用法

1. set（index，item）
2. has（index）
3. map.forEach((item,index,arr) =>{  })
4. get(index)
5.  delete（map.keys().next().value）删除开头的键值



### 6. set用法

1. add(item)
2. delete(item)



### 7.处理数字

parseInt（num，as）、parseFloat ： 直接舍去（认为他是as进制转化为十进制）、返回原来的浮点

toFix(2) ：转成字符串，保留两位数

Math.floor 、Math.ceil、Math.round()  地板（向下取整）、天花板（向上取整）、周围（四舍五入）

toString(2)：转化为2进制

