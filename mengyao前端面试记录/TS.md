 ```
implements 实现 ??
extends 继承 ??
```
接口继承类 ?? https://typescript.bootcss.com/interfaces.html

# 基础类型
1. 布尔值：boolean true/false
2. 数字：number 浮点数 进制 0x 0b 0o
3. 字符串：string "" '' 反包围号 ${}
4. 数组：两种定义方式  
第一种，可以在元素类型后面接上`[]`，表示由此类型元素组成的一个数组：

```
let list: number[] = [1, 2, 3];
```

第二种方式是使用数组泛型，`Array<元素类型>`：

```
let list: Array<number> = [1, 2, 3];
```

5. 元组 Tuple
元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。 比如，你可以定义一对值分别为`string`和`number`类型的元组。

```
// Declare a tuple type
let x: [string, number];
// Initialize it
x = ['hello', 10]; // OK
// Initialize it incorrectly
x = [10, 'hello']; // Error
```
6. 枚举
使用枚举类型可以为一组数值赋予友好的名字。
```
enum Color {Red, Green, Blue}
let c: Color = Color.Green;
```
默认情况下，从`0`开始为元素编号。 你也可以手动的指定成员的数值。

7. 任意值 any
8. 空值 void undefined和null
9. Null 和 Undefined 叫做`undefined`和`null` 默认情况下`null`和`undefined`是所有类型的子类型
10. Never never 表示的是那些永不存在的值的类型
11. 类型断言
它没有运行时的影响，只是在编译阶段起作用。 TypeScript会假设你，程序员，已经进行了必须的检查。
类型断言有两种形式。 其一是“尖括号”语法：

```
let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length;
```
另一个为`as`语法：
```
let someValue: any = "this is a string";

let strLength: number = (someValue as string).length;
```
# 变量声明
let
const
解构
展开

# 接口
TypeScript的核心原则之一是对值所具有的_结构_进行类型检查。 它有时被称做“鸭式辨型法”或“结构性子类型化”。 在TypeScript里，接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。
## 属性类型
## 函数类型
## 类类型
```
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date);
}

class Clock implements ClockInterface {
    currentTime: Date;
    setTime(d: Date) {
        this.currentTime = d;
    }
    constructor(h: number, m: number) { }
}
```
接口描述了类的公共部分，而不是公共和私有两部分。 它不会帮你检查类是否具有某些私有成员。
## 继承接口
```
interface Shape {
    color: string;
}

interface PenStroke {
    penWidth: number;
}

interface Square extends Shape, PenStroke {
    sideLength: number;
}
```

接口也可以相互继承 extends, 一个接口可以继承多个接口，继承接口用逗号隔开。
## 接口继承类

# 类
## 继承 extends
最基本的继承：类从基类中继承了属性和方法。 这里，`Dog`是一个_派生类_，它派生自`Animal`_基类_，通过`extends`关键字。 派生类通常被称作_子类_，基类通常被称作_超类_。
```
class Animal {
    move(distanceInMeters: number = 0) {
        console.log(`Animal moved ${distanceInMeters}m.`);
    }
}

class Dog extends Animal {
    bark() {
        console.log('Woof! Woof!');
    }
}

const dog = new Dog();
dog.bark();
dog.move(10);
dog.bark();
```
重写方法：
重写构造函数，它_必须_调用`super()`，它会执行基类的构造函数。 而且，在构造函数里访问`this`的属性之前，我们_一定_要调用`super()`。 这个是TypeScript强制执行的一条重要规则。
重写其他方法，可以用super.funcname()调用父类方法
注意，即使`tom`子类实例被声明为`Animal`超类类型，但因为它的值是`Horse`，调用`tom.move(34)`时，它会调用`Horse`子类里重写的方法

## 修饰符
### 默认为public
以自由的访问程序里定义的成员
### private
能在声明它的类的外部访问
### protected
`protected`成员在派生类中仍然可以访问。
构造函数也可以被标记成`protected`。 这意味着这个类不能在包含它的类外被实例化，但是能被继承。
### readonly修饰符
只读属性必须在声明时或构造函数里被初始化
### 参数属性
参数属性可以方便地让我们在一个地方定义并初始化一个成员。
仅在构造函数里使用`private name: string`参数来创建和初始化`name`成员。 我们把声明和赋值合并至一处。
```
class Animal {
    constructor(private name: string) { }
    move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
```
参数属性通过给构造函数参数添加一个访问限定符来声明。 使用`private`限定一个参数属性会声明并初始化一个私有成员；对于`public`和`protected`来说也是一样。
## 存取器
## 静态属性
类的实例成员，那些仅当类被实例化的时候才会被初始化的属性
类的静态成员，这些属性存在于类本身上面而不是类的实例上
用`static`定义,想要访问这个属性的时候,使用类名.

