## 1.
时间复杂度为：
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mi>O</mi><mo stretchy="false">(</mo><msup><mi>n</mi><mrow><mn>2</mn></mrow></msup><mo stretchy="false">)</mo></math>

因为：操作次数为:
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mi>n</mi><mo>+</mo><mo stretchy="false">(</mo><mi>n</mi><mo>−</mo><mn>1</mn><mo stretchy="false">)</mo><mo>+</mo><mo stretchy="false">(</mo><mi>n</mi><mo>−</mo><mn>2</mn><mo stretchy="false">)</mo><mo>+</mo><mo>.</mo><mo>.</mo><mo>.</mo><mo>+</mo><mn>1</mn><mo>=</mo><mo stretchy="false">(</mo><mi>n</mi><mo>+</mo><mn>1</mn><mo stretchy="false">)</mo><mo>∗</mo><mi>n</mi><mrow><mo>/</mo></mrow><mn>2</mn><mo>=</mo><mo stretchy="false">(</mo><mn>1</mn><mrow><mo>/</mo></mrow><mn>2</mn><mo stretchy="false">)</mo><mo>∗</mo><mo stretchy="false">(</mo><mi>n</mi><mn>2</mn><mo>+</mo><mi>n</mi><mo stretchy="false">)</mo></math>

忽略常数项与低次的n，得到时间复杂度为:
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mi>O</mi><mo stretchy="false">(</mo><msup><mi>n</mi><mrow><mn>2</mn></mrow></msup><mo stretchy="false">)</mo></math>
## 2.
1. 字节、字符和字符串的区别
	* 字节（Byte）是计算机信息技术用于计量存储容量的一种计量单位，也表示一些计算机编程语言中的数据类型和语言字符。因为1字节(Byte)=8位(bit)，最大值(11111111)2=(255)10，最小值(00000000)2=(0)10。所以Byte是从0-255范围的无符号类型，不能表示负数。
	* 字符（char）是电子计算机或无线电通信中字母、数字、符号的统称，其是数据结构中最小的数据存取单位，通常由8个二进制位(一个字节)来表示一个字符。指类字形单位或符号，包括字母、数字、运算符号、标点符号和其他符号，以及一些功能性符号。可以参见 ASCII 编码，一个英文字母字符存储需要1个字节。
	* 字符串或串(String)是由数字、字母、下划线组成的一串字符。
2. Unicode, UTF-8, UTF-16, GB2312,和GB18030的区别
	* Unicode是一个符号集，为了统一不同国家的符号集而出现。它规定了符号的二进制代码，包括了地球上所有文化、所有字母和符号的编码（没有规定这个二进制代码应该如何存储）。后来逐渐出现了 Unicode 的多种存储传输方式，即有许多种不同的二进制格式，可以用来表示 Unicode，包括UTF-8, UTF-16。
	* UTF-8:字符数量是可变的,有可能是用一个字节表示一个字符,也可能是两个,三个，最多不能超过3个字节了。是根据字符对应的数字大小来确定的。编码方法，将代码点转为二进制，依次填入，位数不够的，左边充 0。可以看出，不同段的代码点会以不同的长度存储，计算机解析时，只用读取前面若干位，就知道该字符占几个字节，位于哪一段。对于西文，该编码方式非常节约空间，因为西文的编码通常都小于 `0x0007ff`，尤其是 ASCII 字符，更是一个字符只占一个字节的程度。对于中文，常用的汉字通常位于 `0x000800` - `0x00ffff` 这一段，需要三个字节的存储，比起 UTF-16 的存储消耗要大一些。
	* UTF-16: 用二个字节来表示基本平面，用四个字节来表示扩展平面。
	* GB2312 是对 ASCII 的中文扩展，以表示6000多个常用汉字
	* GB18030 是对GBK 编码的扩充， GBK 编码它包括了 GB2312 中的编码，同时扩充了很多如繁体字和各种字符， GB18030 又对 GBK 编码扩充，扩充了各民族的语言等。
