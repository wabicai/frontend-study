
1. 
```js
var a = 10
var obj = {
  a: 20,
  say: () => {
    console.log(this.a)
  }
}
obj.say() 

var anotherObj = { a: 30 } 
obj.say.apply(anotherObj) 
// 10 10
```
2. 
```js
var a = 10  
var obj = {  
  a: 20,  
  say(){
    console.log(this.a)  
  }  
}  
obj.say()   
var anotherObj={a:30}   
obj.say.apply(anotherObj)
// 20 30
```
3. 
```js
var obj = { 
  name : 'cuggz', 
  fun : function(){ 
    console.log(this.name); 
  } 
} 
obj.fun()     // cuggz
new obj.fun() // undefined
```
4. 
```js
var obj = {
   say: function() {
     var f1 = () =>  {
       console.log("1111", this);
     }
     f1();
   },
   pro: {
     getPro:() =>  {
        console.log(this);
     }
   }
}
var o = obj.say;
o();
obj.say();
obj.pro.getPro();
// 1111 window对象
// 1111 obj对象
// window对象
```

5. 
```js
var myObject = {
    foo: "bar",
    func: function() {
        var self = this;
        console.log(this.foo);  
        console.log(self.foo);  
        (function() {
            console.log(this.foo);  
            console.log(self.foo);  
        }());
    }
};
myObject.func();
// 首先func是由myObject调用的，this指向myObject。又因为var self = this;所以self指向myObject。
// 这个立即执行匿名函数表达式是由window调用的，this指向window 。立即执行匿名函数的作用域处于myObject.func的作用域中，在这个作用域找不到self变量，沿着作用域链向上查找self变量，找到了指向 myObject对象的self。
```
6. 
```js
window.number = 2;
var obj = {
 number: 3,
 db1: (function(){
   console.log(this);
   this.number *= 4;
   return function(){
     console.log(this);
     this.number *= 5;
   }
 })()
}
var db1 = obj.db1;
db1();
obj.db1();
console.log(obj.number);     // 15
console.log(window.number);  // 40
// 执行db1()时，this指向全局作用域，所以window.number * 4 = 8，然后执行匿名函数， 所以window.number * 5 = 40；
// 执行obj.db1();时，this指向obj对象，执行匿名函数，所以obj.numer * 5 = 15。
```

7. 
```js
var length = 10;
function fn() {
    console.log(this.length);
}
 
var obj = {
  length: 5,
  method: function(fn) {
    fn();
    arguments[0]();
  }
};
 
obj.method(fn, 1);
// 第一次执行fn()，this指向window对象，输出10。
// 第二次执行arguments0，相当于arguments调用方法，this指向arguments，而这里传了两个参数，故输出arguments长度为2。 如果是其他的参数，如test，那么arguments[0]() 得到 undefined
```

8. 
```js
var a = 1;
function printA(){
  console.log(this.a);
}
var obj={
  a:2,
  foo:printA,
  bar:function(){
    printA();
  }
}

obj.foo(); // 2
obj.bar(); // 1
var foo = obj.foo;
foo(); // 1
```


9. 
```js
function a(xx){
  this.x = xx;
  return this
};
var x = a(5);
var y = a(6);

console.log(x.x)  // undefined
console.log(y.x)  // 6
```
10. 
```js
function foo(something){
    this.a = something
}

var obj1 = {
    foo: foo
}

var obj2 = {}

obj1.foo(2); 
console.log(obj1.a); // 2

obj1.foo.call(obj2, 3);
console.log(obj2.a); // 3

var bar = new obj1.foo(4)
console.log(obj1.a); // 2
console.log(bar.a); // 4
// 首先执行obj1.foo(2); 会在obj中添加a属性，其值为2。之后执行obj1.a，a是右obj1调用的，所以this指向obj，打印出2；
// 执行 obj1.foo.call(obj2, 3) 时，会将foo的this指向obj2，后面就和上面一样了，所以会打印出3；
// obj1.a会打印出2；
// 最后就是考察this绑定的优先级了，new 绑定是比隐式绑定优先级高，所以会输出4。
```


```js
var name = 'Nicolas';
function Person(){
    this.name = 'Smiley';
    this.sayName=function(){
        console.log(this); 
        console.log(this.name); 
    };
    setTimeout(this.sayName, 0);     // 第二次输出
}

var person = new Person();
person.sayName();		// 第一次输出
```


```js

var button = document.getElementById('myButton');  
button.addEventListener('click',function ()  {  
    // console.log(this === window); // => true
    console.log(this);
    this.innerHTML = 'Clicked button';
});
```