## 什么是 yield？

- yield 是 ES6 的新关键字，使生成器函数执行暂停。yield 关键字后面的表达式的值返回给生成器的调用者。它可以被认为是一个基于生成器的版本的 return 关键字
- 返回一个迭代器对象（IteratorResult），包含两个属性（value 和 done），代表返回值和是否完成。
- 无法单独工作，需要配合生成器（generator）函数，如 next
- `Generator`  函数是`协程`在  `ES6`  的实现

> ```javascript
>
> function asnycJob() {
>   // ...其他代码
>   var f = yield readFile(fileA);
>   // ...其他代码
> }
> ```

上面代码的函数 asyncJob 是一个协程，它的奥妙就在其中的 yield 命令。它表示执行到此处，执行权将交给其他协程。也就是说，yield 命令是异步两个阶段的分界线

## 简单例子

```js
function* test() {
	var list = [1, 3, 5];
	for (let index = 0; index < list.length; index++) {
		yield list[index];
	}
}
console.log(test);

var arr = test();
console.log(arr);

console.log(arr.next(test()));

console.log(arr.next());
console.log(arr.next());
console.log(arr.next());
```

## 说明

1. 如果你看到某个函数中有 yield，说明这个函数已经是个生成器了
2. yield 可以用来加强控制，懒汉式加载
3. 调用函数指针和调用生成器是两码事，注意上面的运行结果，countAppleSales 和 myArr。
4. 需要 next()函数配合使用，每次调用返回两个值：分别是 value 和 done，代表迭代结果和是否完成
5. 函数 next()是个迭代器对象，传参可以缺省，默认调用函数。

- 它的意义在于，可以在不同阶段从外部直接向内部注入不同的值来调整函数的行为(这一点是其他循环很难做到的，或要付出较大的代价才可以做到)

## 目前项目中的可用性

在前端项目中，用的机会很少，完全可以忽略他的存在，但是在后台项目中，就显得比较重要了，因为其优越的可控性，可是极大的提升线程的效率。

目前只是根据官网，ES6 规范，大站等总结出来的，但是很遗憾，目前我们的项目中由于 node 项目较简单，并不需要进行实际改造。

如果需要实例的话，可参考 github 上的一些 python 后端项目，调用方式稍有不同，由于 js 参考的 python 语言，他们又同为动态语言，所以原理都是相同的，用处也一样。

作者：世外大帝
链接：https://www.jianshu.com/p/36c74e4ca9eb
来源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