## 3.
1. What are the mobile and desktop operating systems you use everyday:
桌面操作系统：在公司使用Windows ，在家使用Mac OS
移动操作系统：iPhone OS和鸿蒙
2. What applications do you use frequently?
微信、企业微信、Chrome、Obisdian
3. Can you name a few of them and tell how they can be improved or have bugsfixed？
* 企业微信：
1. 功能：在今年上半年打通了腾讯文档、腾讯会议，深度融合腾讯文档、腾讯会议的功能，并且和企业微信本身的消息、邮件、日程相结合。提升了协作效率，使得文档更高效，约会、开会流程更顺畅。
2. 如何改进：改进手段之一--在仅限司内使用的内测版本推出后，提供了反馈文档和反馈途径，收集记录使用反馈，并逐步跟进。更多更新日志可以在官网查看：https://work.weixin.qq.com/#indexWxContacts。
## 4.
1. 工厂模式和构造器模式的区别是什么？并举几个例子。
	* 工厂模式：工厂模式创建对象（视为工厂里的产品）时无需指定创建对象的具体类。工厂模式定义一个用于创建对象的接口，这个接口由子类决定实例化哪一个类。该模式使一个类的实例化延迟到了子类。而子类可以重写接口方法以便创建的时候指定自己的对象类型。下面代码列出了一个工厂模式的接口以及使用。
	```js
	// 工厂模式
	var Animal = (function () {
	  var Animal = function (name, age) {
	    this.name = name;
	    this.age = age;
	  };
	  return function (name, age) {
	    return new Animal(name, age);
	  };
	})();
	var puppy = new Animal('puppy', 2);
	```
	* 构造器模式：可以将一个复杂对象的构建与其表示相分离，使得同样的构建过程可以创建不同的表示。也就是说如果我们用了建造者模式，那么用户只需要指定需要建造的类型就可以得到所需要的东西，而具体建造的过程和细节不需要知道。
	  如Object 构造器用于创建特定类型的对象--准备好对象以备使用，同时接收构造器可以使用的参数，以在第一次创建对象时，设置成员属性的方法的值。
	  下面列出了使用Object构造器方式创建对象和一个带原型的构造器以及使用。
	```js
	// Object构造器方式创建对象
	let newObj = new Object();
	
	// 带原型的构造器
	function Animal(name, age) {
	  this.name = name;
	  this.age = age;
	}
	
	Animal.prototype.sayHi = function () {
	  console.log(`我是${this.name}`);
	};
	
	let puppy = new Animal('puppy', 2);
	```
2. 适配器模式和装饰者模式的区别是什么？并举几个例子。
	* 适配器模式：适配器模式（Adapter）是将一个类（对象）的接口（方法或属性）转化成客户希望的另外一个接口（方法或属性），适配器模式使得原本由于接口不兼容而不能一起工作的那些类（对象）可以一些工作。
	  例子：
	```js
	class Adapter {
	  specificRequest() {
	    return '德国标准插头';
	  }
	}
	class Target {
	  constructor() {
	    this.adapter = new Adapter();
	  }
	  request() {
	    let info = `${this.adapter.specificRequest()}---转换成---中国插头`;
	    return info;
	  }
	}
	let target = new Target();
	console.info(target.request());
	```
	* 装饰者模式：装饰者提供比继承更有弹性的替代方案。 装饰者用用于包装同接口的对象，不仅允许你向方法添加行为，而且还可以将方法设置成原始对象调用（例如装饰者的构造函数）。装饰者用于通过重载方法的形式添加新功能，该模式可以在被装饰者前面或者后面加上自己的行为以达到特定的目的。
	  例子：
	```js
	//需要装饰的类（函数）
	function Macbook() {
	  this.cost = function () {
	    return 1000;
	  };
	}
	function Memory(macbook) {
	  this.cost = function () {
	    return macbook.cost() + 75;
	  };
	}
	function BlurayDrive(macbook) {
	  this.cost = function () {
	    return macbook.cost() + 300;
	  };
	}
	function Insurance(macbook) {
	  this.cost = function () {
	    return macbook.cost() + 250;
	  };
	}
	// 用法
	var myMacbook = new Insurance(new BlurayDrive(new Memory(new Macbook())));
	console.log(myMacbook.cost());
	```
