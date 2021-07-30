一、文字描述：
1、相同点：

 三个函数都会改变this的指向（调用这三个函数的函数内部的this）

 

2、不同点：

 1)、bind会产生新的函数，（把对象和函数绑定死后，产生新的函数），如果用调用需要后面添加（）

 2)、call和apply不会产生新的函数（也就是说立即执行，且原函数不会改变），只是在调用时，绑定一下而已。

 3)、call和apply的区别，第一个参数都是要绑定的this，apply第二个参数是数组（是函数的所有参数），call把apply的第二个参数单列出来

```js
//示例代码：
var p1 = {
	name:"隔壁老王",
}
 
function eat(str,drinkstr) {
	console.log(this.name+"在吃"+str+",同时在喝"+drinkstr);
}
 
//1、bind：
let f1 = eat.bind(p1);//f1是个函数。即，用bind把eat函数和p1对象绑死，产生新的函数叫作f1
f1("油条","豆浆");//调用f1，就相当于 p1.eat();，内部的this就是p1，永远都是p1，不会是window
 
//2、call：
eat.call(p1,"油泼面","面汤");//不会产生新的函数，只是临时把eat函数和p1对象绑定一下。
 
//3、apply：(与call的意思一样，只是第二个参数是数组，是原函数eat的参数)
eat.apply(p1,["油泼面","面汤"]);//不会产生新的函数，只是临时把eat函数和p1对象绑定一下。
 
```

