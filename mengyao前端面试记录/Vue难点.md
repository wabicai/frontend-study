# nexttick&异步更新策略
## 异步更新：
当我们使用 Vue 或 React 提供的接口去**更新数据**时，这个更新并不会立即生效，而是会被**推入到一个队列**里。
待到**适当的时机，队列中的更新任务会被批量触发**。这就是异步更新。
异步更新可以帮助我们**避免过度渲染**，是我们上节提到的“**让 JS 为 DOM 分压**”的典范之一。
## 异步更新的优越性
异步更新的特性在于它只看结果，因此渲染引擎不需要为过程买单。

我们在三个更新任务中对同一个状态修改了三次，如果我们采取传统的同步更新策略，那么就要操作三次 DOM。
但本质上需要呈现给用户的目标内容其实只是第三次的结果，也就是说只有第三次的操作是有意义的——我们白白浪费了两次计算。
但如果我们把这三个任务塞进异步更新队列里，它们会先在 JS 的层面上被批量执行完毕。
当流程走到渲染这一步时，它仅仅需要针对有意义的计算结果操作一次 DOM——这就是异步更新的妙处。
## Vue状态更新手法：nextTick
Vue 每次想要更新一个状态的时候，会先把它这个更新操作给包装成一个异步操作派发出去。在vue中这个函数是nextTick