## 5.
JavaScript和TypeScript
* JavaScript:
  优点：1.简单易学，不易报错 2.自由灵活
  缺点：1.开发时不易暴露问题，可能在代码执行中暴露问题 2.动态语言缺少类型约束，大型项目、多人协作开发难度大，维护成本高 3.缺少IDE提示
* TypeScript:
  优点：1.静态语言，有类型约束，可以在开发时编译暴露问题 2.类型约束起到类似文档的作用，便于大型项目、协作开发 3.IDE提示开发友好 4.可以更方便地使用ES6语法
  缺点：1.需要额外编译为JS 2.有一定学习成本 3.没有JS自由灵活
## 6.
1. 可变对象
  把对象a赋值给对象b，更改对象b的属性值，被引用的对象a也随之改变，称为可变对象。在JS中，引用类型为可变对象（这里特指没有进行不可变限制的对象），`object` 存在栈中的是地址值而不是本身的内容值，该地址值指向堆里的一块区域，该区域存的才是本身的内容值。
2. 不可变对象
  与可变对象相反，无法改变的对象称为不可变对象。
  在JS中基本类型是不可变的，包括number、string、boolean、null、undefined，和ES6中新增的symbol。基本类型将值存在栈中。
  JavaScript 确实提供了一些原生的方法来将可变对象变成不可变对象，通过控制对象属性的增删改来实现，由弱到强依次分为三种：`Object.preventExtensions`（不可扩展）、`Object.seal`（密封）、`Object.freeze`（冻结）
## 7.
```js
const toProxy = new WeakMap();
const toRaw = new WeakMap();
const targetMap = new WeakMap();
const effectStack = [];

// track方法
// 收集依赖，构造targetMap
function track(target, name) {
  let target2 = targetMap.get(target);
  if (!target2) {
    // 该target未被收集过，新建
    target2 = new Map();
    targetMap.set(target, target2);
  }
  let effectSet = target2.get(name);
  if (!effectSet) {
    // 该name未被收集过，新建
    effectSet = new Set();
    target2.set(name, effectSet);
  }
  const activeEffect = effectStack[effectStack.length - 1];
  activeEffect && effectSet.add(activeEffect);
}

// trigger方法
// 数据变化时，执行target的name属性对应的所有effect
function trigger(target, name, value) {
  const effectsMap = targetMap.get(target);
  const effects = effectsMap.get(name);
  effects.forEach((fn) => fn(value));
}

// reactive方法
function reactive(target) {
  const proxyObj = toProxy.get(target);
  // target已经存在对应代理，直接返回对应代理
  if (proxyObj) {
    return proxyObj;
  }
  // target已经存在在代理中，直接返回
  if (toRaw.get(target)) {
    return target;
  }

  const handlers = {
    get(target, name, receiver) {
      const result = Reflect.get(target, name, receiver);
      track(target, name);
      return isObj(result) ? reactive(result) : result;
    },
    set(target, name, value, receiver) {
      const result = Reflect.set(target, name, value, receiver);
      trigger(target, name, value);
      return result;
    },
  };

  // 创建proxy对象，存target、proxy入toProxy、toProxy，并返回代理对象
  const proxy = new Proxy(target, handlers);
  toProxy.set(target, proxy);
  toProxy.set(proxy, target);
  return proxy;
}

// effect方法
function effect(fn) {
  effectStack.push(fn);
  const result = fn();
  effectStack.pop();
  return result;
}

// computed方法
// 方法中创建一个effect对象，等到调用get时再执行
function computed(fn) {
  return {
    get value() {
      return effect(fn);
    },
  };
}

// isObj
// 判断obj是否为对象
function isObj(obj) {
  return obj !== null && typeof obj === 'object';
}

// 使用
const node = reactive({
  leftChildren: 1,
  // rightChildren: 0
});
console.log(node.leftChildren, node.rightChildren); // 1 undefined
const children = computed(() => node.leftChildren + (parseInt(node.rightChildren) || 0));
console.log(children.value); // 1
node.leftChildren = 10;
console.log(children.value); // 10
node.rightChildren = 2;
console.log(children.value); // 12
```

