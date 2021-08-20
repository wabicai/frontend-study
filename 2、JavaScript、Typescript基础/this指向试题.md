## 构造函数

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





## 箭头函数

```js

var button = document.getElementById('myButton');  
button.addEventListener('click',function ()  {  
    // console.log(this === window); // => true
    console.log(this);
    this.innerHTML = 'Clicked button';
});
```

