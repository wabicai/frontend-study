简书：JS 简易实现 Vue3 的 reactive、effect、computed https://www.jianshu.com/p/fa0bd04977c5
https://segmentfault.com/a/1190000040237586
## 1.预备知识
### Reflect
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect
#### Reflect 的出现是为了
1、将Object对象的一些明显属于语言内部的方法移到Reflect 上，如Object.defineProperty；  
2、修改 Object 上某些方法的返回值使其更加合理，比如 Object.setPrototypeOf(a,{})总是返回a，而明显返回是否操作成功更加合理；  
3、让Object的操作变得更加函数式，如Reflect.has(obj,a)比 a in obj 更可读；  
4、与 Proxy对象的方法一一对应，这就让Proxy对象可以方便地调用对应的Reflect方法，完成默认行为并作为修改行为的基础。也就是说，不管Proxy怎么修改默认行为，你总可以在Reflect上获取默认行为。
#### 常用静态方法
1、Reflect.get(target, name, receiver)  
查找并返回target对象的name属性，如果没有该属性，则返回undefined。如果name是一个get 属性，则get函数的this会被绑定为receiver对象  
2、Reflect.set(target, name, value, receiver)  
设置target对象的name属性等于value。如果name属性设置了赋值函数，则赋值函数的this绑定receiver。如果 Proxy对象和 Reflect对象联合使用，前者拦截赋值操作，后者完成赋值的默认行为，而且传入了receiver，那么Reflect.set会触发Proxy.defineProperty拦截。
### Proxy
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy
用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。
用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程
## 2.实现 reactive & effect & computed
原理图
![[Pasted image 20220821112110.png]]
-   工具及闭包类
```js
function isObj(obj) {
  return obj !== null && typeof obj === 'object'
}
const rawToReactive = new WeakMap()
const reactiveToRaw = new WeakMap()
const targetMap = new WeakMap()
const effectStack = []
```
-   reactive
```js
// proxy 的 handler
const handlers = {
  get(target, name, receiver) {
    const result = Reflect.get(target, name, receiver)
    track(target, name);
    return isObj(result) ? reactive(result) : result
  },
  set(target, name, value, receiver) {
    const result = Reflect.set(target, name, value, receiver)
    trigger(target, name, value);
    return result
  }
}
// 收集依赖，构造 targetMap
function track(target, name) {
  let target2 = targetMap.get(target)
  if (!target2) {
    target2 = new Map()
    targetMap.set(target, target2)
  }
  let effectSet = target2.get(name)
  if (!effectSet) {
    effectSet = new Set()
    target2.set(name, effectSet)
  }
  const fn = effectStack[effectStack.length - 1]
  fn && effectSet.add(fn)
}
// 触发 effect
function trigger(target, name, value) {
  const effectsMap = targetMap.get(target)
  const effects = effectsMap.get(name)
  effects.forEach(fn => fn(value))
}
// 响应式核心函数
function reactive(target) {
  const proxyObj = rawToReactive.get(target)
  if (proxyObj) {
    return proxyObj
  }
  if (reactiveToRaw.get(target)) {
    return target
  }
  const proxy = new Proxy(target, handlers)
  rawToReactive.set(target, proxy)
  reactiveToRaw.set(proxy, target)
  return proxy
}
```
-   effect
```js
function effect(fn) {
  effectStack.push(fn)
  const result = fn()   // 执行 fn 时会触发 get 拦截
  effectStack.pop()
  return result
}
```
-   computed
```js
function computed(fn) {
  return {
    get value() {
      return effect(fn)
    }
  }
}
```