8.
```js
/**
 * 思路1：从目标点为左上角开始画矩形，判断是否与现有矩形相交，若不相交，则当前位置满足要求，否则向外扩展搜索，直到满足要求。
 * 方法1：
 * 设目标点为（x,y）,搜索点为（x1,y1）（限制x,y,x1,y1均为整数）,设diff = Math.abs(x1-x)+Math.abs(y1-y)
 * 1.diff从0开始
 * 2.遍历差值绝对值等于当前diff的点是否满足要求（与现有矩形不相交），若满足输出结果，否则进入步骤3
 * 3.否则diff++，重复2中步骤
 * 方法评价：思路简单；但是随着diff增加points数量指数增长，效率明显变低；只考虑了坐标为整数的情况；若要多次插入，每次插入需要完全重新计算
 */
class Rect {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
}
/**
 * 判断两个矩形是否相交
 * 边重合也属于相交
 * @param {Rect} r1
 * @param {Rect} r2
 * @return {Boolean} 是否相交
 */
function isInterect(r1, r2) {
  // 边重合也属于相交，若边重合不属于，下面判断条件<均改为<=
  return !(r1.x + r1.w < r2.x || r2.x + r2.w < r1.x || r1.y + r1.h < r2.y || r2.y + r2.h < r1.y);
}
/**
 * 判断矩形是否与矩形列表中的矩形相交
 * @param {Rect} rect
 * @param {Array<Rect>} rectList
 * @return {Boolean} 是否相交
 */
function isInterectWithList(rect, rectList) {
  // debugger;
  for (let i = 0; i < rectList.length; i++) {
    if (isInterect(rectList[i], rect)) {
      return true;
    }
  }
  return false;
}

/**
 * 获得与（x,y）点满足diff === Math.abs(x1-x)+Math.abs(y1-y)点的set
 */
function getPionts(x, y, diff) {
  let points = new Set();
  for (let i = 0; i <= diff; i++) {
    let j = diff - i;
    points.add(x - i + '#' + (y - j));
    points.add(x - i + '#' + (y + j));
    points.add(x + i + '#' + (y - j));
    points.add(x + i + '#' + (y + j));
    points.add(x - j + '#' + (y - i));
    points.add(x - j + '#' + (y + i));
    points.add(x + j + '#' + (y - i));
    points.add(x + j + '#' + (y + i));
  }
  return points;
}

/**
 * @param {Integer} x // 靠近点的x坐标
 * @param {Integer} y // 靠近点的y坐标
 * @param {Integer} w // 插入矩形的width
 * @param {Integer} h // 插入矩形的height
 * @param {Array<Rect>} rectList // 其它矩形
 * @return {Rect} 放置的矩形
 */
function locateRect(x, y, w, h, rectList) {
  // debugger;
  let diff = 0;
  x = Math.round(x); // 四舍五入为整数再处理
  y = Math.round(y);
  while (true) {
    let points = getPionts(x, y, diff);
    for (let piont of points) {
      // 此处以x,y为目标矩形左上角
      // 若以x,y为中心:let rect = new Rect(x-w/2, y-h/2, w, h);
      let [x, y] = piont.split('#');
      let rect = new Rect(Number(x), Number(y), w, h);
      if (!isInterectWithList(rect, rectList)) {
        rectList.push(rect);
        return rect;
      }
    }
    diff++;
  }
}

// 使用
let rectList = [new Rect(0, 1, 1, 1), new Rect(2, 1, 2, 1), new Rect(1, 2, 1, 1), new Rect(1, 0, 1, 1)];
console.log(locateRect(1, 1, 1, 1, rectList));
console.log(locateRect(1, 1, 1, 1, rectList));
console.log(locateRect(1, 1, 1, 1, rectList));

/**
 * 思路2：将列表中的每个矩形四条边向外延迟，延长线将画布分割为数个矩形，过滤掉宽或高小于目标矩形宽高的矩形后，遍历找到距离最小的区域，绘制矩形
 * 方法评价：实现复杂，但效率高，且不限制坐标为整数
 */

```