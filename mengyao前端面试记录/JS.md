![[Pasted image 20220619230252.png]]
![[Pasted image 20220619230821.png]]
![[Pasted image 20220619233917.png]]
![[Pasted image 20220619234635.png]]
![[Pasted image 20220620001809.png]]
![[Pasted image 20220620001830.png]]
![[Pasted image 20220620001848.png]]
typeof
array object null -> "object"
Undefined -> "undefined"
Boolean
Number
String
Function

![[Pasted image 20220620002542.png]]
# 类型转换
1.转String
![[Pasted image 20220620003236.png]]
2.转Number
Number()
![[1655703115351.png]]
parsexxx()第一个参数是string，第二个参数可以指定进制 10,8,2
number 进制 0 0x 0b
-   十进制(Decimal)：  
    取值数字 `0-9`；不用前缀。
-   二进制(Binary)：  
    取值数字 `0` 和 `1` ；前缀 `0b` 或 `0B`。
-   十六进制(Hexadecimal)：  
    取值数字 `0-9` 和 `a-f` ；前缀 `0x` 或 `0X`。
-   八进制(Octal)：  
    取值数字 `0-7` ；前缀 `0o` 或 `0O` (ES6规定)。

> 需要注意的是，非严格模式下浏览器支持：如果有前缀0并且后面只用到 `0-7` 八个数字的数值时，该数值视为八进制；但如果前缀0后面跟随的数字中有 `8或者9`，则视为十进制。

![[Pasted image 20220620231024.png]]
3.转Boolean
![[Pasted image 20220620231955.png]]
## 运算符
### typeof
null -> 'object' 返回值类型是string
函数-> 'function'
![[Pasted image 20220620232234.png]]
### 算术运算符
字符串加法：任何值和字符串相加，都会转字符串，再拼串 +'' 隐式String
其他：转数字，再运算
### 一元运算符
+转Number用隐式转换优先级比二元高
-
++
![[Pasted image 20220620235233.png]]
--自减
逻辑运算符
！非 布尔取反 !!隐式转布尔
&& 与
|| 或

![[Pasted image 20220621000547.png]]
### 比较运算符
.任何和NaN比都是false
.两个字符串比，比字符编码，一位一位进行比较，中文比较无意义
.其他都转数字再比

## Unicode 编码表
js中 \\u转义字符输出
html中 需要十进制的
![[企业微信截图_16557897198657.png]]

### 相等运算符
true == '1' 字符串，布尔值转成数字再比 true
hello == '1' flase
特殊情况：null == 0 false 没有转数字
undifined衍生自null, undifined == null true
NaN不和任何值相等，包括自身，isNaN()判断是不是NaN
### 三元运算符，条件表达式
执行并返回
### ，逗号
### 运算符的优先级
先乘除，后加减，不用背，用括号
![[Pasted image 20220621145148.png]]
# switch
相等后，当前往后的代码都会执行，除非break

break 跳出循环，结束循环 用在循环或者switch中，不能用在if中
continue 跳出本次循环
label使用
![[1655799226203.png]]
# 对象
![[1655804075846.png]]
# 函数
创建函数：
1.构造函数
2.函数声明 不用分号
![[1655813757111.png]]
3.函数表达式 分号
匿名函数赋值给一个变量

形参、实参； 类型，数量；undefined

return undefined

函数也可以作为参数，可以传函数、匿名函数

区别调用函数和函数对象
![[1655814929776.png]]

返回值的类型

立即执行函数：匿名函数加外括号包起来避免报错，然后（）调用函数
![[Pasted image 20220621225027.png]]
![[Pasted image 20220621225113.png]]
遍历对象：for...in... 属性名
![[Pasted image 20220621230330.png]]
# 作用域
JS中的两个作用域
全局作用域
![[Pasted image 20220621231259.png]]
函数作用域

var 声明提升到**当前作用域**的最前面，赋值不提前
![[Pasted image 20220621231211.png]]
函数声明会提升，可以提前调用；函数表达式，赋值给变量前，变量是undefined不能在声明前调用
![[Pasted image 20220621231947.png]]
不写var都是全局变量
![[Pasted image 20220621234643.png]]
形参相当于函数作用域声明变量
![[Pasted image 20220621234830.png]]

# this
解析器在**调用函数**时每次都会向函数内部传递一个隐含的参数，即this。
this指向一个对象，称为函数执行的上下文对象。
根据函数**调用方式**不同，this指向不同对象。
1.函数形式调用，this指向window 如fun()
2.方法形式调用，this指向调用方法的对象 如obj.fun2()
3.构造函数形式调用，this指向构造函数新建的对象
4.使用call applay时，this是指定的对象


