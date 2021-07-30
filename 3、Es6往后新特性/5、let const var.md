@[TOC]


# 一，window挂载

 1. var声明的变量会挂载在window上。 
 2. 而let和const声明的变量不会：

```javascript
    let a = 2
    var b = 3
    console.log(window.a);//undefined
    console.log(window.b);//3
```

var定义的变量，作用域是**整个封闭函数**，是**全域**的；
let定义的变量，作用域是在块级或者字块中；

# 二，变量提升;
1.  let和const不存在变量提升机制
	- let声明的变量不会在顶部初始化，凡是在let声明之前使用该变量都会报错（引用错误ReferenceError）；	
3. 不论通过var声明的变量处于当前作用于的第几行，都会提升到作用域的最顶部

>创建变量的六种方式中： var/function声明的变量有提升机制，而let、const、class和import都不存在这个机制

# 三，作用域
let和const声明形成块作用域
只要块级作用域内存在let，它所声明的变量就会绑定在这个区域；

```javascript
    if (1) {
        var a = 100;
        let b = 10;
    }
    console.log(a); // 100
    console.log(b) // 报错：b is not defined  ===> 找不到b这个变量
```

# 四，重复声明

 1. let不允许在相同作用域内重复声明（报错同时使用var和let，两个let）。
 2.  var允许重复声明，而let是不允许的

> const用来专门声明一个常量，它跟let一样作用于块级作用域，没有变量提升，重复声明会报错，不同的是const声明的常量不可改变，声明时必须初始化（赋值）