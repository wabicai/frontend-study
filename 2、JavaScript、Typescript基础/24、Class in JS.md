### Constructor

### Prototype Methods/Attributes

```jsx
class Father {
		//Properties or methods decorated by public are public and can be accessed anywhere. 
		//By default, all properties and methods are public. 
		//The keyword "public" only can be used in TypeScript.
		PrototypeMethod() {  //Or just "PublicMethod() {}"
			console.log(this, "I'm PrototypeMethod")
		}
};
// translate to ES5
function Father() {};
Father.prototype.PrototypeMethod = function () {
	console.log(this, "I'm PrototypeMethod");
};

class Son extends Father {};
// How to use it 
const fatherInstance = new Father();
const sonInstance = new Son();
fatherInstance.PrototypeMethod() 
sonInstance.PrototypeMethod() 
// For example: A series of operations on an array
// push, pop, shift....

```

### Instance Methods/Attributes

```jsx
class Father {
		constructor() {
			this.InstanceMethod = function() {
					console.log(this,"I'm InstanceMethod ")
			}
		}
};
// translate to ES5
function Father() {
	this.InstanceMethod = function () {
			console.log(this, "I'm InstanceMethod ");
	}
};
class Son extends Father {};
// How to use it 
const fatherInstance = new Father();
const sonInstance = new Son();
fatherInstance.InstanceMethod () 
sonInstance.InstanceMethod () 
```

> what’s difference between instance method and prototype method?
> 
> 1. Instance method: this.func = function ( ) {…} / someObject.func = function ( ) {…} 
> 2. prototype method: Obj.prototype.func = function() {...} 
> - Same:
>     1. the function `func()` will be accessible to all the instances of your object.
> - Difference:
>     - Prototype Method can’t be accessible to Instance Method
>     - Instance Method could use Prototype Method
> - **The advantages and disadvantages of the Prototype Method**
>     - Advantages
>         1. **Modifying** the common functionality is **easy with Prototype**
>         2. ****Prototype is fast and memory efficient.****
>     - Disadvantages
>         1. **Parent and subclass instances share an attribute, but each instance should actually have its own attribute**
> - **The advantages and disadvantages of the Instance Method**
>     - Advantages
>         1. Both parent and subclass instances have their own attributes.
>     - Disadvantage
>         1. Each time a new instance is created, a completely new method is created, which leads to memory usage

### Static Methods/Attributes

```jsx
class Father {
		constructor() {}
		static StaticMethod () {
			console.log(this, "I'm StaticMethod ");
		}
};
// translate to ES5
function Father() {
};
Father.StaticMethod = function () {
		console.log(this, "I'm StaticMethod ");
}
class Son extends Father {};
// How to use it 
Father.StaticMethod () 
Son.StaticMethod () 
// For example
Array.isArray();
Array.from();
```

### Extends

### Super

```jsx
// How to use?
class Rectangle {
  constructor(height, width) {
    this.name = 'Rectangle';
    this.height = height;
    this.width = width;
		this.sayHeight = function() {
			console.log(`My height is ${this.height}`)
		}
  }
	static logNbSides() {
    return 'I have 4 sides';
  }
  sayName() {
    console.log('Hi, I am a ', this.name + '.');
  }
}

// 1. Attributes**( 'super' as a Function)**
class Square extends Rectangle {
  constructor(length) {
    this.height; // ReferenceError, super needs to be called first!
    // Here, it calls the parent class's constructor with lengths
    // provided for the Rectangle's width and height
    super(length, length);

    // Note: In derived classes, super() must be called before you
    // can use 'this'. Leaving this out will cause a reference error.
    this.name = 'Square';
  }
}

// 2. Static Methods**( 'super' as an Object)**
class Square extends Rectangle {
  static logDescription() {
    return super.logNbSides() + ' which are all equal';
  }
}
Square.logDescription(); // 'I have 4 sides which are all equal.('this' refers to subclass itself)

// 3. Prototype Methods ( **'super' is both a Function and an Object**)
// super.sayName === Rectangle.prototype.sayName();
class Square extends Rectangle {
    constructor(){
        super();
				this.name = 'Square'
        super.sayName(); 
    }
}
const squareInstance = new Square(); // Hi, I am a  Square.('this' refers to an instance of subclass)
squareInstance.sayName(); // Hi, I am a  Square.('this' refers to an instance of subclass)

// 4. Instacne Methods 
class Square extends Rectangle {
    constructor(){
        super();
				this.height = 333
				this.name = 'Square'
				// You can't use the method "sayHeight" here.
    }
}
const squareInstance = new Square();
squareInstance.sayHeight() //My height is 333 ('this' refers to an instance of subclass)
```

## Three modifier in TypeScript

### Public

The default visibility of class members is `public`.  A `public`member can be accessed anywhere:

```jsx
class Greeter {
  public greet() {
    console.log("hi!");
  }
}
const g = new Greeter();
g.greet();
```

### Protected

`protected` members are only visible to subclasses of the class they’re declared in.

```jsx
class Greeter {
  public greet() {
    console.log("Hello, " + this.getName());
  }
  protected getName() {
    return "hi";
  }
}
 
class SpecialGreeter extends Greeter {
  public howdy() {
    // OK to access protected member here
    console.log("Howdy, " + this.getName());
  }
}
const g = new SpecialGreeter();
g.greet(); // OK
g.getName();
// Property 'getName' is protected and only accessible within class 'Greeter' and its subclasses.
```

### Private

`private`is like `protected`, but doesn’t allow access to the member even from subclasses:

```jsx
class Base {
  private x = 0;
	showX() {
	    // Can't access in subclasses
	    console.log(this.x);
		 // Property 'x' is private and only accessible within class 'Base'.
	}
}
const b = new Base();
// Can't access from outside the class
console.log(b.x);
Property 'x' is private and only accessible within class 'Base'.
```