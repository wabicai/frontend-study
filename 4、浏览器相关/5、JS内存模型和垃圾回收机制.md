闭包详见：[闭包的应用和常用的场景](https://blog.csdn.net/abuanden/article/details/114136822)

# JS 内存模型

1. 基本数据类型纯栈，复杂数据类型存堆，他的指针存栈

## 为什么这么设计？

1. 对于 array 等复杂类型，他的存储空间会变化，但是类似 Number 类型，则不会变
2.

# 内存泄漏和垃圾回收机制

选自：
[JavaScript 内存泄漏教程](http://www.ruanyifeng.com/blog/2017/04/memory-leak.html)
[js 常见的内存泄漏](https://www.cnblogs.com/cwxwdm/p/10845376.html)
[JavaScript 内存泄露的 4 种方式及如何避免](https://blog.csdn.net/qappleh/article/details/80337630)

## 垃圾回收机制

1. 分新生代（生存时间短，只有 8M 左右）和老生代（长存储，很大）
2. 对象晋升策略，也就是经过两次垃圾回收依然还存活的对象，会被移动到老生区中。
3. 共同的执行流程
   1. 标记活动对象和非活动对象
   2. 清理非活动对象
   3. 内存整理（将不连续变为连续）
4. 新生代：
   1. 副垃圾回收器
   2. Scavenge 算法
5. 老生代：
   1. 主垃圾回收器
   2. （标记-清除/标记-整理）比较常用
   3. 引用计数（会有循环引用的问题）
6. 全停顿
   1. 一旦执行垃圾回收算法，都需要将正在执行的 JavaScript 脚本暂停下来
7. 解决全停顿
   1. 增量标记算法
   2. 把一个完整的垃圾回收任务拆分为很多小的任务，这些小的任务执行时间比较短，可以穿插在其他的 JavaScript 任务中间执行，

## 内存泄漏的识别方法

> 经验法则是，**如果连续五次垃圾回收之后，内存占用一次比一次大，就有内存泄漏。这就要求实时查看内存占用。**

### 浏览器

Chrome 浏览器查看内存占用，按照以下步骤操作。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210304184410661.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FidWFuZGVu,size_16,color_FFFFFF,t_70)

> 现在已经改成 performance 了
> ![在这里插入图片描述](https://img-blog.csdnimg.cn/2021030418500585.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FidWFuZGVu,size_16,color_FFFFFF,t_70)

1.  打开开发者工具，选择 performance 面板
2.  在顶部的 Capture 字段里面勾选 Memory 点击左上角的录制按钮。
3.  在页面上进行各种操作，模拟用户的使用情况。
4.  一段时间后，点击对话框的 stop 按钮，面板上就会显示这段时间的内存占用情况。
    > 如果内存占用基本平稳，接近水平，就说明不存在内存泄漏。
    > ![在这里插入图片描述](https://img-blog.csdnimg.cn/20210304185114725.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FidWFuZGVu,size_16,color_FFFFFF,t_70)
    > 反之，就是内存泄漏了。

## WeakMap

有两种新的数据结构：**WeakSet** 和 **WeakMap**。它们对于值的引用都是不计入垃圾回收机制的，所以名字里面才会有一个"Weak"，表示这是弱引用。

下面以 WeakMap 为例，看看它是怎么解决内存泄漏的。

```js
const wm = new WeakMap();

const element = document.getElementById("example");

wm.set(element, "some information");
wm.get(element); // "some information"
```

> 上面代码中，先新建一个 **Weakmap 实例**。然后，将一个 DOM 节点作为键名存入该实例，并将一些附加信息作为键值，一起存放在 WeakMap 里面。这时，WeakMap 里面**对 element 的引用**就是弱引用，不会被计入垃圾回收机制。

> 也就是说，DOM 节点对象的引用计数**是 1**，而不是 2。这时，一旦消除对该节点的引用，它占用的内存就会被垃圾回收机制释放。Weakmap 保存的这个键值对，也会自动消失。

> 基本上，**如果你要往对象上添加数据，又不想干扰垃圾回收机制，就可以使用 WeakMap。**

## 六、常见的内存泄漏

### 1、闭包

闭包是 JavaScript 开发的一个关键方面：匿名函数可以访问父级作用域的变量。

```javascript
function bindEvent() {
	var obj = document.createElement("XXX");
	obj.onclick = function () {
		//Even if it's a empty function
	};
}
```

以上代码创建了一个作为 obj 元素事件处理程序**的闭包**，而这个闭包则又创建了一个循环引用，匿名函数中保存了一个对 obj 对象的引用，因此无法减少 obj 的引用数。只要匿名函数在，obj 的引用数至少是 1，因此它所占用的内存就永远无法回收。

**再比如**：

```javascript
var theThing = null;
var replaceThing = function () {
	var originalThing = theThing;
	var unused = function () {
		if (originalThing) console.log("hi");
	};

	theThing = {
		longStr: new Array(1000000).join("*"),
		someMethod: function () {
			console.log(someMessage);
		},
	};
};

setInterval(replaceThing, 1000);
```

> 代码片段做了一件事情：每次调用 **replaceThing** ，**theThing** 得到一个包含一个大数组和一个新闭包（**someMethod**）的新对象。

> 同时，变量 **unused** 是一个引用 **originalThing** 的**闭包**（先前的 replaceThing 又调用了 theThing ）。
> 思绪混乱了吗？最重要的事情是，闭包的作用域一旦创建，它们有**同样的父级作用域，作用域是共享的**。
> someMethod 可以通过 theThing 使用，someMethod 与 unused 分享闭包作用域，**尽管 unused 从未使用，它引用的 originalThing 迫使它保留在内存中（防止被回收）**。
> 当这段代码反复运行，就会看到内存占用不断上升，垃圾回收器（GC）并无法降低内存占用。本质上，闭包的链表已经创建，**每一个闭包作用域携带一个指向大数组的间接的引用，造成严重的内存泄露。**

- 这里的解决方法：**在 replaceThing 的最后添加 originalThing = null 。**

**解决方法：**
**1、在定义事件处理函数的外部函数中，删除对 dom 的引用**
《JavaScript 权威指南》中介绍过，闭包中，作用域中没用的属性可以删除，以减少内存消耗。

```javascript
function bindEvent() {
	var obj = document.createElement("XXX");
	obj.onclick = function () {
		//Even if it's a empty function
	};
	obj = null;
}
```

**2、将事件处理函数定义在外部，解除闭包**
闭包可以维持函数内局部变量，使其得不到释放。
上例定义事件回调时，由于是函数内定义函数，并且内部函数--事件回调的引用外暴了，形成了闭包

```javascript
function bindEvent() {
	var obj = document.createElement("XXX");
	obj.onclick = onclickHandler;
}
function onclickHandler() {
	//do something
}
```

### 2、意外的全局变量

在 JavaScript 非严格模式中，未定义的变量会自动绑定在全局对象上（window/global），比如：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210304191800886.png)
foo 执行的时候，由于内部变量没有定义，所以相当于 window.bar = 'something'，函数执行完毕，本应该被销毁的变量 bar 却永久的保留在内存中了。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210304191824638.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FidWFuZGVu,size_16,color_FFFFFF,t_70)

> 上面这里应该这么解释：不是箭头函数，普通的函数的 this 默认指向 window。

**解决办法，使用严格模式。**

虽然全局变量上绑定的变量无法被垃圾回收，但是有时需要使用全局变量去存储临时信息，这个时候要格外小心，并在变量使用完毕后设置为 null，以回收内存。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210304192257951.png)

**全局变量注意事项**

尽管我们讨论了一些意外的全局变量，但是仍有一些明确的全局变量产生的垃圾。它们被定义为不可回收（除非定义为空或重新分配）。尤其当全局变量用于 临时存储和处理大量信息时，需要多加小心。如果必须使用全局变量存储大量数据时，确保用完以后把它设置为 null 或者重新定义。与全局变量相关的增加内存消耗的一个主因是缓存。缓存数据是为了重用，**缓存必须有一个大小上限才有用**。高内存消耗导致缓存突破上限，因为**缓存内容无法被回收。**

### 3、被遗忘的计时器或回调函数

```javascript
var someResource = getData();
setInterval(function () {
	var node = document.getElementById("Node");
	if (node) {
		// 处理 node 和 someResource
		node.innerHTML = JSON.stringify(someResource);
	}
}, 1000);
```

此例说明了什么：与节点或数据关联的计时器不再需要，node 对象可以删除，整个回调函数也不需要了。可是，**计时器回调函数仍然没被回收（计时器停止才会被回收）**。同时，someResource 如果存储了大量的数据，也是无法被回收的。

对于观察者的例子，一旦它们不再需要（或者关联的对象变成不可达），明确地移除它们非常重要。老的 IE 6 是无法处理循环引用的。如今，即使没有明确移除它们，一旦观察者对象变成不可达，大部分浏览器是可以回收观察者处理函数的。

**观察者代码示例：**

```javascript
var element = document.getElementById("button");
function onClick(event) {
	element.innerHTML = "text";
}

element.addEventListener("click", onClick);
```

**对象观察者和循环引用注意事项**

**老版本的 IE 是无法检测 DOM 节点与 JavaScript 代码之间的循环引用，会导致内存泄露。**如今，现代的浏览器（包括 IE 和 Microsoft Edge）使用了更先进的垃圾回收算法，已经可以正确检测和处理循环引用了。换言之，回收节点内存时，**不必非要调用 removeEventListener** 了。

### 4、脱离 DOM 的引用

有时，保存 DOM 节点内部数据结构很有用。假如你想快速更新表格的几行内容，把每一行 DOM 存成字典（JSON 键值对）或者数组很有意义。此时，同样的 DOM 元素存在两个引用：一个在 DOM 树中，另一个在字典中。将来你决定删除这些行时，需要把两个引用都清除。

```js
var elements = {
	button: document.getElementById("button"),
	image: document.getElementById("image"),
	text: document.getElementById("text"),
};

function doStuff() {
	image.src = "http://some.url/image";
	button.click();
	console.log(text.innerHTML);
	// 更多逻辑
}

function removeButton() {
	// 按钮是 body 的后代元素
	document.body.removeChild(document.getElementById("button"));

	// 此时，仍旧存在一个全局的 #button 的引用
	// elements 字典。button 元素仍旧在内存中，不能被 GC 回收。
}
```
