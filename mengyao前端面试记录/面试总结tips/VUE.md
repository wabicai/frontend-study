**Vue三要素**
1.响应式: 例如如何监听数据变化,其中的实现方法就是我们提到的双向绑定
2.模板引擎: 如何解析模板
3.渲染: Vue如何将监听到的数据变化和解析后的HTML进行渲染

## **双向绑定**
Vue.js 是采用**数据劫持结合发布者-订阅者模式**的方式，通过Object.defineProperty()：来劫持各个属性的setter,getter，在数据变动时发布消息给订阅者，触发相应的监听回调
1遍历对象劫持getter，setter:需要 observe 的数据对象进行**递归遍历**，包括**子属性对象的属性**，都加上 setter 和 getter 这样的话，给这个对象的某个值赋值，就会触发 setter，那么就能**监听到了数据变化**
3.Watcher 订阅者是 Observer 和 Compile 之间通信的桥梁，主要做的事情是：
   1、**在自身实例化时往属性订阅器（dep）里面添加自己**
​ 2、**自身必须有一个 `update()` 方法**
​ 3、**待属性变动`dep.notice()` 通知时，能调用自身的 `update()` 方法，并触发 Compile 中绑定的回调，则功成身退。**
3.compile 解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图
总之.MVVM 作为数据绑定的入口，整合**Observer、Compile 和 Watcher**三者，**通过 Observer 来监听自己的 model 数据变化**，通过 Compile 来解析编译模板指令，最终利用 Watcher 搭起 Observer 和 Compile 之间的通信桥梁，达到数据变化->视图更新；视图交互变化(input)->数据 model 变更的双向绑定效果。

## diff虚拟dom
2.key主要用来做dom diff算法用的，diff算法是同级比较，比较当前标签上的key还有它当前的标签名，如果key和标签名都一样时只是做了一个移动的操作，不会重新创建元素和删除元素。

3.没有key的时候默认使用的是“就地复用”策略。如果数据项的顺序被改变，Vue不是移动Dom元素来匹配数据项的改变，而是简单复用原来位置的每个元素。如果删除第一个元素，在进行比较时发现标签一样值不一样时，就会复用之前的位置，将新值直接放到该位置，以此类推，最后多出一个就会把最后一个删除掉。

