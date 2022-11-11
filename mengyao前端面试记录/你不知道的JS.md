[JavaScript Guidebook](https://tsejx.github.io/javascript-guidebook//)
你不知道的JS

Prototype机制就是指对象中的一个内部链接引用另一个对象。如果在第一个对象上没有找到需要的属性或者方法引用，引擎就会继续在[[Prototype]]关联的对象上进行查找。同理，如果在后者中也没有找到需要的引用就会继续查找它的[[Prototype]]，以此类推。这一系列对象的链接被称为“原型链”。换句话说，JavaScript中这个机制的本质就是对象之间的关联关系。
# 1.Foo.prototype 和 a./_/_proto/_/_
常规语言中的类，子类，实例。复制。实例化（或者继承）一个类就意味着“把类的行为复制到物理对象中”，对于每一个新实例来说都会重复这个过程。
在JavaScript中，并没有类，也没有类似的复制机制，只有对象。我们并不会将一个对象（“类”）复制到另一个对象（“实例”），只是将它们关联起来。
new Foo()会生成一个新对象（我们称之为a），这个新对象的内部链接/[/[Prototype/]/]关联的是Foo.prototype对象。这样一个对象就可以通过委托访问另一个对象的属性和函数。
![[Pasted image 20220731163913.png]]
![[Pasted image 20220731164010.png]]
这个机制通常被称为原型继承（稍后我们会分析具体代码），它常常被视为动态语言版本的类继承。这个名称主要是为了对应面向类的世界中“继承”的意义，但是违背（写作违背，读作推翻）了动态脚本中对应的语义。
# 2.constructor

Foo.prototype默认（在代码中第一行声明时！）有一个公有并且不可枚举（参见第3章）的属性．constructor，这个属性引用的是对象关联的函数（本例中是Foo）。此外，我们可以看到通过“构造函数”调用new Foo()创建的对象也有一个．constructor属性，指向“创建这个对象的函数”。
实际上a本身并没有．constructor属性。而且，虽然a.constructor确实指向Foo函数，但是这个属性并不是表示a由Foo“构造”，稍后我们会解释。
![[Pasted image 20220731164631.png]]

## 构造函数调用 而不是构造函数
实际上，Foo和你程序中的其他函数没有任何区别。函数本身并不是构造函数，然而，当你在普通的函数调用前面加上new关键字之后，就会把这个函数调用变成一个“构造函数调用”。实际上，new会劫持所有普通函数并用构造对象的形式来调用它。
函数不是构造函数，但是当且仅当使用new时，函数调用会变成“构造函数调用”。

# 3.原型继承
![[Pasted image 20220731165638.png]]

# 你不知道的JS总结

# 编译原理
JS也是需要编译的语言，但是他不是提前编译的，编译结果也不能在分布式系统中进行移植。但是编译步骤与传统编译语言很相似，甚至某些环节更复杂。
传统编译语言的三个步骤：
1.分词/词法分析（Tokenizing/Lexing）
此过程会将由字符组成的字符串分解成对编程语言来说有意义的代码块，被称为词法单元（token)。 var a = b 分解成 var、a、=、b四块
2.解析/语法分析（parsing）
此过程将词法单词流数组转韩城由元素逐级嵌套形成的抽象语法树，AST，代表了程序语法结构。
3.代码生成
将AST转换为可执行代码的过程。将AST转化为一组志气指令。
JS在语法分析与代码生成阶段，有特定的步骤对运行性能进行优化，包括对冗余元素进行优化。
对于JS来说：
1.  执行流遇到 `var a`，编译器会询问作用域是否已经有一个该名称的变量存在于同一个作用域的集合中。如果是，编译器会忽略该声明，继续进行编译；否则它会要求作用域在当前作用域的集合中声明一个新的变量，并命名为`a`。
2.  接下来编译器会为引擎生成运行所需的代码，这些代码被用来处理 `a = 2` 这个赋值操作。引擎运行时会首先询问作用域，在当前的作用域集合中，是否存在一个叫作 `a` 的变量，如果是，引擎就会使用这个变量；如果否，引擎就会继续查找该变量。
-   编译器在作用域声明变量（如果没有）
-   引擎在运行这些代码时查找该变量，如果作用域中有该变量则进行赋值

# 作用域
作用域就是变量（标识符）适用范围，控制着变量的可见性
作用域主要分为两种：-   词法作用域/静态作用域  和 动态作用域，
词法作用域是在 **定义** 时确定的，而动态作用域是在 **运行** 时确定的。

## 词法作用域
js采用词法作用域/静态作用域，因此函数的作用域在函数定义的时候就决定了。换句话说就是词法作用域是由写代码时变量和快作用域写在哪里来确定的。
（而与词法作用域相对的是动态作用域，函数的作用域是在函数调用的时候才决定的。）

作用域是一套规则，用于确定在何处以及如何查找变量（标识符）。如果查找的目的是对变量进行赋值，那么就会用LHS查询，查询是试图找到变量的容器本身，从而可以对其赋值；如果目的是获取变量的值，就会使用RHS查询， 查询与简单的查找某个变量的值毫无二致。