## nextTick
⭐️Vue源码系列--中文社区 https://vue-js.com/learn-vue/instanceMethods/lifecycle.html#_3-vm-nexttick
⭐️[Vue源码详解之nextTick：MutationObserver只是浮云，microtask才是核心！](https://segmentfault.com/a/1190000008589736) 代码比较旧了
⭐️ 温故而知新，浅入 Vue nextTick 底层原理https://www.mdnice.com/writing/440b1ac98b4d44589326e9a9e427187c

是什么：
nextTick 本质就是执行延迟回调的钩子，接受一个回调函数作为参数，在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。

nextTick 的作用：
#### Vue对DOM的异步更新策略 
Vue 的异步更新，Vue 在更新 DOM 时是**异步**执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。Vue（2.6.x） 在内部对异步队列尝试使用原生的 `Promise.then`、`MutationObserver` 和 `setImmediate`，如果执行环境不支持，则会采用 `setTimeout(fn, 0)` 代替。

例如，当你设置 `vm.someData = 'new value'`，该组件不会立即重新渲染。当刷新队列时，组件会在下一个事件循环“tick”中更新。多数情况我们不需要关心这个过程，**但是如果你想基于更新后的 DOM 状态来做点什么，这就可能会有些棘手**。虽然 Vue.js 通常鼓励开发人员使用“数据驱动”的方式思考，避免直接接触 DOM，但是有时我们必须要这么做。**为了在数据变化之后等待 Vue 完成更新 DOM，可以在数据变化之后立即使用** `Vue.nextTick(callback)`**。这样回调函数将在 DOM 更新完成后被调用**。

Vue在两个地方用到了上述nextTick：
-   Vue.nextTick和Vue.prototype.$nextTick都是直接使用了这个nextTick
-   在batcher中，也就是watcher观测到数据变化后执行的是`nextTick(flushBatcherQueue)`，`flushBatcherQueue`则负责执行完成所有的dom更新操作
即nextTick 除了让我们可以在 DOM 更新之后执行延迟回调，还有一个作用就是 Vue 内部 使用 nextTick，把渲染 Dom 操作这个操作 放入到 callbacks 中。

![[Pasted image 20220802153532.png]]

![[Pasted image 20220802161548.png]]

但是这样的方案（由微任务实现nexttick），在后续的版本中已经表明是有一定的问题，问题在于由于 **microTask 的执行优先级非常高，在某些场景之下它甚至要比事件冒泡还要快，就会导致一些诡异的问题**。后来改为宏任务实现，但是宏任务晚于当次渲染，有时候会被阻塞，会造成闪烁等问题。最终 nextTick 采取的策略是默认走 microTask ，对于一些 DOM 的交互事件，如 v-on 绑定的事件回调处理函数的处理，会强制走 macroTask。在源码层面上也存在一个优雅的降级。

## 源码分析
`nextTick` 的定义位于源码的`src/core/util/next-tick.js`中，其大概可分为两大部分：
1.  能力检测
2.  根据能力检测以不同方式执行回调队列

### 能力检测
`Vue` 在内部对异步队列尝试使用原生的 `Promise.then`、`MutationObserver` 和 `setImmediate`，如果执行环境不支持，则会采用 `setTimeout(fn, 0)` 代替。timerFunc
```JS
let microTimerFunc
let macroTimerFunc
let useMacroTask = false

/* 对于宏任务(macro task) */
// 检测是否支持原生 setImmediate(高版本 IE 和 Edge 支持)
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    macroTimerFunc = () => {
        setImmediate(flushCallbacks)
    }
}
// 检测是否支持原生的 MessageChannel
else if (typeof MessageChannel !== 'undefined' && (
    isNative(MessageChannel) ||
    // PhantomJS
    MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
    const channel = new MessageChannel()
    const port = channel.port2
    channel.port1.onmessage = flushCallbacks
    macroTimerFunc = () => {
        port.postMessage(1)
    }
}
// 都不支持的情况下，使用setTimeout
else {
    macroTimerFunc = () => {
        setTimeout(flushCallbacks, 0)
    }
}

/* 对于微任务(micro task) */
// 检测浏览器是否原生支持 Promise
if (typeof Promise !== 'undefined' && isNative(Promise)) {
    const p = Promise.resolve()
    microTimerFunc = () => {
        p.then(flushCallbacks)
    }
}
// 不支持的话直接指向 macro task 的实现。
else {
    // fallback to macro
    microTimerFunc = macroTimerFunc
}
```
### 执行回调
```js
const callbacks = []   // 回调队列
let pending = false    // 异步锁

// 执行队列中的每一个回调
function flushCallbacks () {
    pending = false     // 重置异步锁
    // 防止出现nextTick中包含nextTick时出现问题，在执行回调函数队列前，提前复制备份并清空回调函数队列
    const copies = callbacks.slice(0)
    callbacks.length = 0
    // 执行回调函数队列
    for (let i = 0; i < copies.length; i++) {
        copies[i]()
    }
}

export function nextTick (cb?: Function, ctx?: Object) {
    let _resolve
    // 将回调函数推入回调队列
    callbacks.push(() => {
        if (cb) {
            try {
                cb.call(ctx)
            } catch (e) {
                handleError(e, ctx, 'nextTick')
            }
        } else if (_resolve) {
            _resolve(ctx)
        }
    })
    // 如果异步锁未锁上，锁上异步锁，调用异步函数，准备等同步函数执行完后，就开始执行回调函数队列
    if (!pending) {
        pending = true
        if (useMacroTask) {
            macroTimerFunc()
        } else {
            microTimerFunc()
        }
    }
    // 如果没有提供回调，并且支持Promise，返回一个Promise
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(resolve => {
            _resolve = resolve
        })
    }
}
```
首先，先来看 `nextTick`函数，该函数的主要逻辑是：先把传入的回调函数 `cb` 推入 回调队列`callbacks` 数组，同时在接收第一个回调函数时，执行能力检测中对应的异步方法（异步方法中调用了回调函数队列）。最后一次性地根据 `useMacroTask` 条件执行 `macroTimerFunc` 或者是 `microTimerFunc`，而它们都会在下一个 tick 执行 `flushCallbacks`，`flushCallbacks` 的逻辑非常简单，对 `callbacks` 遍历，然后执行相应的回调函数。
`nextTick` 函数最后还有一段逻辑：

```
if (!cb && typeof Promise !== 'undefined') {
  return new Promise(resolve => {
    _resolve = resolve
  })
}
```

这是当 `nextTick` 不传 `cb` 参数的时候，提供一个 Promise 化的调用，比如：

```
nextTick().then(() => {})
```

当 `_resolve` 函数执行，就会跳到 `then` 的逻辑中。

这里有两个问题需要注意：

1.  如何保证只在接收第一个回调函数时执行异步方法？
    `nextTick`源码中使用了一个异步锁的概念，即接收第一个回调函数时，先关上锁，执行异步方法。此时，浏览器处于等待执行完同步代码就执行异步代码的情况。
2.  执行 `flushCallbacks` 函数时为什么需要备份回调函数队列？执行的也是备份的回调函数队列？
    因为，会出现这么一种情况：`nextTick` 的回调函数中还使用 `nextTick`。如果 `flushCallbacks` 不做特殊处理，直接循环执行回调函数，会导致里面`nextTick` 中的回调函数会进入回调队列。
3. 
以上就是对 `nextTick` 的源码分析，我们了解到数据的变化到 `DOM` 的重新渲染是一个异步过程，发生在下一个 tick。当我们在实际开发中，比如从服务端接口去获取数据的时候，数据做了修改，如果我们的某些方法去依赖了数据修改后的 DOM 变化，我们就必须在 `nextTick` 后执行

# 渲染机制
https://ustbhuangyi.github.io/vue-analysis/v2/data-driven/mounted.html
在编译环境中，模版 HTML 字符串被编译成 `render()` 函数，然后在运行时环境中，调用 `render()` 函数得到 VNode，最后应用到真实 DOM 中。
## 虚拟 DOM
虚拟 DOM (Virtual DOM，简称 VDOM) 是一种编程概念，意为将目标所需的 UI 通过数据结构“虚拟”地表示出来，保存在内存中，然后将真实的 DOM 与之保持同步。
Virtual DOM 除了它的数据结构（VNode）的定义，映射到真实的 DOM 实际上要经历 VNode 的 create、diff、patch 等过程。那么在 Vue.js 中，VNode 的 create 是通过之前提到的 `createElement` 方法创建的，我们接下来分析这部分的实现。

**vnode**： `vnode` 即一个纯 JavaScript 的对象 (一个“虚拟节点”)，它代表着一个HTML 元素。包含创建实际元素所需的所有信息。包含子节点。
VNode 是对真实 DOM 的一种抽象描述，核心定义无非就几个关键属性，标签名、数据、子节点、键值等，其它属性都是用来扩展 VNode 的灵活性以及实现一些特殊 feature 的。由于 VNode 只是用来映射到真实 DOM 的渲染，不需要包含操作 DOM 的方法，因此它是非常轻量和简单的。
**挂载mount**：一个运行时渲染器将会遍历整个虚拟 DOM 树，并据此构建真实的 DOM 树。这个过程被称为**挂载** (mount)。
**更新patch**：如果我们有两份虚拟 DOM 树，渲染器将会有比较地遍历它们，找出它们之间的区别，并应用这其中的变化到真实的 DOM 上。这个过程被称为**更新** (patch)，又被称为“比对”(diffing) 或“协调”(reconciliation)。
## 流程
Vue 组件挂载后发生了如下这几件事：
`vm._render` 创建了一个 VNode：使用createElement方法
 `vm._update`：把 VNode 渲染成真实 DOM 并渲染，被调用时机 2 个，一是首次渲染，一是数据更新。patch方法
1.**编译**：Vue 模板被编译为了**渲染函数**：即用来返回虚拟 DOM 树的函数。这一步骤可以通过构建步骤提前完成，也可以通过使用运行时编译器即时完成。
2.**挂载**：运行时渲染器调用渲染函数，遍历返回的虚拟 DOM 树，并基于它创建实际的 DOM 节点。这一步会作为[响应式副作用](https://cn.vuejs.org/guide/extras/reactivity-in-depth.html)执行，因此它会追踪其中所用到的所有响应式依赖。
3.**更新**：当一个依赖发生变化后，副作用会重新运行，这时候会创建一个更新后的虚拟 DOM 树。运行时渲染器遍历这棵新树，将它与旧树进行比较，然后将必要的更新应用到真实 DOM 上去。
    

![](https://cn.vuejs.org/assets/render-pipeline.03805016.png)
![[Pasted image 20220824150448.png]]
![[Pasted image 20220824150540.png]]
1.Vue在渲染的时候先调用原型上的`_render`函数将组件对象转化为一个VNode实例；而`_render`是通过调用`createElement`和`createEmptyVNode`两个函数进行转化；
2.`createElement`的转化过程会根据不同的情形选择`new VNode`或者调用`createComponent`函数做VNode实例化；
3.完成VNode实例化后，这时候Vue调用原型上的`_update`函数把VNode渲染为真实DOM，这个过程又是通过调用`__patch__`函数完成的（这就是pacth阶段了）



# keep-alive
https://juejin.cn/post/6844903837770203144
### **是什么**：
是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在父组件链中；使用keep-alive包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。
### **作用**：
能够保存页面/组件的状态，可以避免组件反复创建和渲染，有效提升性能
### **用法**：
1.在动态组件中的应用
```html
<keep-alive :include="whiteList" :exclude="blackList" :max="amount">
  <component :is="currentComponent"></component>
</keep-alive>
```
2在vue-router中的应用
```html
<keep-alive :include="whiteList" :exclude="blackList" :max="amount">
  <router-view></router-view>
</keep-alive>
```
3.属性：
`include`定义缓存白名单，keep-alive会缓存命中的组件；
`exclude`定义缓存黑名单，被命中的组件将不会被缓存；
`max`定义缓存组件上限，超出上限使用LRU策略置换缓存数据。
### **源码**：
1.keep-alive.js 定义keep-alive组件对象，定义了一些工具函数
```kotlin
// src/core/components/keep-alive.js
export default {
  name: 'keep-alive',
  abstract: true, // 判断当前组件虚拟dom是否渲染成真是dom的关键

  props: {
    include: patternTypes, // 缓存白名单
    exclude: patternTypes, // 缓存黑名单
    max: [String, Number] // 缓存的组件实例数量上限
  },

  created () {
    this.cache = Object.create(null) // 缓存虚拟dom
    this.keys = [] // 缓存的虚拟dom的健集合
  },

  destroyed () {
    for (const key in this.cache) { // 删除所有的缓存
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted () {
    // 实时监听黑白名单的变动
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },

  render () {
    // 先省略...
  }
}
```

可以看出，与我们定义组件的过程一样，先是设置组件名为`keep-alive`，其次定义了一个`abstract`属性，值为`true`。这个属性在vue的官方教程并未提及，却至关重要，后面的渲染过程会用到。`props`属性定义了keep-alive组件支持的全部参数。

keep-alive在它生命周期内定义了三个钩子函数：
1.**created**
    初始化两个对象分别缓存VNode（虚拟DOM）和VNode对应的键集合
2.**destroyed**
    删除`this.cache`中缓存的VNode实例。我们留意到，这里不是简单地将`this.cache`置为`null`，而是遍历调用`pruneCacheEntry`函数删除。删除缓存对应执行组件实例`destory`钩子函数。
3.**mounted**
    在`mounted`这个钩子中对`include`和`exclude`参数进行监听，然后实时地更新（删除）`this.cache`对象数据。`pruneCache`函数的核心也是去调用`pruneCacheEntry`。
4.**render**
第一步：获取keep-alive包裹着的第一个子组件对象及其组件名；
第二步：根据设定的黑白名单（如果有）进行条件匹配，决定是否缓存。不匹配，直接返回组件实例（VNode），否则执行第三步；
第三步：根据组件ID和tag生成缓存Key，并在缓存对象中查找是否已缓存过该组件实例。如果存在，直接取出缓存值并更新该`key`在`this.keys`中的位置（更新key的位置是实现LRU置换策略的关键），否则执行第四步；
第四步：在`this.cache`对象中存储该组件实例并保存`key`值，之后检查缓存的实例数量是否超过`max`的设置值，超过则根据LRU置换策略删除最近最久未使用的实例（即是下标为0的那个key）。
第五步：最后并且很重要，将该组件实例的`keepAlive`属性值设置为`true`。这个在@_不可忽视：钩子函数_ 章节会再次出场。

### 渲染
vue的渲染过程
![[Pasted image 20220824150720.png]]
Vue的渲染是从图中的`render`阶段开始的，但keep-alive的渲染是在patch阶段，这是构建组件树（虚拟DOM树），并将VNode转换成真正DOM节点的过程
**不会生成真正的DOM节点**
Vue在初始化生命周期的时候，为组件实例建立父子关系会根据`abstract`属性决定是否忽略某个组件。在keep-alive中，设置了`abstract: true`，那Vue就会跳过该组件实例。

最后构建的组件树中就不会包含keep-alive组件，那么由组件树渲染成的DOM树自然也不会有keep-alive相关的节点了。

**keep-alive包裹的组件是如何使用缓存的？**
在`patch`阶段，会执行`createComponent`函数：
1.首次加载被包裹组件时，由`keep-alive.js`中的`render`函数可知，`vnode.componentInstance`的值是`undefined`，`keepAlive`的值是`true`，因为keep-alive组件作为父组件，它的`render`函数会先于被包裹组件执行；那么就只执行到`i(vnode, false /* hydrating */)`，后面的逻辑不再执行；
2.再次访问被包裹组件时，`vnode.componentInstance`的值就是已经缓存的组件实例，那么会执行`insert(parentElm, vnode.elm, refElm)`逻辑，这样就直接把上一次的DOM插入到了父元素中。

### 钩子函数
1.**（`beforeCreate`、`created`、`mounted`）都不再执行**： 在初始化组件钩子函数中可以看出，当`vnode.componentInstance`和`keepAlive`同时为truly值时，不再进入`$mount`过程，那`mounted`之前的所有钩子函数（`beforeCreate`、`created`、`mounted`）都不再执行。
2.**（`activated` ，`destroy`）执行**：在`patch`的阶段，最后会执行`invokeInsertHook`函数，而这个函数就是去调用组件实例（VNode）自身的`insert`钩子：执行所有子组件的`activated`钩子函数；`deactivated`钩子函数也是一样的原理，在组件实例（VNode）的`destroy`钩子函数中调用`deactivateChildComponent`函数。
# Vue3
### 改变
1.响应式原理：
![[1655377068919.png]]
![[Pasted image 20220618002349.png]]
2.composition api+setup
优势：更优雅地组织代码，传统options api中，增或者改一个需求，需要分别在data methods computed中修改;compostion api可以放在一起，同一块功能写在同一个hooks中,方便功能复用，解耦合
3.生命周期
（1）沿用Vue2钩子名称改变
![[Pasted image 20220618161124.png]]
(2)compostion api
![[Pasted image 20220618161142.png]]
4.性能提升
打包体积减少，内存减少，更新渲染速度快
5.更好地支持TS
### 缺点：
1.不兼容：Events API弃用Vue实例不能作为**事件总线**做事件通信，`$`on，`$`off，`$`once彻底移除；第三方库不支持Vue3
2.颠覆式的设计模式（composition-api）
颠覆式的**composition-api**慢慢向**面向函数**思想转变，导致很多原有习惯于**options-api**的开发者反感Vue正在像react靠拢，没有坚持住Vue特色
3.生态系统、社区文档
4.成本，风险
# 懒加载
https://juejin.cn/post/6985725946598785055
当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就会更加高效。
### 方法1：ESM+路由懒加载
Vue Router 支持开箱即用的[动态导入](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Dynamic_Imports)，这意味着你可以用动态导入代替静态导入：
```js
// 将
// import UserDetails from './views/UserDetails'
// 替换成
const UserDetails = () => import('./views/UserDetails')

const router = createRouter({
  // ...
  routes: [{ path: '/users/:id', component: UserDetails }],
})
```
`component` (和 `components`) 配置接收一个返回 Promise 组件的函数，Vue Router **只会在第一次进入页面时才会获取这个函数**，然后使用缓存数据。这意味着你也可以使用更复杂的函数，只要它们返回一个 Promise 
**不要**在路由中使用[异步组件](https://v3.vuejs.org/guide/component-dynamic-async.html#async-components)。异步组件仍然可以在路由组件中使用，但路由组件本身就是动态导入的。
如果你使用的是 webpack 之类的打包器，它将自动从[代码分割](https://webpack.js.org/guides/code-splitting/)中受益。
如果你使用的是 Babel，你将需要添加 [syntax-dynamic-import](https://babeljs.io/docs/plugins/syntax-dynamic-import/) 插件，才能使 Babel 正确地解析语法。
#### 把组件按组分块
### webpack中
有时候我们想把某个路由下的所有组件都打包在同个异步块 (chunk) 中。只需要使用[命名 chunk](https://webpack.js.org/guides/code-splitting/#dynamic-imports)，一个特殊的注释语法来提供 chunk name (需要 Webpack > 2.4)：

```
const UserDetails = () =>
  import(/* webpackChunkName: "group-user" */ './UserDetails.vue')
const UserDashboard = () =>
  import(/* webpackChunkName: "group-user" */ './UserDashboard.vue')
const UserProfileEdit = () =>
  import(/* webpackChunkName: "group-user" */ './UserProfileEdit.vue')
```

webpack 会将任何一个异步模块与相同的块名称组合到相同的异步块中。

### 使用 Vite
在Vite中，你可以在[`rollupOptions`](https://vitejs.dev/config/#build-rollupoptions)下定义分块：

```
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      // https://rollupjs.org/guide/en/#outputmanualchunks
      output: {
        manualChunks: {
          'group-user': [
            './src/UserDetails',
            './src/UserDashboard',
            './src/UserProfileEdit',
          ],
        },
    },
  },
})
```

### 方法2： 异步组件
https://cn.vuejs.org/guide/components/async.html#basic-usage
在大型项目中，我们可能需要拆分应用为更小的块，并仅在需要时再从服务器加载相关组件。Vue 提供了 [`defineAsyncComponent`](https://cn.vuejs.org/api/general.html#defineasynccomponent) 方法来实现此功能：
```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...从服务器获取组件
    resolve(/* 获取到的组件 */)
  })
})
// ... 像使用其他一般组件一样使用 `AsyncComp`

```
`defineAsyncComponent` 方法接收一个返回 Promise 的加载函数。这个 Promise 的 `resolve` 回调方法应该在从服务器获得组件定义时调用。你也可以调用 `reject(reason)` 表明加载失败。

[ES 模块动态导入](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports)也会返回一个 Promise，所以多数情况下我们会将它和 `defineAsyncComponent` 搭配使用。类似 Vite 和 Webpack 这样的构建工具也支持此语法 (并且会将它们作为打包时的代码分割点)，因此我们也可以用它来导入 Vue 单文件组件：

```
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

最后得到的 `AsyncComp` 是一个外层包装过的组件，仅在页面需要它渲染时才会调用加载内部实际组件的函数。它会将接收到的 props 和插槽传给内部组件，所以你可以使用这个异步的包装组件无缝地替换原始组件，同时实现延迟加载。

与普通组件一样，异步组件可以使用 `app.component()` [全局注册](https://cn.vuejs.org/guide/components/registration.html#global-registration)：

```
app.component('MyComponent', defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
))
```

你也可以在[局部注册组件](https://cn.vuejs.org/guide/components/registration.html#local-registration)时使用 `defineAsyncComponent`：

```
<script>
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    AdminPage: defineAsyncComponent(() =>
      import('./components/AdminPageComponent.vue')
    )
  }
}
</script>

<template>
  <AdminPage />
</template>
```
#### 加载与错误状态[#](https://cn.vuejs.org/guide/components/async.html#loading-and-error-states)

异步操作不可避免地会涉及到加载和错误状态，因此 `defineAsyncComponent()` 也支持在高级选项中处理这些状态：

```
const AsyncComp = defineAsyncComponent({
  // 加载函数
  loader: () => import('./Foo.vue'),

  // 加载异步组件时使用的组件
  loadingComponent: LoadingComponent,
  // 展示加载组件前的延迟时间，默认为 200ms
  delay: 200,

  // 加载失败后展示的组件
  errorComponent: ErrorComponent,
  // 如果提供了一个 timeout 时间限制，并超时了
  // 也会显示这里配置的报错组件，默认值是：Infinity
  timeout: 3000
})
```

如果提供了一个加载组件，它将在内部组件加载时先行显示。在加载组件显示之前有一个默认的 200ms 延迟——这是因为在网络状况较好时，加载完成得很快，加载组件和最终组件之间的替换太快可能产生闪烁，反而影响用户感受。

如果提供了一个报错组件，则它会在加载器函数返回的 Promise 抛错时被渲染。你还可以指定一个超时时间，在请求耗时超过指定时间时也会渲染报错组件。
### 方法3：webpack提供的require.ensure()

```css
{
  path: '/home',
  name: 'Home',
  component: r => require.ensure([],() =>  r(require('@/components/HelloWorld')), 'home')
}
```

# Vue.use
https://juejin.cn/post/6859944479223185416
https://juejin.cn/post/7023712777457893389
## 说明：
Vue.use安装 Vue.js 插件。如果插件是一个对象，必须提供 install 方法。如果插件是一个函数，它会被作为 install 方法，install 方法调用时，会将 Vue 作为参数传入。
插件的功能没有严格的限制，一般有以下几种
-添加`全局方法`或`property`,如：[vue-custom-element](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fkarol-f%2Fvue-custom-element)
-添加全局资源：`指令、过滤器、过度等`，如：[vue-touch](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fvuejs%2Fvue-touch)
-通过全局混入来添加一些组件选项，如： [vue-router](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fvuejs%2Fvue-router)
-添加Vue实例方法，通过把它们添加到`Vue.prototype`上实现
-一个库，提供自己的API,同时提供上边的一种或几种功能，如： [vue-router]
## 前言
四种为Vue添加全局功能的方法
**1.添加全局方法或 property**
```javascript
Vue.myGlobalMethod = function () {
    // 逻辑...
  }
```
**2. 添加全局资源**
```less
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })
```
**3. 注入组件选项**
```javascript
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })
```
**4. 添加实例方法**
```javascript
 Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
```
注意事项
1.通过全局方法 `Vue.use()` 使用插件。它需要在你调用 `new Vue()` 启动应用之前完成
2.`Vue.use` 会自动阻止多次注册相同插件，届时即使多次调用也只会注册一次该插件。
## 使用
-   vue2.x使用Vue.use()
    ```javascript
    import Vue from 'vue';
    import App from './App';
    import router from './router';
    import store from './store';
    // 引入国际化插件
    import VueI18n from 'vue-i18n';
    // 引入统一配置
    import common from './lib/common';
    // 引入animate.css
    import animated from 'animate.css';
    
    Vue.use(animated);
    Vue.use(VueI18n); // 通过插件的形式挂载
    Vue.use(common); // 全局配置项
    
    /* eslint-disable no-new */
    // 把vue实例挂载在window.vm,方便使用vue的实例
    window.vm = new Vue({
      el: '#app',
      router,
      store,
      components: {
        App,
      },
      template: '<App/>',
    });
    ```
-   vue3.x使用app.use()
    ```javascript
    import { createApp } from 'vue';
    import App from './App.vue';
    import router from './router';
    import store from './store';
    import vant from 'vant';
    import 'vant/lib/index.css';
    import globalFunction from './utils/globalFunction'; // 引入全局方法
    
    const app = createApp(App);
    
    app.use(vant);
    app.use(store);
    app.use(router);
    
    // 挂载全局方法
    for (const key in globalFunction) {
      app.provide(key, globalFunction[key]);
      console.log(key);
    }
    
    app.mount('#app');
    
    window.vm = app;
    ```

## 源码与原理
```javascript
import { toArray } from '../util/index'
// Vue.use 源码
export function initUse (Vue: GlobalAPI) {
	// 首先先判断插件plugin是否是对象或者函数：
	Vue.use = function (plugin: Function | Object) {
		const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
		// 判断vue是否已经注册过这个插件,如果已经注册过，跳出方法
		if (installedPlugins.indexOf(plugin) > -1) {
			return this
		}
		
		// 取vue.use参数,toArray() 方法代码在下一个代码块
		const args = toArray(arguments, 1)
		args.unshift(this)
		// 判断插件是否有install方法，如果有就执行install()方法。没有就直接把plugin当Install执行。
		if (typeof plugin.install === 'function') {
			plugin.install.apply(plugin, args)
		} else if (typeof plugin === 'function') {
			plugin.apply(null, args)
		}
		installedPlugins.push(plugin)
		return this
	}
}
```

```javascript
// toArray 方法源码
export function toArray (list: any, start?: number): Array<any> {
	start = start || 0
	let i = list.length - start
	const ret: Array<any> = new Array(i)
	while (i--) {
		ret[i] = list[i + start]
	}
	return ret
}
```
通过Vue.use安装 Vue.js 插件，如果插件是一个对象，那么对象当Vue.use(插件)之后，插件的install方法会立即执行；如果插件是一个函数，当Vue.use(插件)之后，函数会被立即执行
也就是说：
1.Vue.use参数为函数（插件为函数）时，函数的参数是Vue对象
2.Vue.use参数为对象（插件为对象）时，它提供的install方法中参数是Vue对象
3.自定义参数：插件除了默认的参数 Vue 以外，还可以按需要传入自定义参数 
Vue.use(demo, 1, 2, {name:'小明'}); // 安装自定义插件  install: (Vue, a, b, c) => {}
# Vue copmuted watch差异与原理


