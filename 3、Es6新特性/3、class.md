选自：
[Javascript定义类（class）的三种方法](http://www.ruanyifeng.com/blog/2012/07/three_ways_to_define_a_javascript_class.html)
[es6中class类的全方面理解（一）](https://www.jianshu.com/p/86267fab4878)

@[TOC]

# Javascript定义"类"的四种方法
在面向对象编程中，**类（class）是对象（object）的模板**，定义了同一组对象（又称"实例"）共有的属性和方法。

Javascript语言不支持"类"，但是可以用一些变通的方法，模拟出"类"。

## 一、构造函数法
这是经典方法，也是教科书必教的方法。它用构造函数模拟"类"。
1、在其内部用this关键字指代实例对象。

```javascript
　function Cat() {

　　　　this.name = "大毛";

　　}
```
2、生成实例的时候，使用new关键字。

```javascript
　var cat1 = new Cat();

　　alert(cat1.name); // 大毛
```
类的属性和方法，还可以定义在构造函数的prototype对象之上。

```javascript
Cat.prototype.makeSound = function(){

　　　　alert("喵喵喵");

　　}
```
关于这种方法的详细介绍，请看系列文章
[Javascript 面向对象编程（一）：封装](http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_encapsulation.html)
它的主要缺点是，**比较复杂，用到了this和prototype，编写和阅读都很费力。**
## 二、Object.create()法
为了解决"构造函数法"的缺点，更方便地生成对象，Javascript的国际标准ECMAScript第五版（目前通行的是第三版），提出了一个新的方法Object.create()。
**用这个方法，"类"就是一个对象，不是函数。**
1、定义一个对象
```javascript
　var Cat = {

　　　　name: "大毛",

　　　　makeSound: function(){ alert("喵喵喵"); }

　　};
```
2、然后，直接用Object.create()生成实例，不需要用到new。

```javascript
var cat1 = Object.create(Cat);

　　alert(cat1.name); // 大毛

　　cat1.makeSound(); // 喵喵喵
```
这种方法比"构造函数法"简单，但是**不能实现私有属性和私有方法，实例对象之间也不能共享数据**，对"类"的模拟不够全面。

## 三、极简主义法（推荐）
荷兰程序员Gabor de Mooij提出了一种比Object.create()更好的新方法，他称这种方法为"极简主义法"（minimalist approach）。
### 3.1 封装
这种方法不使用this和prototype，代码部署起来非常简单，这大概也是它被叫做"极简主义法"的原因。

1、首先，它也是用一个对象模拟"类"。在这个类里面，定义一个构造函数createNew()，用来生成实例。

```javascript
var Cat = {

　　　　createNew: function(){

　　　　　　// some code here

　　　　}

　　};
```
2、然后，在createNew()里面，定义一个实例对象，把这个实例对象作为返回值。

```javascript
　var Cat = {

　　　　createNew: function(){

　　　　　　var cat = {};

　　　　　　cat.name = "大毛";

　　　　　　cat.makeSound = function(){ alert("喵喵喵"); };

　　　　　　return cat;

　　　　}

　　};
```
使用的时候，调用createNew()方法，就可以得到实例对象。

```javascript
var cat1 = Cat.createNew();

　　cat1.makeSound(); // 喵喵喵
```
这种方法的好处是，容易理解，结构清晰优雅，符合传统的"面向对象编程"的构造，因此可以方便地部署下面的特性。
### 3.2 继承
让一个类继承另一个类，实现起来很方便。只要在前者的createNew()方法中，调用后者的createNew()方法即可。

1、先定义一个Animal类。

```javascript
　var Animal = {

　　　　createNew: function(){

　　　　　　var animal = {};

　　　　　　animal.sleep = function(){ alert("睡懒觉"); };

　　　　　　return animal;

　　　　}

　　};
```
2、然后，在Cat的createNew()方法中，调用Animal的createNew()方法。

```javascript
　var Cat = {

　　　　createNew: function(){

　　　　　　var cat = Animal.createNew();//就是这里

　　　　　　cat.name = "大毛";

　　　　　　cat.makeSound = function(){ alert("喵喵喵"); };

　　　　　　return cat;

　　　　}

　　};
```
这样得到的Cat实例，就会同时继承Cat类和Animal类。

```javascript
　var cat1 = Cat.createNew();

　　cat1.sleep(); // 睡懒觉
```
### 3.3 私有属性和私有方法
在createNew()方法中，只要不是定义在cat对象上的方法和属性，都是私有的。

```javascript
　var Cat = {

　　　　createNew: function(){

　　　　　　var cat = {};

　　　　　　var sound = "喵喵喵";

　　　　　　cat.makeSound = function(){ alert(sound); };

　　　　　　return cat;

　　　　}

　　};
```
上例的**内部变量sound**，外部无法读取，只有通过cat的公有方法makeSound()来读取。

```javascript
　var cat1 = Cat.createNew();

　　alert(cat1.sound); // undefined
```
### 3.4 数据共享
有时候，我们需要所有实例对象，能够读写同一项内部数据。这个时候，**只要把这个内部数据，封装在类对象的里面、createNew()方法的外面**即可。

```javascript
var Cat = {

　　　　sound : "喵喵喵",

　　　　createNew: function(){

　　　　　　var cat = {};

　　　　　　cat.makeSound = function(){ alert(Cat.sound); };

　　　　　　cat.changeSound = function(x){ Cat.sound = x; };

　　　　　　return cat;

　　　　}

　　};
```
>也就说：变量定义在函数里面，而且不在实例对象上，就是私有变量
>变量定义在外围的对象内，函数外，就是公有变量

这时，**如果有一个实例对象，修改了共享的数据，另一个实例对象也会受到影响。**

```javascript
　　cat2.changeSound("啦啦啦");

　　cat1.makeSound(); // 啦啦啦
```

## 四、Class方法
ES6引入了Class（类）这个概念，通过class关键字可以定义类。该关键字的出现使得其在对象写法上更加清晰，更像是一种面向对象的语言。如果将之前的代码改为ES6的写法就会是这个样子：

```javascript
class Person{//定义了一个名字为Person的类
    constructor(name,age){//constructor是一个构造方法，用来接收参数
        this.name = name;//this代表的是实例对象
        this.age=age;
    }
    say(){//这是一个类的方法，注意千万不要加上function
        return "我的名字叫" + this.name+"今年"+this.age+"岁了";
    }
}
var obj=new Person("laotie",88);
console.log(obj.say());//我的名字叫laotie今年88岁了
```
注意：

> 1.在类中声明方法的时候，千万不要给该方法加上function关键字
> 2.方法之间不要用逗号分隔，否则会报错

以下代码说明构造函数的prototype属性，在ES6的类中依然存在着。
console.log(Person.prototype);//输出的结果是一个对象
**实际上类的所有方法都定义在类的prototype属性上。**

这就导致了两个特点：
**1、方法可覆盖**
```javascript
Person.prototype.say=function(){//定义与类中相同名字的方法。成功实现了覆盖！
    return "我是来证明的，你叫" + this.name+"今年"+this.age+"岁了";
}
var obj=new Person("laotie",88);
console.log(obj.say());//我是来证明的，你叫laotie今年88岁了
```

**2、方法可添加**

```javascript
Person.prototype.addFn=function(){
    return "我是通过prototype新增加的方法,名字叫addFn";
}
var obj=new Person("laotie",88);
console.log(obj.addFn());//我是通过prototype新增加的方法,名字叫addFn
```
还可以通过Object.assign方法来为对象动态增加方法
```javascript
Object.assign(Person.prototype,{
    getName:function(){
        return this.name;
    },
    getAge:function(){
        return this.age;
    }
})
var obj=new Person("laotie",88);
console.log(obj.getName());//laotie
console.log(obj.getAge());//88
```

### constructor和class的特点

#### 1、constructor方法是类的构造函数的默认方法，通过new命令生成对象实例时，自动调用该方法。

```javascript
class Box{
    constructor(){
        console.log("啦啦啦，今天天气好晴朗");//当实例化对象时该行代码会执行。
    }
}
var obj=new Box();
```
#### 2、constructor方法如果没有显式定义，会隐式生成一个constructor方法。所以即使你没有添加构造函数，构造函数也是存在的。

constructor方法默认返回实例对象this，但是也可以指定constructor方法返回一个全新的对象，让返回的实例对象不是该类的实例。

```javascript
class Desk{
    constructor(){
        this.xixi="我是一只小小小小鸟！哦";
    }
}
class Box{
    constructor(){
       return new Desk();// 这里没有用this哦，直接返回一个全新的对象
    }
}
var obj=new Box();
console.log(obj.xixi);//我是一只小小小小鸟！哦
```

#### 3、 hasOwnProperty 和 in
constructor中定义的属性可以称为实例属性（即定义在this对象上）。

constructor外声明的属性都是定义在原型上的，可以称为原型属性（即定义在class上)。

hasOwnProperty()函数用于判断属性是否是实例属性。其结果是一个布尔值， true说明是实例属性，false说明不是实例属性。

in操作符会在通过对象能够访问给定属性时返回true,无论该属性存在于实例中还是原型中。

```javascript
class Box{
    constructor(num1,num2){
        this.num1 = num1;
        this.num2 = num2;
    }
    sum(){
        return num1+num2;
    }
}
var box=new Box(12,88);
console.log(box.hasOwnProperty("num1"));//true
console.log(box.hasOwnProperty("num2"));//true
console.log(box.hasOwnProperty("sum"));//false
console.log("num1" in box);//true
console.log("num2" in box);//true
console.log("sum" in box);//true
console.log("say" in box);//false
```
#### 4、类的所有实例共享一个原型对象，它们的原型都是Person.prototype，所以**proto属性是相等的**

```javascript
class Box{
    constructor(num1,num2){
        this.num1 = num1;
        this.num2=num2;
    }
    sum(){
        return num1+num2;
    }
}
//box1与box2都是Box的实例。它们的__proto__都指向Box的prototype
var box1=new Box(12,88);
var box2=new Box(40,60);
console.log(box1.__proto__===box2.__proto__);//true
```
#### 5、可以通过proto来为类增加方法。（不推荐）
使用实例的proto属性改写原型，会改变Class的原始定义，影响到所有实例，所以不推荐使用！

```javascript
class Box{
    constructor(num1,num2){
        this.num1 = num1;
        this.num2=num2;
    }
    sum(){
        return num1+num2;
    }
}
var box1=new Box(12,88);
var box2=new Box(40,60);
box1.__proto__.sub=function(){
    return this.num2-this.num1;
}
console.log(box1.sub());//76
console.log(box2.sub());//20
```
#### 6、class不存在变量提升
console.log(box2.sub());//20
class不存在变量提升，所以需要先定义再使用。因为ES6不会把类的声明提升到代码头部，但是ES5就不一样,ES5存在变量提升,可以先使用，然后再定义。

```javascript
//ES5可以先使用再定义,存在变量提升
new A();
function A(){

}
//ES6不能先使用再定义,不存在变量提升 会报错
new B();//B is not defined
class B{

}
```