4.尽量不要使用索引值index作key值，一定要用唯一标识的值，如id等。因为若用数组索引index为key，当向数组中指定位置插入一个新元素后，因为这时候会重新更新index索引，对应着后面的虚拟DOM的key值全部更新了，这个时候还是会做不必要的更新，就像没有加key一样，因此index虽然能够解决key不冲突的问题，但是并不能解决复用的情况。如果是静态数据，用索引号index做key值是没有问题的。
## VNode 是什么？什么是虚拟 DOM
**1）VNode 是什么**
VNode 是 JavaScript 对象，VNode 表示 Virtual DOM，**用 JavaScript 对象来描述真实的 DOM 把 DOM 标签，属性，内容都变成对象的属性**。就像使用 JavaScript 对象对一种动物进行说明一样 `{name:'Hello mike',age:18,children:null}`
**2）VNode 的作用**
通过`render`将`template`模版描述成 VNode，然后进行一系列操作之后形成真实的 DOM 进行挂载。
**3）VNode 的优点**
1、**兼容性强**，不受执行环境的影响。VNode 因为是 JS 对象，不管 Node 还是浏览器，都可以统一操作，从而**获得了服务端渲染、原生渲染、手写渲染函数等能力**。
2、**减少操作 DOM**，**任何页面的变化，都只使用 VNode 进行操作对比**，只需要在**最后一步挂载更新 DOM**，不需要频繁操作 DOM，从而**提高页面性能**。
**4）什么是虚拟 DOM？**
**文档对象模型或 DOM 定义了一个接口，该接口允许 JavaScript 之类的语言访问和操作 HTML 文档。** 元素由树中的节点表示，并且接口允许我们操纵它们。但是此接口需要付出代价，大量非常频繁的 DOM 操作会使页面速度变。 **Vue 通过在内存中实现文档结构的虚拟表示来解决此问题**，其中虚拟节点（VNode）表示 DOM 树中的节点。 当需要操纵时，**可以在虚拟 DOM 的内存中执行计算和操作**，而不是在真实 DOM 上进行操纵。这自然会更快，**并且允许虚拟 DOM 算法计算出最优化的方式来更新实际 DOM 结构**，一旦计算出，就将其应用于实际的 DOM 树，这就提高了性能，这就是为什么基于虚拟 DOM 的框架（例如 Vue 和 React）如此突出的原因。
## 实现一个虚拟 DOM？说说你的思路（高薪常问）
**首先要构建一个 VNode 的类**，DOM 元素上的所有属性在 VNode 类实例化出来的对象上都存在对应的属性。例如 tag 表示一个元素节点的名称，text 表示一个文本节点的文本，chlidren 表示子节点等。**将 VNode 类实例化出来的对象进行分类**，例如注释节点、文本节点、元素节点、组件节点、函数式节点、克隆节点。 **然后通过编译将模板转成渲染函数 render，执行渲染函数 render，在其中创建不同类型的 VNode 类，最后整合就可以得到一个虚拟 DOM**（vnode））。 **最后通过 patch 将 vnode 和 oldVnode 进行比较后，生成真实 DOM。**
## 数组触发视图更新，哪些不可以，解决办法？
`push()、pop()、shift()、unshift()、splice()、sort()、reverse()` **这些方法会改变被操作的数组**；
`filter()、concat()、slice()` **这些方法不会改变被操作的数组，返回一个新的数组**。**以上方法都可以触发视图更新。**
**利用索引直接设置一个数组项**，例：`this.array[index]=newValue`
**直接修改数组的长度**，例：`this.array.length=newLength`
**以上两种方法不可以触发视图更新**；
可以用`this.$set(this.array,index,newValue)`或`this.array.splice(index,1,newValue)`解決方法 1
可以用`this.array.splice(newLength)`解决方法 2
## 单向数据流？（必会）
**数据从父级组件传递给子组件，只能单向绑定。** **子组件内部不能直接修改从父级传递过来的数据。** 所有的 prop 都使得其父子 prop 之间形成了一个**单向下行绑定**：父级 prop 的更新会**向下流动**到子组件中，但是反过来则不行。 这样会**防止从子组件意外改变父级组件的状态**，从而导致你的应用的数据流向难以理解。 额外的，**每次父级组件发生更新时**，**子组件**中所有的`props`都将会**刷新为最新的值**。 这意味着你不应该在一个子组件内部改变 prop。如果你这样做了，Vue 会在浏览器的控制台中发出警告。 **子组件想修改时，只能通过$emit 派发一个自定义事件，父组件接收到后，由父组件修改**
## 3.生命周期钩子函数
![[Pasted image 20220811162739.png]]
## Object.defineProperty 和 Proxy 的区（必会）
1）Proxy 优势如下：
1.直接监听对象而非属性；
2.直接监听数组的变化； 
3.有多达 13 种拦截方法不限于**apply、ownKeys、deleteProperty、has**等等是
4.`Proxy`返回的是一个新对像我们可以只操作新的对象达到目的，而 Object.defineProperty 只能遍历对象属性直接修改；
5.Proxy 作为新标准将受到浏览器厂商重点持续的性能优化，也就是传说中的新标准的性能红利；
2）Object.defineProperty 的优势如下：** **兼容性好，支持 IE9**，而 Proxy 的存在浏览器兼容性问题，而且无法用 polyfill 磨平，因此 Vue 的作者才声明需要等到下个大版本（3.0）才能用 Proxy 重写。
## Vue 组件如何进行传值的？（必会）
**1）父组件向子组件传递数据** 父组件内设置要传的数据，在父组件中引用的子组件上绑定一个自定义属性并把数据绑定在自定义属性上，在子组件添加参数 props 接收即可
**2）子组件向父组件传递数据** 子组件通过 Vue 实例方法$emit 进行触发并且可以携带参数，父组件监听使用`@ / v-on`进行监听，然后进行方法处理
**3）非父子组件之间传递数据**
1、引入第三方 new Vue 定义为 eventBus
2、在组件中 created 中订阅方法 eventBus.$on（"自定义事件名"，methods 中的方法名）
3、在另一个兄弟组件中的 methods 中写函数，在函数中发布 eventBus 订阅的方法 eventBus.$emit（"自定义事件名”）
4、在组件的 template 中绑定事件（比如 click）
## 3.VUEX
![[Pasted image 20220613231600.png]]


