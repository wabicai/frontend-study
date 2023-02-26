# CommonJS VS ESM

CommonJS 是一种模块规范，最初被应用于 Nodejs，成为 Nodejs 的模块规范。运行在浏览器端的 JavaScript 由于也缺少类似的规范，在 ES6 出来之前，前端也实现了一套相同的模块规范 (例如: AMD)，用来对前端模块进行管理。自 ES6 起，引入了一套新的 ES6 Module 规范，在语言标准的层面上实现了模块功能，而且实现得相当简单，有望成为浏览器和服务器通用的模块解决方案。但目前浏览器对 ES6 Module 兼容还不太好，我们平时在 Webpack 中使用的 export 和 import，会经过 Babel 转换为 CommonJS 规范。在使用上的差别主要有：

1. require 模块输出的是一个值的拷贝，import 模块输出的是值的引用。
2. require 模块是运行时加载，import 模块是编译时输出接口。（先编译、再运行）
3. require 是单个值导出，import 可以导出多个
4. require 是动态语法可以写在判断里，import 静态语法只能写在顶层
5. require 的 this 是当前模块，import 的 this 是 undefined
6. require 是赋值过程并且是运行时才执行，也就是异步加载。import 是解构过程并且是编译时执行
7. require 的性能相对于 import 稍低，因为 require 是在运行时才引入模块并且还赋值给某个变量

