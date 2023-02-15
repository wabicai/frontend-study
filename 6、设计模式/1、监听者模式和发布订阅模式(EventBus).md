# 区别：

观察者模式：

1. 耦合度高，通常用来实现一些响应式的效果；
2. 角色很明确，**没有事件调度中心作为中间者**，目标对象 Subject 和观察者 Observer 都要实现**约定的成员方法**；
3. 双方联系紧密，目标对象的主动性很强，**自己收集和维护观察者**，并在**状态变化时主动通知观察者更新**；
4. 在观察者模式中，只有两种主体：**目标对象 (Subject) 和 观察者 (Observer)**。

发布-订阅模式

1. 发布订阅模式中，对于发布者 Publisher 和订阅者 Subscriber 没有特殊的约束，他们借助事件调度中心提供的接口发布和订阅事件，互不了解对方是谁；
2. 松散耦合，灵活度高，**常用作事件总线**；
3. 易理解，可类比于 DOM 事件中的 dispatchEvent 和 addEventListener；
4. 发布订阅模式中有三个角色：**发布者 Publisher ，事件调度中心 Event Channel ，订阅者 Subscriber （listener）**。

## 监听者模式

```js
// 目标对象
class Subject {
	constructor() {
		this.observers = [];
	}

	subscribe(observer) {
		this.observers.push(observer);
	}

	notify() {
		this.observers.map((observer) => {
			if (observer && typeof observer.update === "function") {
				observer.update();
			}
		});
	}

	remove(observer) {
		const idx = this.observers.findIndex((itm) => itm === observer);
		if (idx !== -1) {
			this.observers.splice(idx, 1);
		}
	}
}

// 观察者
class Observer {
	constructor(name) {
		this.name = name;
	}

	update() {
		console.log(`${this.name} updated`);
	}
}

const subject = new Subject();
const o1 = new Observer("Nina");
const o2 = new Observer("Jack");

subject.subscribe(o1);
subject.subscribe(o2);

console.log("第一次通知：");
subject.notify();

subject.remove(o1);

console.log("删除 Nina 后，再次通知：");
subject.notify();
```

## 发布-订阅模式

```js
class EventBus {
	constructor() {
		this.events = {};
	}

	// 发送信息
	emit(name, ...args) {
		const event = this.events[name];
		if (!event) return console.error("没有这个事件");
		event.forEach((item) => item.apply(this, args));
		return this;
	}

	// 实现监听
	on(name, listener) {
		if (Array.isArray(name)) {
			for (let index = 0; index < name.length; index++) {
				this.on(name[i], listener);
			}
		} else {
			if (!this.events[name]) {
				this.events[name] = [];
			}
			this.events[name].push(listener);
		}
		return this;
	}

	// 执行一次
	once(name, listener) {
		const func = (...args) => {
			listener.apply(this, args);
			this.off(name);
			// console.log(this, 'insidethis');
		};
		// console.log(this, 'outthis');
		this.on(name, func);
		return this;
	}

	// 注销监听,这样可以实现传入一个数组。批量注销监听
	off(name) {
		if (Array.isArray(name)) {
			for (let index = 0; index < name.length; index++) {
				this.off(name);
			}
		} else {
			if (this.events[name]) {
				delete this.events[name];
			}
		}
		return this;
	}
}
const add = (a, b) => console.log(a + b);
const log = (...args) => console.log(...args);
const event = new EventBus();
// event.on('addFun', add)
// event.on('logFun', log)
// event.off('logFun')
// event.emit('addFun', 1, 2)
// event.emit('logFun', 'hi')
event.once("onceAddFun", add);
event.emit("onceAddFun", 2, 3); //5
event.emit("onceAddFun", 2, 3); // m
console.log(event);
```
