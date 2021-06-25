首先，定义父类：Animal，子类为：Dog

```js
//构造函数
function Animal(name) {
	this.name = name || 'Animal';
	this.sleep = function() {
		console.log(this.name + '正在睡觉！');
	};
}
//原型上面的方法：
Animal.prototype.eat = function(food) {
	console.log(this.name + '正在吃:' + food);
}

```

# 一：原型链继承

1. Son.prototype == new Father( );  （这样在创建之后，父类添加新的属性和方法，子类也可以访问到）

```js
//核心：将父类的实例作为子类的原型
function Dog() {

}
Dog.prototype = new Animal();  //将Animal的实例挂载到了Dog的原型链上
//或：
//Dog.prototype = Object.create(Animal.prototype)
Dog.prototype.name = 'dog';

var dog = new Dog();
console.log(dog.name);		//dog
dog.eat('bone');		//dog正在吃:bone
dog.sleep();		//dog正在睡觉！
console.log(dog instanceof Animal);		//true
console.log(dog instanceof Dog);		//true
```

**特点：**

- 非常纯粹的继承关系，**实例是子类的实例，也是父类的实例**
- **父类新增原型方法/原型属性，子类都能访问的到**
- 简单

**缺点**

- 要想为子类新增属性和方法，必须要在new Animal()这样的语句之后执行，不能放到构造器中
- 无法实现继承多个
- 来自原型对象的所有属性被所有实例共享
- 创建子类实例时，无法向父类构造函数传参

# 二：构造继承

1. 父类：this.prop = ……  （父类定义属性和方法）
2. 子类：Father.call( this )   （将父类的属性和方法赋值到子类上，不然父类新增的属性和方法子类访问不到）

3. 子类：var son = new Son( )   （复制子类实例给子类）



```js
//核心：使用父类的构造函数增强子类实例，等于是复制父类的实例属性给子类（没用到原型）
function Cat(name) {
	Animal.call(this);
    //只有通过call,父类上的sleep函数才能传递过来。
	this.name = name || 'Tom';
}

var cat = new Cat();
console.log(cat.name);		//Tom
cat.sleep();		//Tom正在睡觉！
console.log(cat instanceof Animal);		//false
console.log(cat instanceof Cat);		//true
```

**特点：**

- 创建子类实例时，可以向父类传递参数
- 可以实现多继承（call多个父类对象）

**缺点：**

- 实例并不是父类的实例，只是子类的实例
- **只能继承父类的实例属性和方法，不能继承原型属性/方法**
- 无法实现函数复用，每个子类都有父类实例函数的副本，影响性能（**即每个子类的属性和方法都单独占有一个空间，对方法和属性的改写不会影响其他实例和父类**）

# 三：组合继承

1. 父类：this.prop =…… （父类定义属性和方法）
2. 子类：Father.call( this )   （将父类的属性和方法赋值到子类上）
3. 子类：Son.prototype == new Father( );（这样在创建之后，父类添加新的属性和方法，子类也可以访问到）
4. 子类：var son = new Son( )
5. 其实就是原型链+构造函数继承。

```js
//核心：通过调用父类构造，继承父类的属性并保留传参的优点，然后通过将父类实例作为子类原型，实现函数复用
function Cat(name) {
	Animal.call(this);//这里是构造函数继承
	this.name = name || 'Tom';//这里是构造函数继承
}
Cat.prototype = new Animal();//这里是原型链继承
Cat.prototype.constructor = Cat;
//这里要修正constructor 不然他的constructor指向Animal。

var cat = new Cat();
console.log(cat.name);	//Tom
cat.sleep();		//Tom正在睡觉
console.log(cat instanceof Animal); // true
console.log(cat instanceof Cat); // true
```

**特点：**

- 弥补了方式2的缺陷，可以继承实例属性/方法，也可以继承原型属性/方法
- 既是子类的实例，也是父类的实例
- 不存在引用属性共享问题
- 函数可复用
- 可传参

**缺点：**

- 调用了俩次构造函数，生成了俩份实例（子类实例将子类原型上的那份屏蔽了）

# 四：寄生组合继承：

```js
//核心：通过寄生方式，砍掉父类的实例属性，这样，在调用俩次父类的构造的时候，就不会初始化俩次实例方法/属性，避免了组合继承的缺点。
function Cat(name) {
	Animal.call(this);
	this.name = name || 'Tom';
}
(function() {
	var Super = function() {};  //创建一个没有实例的方法类。
	Super.prototype = Animal.prototype;
	Cat.prototype = new Super();  //将实例作为子类的原型。
})();

let cat = new Cat();
console.log(cat.name);		//Tom
cat.sleep();		//Tom正在睡觉
console.log(cat instanceof Animal); // true
console.log(cat instanceof Cat); //true

Cat.prototype.constructor = Cat;	//修复构造函数

```

**特点：**

- 基本上是完美的

**缺点：**

- 实现起来较为复杂