## 抽象类

# 函数

# 泛型

# 枚举
使用枚举我们可以定义一些有名字的数字常量。 枚举通过`enum`关键字来定义

# 类型推论 type inference
# 类型兼容性
# 高级类型
## 交叉类型（Intersection Types）
`Person & Serializable & Loggable`同时是`Person`_和_`Serializable`_和_`Loggable`。 就是说这个类型的对象同时拥有了这三种类型的成员。

## 联合类型（Union Types）
联合类型表示一个值可以是几种类型之一。 我们用竖线（`|`）分隔每个类型，所以`number | string | boolean`表示一个值可以是`number`，`string`，或`boolean`。如果一个值是联合类型，我们只能访问此联合类型的所有类型里共有的成员。

## 类型保护与区分类型（Type Guards and Differentiating Types）
### 用户自定义的类型保护
定义一个返回类型谓词（pet is Fish ）的函数
```
function isFish(pet: Fish | Bird): pet is Fish {
    return (<Fish>pet).swim !== undefined;
}
```
### `typeof`类型保护
```
function padLeft(value: string, padding: string | number) {
    if (typeof padding === "number") {
        return Array(padding + 1).join(" ") + value;
    }
    if (typeof padding === "string") {
        return padding + value;
    }
    throw new Error(`Expected string or number, got '${padding}'.`);
}
```
这些_`typeof`类型保护_只有两种形式能被识别：`typeof v === "typename"`和`typeof v !== "typename"`，`"typename"`必须是`"number"`，`"string"`，`"boolean"`或`"symbol"`
### `instanceof`类型保护
通过构造函数来细化类型的一种方式。
`instanceof`的右侧要求是一个构造函数，TypeScript将细化为：
1.  此构造函数的`prototype`属性的类型，如果它的类型不为`any`的话
2.  构造签名所返回的类型的联合

## 可以为null的类型
默认情况下，类型检查器认为`null`与`undefined`可以赋值给任何类型。 `null`与`undefined`是所有其它类型的一个有效值。 这也意味着，你阻止不了将它们赋值给其它类型。
而`--strictNullChecks`标记可以解决此错误：当你声明一个变量时，它不会自动地包含`null`或`undefined`。此时可选参数会被自动地加上`| undefined`。
类型保护来去除`null`：
1. sn == null 
2. 短路运算符 sn || "default" 
3. 类型断言手动去除。 语法是添加`!`后缀：`identifier!`从`identifier`的类型里去除了`null`和`undefined`：
## 类型别名
类型别名会给一个类型起个新名字。 类型别名有时和接口很像，但是可以作用于原始值，联合类型，元组以及其它任何你需要手写的类型。
起别名不会新建一个类型 - 它创建了一个新_名字_来引用那个类型。
同接口一样，类型别名也可以是泛型

