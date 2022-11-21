- 作用：Object.create() 方法用于创建一个新对象，使用现有的对象来作为新创建对象的原型（prototype）

```js
const person = {
	isHuman: false,
	printIntroduction: function () {
		console.log(`My name is ${this.name}. Am I human? ${this.isHuman}`);
	},
};

const me = Object.create(person);

me.name = "Matthew"; // "name" is a property set on "me", but not on "person"
me.isHuman = true; // inherited properties can be overwritten

me.printIntroduction();
// expected output: "My name is Matthew. Am I human? true"
```

- 实现

```js
Object.prototype.myCreate = function (obj) {
	function Func() {}
	Func.prototype = obj;
	return new Func();
};
```