## 你是怎么认识 vuex 的？（必会）
`Vuex`可以理解为**一种开发模式或框架**。**比如 PHP 有 thinkphp,java 有 spring**等，通过状态（数据源）**集中管理驱动组件的变化**（好比 spring 的 IOC 容器对 bean 进行集中管理）。
1、应用级的状态集中放在 **store** 中;
2、改变状态的方式是提交 **mutations**，这是个同步的事物;
3、异步逻辑应该封装在 **action** 中。
## Vue-Router 是干什么的，原理是什么（必会）
​ `Vue-Router`是 Vue.js 官方的**路由插件**，它和 Vue.js 是深度集成的，**适合用于构建单页面应用**。**Vue 的单页面应用是基于路由和组件的，路由用于设定访问路径，并将路径和组件映射起来**。传统的页面应用，是用一些超链接来实现页面切换和跳转的。在`Vue-Router`单页面应用中，则是**路径之间的切换，也就是组件的切换**。**路由模块的本质就是建立起 u 和页面之间的映射关系**。 “**更新视图但不重新请求页面**”是前端路由原理的**核心**之一，目前在浏览器环境中这一功能的实现主要有两种方式： **利用 URL 中的 hash（"#”）** **利用 History interface 在 HTML5 中新增的方法**
## 路由之间是怎么跳转的？有哪些方式？（必会）
1.`<router-link to="需要跳转的页面路径">`
2.`this.$router.push()` 跳转到指定的 url ，并在 history 中添加记录，点击回退到上一个页面 `this.$router.back()`
3.`this.$router.replace()`跳转到指定的 url，但是 history 中不会添加记录，点击回退到上上个页面
4.`this.$router.go(n)` 向前或者后跳转 n 个页面，n 可以是正数也可以是负数
路由守卫为：
**全局守卫**：beforeEach**后置守卫**：afterEach**全局解析守卫**：beforeResolve**路由独享守卫**：beforeEnter
**组件内钩子**
​ `beforeRouterEnter, beforeRouterUpdate, beforeRouterLeave`
## Vue 怎么实现跨域（必会）
**1）什么是跨域**
​ **跨域指浏览器不允许当前页面的所在的源去请求另一个源的数据**。**源指协议，端口，域名**。只要这个 3 个中有一个不同就是跨域
**2）使用 Vue-cli 脚手架搭建项目时 proxyTable 解决跨域问题**
打开`config/index.js(vue.cofig.js)`在 proxyTable 中添写如下代码：
```
proxyTable:{
  '/api': {// 使用"/api"来代替"http:/f.apiplus.c"
  target: 'http:/f.apiplus.cn',// 源地址
  changeOrigin:true, // 改变源
  pathRewrite:{
  '^/api':'http:/f.apiplus.cn'// 路径重写
  }
}
```
**3）使用 CORS（跨域资源共享）**
**1、前端设置：**
​ 前端 Vue 设置`axios`允许跨域携带`cookie`（默认是不带 cookie）`axios.defaults.withCredentials = true;` **2、后端设置：**​ 1、**跨域请求后的响应头中需要设置**
​ 2、`Access-Control-Alow-Origin`为**发起请求的主机地址**。
​ 3、`Access-Control-Allow-Credentials`，当它被**设置为 true 时**，**允许跨域带 cookie**，但此时`Access-Control-Allow-Origin`**不能为通配符***。
​ 4、`Access-Control-Allow-Headers`，**设置跨域请求允许的请求头**。
​ 5、`Access-Control-Alow-Methods`，**设置跨域请求允许的请求方式**。