注意：在函数中，使用 name 和 this.name的区别

# 创建对象
## 工厂方法创建对象
使用的构造函数都是new Object(),无法区分多种对象
了解：
![[1655867656797.png]]


## 构造函数：
构造函数就是一个普通函数，创建方式没有不同，习惯上首字母大写
普通函数直接调用，构造函数调用方式要加上new，会返回一个对象
![[1655867953459.png]]
![[1655868478679.png]]
构造函数执行流程：
1.立刻创建一个新的对象
2.将新建的对象设置为函数中的this指向构造函数新建的对象
3.逐行执行函数中的代码
4.将新的对象作为返回值返回

使用同一个构造函数创建的对象成为一类对象，构造函数也称为一个类，由构造函数创建的对象称为类的实例。
对象 instanceof 构造函数； 检查一个对象是否是一个类的实例，是返回true，否则false

### 优化（不重要）
目前方法在构造函数内部创建，每次执行一次构造函数，就会创建一个新的方法，每个实例的方法都是唯一的，不同的，但功能是相同的，浪费，应该实例共享同一个方法。
优化1.把方法在全局作用域中定义
问题：污染全局作用域命名空间，而且定义在全局作用域中不安全
![[1655868829394.png]]

## 原型
每创建一个函数，解析器都会向函数中添加一个属性prototype，每个函数的都是唯一的。
prototype属性指向一个对象，即原型对象。
如果函数作为普通函数调用，prototype属性没有任何作用。
如果函数作为构造函数调用，所创建的对象（实例）的隐含属性(\_\_proto\_\_)，指向该构造函数的原型对象。
是对象就有隐含属性(\_\_proto\_\_)。
![[1655869633247.png]]
优化2：原型对象就相当于一个公共的区域，所有同一个类的实例都可以访问到这个原型对象，可以将对象共有的内容，统一设置到原型对象中。
![[1655869833052.jpg]]

检查对象是否有某个属性
1. 'name' in objm 对象或者原型上有，都会返回true
2. objm.hasOwnProperty('name') 对象自身上有，会返回true

### 原型链：
原型对象也是对象，也有隐含属性(\_\_proto\_\_)
访问对象的属性或方法时，先在自身上找，
找不到去原型对象上找，
找不到去原型的原型上寻找，
顺着(\_\_proto\_\_)找下去，直到找到Object对象的原型，Object对象的原型没有原型，(\_\_proto\_\_)为null。找不到返回undefined。


# 垃圾回收GC
垃圾：
![[1655875165585.png]]
# 数组
数组也是一个对象

# 函数的方法
函数也是对象，也有方法

call(obj, a, b, c)和apply(obj, \[a,b,c\])

# arguments
类数组，保存实参
arguments.callee 属性，指向函数
![[1655880402028.png]]

# Date
# Math
工具类

# 包装类
把基本数据类型转换为基本对象，开发中很少用
![[1655881001254.png]]
![[1655881220507.png]]

# String
字符串在底层是以数组方式储存的

# 正则表达式
构造函数 var reg = newRegExp('a', 'i')
字面量 :
![[1655884278723.png]]
![[Pasted image 20220622225814.png]]

\[0-9\] 任意数字
\[^  \] 除了
reg.test('a')

## 量词
![[Pasted image 20220622231920.png]]
![[Pasted image 20220622232125.png]]
## 元字符
. 任意字符，真实.在字面量中需要用\\ 单斜杠转义，在构造函数中用双斜杠转义
![[Pasted image 20220622232332.png]]
# String字符串和正则相关的方法
![[Pasted image 20220622230306.png]]
search()
![[Pasted image 20220622231505.png]]
match() 字符串中匹配的，返回数组
![[Pasted image 20220622231112.png]]
replace()
![[Pasted image 20220622231258.png]]
split(/a/);
![[Pasted image 20220622231445.png]]

# DOM
## 节点元素的区别
## 元素宽高位置
element.clientWidth number 可见高度，包括内容和内边距，不包括边框，只读
element.clientHeight number 可见高度，包括内容和内边距，不包括边框，只读

element.offestWidth number 获取元素整个宽度，包括内容、内边距和边框，只读
element.offestHeight number 获取元素整个高度，包括内容、内边距和边框，只读

element.offsetParent 元素的定位父元素，最近position不是static（开启定位）的祖元素，如果没有就是body

element.offsetLeft 当前元素相对定位元素的水平偏移量
element.offsetHeight 当前元素相对定位元素的垂直偏移量