JS引擎在代码执行前会对代码进行编译，此过程中，var a = 2这样的声明会被粉籍成两个独立的步骤 1.var a 在其作用域中声明新变量 2. a=2 LHS查询，并赋值

LHS和RHS查询都会在当前作用域中开始，如果没找到，就会想上级作用域逐层查找，直到达到顶层的全局作用域，找到找不到都会停止。

### 嵌套作用域：
![[Pasted image 20220805215212.png]]
### 查找
作用域查找始终从运行时所处的最内部作用域开始，逐级向外或者说向上层作用域进行查询，直到遇见第一个匹配的标识符为止。
### 遮蔽
**作用域查找会在找到第一个匹配的标识符时停止**。
在多层嵌套作用域中允许定义同名标识符，称为 **遮蔽效应**（内部的标识符遮蔽了外部的标识符）。

## 动态作用域
态作用域是 JavaScript 另一个重要机制 [this](https://tsejx.github.io/javascript-guidebook/core-modules/executable-code-and-execution-contexts/execution/this) 的表亲。作用域混乱多数是因为词法作用域和 `this` 机制相混淆。
**动态作用域** 并不关心函数和作用域是如何声明以及在何处声明，它只关心它们从何处调用。
换句话说，[作用域链](https://tsejx.github.io/javascript-guidebook/core-modules/executable-code-and-execution-contexts/execution/scope-chain) 是基于 **调用栈** 的，而不是代码中的作用域嵌套。

## 函数作用域

**函数作用域** 指属于这个函数的全部变量都可以在整个函数的范围内使用及复用（事实上在嵌套的作用域中也可以使用）。这种设计方案是非常有用的，能充分利用 JavaScript 变量可以根据需要改变值类型的动态特性。
### 隐藏内部实现
最小权限原则：指在软件设计中，应该最小限度地暴露必要内容，而将其他内容都 **隐藏** 起来。
暴露过多的变量或函数，而这些变量或函数本应该是私有的，正确的代码应该是 **可以阻止对这些变量或函数进行访问**。
#### 匿名和具名函数表达式
无论是匿名还是具名，都是针对 **函数表达式** 的。函数声明必须有名称，否则报错。

## 块作用域
var
let const

## 声明提升

### 为什么要提升？
JavaScript 程序的运行阶段分为 **预编译阶段** 和 **执行阶段**。
在预编译阶段，JavaScript 引擎会做一件事情，那就是读取 `变量的定义` 并 `确定其作用域` 即生效范围。
编译在执行阶段前且只执行一次。编译阶段统计每个作用域中所有的变量、函数（变量提升）、去冗余，去注释，压缩等，不需要每次执行到这个函数的时候再编译一次，可以直接为该函数分配对应的栈空间，可以优化JS运行的性能。导致了变量提升的出现。
另一个带来的副作用或者说好处，可以提高JS代码的容错性，使一些不规范的代码也可以正常执行。

**声明提升** 包括 **变量声明提升** 和 **函数声明提升**：

-   **变量声明提升**：通过 `var`、`let` 和 `const` 声明的变量在代码执行之前被 JavaScript 引擎提升到当前作用域的顶部
-   **函数声明提升**：通过函数声明的方式（非函数表达式）声明的函数在代码执行之前被 JavaScript 引擎提升了当前作用域的顶部，而且 **函数声明提升优先于变量声明提升**

JavaScript 的代码在生成前，会先对代码进行编译，编译的一部分工作就是找到所有的声明，然后建立作用域将其关联起来，因此，在 **当前作用域内** 包括变量和函数在内的所有声明都会在任何代码被执行前首先被处理。

注意这里是 **声明** 会被提前处理，**赋值** 并没有， 定义声明是在编译阶段进行的，而赋值是在执行阶段进行的 。也就是说声明提升了，赋值还留着原地，等待执行。
### 总结
- 函数声明（function开头）提升，会将函数的声明和定义全都提升至**当前作用域**顶部，调用可以正常运行。函数表达式不提升，若是赋值表达式，变量提升。
- 变量声明提升，只提升声明部分（未赋值状态），赋值部分保持原位置不动，在未赋值的情况下，该变量的值是 `undefined`
- **变量的重复声明是无用的**，但**函数的重复声明会覆盖前面的声明**（无论是变量还是函数声明）。
### let const 到底有没有提升
用了两个月的时间才理解 let https://zhuanlan.zhihu.com/p/28140450
#### 变量的生命周期：
1. 声明阶段（`Declaration phase`）正在范围内注册变量 **创建**
2. 初始化阶段（`Initialization phase`）是分配内存并为作用域中的变量创建绑定**初始化**
3. 分配阶段（`Assignment phase`）是为初始化变量分配一个值**赋值**
#### var 声明的「创建、初始化和赋值」过程
```text
function fn(){
  var x = 1
  var y = 2
}
fn()
```

在执行 fn 时，会有以下过程（不完全）：
1.  进入 fn，为 fn 创建一个环境。
2.  找到 fn 中所有用 var 声明的变量，在这个环境中「创建」这些变量（即 x 和 y）。
3.  将这些变量「初始化」为 undefined。
4.  开始执行代码
5.  x = 1 将 x 变量「赋值」为 1
6.  y = 2 将 y 变量「赋值」为 2

也就是说 var 声明会在代码执行之前就将「创建变量，并将其初始化为 undefined」。

这就解释了为什么在 var x = 1 之前 console.log(x) 会得到 undefined。

#### function 声明的「创建、初始化和赋值」过程
假设代码如下：
```js
fn2()

function fn2(){
  console.log(2)
}
```
JS 引擎会有一下过程：
1.  找到所有用 function 声明的变量，在环境中「创建」这些变量。
2.  将这些变量「初始化」并「赋值」为 function(){ console.log(2) }。
3.  开始执行代码 fn2()
也就是说 function 声明会在代码执行之前就「创建、初始化并赋值」。
#### 接下来看 let 声明的「创建、初始化和赋值」过程**
假设代码如下：
```text
{
  let x = 1
  x = 2
}
```
我们只看 {} 里面的过程：
1.  找到所有用 let 声明的变量，在环境中「创建」这些变量
2.  开始执行代码（注意现在还没有初始化）
3.  执行 x = 1，将 x 「初始化」为 1（这并不是一次赋值，如果代码是 let x，就将 x 初始化为 undefined）
4.  执行 x = 2，对 x 进行「赋值」

这就解释了为什么在 let x 之前使用 x 会报错：
```js
let x = 'global'
{
  console.log(x) // Uncaught ReferenceError: x is not defined
  let x = 1
}
```

原因有两个
1.  console.log(x) 中的 x 指的是下面的 x，而不是全局的 x
2.  执行 log 时 x 还没「初始化」，所以不能使用（也就是所谓的暂时死区）

#### 总结
⭐️**看到这里，你应该明白了 let 到底有没有提升：**
1.  let 的「创建」过程被提升了，但是初始化没有提升。
2.  var 的「创建」和「初始化」都被提升了。
3.  function 的「创建」「初始化」和「赋值」都被提升了。
#### 如何理解let x = x报错后，x依然报错
![[Pasted image 20220805232724.png]]
这个问题说明：如果 let x 的初始化过程失败了，那么
1.  x 变量就将永远处于 created 状态。
2.  你无法再次对 x 进行初始化（初始化只有一次机会，而那次机会你失败了）。
3.  由于 x 无法被初始化，所以 x 永远处在暂时死区（也就是盗梦空间里的 limbo）！
4.  有人会觉得 JS 坑，怎么能出现这种情况；其实问题不大，因为此时代码已经报错了，后面的代码想执行也没机会。



# 闭包
1.  首先要理解执行环境，执行环境定义了变量或函数有权访问的其他数据。
2.  每个执行环境都有一个与之关联的变量对象，环境中定义的所有变量和函数都保存在这个对象中。
3.  每个函数都有自己的执行环境，和与之关联的变量对象，当执行流进入一个函数时，函数的环境就会被推入到一个环境栈中。而在函数执行之后，栈将其环境弹出，把控制权返回给之前的执行环境。
4.  当某个函数被调用时，会创建一个执行环境及其相应的 **作用域链**。然后使用 `arguments` 和其他命名参数的值来初始化函数的活动对象。在函数中，活动对象作为变量对象使用（_作用域链是由每层的变量对象使用链结构链接起来的_）。
5.  在作用域链中，外部函数的活动对象始终处于第二位，外部函数的外部函数的活动对象处于第三位，直到作用域链终点即全局执行环境。
6.  **作用域链的本质是一个指向变量对象的指针列表，它只引用但不实际包含变量对象。**

https://tsejx.github.io/javascript-guidebook/core-modules/executable-code-and-execution-contexts/compilation/closures
我们通过一段代码仔细分析上述代码片段执行过程到底发生了什么（精简版，完整见↑）：
```js
function foo() {

  var a = 2;

  function bar() {

    console.log(a);

  }

  return bar;

}

var baz = foo();

baz();
```


⭐️按理说，这时 `foo` 函数已经执行完毕，应该销毁其执行环境，等待垃圾回收。但因为其返回值是 `bar` 函数。`bar` 函数中存在自由变量 `a`，需要通过作用域链到 `foo` 函数的执行环境中找到变量 `a` 的值，所以虽然 `foo` 函数的执行环境被销毁，但其变量对象不能被销毁，**只是从活动状态变成非活动状态**；而全局环境的变量对象则变成活动状态；执行流继续执行 `var baz = foo`，把 `foo` 函数的返回值 `bar` 函数赋值给 `baz`。

对的，就是因为这个作用域链，`bar` 函数依然可以读取到 `fooContext.AO` 的值，说明当 `bar` 函数引用了 `fooContext.AO` 中的值的时候，即使 `fooContext` 被销毁了，但是 JavaScript 依然会让 `fooContext.AO` 活在内存中，`bar` 函数依然可以通过 `bar` 函数的作用域链找到它，正是因为 JavaScript 做到了这一点，从而实现了闭包这个概念。

## 定义：
**闭包的定义**：指有权访问另一个函数作用域中的变量的函数，一般情况就是在一个函数中包含另一个函数。

**闭包的作用**：访问函数内部变量、保持函数在环境中一直存在，不会被垃圾回收机制处理

函数内部声明的变量是局部的，只能在函数内部访问到，但是函数外部的变量是对函数内部可见的。

子级可以向父级查找变量，逐级查找，直到找到为止或全局作用域查找完毕。

因此我们可以在函数内部再创建一个函数，这样对内部的函数来说，外层函数的变量都是可见的，然后我们就可以访问到他的变量了。

## 应用场景
-   **函数嵌套**：函数里面的函数能够保证外面的函数的作用域不会被销毁，所以无论是在函数里面还是在外面调用函数里面的函数都可以访问到外层函数的作用域，具体做法可以将里面函数当做返回值返回后通过两次的括号调用
-   **回调函数**：回调函数会保留当前外层的作用域，然后回调到另一个地方执行，执行的时候就是闭包
-   **匿名函数自执行**：严格算也不是闭包，就是 `(function(){})()` 这种格式
## 优缺点
-   优点：能够让希望一个变量长期驻扎在内存之中成为可能，避免全局变量的污染，以及允许私有成员的存在
-   缺点：就是常驻内存会增大内存使用量，并且使用不当容易造成内存泄漏。（如果在将来需要回收这些变量，我们可以手动把这些变量设为 null来及时回收这些内存。另使用闭包的同时比较容易形成循环引用，如果闭包的作用域链中保存着一些DOM节点，这时候就有可能造成内存泄露。）

# 执行上下文
![[Pasted image 20220806100838.png]]
当我们调用一个函数时（激活），一个新的执行上下文就会被创建。

一个执行上下文的生命周期可分为 **创建阶段** 和 **代码执行阶段** 两个阶段。

**创建阶段**：在这个阶段中，执行上下文会分别进行以下操作

-   创建 [变量对象](https://tsejx.github.io/javascript-guidebook/core-modules/executable-code-and-execution-contexts/execution/variable-object)
-   建立 [作用域链](https://tsejx.github.io/javascript-guidebook/core-modules/executable-code-and-execution-contexts/execution/scope-chain)
-   确定 [this](https://tsejx.github.io/javascript-guidebook/core-modules/executable-code-and-execution-contexts/execution/this) 的指向

**代码执行阶段**：创建完成之后，就会开始执行代码，并依次完成以下步骤
执行上下文可以理解为当前代码的执行环境，它会形成一个作用域。

JavaScript 中的运行环境大概包括三种情况：

-   **全局环境**：JavaScript 代码运行起来会首先进入该环境
-   **函数环境**：当函数被调用执行时，会进入当前函数中执行代码
-   **eval**（不建议使用，可忽略）

因此在一个 JavaScript 程序中，必定会产生多个执行上下文，而 JavaScript 引擎会以栈的方式来处理它们，这个栈，我们称其为 **函数调用栈（Call Stack）**。栈底永远都是全局上下文，而栈顶就是当前执行的上下文。
## 总结
-   JavaScript 引擎是单线程的
-   同步执行，只有栈顶的上下文处于执行中，其他上下文需要等待
-   全局上下文只有唯一的一个，它在浏览器关闭时出栈
-   函数的执行上下文的个数没有限制
-   每次某个函数被调用，就会有个新的执行上下文为其创建，即使是调用的自身函数，也是如此
- 函数被调用，新的执行上下文被创建，并推入执行上下文栈中，正在执行的函数的执行上下文位于栈顶，执行完后出栈，等待被回收。

# 变量对象

## 全局上下文变量对象 即全局对象
**全局对象** 是预定义的对象，作为 JavaScript 的全局函数和全局属性的占位符。通过使用全局对象，可以访问所有其他所有预定义的对象、函数和属性。
this
有属性window指向自身
有全局函数，全局属性
是全局变量的宿主
##  函数执行上下文对象
在函数执行上下文中，我们用 **活动对象**（Activation Object，AO）来表示变量对象
活动对象是在进入函数执行上下文时刻被创建的，它通过函数的 `arguments` 属性初始化。

## 变量对象初始化和创建
1.  全局执行上下文的变量对象初始化是全局对象
2.  函数执行上下文的变量对象初始化只包括 Arguments 对象
3.  在进入执行上下文时会给变量对象添加形参、函数声明、变量声明等初始的属性值
4.  在代码执行阶段，会再次修改变量对象的属性值

## 变量对象和活动对象的关系
未进入执行阶段之前，变量对象（VO：Variable Object）中的属性都不能访问。

但是进入执行阶段之后，活动对象（AO：Activation Object）被激活，里面的属性包括 VO、函数执行时传入的参数和 Arguments 对象都能被访问了，然后开始进行执行阶段的操作。

利用公式可以简单表述为:

AO = VO + function parameters + arguments

# 作用域链
这样由多个执行上下文的 **变量对象** 构成的链表就叫做作用域链。
## 创建
函数作用域在函数定义的时候就决定了。

这是因为函数有一个内部属性 `[[Scopes]]`，当函数创建的时候，就会保存所有父级作用域内的变量对象到其中，你可以理解 `[[Scopes]]` 就是所有父级作用域的变量对象的层级链，但是注意：`[[Scopes]]` 并不代表完整的作用域链。

## 激活
当函数激活（执行）时，进入函数上下文，创建 VO / AO 后，就会将 **活动对象** 添加到作用域链的前端。

这时候执行上下文的作用域链，我们命名为 Scopes：

Scopes = [AO].concat([[Scopes]]);

至此，作用域链创建完毕。

## 例子
总结一下函数执行上下文中作用域链和变量对象的 **创建过程**：

const scope = 'global scope';

function checkscope() {

  var scope2 = 'local scope';

  return scope2;

}

checkscope();

**执行过程** 如下：

1.  `checkscope` 函数被创建，保存作用域链到内部属性 `[[Scopes]]`

checkscope.[[Scopes]] = [

  globalContext.VO

];

2.  执行 `checkscope` 函数，创建 `checkscope` 函数执行上下文，`checkscope` 函数执行上下文被压入执行上下文栈

ECStack = [checkscopeContext, globalContext];

3.  `checkscope` 函数并不立刻执行，开始做准备工作，第一步：复制函数 `[[Scopes]]` 属性创建作用域链

checkscopeContext = {

  Scopes: checkscope.[[Scopes]],

}

4.  用 `arguments` 创建活动对象，随后初始化活动对象，加入形参、函数声明、变量声明

checkscopeContext = {

  AO: {

    arguments: {

      length: 0

    },

    scope2: undefined

  }，

  Scopes: checkscope.[[Scopes]],

}

5.  将活动对象压入 `checkscope` 作用域链顶端

checkscopeContext = {

  AO: {

    arguments: {

      length: 0,

    },

    scope2: undefined,

  },

  Scopes: [AO, [[Scopes]]],

};

6.  准备工作做完，开始执行函数，随着函数的执行，修改 AO 的属性值

checkscopeContext = {

  AO: {

    arguments: {

      length: 0,

    },

    scope2: 'local scope',

  },

  Scopes: [AO, [[Scopes]]],

};

7.  查找到 `scope2` 的值，返回后函数执行完毕，函数上下文从执行上下文栈中弹出

ECStack = [globalContext];


-   变量赋值
-   函数引用
-   执行其他代码

  

![execution context](data:image/jpeg;base64,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)
# this
## 调用位置
首先要理解 `this` 的**调用位置**：调用位置就是函数在代码中被调用的位置（而不是声明的位置）。**分析调用栈**（就是为了到达当前执行位置所调用的所有函数）。我们关心的调用位置就在当前正在执行的函数的前一个调用中。
## 绑定规则
### 1.默认绑定：
**独立函数调用**。可以把这条规则看作是无法应用其他规则时的默认规则。
函数运行在非严格模式下时，绑定到全局对象。
foo 函数直接使用不带任何修饰的函数引用进行调用，因此只能使用默认绑定，无法应用其他规则
### 2.隐式绑定
需要考虑的规则是调用位置是否有**上下文对象**，或者说是否**被某个对象拥有或者包含**

```js
function foo() {
  console.log(this.a);
}

const container = {
  a: 2,
  foo: foo,
};

container.foo(); // 2
```
这个函数严格来说都不属于 `container` 对象。

然而，调用位置会使用 `container` 上下文来引用函数，因此你可以说函数被调用时 `container` 对象 **拥有** 或者 **包含** 它。
ps.
1.**对象属性引用链中只有上一层或最后一层在调用位置中起作用。 ** a.b.func() b起作用
2.隐式丢失 var c = a.fun; c(), 绑不到a上；或回调函数传入a.fun(),由于回调函数实际是隐式赋值，因此也会发生隐式丢失
## 3.显示绑定
JavaScript 提供了 `apply`、`call` 和 `bind` 方法，为创建的所有函数 **绑定宿主环境**。通过这些方法绑定函数的 `this` 指向称为 **显式绑定**。
硬绑定 内置函数
## 4.构造调用绑定 new func()
 ⭐️使用 `new` 来调用函数，或者说发生构造函数调用时，会自动执行下面的操作。
1.  创建全新的空对象
2.  将新对象的隐式原型对象关联构造函数的显式原型对象
3.  执行对象类的构造函数，同时该实例的属性和方法被 `this` 所引用，即 `this` 指向新构造的实例
4.  如果构造函数执行后没有返回其他对象，那么 `new` 表达式中的函数调用会自动返回这个新对象
模拟过程
```js
function objectFactory(constructor, ...rest) {
  // 创建空对象，空对象关联构造函数的原型对象
  const instance = Object.create(constructor.prototype);
  // 执行对象类的构造函数，同时该实例的属性和方法被 this 所引用，即 this 指向新构造的实例
  const result = constructor.apply(instance, rest);
  // 判断构造函数的运行结果是否对象类型
  if (result !== null && /^(object|function)$/.test(typeof result)) {
    return result;
  }
  return instance;
}
```

### 优先级
显式绑定 > 构造调用绑定 > 隐式绑定 > 默认绑定;

### 软绑定 没看懂 todo

### 指向变更
在编码中改变 `this` 指向。
-   使用 ES6 的箭头函数
-   在函数内部使用 `_this = this`
-   使用 `apply`、`call` 和 `bind`
-   `new` 实例化一个对象

### 箭头函数
箭头函数并不是使用 `function` 关键字定义的，而是使用被称为胖箭头的操作符 `=>` 定义的。箭头函数不使用 `this` 的四种标准规则，而是根据外层（函数或者全局）作用域来决定 `this` 的指向。并且，箭头函数拥有静态的上下文，即一次绑定之后，便不可再修改。

`this` 指向的固定化，并不是因为箭头函数内部有绑定 `this` 的机制，实际原因是箭头函数根本没有自己的 `this`，导致内部的 `this` 就是外层代码块的 `this`。正是因为它没有 `this`，所以也就不能用作构造函数
例子
```js
function Timer() {
  this.num1 = 0;
  this.num2 = 0;

  // 箭头函数
  setInterval(() => this.num1++, 1000);

  // 普通函数
  setInterval(function () {
    this.num2++;
  }, 1000);
}

const timer = new Timer();

setTimeout(() => console.log('num1', timer.num1), 3000);
setTimeout(() => console.log('num2', timer.num2), 3000);
// num1: 3
// num2: 0
```
上面的代码中，`Timer` 函数内部设置了两个定时器，分别使用了箭头函数和普通函数。

前者的 `this` 绑定 **定义时** 所在的作用域（即 `Timer` 函数），后者的 `this` 指向 **运行时** 所在的作用域（即全局对象）。所以，3000ms 之后， `timer.num1` 被更新了 3 次，而 `timer.num2` 一次都没更新。

### 总结
1.  函数的普通调用
2.  函数作为对象方法调用
3.  函数作为构造函数调用
4.  函数通过 `call`、`apply`、`bind` 间接调用
5.  箭头函数的调用
# 内存管理
## 内存模型
JavaScript 内存空间分为 **栈**（Stack）、**堆**（Heap）、**池**（一般也会归类为栈中）。其中 **栈** 存放变量，**堆** 存放复杂对象，**池** 存放常量
![[Pasted image 20220806111149.png]]

## 内存生命周期
![[Pasted image 20220806111223.png]]
1.  **内存分配**：当我们声明变量、函数、对象的时候，系统会自动为他们分配内存
2.  **内存使用**：即读写内存，也就是使用变量、函数等
3.  **内存回收**：使用完毕，由 [垃圾回收机制](https://tsejx.github.io/javascript-guidebook/core-modules/executable-code-and-execution-contexts/memory-management/garbage-collection) 自动回收不再使用的内存

## 垃圾回收
在编写 JavaScript 的过程中，内存的分配以及内存的回收完全实现了自动管理。

JavaScript 通过 **自动垃圾收集机制** 实现内存的管理。垃圾回收机制通过垃圾收集器每隔固定的时间段（周期性）找出那些不再需要继续使用的变量，执行一次释放占用内存的操作

### 不再需要继续使用的变量也就是生命周期结束的变量
-   **局部变量**：在局部作用域中，当函数执行完毕，局部变量也就没有存在的必要了（除了闭包），因此垃圾收集器很容易做出判断并回收
-   **全局变量**：但是全局变量的生命周期直到浏览器卸载页面才会结束，也就是**全局变量不会被当成垃圾变量回收**。所以声明一个全局变量的时候，我们一定要慎重的考虑，在使用完这个变量的对象之后，我们是否还在需要这个对象，如果不需要的话，我们应该手动的将这个变量置为空（`null`），这样在下一次垃圾回收的时候，就能去释放这个变量上一次指向的值
### 原理
#### 引用计数法
优点：可以引用计数为0时立即回收垃圾
缺点：计数器占位置大，无法解决循环问题，造成内存泄漏
#### 标记清除法
根据可达性判断变量是否需要清除。
标记清除的工作流程：
-   垃圾收集器在运行的时候会给存储在内存的中的 **所有变量都加上标记**
-   去掉 **执行上下文中的变量** 以及 **被环境中的变量引用的变量** 的标记
-   那些 **还存在标记的变量将被视为准备删除的变量**
-   最后垃圾收集器完成内存清除工作，销毁那些带标记的值并回收它们所占用的内存空间

缺点：内存碎片，导致分配变慢（first-fit best-fit worst-fit ）
#### 标记清除法的优化：
1.标记整理法：标记清除完，把活着的内存整理到一侧
V8对垃圾回收的优化
1.【**分代式垃圾回收**】
堆内存分为新生代和老生代两区域，采用不同的垃圾回收器也就是不同的策略管理垃圾回收
新生代的对象为存活时间较短的对象，简单来说就是新产生的对象，比较通常小1-8M
老生代：大老对象
采用了两个垃圾回收器来管控
2.新生代垃圾回收： `Scavenge` 的算法进行垃圾回收，在 `Scavenge算法` 的具体实现中，主要采用了一种复制式的方法即 `Cheney算法`。【**`Cheney算法`** 】中将堆内存一分为二，一个是处于使用状态的空间我们暂且称之为 `使用区`，一个是处于闲置状态的空间我们称之为 `空闲区`新加入的对象都会存放到使用区，当使用区快被写满时，就需要执行一次垃圾清理操作
当开始进行垃圾回收时，新生代垃圾回收器会对使用区中的活动对象做标记，标记完成之后将使用区的活动对象复制进空闲区并进行排序，随后进入垃圾清理阶段，即将非活动对象占用的空间清理掉。最后进行角色互换，把原来的使用区变成空闲区，把原来的空闲区变成使用区
当一个对象经过多次复制后依然存活，它将会被认为是生命周期较长的对象，随后会被移动到老生代中，采用老生代的垃圾回收策略进行管理
![[Pasted image 20220806115000.png]]
3.老生代：标记清除，加整理
4.【**并行回收**】，新生代，主线程是让出来的，全停顿
![[Pasted image 20220806114950.png]]
5.【**增量标记**】：
老生代，为了减少全停顿的时间，从全停顿标记切换到增量标记，要暂停和恢复-》三色标记法与写屏障
![[Pasted image 20220806115019.png]]
【**三色标记法**】：暂停恢复 即使用每个对象的两个标记位和一个标记工作表来实现标记，两个标记位编码三种颜色：白、灰、黑

-   白色指的是未被标记的对象
-   灰色指自身被标记，成员变量（该对象的引用对象）未被标记
-   黑色指自身和成员变量皆被标记
![[Pasted image 20220806115159.png]]

恢复的时候，有灰色的从灰色开始继续标记，没有灰色的开始清理。
【**写屏障**】：暂停过程中，避免，已经标记过的变量关系被修改，比如给一个黑色节点增加一个子节点，这个节点永远不会被标记为黑，则会被GC，写屏障规定，一旦给黑节点加子节点，这个节点自动标为灰色
6.【**懒性清理**】
增量标记完成后，假如当前的**可用内存足**以让我们快速的执行代码，其实我们是没必要立即清理内存的，可以将**清理过程稍微延迟**一下，**让 `JavaScript` 脚本代码先执**行，**也无需一次性清理完**所有非活动对象内存，可以按需逐一进行清理直到所有的非活动对象内存都清理完毕，后面再接着执行增量标记
（也有并发回收，避免阻塞主线程）

**增量标记与惰性清理优缺点**:
优点：主线程的停顿时间大大减少了，让用户与浏览器交互的过程变得更加流畅。
缺点：减少主线程的总暂停的时间，甚至会略微增加，总成本增加。

内存泄漏
![[Pasted image 20220806133337.png]]
![[Pasted image 20220806133404.png]]

## ES5 ES6继承的区别
https://juejin.cn/post/6844903924015120397
https://segmentfault.com/a/1190000040585990
### 1. ES5 继承
明确继承要继承些什么东西，三部分，
一实例属性/方法
二是原型属性/方法
三是静态属性/方法
```js
function A(name) {
  this.name = name; // 实例属性
}
A.type = '午'; // 静态属性
// 静态方法
A.sleep =  function () {
    console.log(`我在睡${this.type}觉`)
}
// 实例方法
A.prototype.say = function() {
    console.log('我叫 ' + this.name)
}

function B(name, age) {
  // 继承父类的实例属性
  A.call(this, name);
  // 子类自己的实例属性
  this.age = age;
}

B.prototype = Object.create(A.prototype, {
  constructor: { value: B, writable: true, configurable: true }
});

let b = new B();
```
代码中，构造函数 B 继承构造函数 A，首先让构造函数 B 的 prototype 对象中的 __proto__ 属性指向构造函数 A 的 prototype 对象，并且将构造函数 B 的 prototype 对象的 constructor 属性赋值为构造函数 B，让构造函数 B 的实例继承构造函数 A 的原型对象上的属性，

然后在构造函数 B 内部的首行写上 A.call(this)，让构造函数 B 的实例继承构造函数 A 的实例属性。能这么做的原理又是另外一道经典面试题：`new操作符都做了什么`，很简单，就`4`点：
1.创建一个空对象
2.把该对象的`__proto__`属性指向`Sub.prototype`
3.让构造函数里的`this`指向新对象，然后执行构造函数，
4.返回该对象
所以`Sup.call(this)`的`this`指的就是这个新创建的对象，那么就会把父类的实例属性/方法都添加到该对象上。

在 ES5 中实现两个构造函数之间的继承，只需要做这两步即可。
实例 b 的原型链如下图：
![[Pasted image 20220901183110.png]]
![[Pasted image 20220901183125.png]]
构造函数 B 的原型链图下图：
![[Pasted image 20220901183312.png]]
从上面 6 幅图可知，
构造函数 B 的实例 b 继承了构造函数 A 的实例属性，继承了构造函数 A 的原型对象上的属性，继承了构造函数 Object 的原型对象上的属性。
构造函数 B 是构造函数 Function 的实例，继承了构造函数 Function 的原型对象上的属性，继承了构造函数 Object 的原型对象上的属性。 
构造函数 A 是构造函数 Function 的实例，继承了构造函数 Function 的原型对象上的属性，继承了构造函数 Object 的原型对象上的属性。
可看出，构造函数 A 与 构造函数 B 并没有继承关系，即构造函数 B 没有继承构造函数 A 上面的属性，在 ES6 中，用 extends 实现两个类的继承，两个类之间是有继承关系的，即子类继承了父类的方法，这是 ES6 与 ES5 继承的第一点区别，下面通过 ES6 的继承来说明这一点。

### 2.ES6继承
```js
class A {
  constructor() {
    this.a = 'hello';
  }
}

class B extends A {
  constructor() {
	super();
	this.b = 'world';
  }
}

let b = new B();
```
代码中，类 B 通过 extends 关键字继承类 A 的属性及其原型对象上的属性，通过在类 B 的 constructor 函数中执行 super() 函数，让类 B 的实例继承类 A 的实例属性，super() 的作用类似构造函数 B 中的 A.call(this)，但它们是有区别的，这是 ES6 与 ES5 继承的第二点区别，这个区别会在文章的最后说明。在 ES6 中，两个类之间的继承就是通过 extends 和 super 两个关键字实现的。下面四幅图分别是，实例 b 的原型链及验证图，类 B 的原型链及验证图。
![[Pasted image 20220901183601.png]]
![[Pasted image 20220901183637.png]]
在 ES6 与 ES5 中，类 B 的实例 b 的原型链与构造函数 B 的实例 b 的原型链是相同的，但是在 ES6 中类 B 继承了类 A 的属性，在 ES5 中，构造函数 B 没有继承构造函数 A 的属性，这是 ES6 与 ES5 继承的第一个区别。
### super() 与 A.call(this) 的区别
在 ES5 中，构造函数 B 的实例继承构造函数 A 的实例属性是通过 A.call(this) 来实现的，在 ES6 中，类 B 的实例继承类 A 的实例属性，是通过 super() 实现的。在不是继承原生构造函数的情况下，A.call(this) 与 super() 在功能上是没有区别的，用 [babel 在线转换](https://link.juejin.cn?target=https%3A%2F%2Fbabeljs.io%2Frepl%2F%23%3Fbabili%3Dfalse%26evaluate%3Dtrue%26lineWrap%3Dfalse%26presets%3Des2015%2Creact%2Cstage-2%26targets%3D%26browsers%3D%26builtIns%3Dfalse%26debug%3Dfalse%26code%3D "https://babeljs.io/repl/#?babili=false&evaluate=true&lineWrap=false&presets=es2015,react,stage-2&targets=&browsers=&builtIns=false&debug=false&code=") 将类的继承转换成 ES5 语法，babel 也是通过 A.call(this) 来模拟实现 super() 的。但是在继承原生构造函数的情况下，A.call(this) 与 super() 在功能上是有区别的，ES5 中 A.call(this) 中的 this 是构造函数 B 的实例，也就是在实现实例属性继承上，ES5 是先创造构造函数 B 的实例，然后在让这个实例通过 A.call(this) 实现实例属性继承，在 ES6 中，是先新建父类的实例对象this，然后再用子类的构造函数修饰 this，使得父类的所有行为都可以继承。下面通过 2 段代码说明这个问题。
### 区别总结
**区别1**：ES5里的构造函数就是一个普通的函数，可以使用new调用，也可以直接调用，而ES6的class不能当做普通函数直接调用，必须使用new操作符调用（调用的时候做了检查，判断某个对象是否是某个构造函数的实例，可以看到如果不是的话就抛错了，不能把类当作函数使用）
**区别2**：ES5的原型方法和静态方法默认是可枚举的，而class的默认不可枚举，如果想要获取不可枚举的属性可以使用Object.getOwnPropertyNames方法(原因：通过`Object.defineProperty`方法来设置原型方法和静态方法，而且`enumerable`默认为`false`)
**区别3**：子类可以直接通过`__proto__`找到父类，而ES5是指向`Function.prototype`：
ES6：`Sub.__proto__ === Sup`
ES5：`Sub.__proto__ === Function.prototype`
**区别4**：ES5的继承，实质是先创造子类的实例对象`this`，然后再执行父类的构造函数给它添加实例方法和属性(不执行也无所谓）。而ES6的继承机制完全不同，实质是先创造父类的实例对象`this`（当然它的`__proto__`指向的是子类的`prototype`），然后再用子类的构造函数修改`this`。
**区别5**：class不存在变量提升，所以父类必须在子类之前定义

1.ES6 中子类会继承父类的属性，第二个区别是，super() 与 A.call(this) 是不同的，在继承原生构造函数的情况下，体现得很明显，ES6 中的子类实例可以继承原生构造函数实例的内部属性，而在 ES5 中做不到。

ES6：`Sub.__proto__ === Sup`
ES5：`Sub.__proto__ === Function.prototype`
ES5 的子类通过 **proto** 查找到的是 Function.prototype, 而 ES6 的子类通过 **proto** 查找到的是父类。原因是 ES5 和 ES6 子类 this 生成顺序不同。ES5 的继承先生成了子类实例，再调用父类的构造函数修饰子类实例，ES6 的继承先生成父类实例，再调用子类的构造函数修饰父类实例(在 constructor 中，需要使用 super())。

面试：
1.说一下原型链
2.原型类、继承怎么写，ES类继承怎么写、
3.