通篇只需要看：[前端模块化详解(完整版)](https://segmentfault.com/a/1190000017466120)，讲的太好了

## 1.AMDs （RequireJ）

AMD（异步执行） 是 RequireJS 在推广过程中对模块定义的规范化产出。

AMD 是"Asynchronous Module Definition"的缩写，意思就是"异步模块定义"。它采用**异步方式**加载模块，**模块的加载不影响它后面语句的运行**。所有依赖这个模块的语句，**都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。**

AMD 也采用 require()语句加载模块，但是不同于 CommonJS，它要求两个参数：

```
　　require([module], callback);
```

第一个参数[module]，是一个数组，里面的成员就是要加载的模块；第二个参数 callback，则是加载成功之后的回调函数。

> 同样都是异步加载模块，AMD 在加载模块完成后就会执行改模块，所有模块都加载执行完后会进入 require 的回调函数，执行主逻辑，这样的效果就是依赖模块的执行顺序和书写顺序不一定一致，看网络速度，哪个先下载下来，哪个先执行，但是主逻辑一定在所有依赖加载完成后才执行.

- requireJS 主要解决两个问题

1、多个 js 文件可能有依赖关系，被依赖的文件需要早于依赖它的文件加载到浏览器
2、js 加载的时候浏览器会停止页面渲染，加载文件越多，页面失去响应时间越长

### 特点：

1. require()函数在加载依赖的函数的时候是**异步加载**的，这样浏览器不会失去响应，**它指定的回调函数，只有前面的模块都加载成功后，才会运行，解决了依赖性的问题。**
2. **AMD 用户体验好，因为没有延迟，依赖模块提前执行了**

### 基本用法：

```js
// AMD 推崇依赖前置
define(['./a', './b'], function(a, b) { // 依赖必须一开始就写好
a.doSomething()
// 此处略去 100 行
b.doSomething()
...
})
```

#### (1)AMD 规范基本语法

```js
//定义没有依赖的模块
define(function () {
	return 模块;
});
//定义有依赖的模块
define(["module1", "module2"], function (m1, m2) {
	return 模块;
});
```

**引入使用模块**:

```js
require(["module1", "module2"], function (m1, m2) {
	使用m1 / m2;
});
```

## 2. CMD（SeaJs）

CMD （异步执行）是 SeaJS 在推广过程中对模块定义的规范化产出。

CMD 规范专门用于浏览器端，模块的加载是异步的，模块使用时才会加载执行。CMD 规范整合了 CommonJS 和 AMD 规范的特点。在 Sea.js 中，所有 JavaScript 模块都遵循 CMD 模块定义规范。

[cmd](https://www.oecom.cn/tag/cmd/)的全称是 Common Module Definition，即**通用模块定义**，其提供了模块定义和按需加载执行模块。该规范明确了模块的基本书写格式和基本的交互规则。

在 CMD 规范中，一个模块就是一个文件。代码的书写格式如下：

```
define(factory);
```

这里的 define 是一个全局函数，用来定义模块，这里的 factory 参数既可以是函数，又可以是字符串或对象

- CMD 加载完某个模块后没有立即执行而是等到遇到 require 语句的时再执行。

### 特点：

1. CMD 是延迟执行。不过 RequireJS 从 2.0 开始，也改成可以延迟执行（根据写法不同，处理方式不同）。
2. **CMD 加载完某个依赖模块后并不执行，只是下载而已**，在所有依赖模块加载完成后进入主逻辑，遇到 require 语句的时候才执行对应的模块，这样模块的执行顺序和书写顺序是完全一致的
3. **CMD 性能好，因为只有用户需要的时候才执行**

### 基本用法：

```js
// CMD 推崇依赖就近
define(function (require, exports, module) {
	var a = require("./a");
	a.doSomething();
	// 此处略去 100 行
	var b = require("./b"); // 依赖可以就近书写
	b.doSomething();
	// ...
});
```

#### (1)CMD 规范基本语法

**定义暴露模块：**

```js
//定义没有依赖的模块
define(function (require, exports, module) {
	exports.xxx = value;
	module.exports = value;
});
//定义有依赖的模块
define(function (require, exports, module) {
	//引入依赖模块(同步)
	var module2 = require("./module2");
	//引入依赖模块(异步)
	require.async("./module3", function (m3) {});
	//暴露模块
	exports.xxx = value;
});
```

**引入使用模块：**

```js
define(function (require) {
	var m1 = require("./module1");
	var m4 = require("./module4");
	m1.show();
	m4.show();
});
```

![img](https://img-blog.csdnimg.cn/20201010113837857.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDI1ODk2NA==,size_16,color_FFFFFF,t_70#pic_center)

## 3. CommonJs（noedJs/webpack）

#### **moudle.export + require**

- CommonJS 规范加载模块是同步的，也就是说，只有加载完成，才能执行后面的操作。

浏览器不兼容 CommonJS（http://wiki.commonjs.org/wiki/Modules/1.1）的根本原因，也正是在于缺少四个Node.js环境的变量。

- module
- exports
- require
- global

Node 应用由模块组成，采用 CommonJS 模块规范。每个文件就是一个模块，有自己的作用域。在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。**在服务器端，模块的加载是运行时同步加载的；在浏览器端，模块需要提前编译打包处理。**

### 特点

- 所有代码都运行在模块作用域，不会污染全局作用域。
- 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。
- 模块加载的顺序，按照其在代码中出现的顺序。

### 基本语法

- 暴露模块：`module.exports = value`或`exports.xxx = value`
- 引入模块：`require(xxx)`,如果是第三方模块，xxx 为模块名；如果是自定义模块，xxx 为模块文件路径

> 此处我们有个疑问：**CommonJS 暴露的模块到底是什么?** CommonJS 规范规定，每个模块内部，module 变量代表当前模块。这个变量是一个对象，它的 exports 属性（即 module.exports）是对外的接口。**加载某个模块，其实是加载该模块的 module.exports 属性**。
>
> ```js
> // example.js
> var x = 5;
> var addX = function (value) {
> 	return value + x;
> };
> module.exports.x = x;
> module.exports.addX = addX;
> ```
>
> 上面代码通过 module.exports 输出变量 x 和函数 addX。
>
> ```
> var example = require('./example.js');//如果参数字符串以“./”开头，则表示加载的是一个位于相对路径
> console.log(example.x); // 5
> console.log(example.addX(1)); // 6
> ```
>
> require 命令用于加载模块文件。**require 命令的基本功能是，读入并执行一个 JavaScript 文件，然后返回该模块的 exports 对象。如果没有发现指定模块，会报错**。

### 加载机制

**CommonJS 模块的加载机制是，输入的是被输出的值的拷贝。也就是说，一旦输出一个值，模块内部的变化就影响不到这个值**。这点与 ES6 模块化有重大差异，请看下面这个例子：

```js
// lib.js
var counter = 3;
function incCounter() {
	counter++;
}
module.exports = {
	counter: counter,
	incCounter: incCounter,
};
```

上面代码输出内部变量 counter 和改写这个变量的内部方法 incCounter。

```js
// main.js
var counter = require("./lib").counter;
var incCounter = require("./lib").incCounter;

console.log(counter); // 3
incCounter();
console.log(counter); // 3
```

上面代码说明，counter 输出以后，lib.js 模块内部的变化就影响不到 counter 了。**这是因为 counter 是一个原始类型的值，会被缓存。除非写成一个函数，才能得到内部变动后的值**。

## 4. ES6

#### **export + import**

ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。比如，CommonJS 模块就是对象，输入时必须查找对象属性。

#### (1)ES6 模块化语法

export 命令用于规定模块的对外接口，import 命令用于输入其他模块提供的功能。

```js
/** 定义模块 math.js **/
var basicNum = 0;
var add = function (a, b) {
	return a + b;
};
export { basicNum, add };
/** 引用模块 **/
import { basicNum, add } from "./math";
function test(ele) {
	ele.textContent = add(99 + basicNum);
}
```

如上例所示，使用 import 命令的时候，用户需要知道所要加载的变量名或函数名，否则无法加载。为了给用户提供方便，让他们不用阅读文档就能加载模块，就要用到 export default 命令，为模块指定默认输出。

```js
// export-default.js
export default function () {
	console.log("foo");
}
// import-default.js
import customName from "./export-default";
customName(); // 'foo'
```

模块默认输出, 其他模块加载该模块时，import 命令可以为该匿名函数指定任意名字。

#### (2)ES6 模块与 CommonJS 模块的差异

它们有两个重大差异：

**① CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用**。

**② CommonJS 模块是运行时加载，ES6 模块是编译时输出接口**。

第二个差异是因为 CommonJS 加载的是一个对象（即 module.exports 属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

下面重点解释第一个差异，我们还是举上面那个 CommonJS 模块的加载机制例子:

```js
// lib.js
export let counter = 3;
export function incCounter() {
	counter++;
}
// main.js
import { counter, incCounter } from "./lib";
console.log(counter); // 3
incCounter();
console.log(counter); // 4
```

ES6 模块的运行机制与 CommonJS 不一样。**ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块**。

## 总结

- **CommonJS 规范**主要用于服务端编程，加载模块是同步的，这并不适合在浏览器环境，因为同步意味着阻塞加载，浏览器资源是异步加载的，因此有了 AMD CMD 解决方案。
- **AMD 规范**在浏览器环境中异步加载模块，而且可以并行加载多个模块。不过，AMD 规范开发成本高，代码的阅读和书写比较困难，模块定义方式的语义不顺畅。
- **CMD 规范与 AMD 规范很相似，都用于浏览器编程**，依赖就近，延迟执行，可以很容易在 Node.js 中运行。不过，依赖 SPM 打包，模块的加载逻辑偏重
- **ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案**。

## import 和 require 的区别

> - require 的核心概念：在导出的文件中定义 module.exports，导出的对象类型不予限定（可为任意类型）。在导入的文件中使用 require()引入即可使用。本质上，是将要导出的对象，赋值给 module 这个对象的 exports 属性，在其他文件中通过 require 这个方法来访问 exports 这个属性。上面 b.js 中，require(./a.js) = exports 这个对象，然后使用 es6 取值方式从 exports 对象中取出 test 的值。
> - import 是 es6 为 js 模块化提出的新的语法，import （导入）要与 export（导出）结合使用。

#### 区别 1：模块加载的时间

require：运行时加载
import：编译时加载（效率更高）【由于是编译时加载，所以 import 命令会提升到整个模块的头部】

#### 区别 2：模块的本质

**require：模块就是对象，输入时必须查找对象属性**
**import：ES6 模块不是对象，而是通过 export 命令显式指定输出的代码，再通过 import 命令输入**（这也导致了没法引用 ES6 模块本身，因为它不是对象）。由于 ES6 模块是编译时加载，使得静态分析成为可能。有了它，就能进一步拓宽 JavaScript 的语法，比如引入宏（macro）和类型检验（type system）这些只能靠静态分析实现的功能。

```js
// CommonJS模块
let { exists, readFile } = require("fs");
// 等同于
let fs = require("fs");
let exists = fs.exists;
let readfile = fs.readfile;
```

上面 CommonJs 模块中，实质上整体加载了 fs 对象（fs 模块），然后再从 fs 对象上读取方法

```js
// ES6模块
import { exists, readFile } from "fs";
```

上面 ES6 模块，实质上从 fs 模块加载 2 个对应的方法，其他方法不加载

#### 区别 3：输出的值

CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用，举例如下

```js
// m1.js
export var foo = "bar";
setTimeout(() => (foo = "baz"), 500);
// m2.js
import { foo } from "./m1.js";
console.log(foo); //bar
setTimeout(() => console.log(foo), 500); //baz
```

ES6 模块之中，顶层的 this 指向 undefined ，即不应该在顶层代码使用 this