element.scrollHeight 整个滚动区域高度
element.scrollWidth 整个滚动区域宽度
element.scrollLeft 水平滚动条滚动距离
element.scrollTop 垂直滚动条滚动距离

滚动条滚动到底部时， element.scrollHeight - element.scrollTop == element.clinetHeight

## event.
clientX,screenX,pageX,offsetX

target 触发的目标元素
currentTarget 当前

拖拽：
pageX无效时，用滚动条距离计算代替 

onkeydown连续触发时，第一次和第二次的间隔会长一点，后面触发很快，防止连续误输入
onkeydown只会触发一次

在文本框中输入内容，属于onkeydown的默认行为，若取消默认行为，则不显示内容
## 事件监听
三种方法
1.在DOM元素中直接绑定；onXXX="JavaScript Code"
2.在JavaScript代码中绑定；elementObject.onXXX=function(){     // 事件处理代码 }
3.绑定事件监听函数。 elementObject.addEventListener(eventName,handle,options);

options 对象可用的属性有三个：
addEventListener(type, listener, {
    capture: false,
    passive: false,
    once: false
})
三个属性都是布尔类型的开关，默认值都为 false。其中 capture 属性等价于以前的 useCapture 参数true捕获 flase冒泡；once 属性就是表明该监听器是一次性的，执行一次后就被自动 removeEventListener 掉。
### 事件捕获和事件冒泡
阻止冒泡，用`event`的`stopPropagation()`方法
1.  不是所有事件都冒泡，如：blur、focus、load、unload
2.  不同的浏览器，阻止冒泡不一样，在w3c标准`event.stopPropagation()`， IE`event.cancelBubble=true`来完成。
#### 拓展VUE事件修饰符：
stop, prevent, self, once, capture, passive
.stop 是阻止冒泡行为,不让当前元素的事件继续往外触发,如阻止点击div内部事件,触发div事件
.prevent 是阻止事件本身行为,如阻止超链接的点击跳转,form表单的点击提交
.self 是只有是自己触发的自己才会执行,如果接受到内部的冒泡事件传递信号触发,会忽略掉这个信号
.capture 是改变js默认的事件机制,默认是冒泡,capture功能是将冒泡改为倾听模式
.once 是将事件设置为只执行一次,如 .click.prevent.once 代表只阻止事件的默认行为一次,当第二次触发的时候事件本身的行为会执行
.passive 滚动事件的默认行为 (即滚动行为) 将会立即触发，而不会等待 onScroll 完成。这个 .passive 修饰符尤其能够提升移动端的性能
### 事件委托
当事件被冒到更上层的父节点的时候，通过检查事件的目标对象（target）来判断并获取事件源
优点：
1.管理的函数变少了。不需要为每个元素都添加监听函数。对于同一个父节点下面类似的子元素，可以通过委托给父元素的监听函数来处理事件。
2.可以方便地动态添加和修改元素，不需要因为元素的改动而修改事件绑定。
3.JavaScript和DOM节点之间的关联变少了，这样也就减少了因循环引用而带来的内存泄漏发生的概率。
1.  减少事件注册，节省内存。比如，
    -   在table上代理所有td的click事件。
    -   在ul上代理所有li的click事件。
2.  简化了dom节点更新时，相应事件的更新。比如
    -   不用在新添加的li上绑定click事件。
    -   当删除某个li时，不用移解绑上面的click事件。
缺点：
1.  事件委托基于冒泡，对于不冒泡的事件不支持。
2.  层级过多，冒泡过程中，可能会被某层阻止掉。
3.  理论上委托会导致浏览器频繁调用处理函数，虽然很可能不需要处理。所以建议就近委托，比如在table上代理td，而不是在document上代理td。
4.  把所有事件都用代理就可能会出现事件误判。比如，在document中代理了所有button的click事件，另外的人在引用改js时，可能不知道，造成单击button触发了两个click事件。
### 自定义事件
参考知乎JavaScript 自定义事件如此简单！
https://zhuanlan.zhihu.com/p/108447200

目前实现**自定义事件**的两种主要方式是 JS 原生的 `Event()` 构造函数和 `CustomEvent()` 构造函数来创建。  

## **1. Event()**

`Event()` 构造函数, 创建一个新的事件对象 `Event`。

### **1.1 语法**

```text
let myEvent = new Event(typeArg, eventInit);
```

### **1.2 参数**

`typeArg` ： `DOMString` 类型，表示创建事件的名称；  
`eventInit` ：可选配置项，包括：

**字段名称说明是否可选类型默认值**`bubbles`表示该事件**是否冒泡**。可选`Boolean`false`cancelable`表示该事件**能否被取消**。可选`Boolean`false`composed`指示事件是否会在**影子DOM根节点之外**触发侦听器。可选`Boolean`false

### **1.3 演示示例**

```text
// 创建一个支持冒泡且不能被取消的 pingan 事件
let myEvent = new Event("pingan", {"bubbles":true, "cancelable":false});
document.dispatchEvent(myEvent);

// 事件可以在任何元素触发，不仅仅是document
testDOM.dispatchEvent(myEvent);
```
## **2. CustomEvent()**

`CustomEvent()` 构造函数, 创建一个新的事件对象 `CustomEvent`。

### **2.1 语法**

```text
let myEvent = new CustomEvent(typeArg, eventInit);
```

### **2.2 参数**

`typeArg` ： `DOMString` 类型，表示创建事件的名称；  
`eventInit` ：可选配置项，包括：

**字段名称说明是否可选类型默认值**`detail`表示该事件中需要被传递的数据，在 `EventListener` 获取。可选`Any`null`bubbles`表示该事件**是否冒泡**。可选`Boolean`false`cancelable`表示该事件**能否被取消**。可选`Boolean`false

### **2.3 演示示例**

```text
// 创建事件
let myEvent = new CustomEvent("pingan", {
	detail: { name: "wangpingan" }
});

// 添加适当的事件监听器
window.addEventListener("pingan", e => {
	alert(`pingan事件触发，是 ${e.detail.name} 触发。`);
});
document.getElementById("leo2").addEventListener(
  "click", function () {
    // 派发事件
		window.dispatchEvent(pingan2Event);
  }
)
```
我们也可以给自定义事件添加属性：

```text
myEvent.age = 18;
```
### **2.5 IE8 兼容**
分发事件时，需要使用 `dispatchEvent` 事件触发，它在 IE8 及以下版本中需要进行使用 `fireEvent` 方法兼容：
```text
if(window.dispatchEvent) {  
    window.dispatchEvent(myEvent);
} else {
    window.fireEvent(myEvent);
}
```
## **3. Event() 与 CustomEvent() 区别**
从两者支持的参数中，可以看出：  
`Event()` 适合创建简单的自定义事件，而 `CustomEvent()` 支持参数传递的自定义事件，它支持 `detail` 参数，作为事件中**需要被传递的数据**，并在 `EventListener` 获取。
**注意:**  
当一个事件触发时，若相应的元素及其上级元素没有进行事件监听，则不会有回调操作执行。  
当需要对于子元素进行监听，可以在其父元素进行事件托管，让事件在事件冒泡阶段被监听器捕获并执行。此时可以使用 `event.target` 获取到具体触发事件的元素。
## **三、使用场景**
**事件本质是一种消息**，事件模式本质上是**观察者模式**的实现，即能用**观察者模式**的地方，自然也能用**事件模式**。
**场景1：单个目标对象发生改变，需要通知多个观察者一同改变。**  
本例子模拟三个页面进行演示：  
1.微博列表页（Weibo.js）  
2.粉丝列表页（User.js）  
3.微博首页（Home.js）
**场景2：解耦多模块开协作。**  
举个更直观的例子，当微博需要加入【**一键三连**】新功能，需要产品原型和UI设计完后，程序员才能开发。
# BOM浏览器对象模型
BOM可以使我们通过JS来操作浏览器对象，BOM为我们提供了一组对象，用来完成对浏览器的操作。
## Window
 代表整个浏览器窗口，同时window也是网页中的全局对象
 ![[1656069130763.png]]
## Navigator
 代表当前浏览器的信息，通过该对象可以识别不同浏览器
 由于历史原因，其中的大部分属性已经不能帮我们识别浏览器了
 一般只会使用userAgent用户代理来判断浏览器信息
 通过ActiveXObject 判读是否是ie if (window.ActiveXObject)或者ActiveXObject in window
## Location
 代表当前浏览器地址栏信息，通过Location可以获取地址栏信息，或者操作跳转页面
 1.直接访问/修改 地址栏的信息，页面的完整路径
 ![[1656068851305.png]]
 ![[1656068921580.png]]
 ![[1656069081256.png]]
## History
 代表浏览器的历史记录，可以通过改对象来操作浏览器的历史记录，由于隐私原因，该对象不能获取到具体的历史记录，只能操作浏览器向前向后，而且操作只在当次访问有效
 ![[1656063847414.png]]
 
## Screen
 代表用户的屏幕信息，可以获取到用户的显示器相关信息

都是作为window对象的属性保存的，可以通过window对象使用，也可以直接使用。

# 类的操作