### 接口 vs. 类型别名
1. 接口创建了一个新的名字，可以在其它任何地方使用。 类型别名并不创建新名字
2. 另一个重要区别是类型别名不能被`extends`和`implements`（自己也不能`extends`和`implements`其它类型）。 因为[软件中的对象应该对于扩展是开放的，但是对于修改是封闭](https://en.wikipedia.org/wiki/Open/closed_principle)
3. 你应该尽量去使用接口代替类型别名。除非描述一个类型并且需要使用联合类型或元组类型，这时通常会使用类型别名。

## 字符串字面量类型
```
type Easing = "ease-in" | "ease-out" | "ease-in-out";
```
只能从三种允许的字符中选择其一来做为参数传递，传入其它值则会产生错误。
函数重载
```
function createElement(tagName: "img"): HTMLImageElement;
function createElement(tagName: "input"): HTMLInputElement;
// ... more overloads ...
function createElement(tagName: string): Element {
    // ... code goes here ...
}
```
## 数字字面量类型
```
function rollDie(): 1 | 2 | 3 | 4 | 5 | 6 {
    // ...
}
```
## 枚举成员类型
## 可辨识联合（Discriminated Unions）
合并单例类型，联合类型，类型保护和类型别名来创建一个叫做_可辨识联合_的高级模式，它也称做_标签联合_或_代数数据类型_。
声明要联合的接口
```
interface Square {
    kind: "square";
    size: number;
}
interface Rectangle {
    kind: "rectangle";
    width: number;
    height: number;
}
interface Circle {
    kind: "circle";
    radius: number;
}
```
声明联合
```
type Shape = Square | Rectangle | Circle;
```
使用
```
function area(s: Shape) {
    switch (s.kind) {
        case "square": return s.size * s.size;
        case "rectangle": return s.height * s.width;
        case "circle": return Math.PI * s.radius ** 2;
    }
}
```
### 完整性检查
1.启用`--strictNullChecks`并且指定一个返回值类型
2.使用`never`类型，让default返回never

## 多态的`this`类型
## 索引类型（Index types）
# Symbols
# Iterators 和 Generators
### `for..of` 语句
会遍历可迭代的对象，调用对象上的`Symbol.iterator`方法。

#### `for..of` vs. `for..in` 语句
1.`for..of`和`for..in`均可迭代一个列表；但是用于迭代的值却不同，
`for..of`迭代对象的键对应的值，value;关注于迭代对象的值,对象要有`Symbol.iterator`方法
`for..in`迭代的是对象的 _键_ 的列表，key;可以操作任何对象

# 模块
## 介绍
**模块在其自身的作用域里执行，而不是在全局作用域里**；这意味着定义在一个模块里的变量，函数，类等等在模块外部是不可见的，除非你明确地使用[`export`形式](https://typescript.bootcss.com/modules.html#export)之一导出它们。 相反，如果想使用其它模块导出的变量，函数，类，接口等的时候，你必须要导入它们，可以使用[`import`形式](https://typescript.bootcss.com/modules.html#import)之一。

**模块是自声明的**；两个模块之间的关系是通过在文件级别上使用imports和exports建立的。

模块使用模块加载器去导入其它的模块。 在运行时，模块加载器的作用是在执行此模块代码前去查找并执行这个模块的所有依赖。 大家最熟知的JavaScript模块加载器是服务于Node.js的[CommonJS](https://en.wikipedia.org/wiki/CommonJS)和服务于Web应用的[Require.js](http://requirejs.org/)。

TypeScript与ECMAScript 2015一样，**任何包含顶级`import`或者`export`的文件都被当成一个模块。**

# 命名空间
# 模块解析
## 相对 vs. 非相对模块导入
相对导入是以`/`，`./`或`../`开头的。 下面是一些例子：
解析时是相对于导入它的文件来的，并且_不能_解析为一个外部模块声明
-   `import Entry from "./components/Entry";`
-   `import { DefaultHeaders } from "../constants/http";`
-   `import "/mod";`

所有其它形式的导入被当作非相对的。 下面是一些例子：
可以相对于`baseUrl`或通过下文会讲到的路径映射来进行解析。 它们还可以被解析能[外部模块声明](https://typescript.bootcss.com/Modules.md#ambient-modules)。
-   `import * as $ from "jQuery";`
-   `import { Component } from "@angular/core";`

## 模块解析策略
[Node](https://typescript.bootcss.com/module-resolution.html#node)和[Classic](https://typescript.bootcss.com/module-resolution.html#classic)
使用`--moduleResolution`标记指定，若未指定，那么在使用了`--module AMD | System | ES2015`时的默认值为Classic，其它情况时则为Node
### Classic
* 相对导入的模块：
如`root/src/folder/A.ts`文件里的`import { b } from "./moduleB"`会使用下面的查找流程：
1.  `/root/src/folder/moduleB.ts`
2.  `/root/src/folder/moduleB.d.ts`

* 非相对模块的导入，编译器则会从包含导入文件的目录开始依次向上级目录遍历，尝试定位匹配的声明文件。
 比如：
有一个对`moduleB`的非相对导入`import { b } from "moduleB"`，它是在`/root/src/folder/A.ts`文件里，会以如下的方式来定位`"moduleB"`：
1.  `/root/src/folder/moduleB.ts`
2.  `/root/src/folder/moduleB.d.ts`
3.  `/root/src/moduleB.ts`
4.  `/root/src/moduleB.d.ts`
5.  `/root/moduleB.ts`
6.  `/root/moduleB.d.ts`
7.  `/moduleB.ts`
8.  `/moduleB.d.ts`

### Node
#### Node.js如何解析模块
* 相对路径
假设有一个文件路径为`/root/src/moduleA.js`，包含了一个导入`var x = require("./moduleB");` Node.js以下面的顺序解析这个导入：
1.  `/root/src/moduleB.js`  
2.  `/root/src/moduleB/package.json`，并且其指定了一个`"main"`模块。 如果Node.js发现文件`/root/src/moduleB/package.json`包含了`{ "main": "lib/mainModule.js" }`，那么Node.js会引用`/root/src/moduleB/lib/mainModule.js`。
3.  `/root/src/moduleB/index.js`

* 非相对路径：非常不同，Node会在一个特殊的文件夹`node_modules`里查找你的模块。 `node_modules`可能与当前文件在同一级目录下，或者在上层目录里。 Node会向上级目录遍历，查找每个`node_modules`直到它找到要加载的模块。
假设`/root/src/moduleA.js`里使用的是非相对路径导入`var x = require("moduleB");`。 Node则会以下面的顺序去解析`moduleB`，直到有一个匹配上。

1.  `/root/src/node_modules/moduleB.js`
2.  `/root/src/node_modules/moduleB/package.json` (如果指定了`"main"`属性)
3.  `/root/src/node_modules/moduleB/index.js`  
     向上跳一级
4.  `/root/node_modules/moduleB.js`
5.  `/root/node_modules/moduleB/package.json` (如果指定了`"main"`属性)
6.  `/root/node_modules/moduleB/index.js`  
       向上跳一级
7.  `/node_modules/moduleB.js`
8.  `/node_modules/moduleB/package.json` (如果指定了`"main"`属性)
9.  `/node_modules/moduleB/index.js`

#### TypeScript
TypeScript在Node解析逻辑基础上增加了TypeScript源文件的扩展名（`.ts`，`.tsx`和`.d.ts`）。 同时，TypeScript在`package.json`里使用字段`"types"`来表示类似`"main"`的意义 - 编译器会使用它来找到要使用的”main”定义文件。

* 相对：
比如，有一个导入语句`import { b } from "./moduleB"`在`/root/src/moduleA.ts`里，会以下面的流程来定位`"./moduleB"`：
1.  `/root/src/moduleB.ts`
2.  `/root/src/moduleB.tsx`
3.  `/root/src/moduleB.d.ts`
4.  `/root/src/moduleB/package.json` (如果指定了`"types"`属性)
5.  `/root/src/moduleB/index.ts`
6.  `/root/src/moduleB/index.tsx`
7.  `/root/src/moduleB/index.d.ts`

* 非相对：
首先查找文件，然后是合适的文件夹。 因此`/root/src/moduleA.ts`文件里的`import { b } from "moduleB"`会以下面的查找顺序解析：

1.  `/root/src/node_modules/moduleB.ts`
2.  `/root/src/node_modules/moduleB.tsx`
3.  `/root/src/node_modules/moduleB.d.ts`
4.  `/root/src/node_modules/moduleB/package.json` (如果指定了`"types"`属性)
5.  `/root/src/node_modules/moduleB/index.ts`
6.  `/root/src/node_modules/moduleB/index.tsx`
7.  `/root/src/node_modules/moduleB/index.d.ts`  
      
    
8.  `/root/node_modules/moduleB.ts`
9.  `/root/node_modules/moduleB.tsx`
10.  `/root/node_modules/moduleB.d.ts`
11.  `/root/node_modules/moduleB/package.json` (如果指定了`"types"`属性)
12.  `/root/node_modules/moduleB/index.ts`
13.  `/root/node_modules/moduleB/index.tsx`
14.  `/root/node_modules/moduleB/index.d.ts`  
      
    
15.  `/node_modules/moduleB.ts`
16.  `/node_modules/moduleB.tsx`
17.  `/node_modules/moduleB.d.ts`
18.  `/node_modules/moduleB/package.json` (如果指定了`"types"`属性)
19.  `/node_modules/moduleB/index.ts`
20.  `/node_modules/moduleB/index.tsx`
21.  `/node_modules/moduleB/index.d.ts`

### Base URL
设置`baseUrl`来告诉编译器到哪里去查找模块。 所有非相对模块导入都会被当做相对于`baseUrl`。
_baseUrl_的值由以下两者之一决定：
-   命令行中_baseUrl_的值（如果给定的路径是相对的，那么将相对于当前路径进行计算）
-   ‘tsconfig.json’里的_baseUrl_属性（如果给定的路径是相对的，那么将相对于‘tsconfig.json’路径进行计算）

### 路径映射
TypeScript编译器通过使用`tsconfig.json`文件里的`"paths"`来支持这样的声明映射。 下面是一个如何指定`jquery`的`"paths"`的例子。

```
{
  "compilerOptions": {
    "baseUrl": ".", // This must be specified if "paths" is.
    "paths": {
      "jquery": ["node_modules/jquery/dist/jquery"] // 此处映射是相对于"baseUrl"
    }
  }
}
```

请注意`"paths"`是相对于`"baseUrl"`进行解析。 如果`"baseUrl"`被设置成了除`"."`外的其它值，比如`tsconfig.json`所在的目录，那么映射必须要做相应的改变。

通过`"paths"`，还可以指定复杂的映射，包括指定多个回退位置

### 利用`rootDirs`指定虚拟目录

# 声明合并
“声明合并”是指编译器将针对同一个名字的两个独立声明合并为单一声明。

# mixin ?? 混入
# 如何书写声明规范 ？？


# 视频课程
# Why TS
1. 项目越来越复杂，js维护困难，安全隐患
2. 没有类型检查，不报错，函数参数没有类型检查
回答：TypeScript 是 JavaScript 的一个超集，它本质上其实是在 JavaScript 上添加了可选的静态类型和基于类的面向对象编程。
TypeScript 的特点：
解决大型项目的代码复杂性
可以在编译期间发现并纠正错误
支持强类型、接口、模块、范型
在实际的使用中，最大的好处还是：第一个是强类型，规范大型工程中变量声明，可控可预知，减少不同开发人员引入的隐性 bug。第二个是接口，在XXX里面的接口，其实主要是用于定义数据结构，也是规范数据结构的作用。第三个是继承，避免重复实现一些功能，protected、public、private 等关键字也可以实现方法的隔离。


# 什么是ts
![[Pasted image 20220625233459.png]]
ts增加了什么
1.类型
2.ES
3.ES不具备的：接口，修饰器等
4.丰富的配置选项：编译成那个版本的js，
5.强大的工具

# 1.开发环境搭建
1.ts 解析器是基于node.js的，所以要下node.js
2.装ts解析器 npm i -g typescript

# 2.类型声明
## 变量
1.声明
let a: number; // 基本类型，小写 number boolean string ...
2.声明同时赋值（不常用）
let a: number = 2;
3.若声明同时赋值，编译器会自动进行类型检测
let a = 2;

## 函数参数使用
function sum(a: number, b: number) {
...
}
参数类型，个数
## 函数返回值
function sum(a: number, b: number): number {
...
return 2;
}

## 类型声明的类型种类
基本类型：
![[Pasted image 20220625235947.png]]

* 字面量：let a: 'male' | 'female';
* any: 任意类型，相当于对该变量关闭了ts类型检测(隐式any:声明不赋值，let a)，any类型变量可以赋值给任意类型变量不报错
* unknown:任意类型，unknown类型变量不可以直接赋值给其他类型变量，
除非类型检查，或类型断言
![[Pasted image 20220626001032.png]]
* void 空值。常用于函数返回值，不返回，return； return null; return undefined;
* never 永远都没有值。常用于函数返回值
* object 对象、函数。。。 一般不用
  对象类型声明一般用法，指定属性：
   let b: { name: string}；必须一模一样，属性不能多也不能少
   let b: { name: string， age?: number}； ?可选
   let b: { name: string， \[propName: string\]: any}； name必须有，其他随意
  函数类型声明：
     let d: (a: number, b:number) => number;
    ![[Pasted image 20220626114455.png]]
  数组
* ![[Pasted image 20220626114701.png]]
   元组，固定长度的数组
     ![[Pasted image 20220626114907.png]]

   enum枚举：多个值中选择，常用，把可能的情况列出来
   ![[Pasted image 20220626115300.png]]
   ![[Pasted image 20220626115321.png]]
* 

|  或，可以链接多个类型（联合类型）
& 且，同时
![[Pasted image 20220626115557.png]]

类型别名：
给一个长类型起个名字，或者起一个语义化的名字
![[Pasted image 20220626120728.png]]

# 3.编译配置
tsconfig.json 配置文件
![[Pasted image 20220626121313.png]]
![[Pasted image 20220626121708.png]]

## compilerOptions 编译配置选项
#### target 指定被编译成的ES版本
"target": "ES3",   
可选项：![[Pasted image 20220626122018.png]]

#### module 指定使用的模块化规范
"module"
![[Pasted image 20220626123418.png]]
#### lib 指定项目中需要用到的库
前端浏览器运行时，一般不需要修改；若在node中运行，可以指定
#### outDir 指定编译后文件的目录
"outDir": "./dist"
#### outFile 指定输出后的文件
用的少，一般交给打包工具做
可以将全局作用域中的代码合成一个文件
"outFile": "./dist/app.js"
#### allowJS 是否对js文件进行编译
默认false
"allowJS": true
#### checkJS 是否对js进行检查
默认false
"checkJS": true
#### removeComments 是否移除注释
默认false
"removeComments": true
#### noEmit 不生产编译后的文件
#### noEmitOnError 当有错误时不生成编译后的文件
编译器检查相关的配置👇🏻
![[Pasted image 20220626130016.png]]





# 4.webpack打包ts代码
![[Pasted image 20220626131548.png]]

## 几个常用插件
![[Pasted image 20220626132615.png]]
webpack-dev-server

## babel：
新语法转换旧语法，新方法转换旧实现
安装：![[Pasted image 20220626132824.png]]

# 面向对象简介
## 1.属性
实例属性：直接定义，通过对象实例去访问
静态属性：static定义，通过类名访问
readonly只读属性，可以放在static后面
## 2.方法
实例方法
静态方法：static定义，通过类名访问
![[1656330025889.png]]
## 3.构造函数
## 4.this 继承
class Child entends Parent {

}
super 代表当前类的父类
重写父类构造函数，一定要主动super()调用父类构造函数
调用父类其他函数：super.othermethod()
## 5.抽象类
以abstract开头，不能生成实例，专门作为父类
abstract class Parent {
  // 抽象方法
  // abstract开头，没有方法体
  // 只能定义在抽象类中，子类必须进行重写
  abstract sayHello():void;

}
## 6.接口
vs 类型别名
vs 抽象类 1.extends impletment 2.抽象类里可以有普通方法和具体方法，接口只有抽象方法
![[Pasted image 20220627225337.png]]
1.接口可以重复定义
2.可以在定义类的时候限制类的结构，只有结构，不能有具体值
![[Pasted image 20220627230020.png]]
接口就是定义了一个规范，对类的限制
## 7.属性的封装
### 修饰符
### get set
1.普通method封装
2.另一种写法
![[Pasted image 20220627231454.png]]
![[Pasted image 20220627231537.png]]
### 在构造函数参数中，带上修饰符，直接给属性赋值，语法糖
![[Pasted image 20220627232024.png]]
## 8.泛型
泛型是一个不确定的类型，用变量代替这个类型
![[Pasted image 20220627232604.png]]
多个
![[Pasted image 20220627232643.png]]

使用接口或类限制泛型
![[Pasted image 20220627233247.png]]
在类中的使用
![[Pasted image 20220627233310.png]]

# 面试题：
## 1.介绍一下TS
TS是JS的一个超级，相对JS来比，提供了**类型系统**和**ES6**的支持，由微软开发，开源在github上。
## 2.Why ts+优劣
TS优点：
TS是JS的一个超级，相对JS来比，提供了**类型系统**和**ES6**的支持，
1.静态输入：静态类型化，在写代码的时候就可以检查错误，可以更快更好地完成开发
2.开发大型项目，便于更好的协作，在写代码期间进行的类型检测，能告诉开发者是不是出现了错误，不用等到代码执行过程中才发现
3.ECMAScript 6 代码，自动完成和动态输入

JS优势：
1.TypeScript 代码需要被编译（输出 JavaScript 代码），这是 TypeScript 代码执行时的一个额外的步骤。
2.JavaScript 的灵活性。

抉择：
TypeScript 正在成为开发大型编码项目的有力工具。因为其面向对象编程语言的结构保持了代码的清洁、一致和简单的调试。因此在应对大型开发项目时，使用 TypeScript 更加合适。如果有一个相对较小的编码项目，似乎没有必要使用 TypeScript，只需使用灵活的 JavaScript 即可。


## 3.TS面向对象
VS面向过程
什么是对象，对事物的抽象，具有方法属性
## 4.接口vs类型别名、接口vs抽象类的异同
## 5.TS构建
## 6. 动态 静态 强类型 弱类型
#### 动态类型语言
在运行期进行类型检查的语言，也就是在编写代码的时候可以不指定变量的数据类型。
#### 静态类型语言
它的数据类型是在编译期进行检查的，也就是说变量在使用前要声明变量的数据类型，这样的好处是把类型检查放在编译期，提前检查可能出现的类型错误。
#### 强类型语言
一个变量不经过强制转换，它永远是这个数据类型，不允许隐式的类型转换。
#### 弱类型语言
它与强类型语言定义相反,允许编译器进行隐式的类型转换。
TS是弱类型，静态类型语言
