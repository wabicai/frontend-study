
 # 01 初识vue
# 06数据代理
![[Pasted image 20220605150851.png]]
![[Pasted image 20220605150825.png]]
# 07 事件处理
## 01 事件的基本使用
对象里写方法，简写，直接方法名，小括号，花括号。
![[Pasted image 20220605152711.png]]
## 02 事件修饰符
![[Pasted image 20220605152923.png]]

@wheel 鼠标滚轮滚动事件（默认行为会移动wheel）
@scroll 滚动条滚动

passive:
正常顺序，先调用绑定的回调函数，再调用默认行为
加上之后，并行处理？？？

## 03 键盘事件
![[Pasted image 20220605154910.png]]

2. .Enter .caps-lock
不是所有按键都可以绑定事件，如音量调节键
tab键，keyup前元素已经失去焦点，可以用keydown

# 08计算属性
## 03计算属性的实现
![[Pasted image 20220605180656.png]]
简写写法
![[Pasted image 20220618152647.png]]
get set 完整写法
![[Pasted image 20220629224715.png]]
完全依赖返回值，没办法异步，没办法等一等才有返回值。
![[1654492968(1).png]]
图中返回值返回给了箭头函数而不是返回给fullname

# 09监视属性/侦听属性
deep
immediate
简写
![[1654493398(1).png]]
![[1654493346(1).png]]
方便开启异步任务
![[1654492916(1).png]]
定时器中的箭头函数，不是vue管理的函数，JS时间到了，是JS引擎调用的函数，而不是VUE调用的，必须写成箭头函数，此this才能是vue实例,往外找this，找到firstname的this，即vm，若写成普通函数，this是window
![[Pasted image 20220618152533.png]]
# computed vs watch
![[Pasted image 20220606132622.png]]
computed 数据计算出来的数据，return value, 自动根据依赖数据变化进行计算
watch 监视数据，数据变化后执行某些操作，过程，指明watch的对象
vs vue3 watcheffect
# 绑定样式
## class样式绑定：字符串；数组；对象
![[1654500932(1).png]]
![[1654500954(1).png]]
## style内联样式绑定
对象写法、数组写法
![[1654509631(1).png]]

# 条件渲染
![[1654517924(1).png]]
# 列表渲染
![[1654521859839.png]]

# key和diff，和虚拟DOM
v-for中为什么要用key
1.vue中列表循环需加:key="唯一标识" 唯一标识尽量是item里面id等，因为vue组件高度复用增加Key可以标识组件的唯一性，为了更好地区别各个组件 key的作用主要是为了高效的更新虚拟DOM。

2.key主要用来做dom diff算法用的，diff算法是同级比较，比较当前标签上的key还有它当前的标签名，如果key和标签名都一样时只是做了一个移动的操作，不会重新创建元素和删除元素。

3.没有key的时候默认使用的是“就地复用”策略。如果数据项的顺序被改变，Vue不是移动Dom元素来匹配数据项的改变，而是简单复用原来位置的每个元素。如果删除第一个元素，在进行比较时发现标签一样值不一样时，就会复用之前的位置，将新值直接放到该位置，以此类推，最后多出一个就会把最后一个删除掉。

4.尽量不要使用索引值index作key值，一定要用唯一标识的值，如id等。因为若用数组索引index为key，当向数组中指定位置插入一个新元素后，因为这时候会重新更新index索引，对应着后面的虚拟DOM的key值全部更新了，这个时候还是会做不必要的更新，就像没有加key一样，因此index虽然能够解决key不冲突的问题，但是并不能解决复用的情况。如果是静态数据，用索引号index做key值是没有问题的。
![[d63ef3d9e49c07dd553832af0151fcc.jpg]]
-   **预期**：`number | string | boolean (2.4.2 新增) | symbol (2.5.12 新增)`
    
    `key` 的特殊 attribute 主要用在 Vue 的虚拟 DOM 算法，在新旧 nodes 对比时辨识 VNodes。如果不使用 key，Vue 会使用一种最大限度减少动态元素并且尽可能的尝试就地修改/复用相同类型元素的算法。而使用 key 时，它会基于 key 的变化重新排列元素顺序，并且会移除 key 不存在的元素。
    
    有相同父元素的子元素必须有**独特的 key**。重复的 key 会造成渲染错误。
    
    最常见的用例是结合 `v-for`：
    
    ```
    <ul>
      <li v-for="item in items" :key="item.id">...</li>
    </ul>
    ```
    
    它也可以用于强制替换元素/组件而不是重复使用它。当你遇到如下场景时它可能会很有用：
    
    -   完整地触发组件的生命周期钩子
    -   触发过渡
    
    例如：
    
    ```
    <transition>
      <span :key="text">{{ text }}</span>
    </transition>
    ```
    
    当 `text` 发生改变时，`<span>` 总是会被替换而不是被修改，因此会触发过渡。
#  模拟一个数据监测
只考虑一层对象时
![[1654570848509.png]]
？？ vm.data = data = obs, 原来的data丢了，
vue.set的使用
Vue.set
vm.$set
![[1654573405202.png]]
多层对象和数组？

数组的监视：
包装数组常用方法
![[1654575122761.png]]
2. Vue.set(vm.arry, 0, '新的值')；
    vm.$set()；
	
	总结：
	![[1654578300226.png]]

# 数据劫持
vs 代理？？

# 收集表单数据
v-model 收集value值：input有，radio无，手动加上
修饰符 v-model.num(转化为num)；v-model.lazy（失焦收集）；v-model.trim
![[1654579772008.png]]
# 过滤器
![[1654585734536.png]]
全局过滤器/局部过滤器
# 一些内置指令
## v-text
## v-html
![[1654588117825.png]]
## v-cloack
![[1654591240323.png]]
## v-once
![[1654591359108.png]]
## v-pre
![[1654591460802.png]]
# 自定义指令
![[1654603247656.png]]
如果指令需要多个值，可以传入一个 JavaScript 对象字面量。记住，指令函数能够接受所有合法的 JavaScript 表达式。

```
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

```
Vue.directive('demo', function (el, binding) {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text)  // => "hello!"
})
```
应用的坑与总结
1.指令名：多个单词： 风格 v-name-a, vue配置directives里面，‘name-a'
2.this: 指令相关的回调中，this是window，不能直接拿vue的数据，都得传进来
3.局部指令: 配置在vue中 directives
   全局指令： Vue.directive('fbind', {}) 三个钩子回调函数，作为配置对象的属性
                      Vue.directive('fbind', function(el, binding){blabla})  默认bind和update时调用
![[1654603830051.png]]
# 生命周期
![[1654604939434.png]]
this是vm或组件实例对象
![[1654662170114.png]]
![[1654662209231 1.png]]
![[1654606065680.png]]
![[1654662116414.png]]
![[1654667088199.png]]
# 组件
## 什么是组件、组件化
why组件化，传统方式有什么问题
![[1654670206121.png]]
组件化
![[1654670400765.png]]
组件：实现应用中局部功能代码（css/html/js）和资源（MP3/MP4/image等）的集合
## 
非单文件组件：一个文件中包含n个组件
单文件组件：一个文件中只包含一个组件 .vue

## 创建组件（非单文件组件，实际不用，用于学习）
![[1654672241556.png]]
data返回一个函数，因此每个实例可以维护一份被返回对象的独立的拷贝：

```
data() {
  return {
    count: 0
  }
}
```
![[1654672891285.png]]
组件名：
1.一个单词，可以开头大写/小写，标签使用和注册两个地方统一
2.多个单词，1） 短横连接 2）每个单词开头都大写，需要在脚手架里面用，html不能处理大写字母
## 注册组件
局部注册：（用的多）
![[1654672280487.png]]
全局注册：
![[1654672463123.png]]
## 编写组件标签
![[1654672200665.png]]
![[1654672515900.png]]
# 组件的嵌套
vm-app-其他组件
# VueComponent
组件的本质是一个名为VueComponent的构造函数，每次调用Vue.extend都会返回一个全新的VueComponent
![[1654677247164.png]]
this指向总结↑
## 一个重要的内置关系
![[1654681520730.png]]
显示原型写
隐式原型链查找
![[1654681770574.png]]
![[1654686222091.png]]
# 单文件组件
## 
main.js index.html App.vue Student.vue School.vue
![[1654775704913.png]]
# 脚手架 Vue CLI
commoand line interface
![[1654775673535.png]]
## 修改默认配置
命令： vue inspect > output.js
把默认配置都生产一个js
若采用默认配置，不能修改的，红色框内的
![[1654775263278.png]]

可选配置文件 vue.config.js 放在package.json同级目录（与Vue.config区别开）
用了commonjs模块化，要交给webpack和默认配置文件整合，是基于nodejs的
# ref
和js getelementbyid的区别<- DOM, DOM or VC（放在组件标签上时）
![[1654776630586.png]]
![[1654776666104.png]]
# 配置项之 props（属性）
<Student age="18"/> 字符串
<Student :age="18"/> number
父组件传入，子组件配置中接收
父组件传入：
![[1654777490223.png]]
子组件配置中接收：
![[Pasted image 20220609202353.png]]
接收到的props不可以修改，若想改，要在data里加一个不同名属性，初始值设置为props，修改data的值（若同名，props优先级更高）
![[1654777844595.png]]
![[1654778098343.png]]

# mixins 混入
两个组件共享一个相同的配置。
1.相同配置写进一个混入文件，如叫做mixin.js,内容如下
![[1654778565373.png]]
2.组件局部引入：在组件中先引入import,再mixins配置项用用数组混入
（1）若组件中本身就有，使用组件中的；组件中没有用mixins的
（2）生命周期钩子的，都要执行，先执行mixin中的，后执行组件中的
![[1654778745580.png]]
3.全局混入，vm vc身上都会混入
![[1654778920013.png]]
![[1654778966597.png]]
# 插件
定义： install方法中的参数是Vue构造函数
![[1654779463052.png]]
使用
![[1654779353406.png]]
![[1654779651648.png]]

# scoped样式 lang
![[1654780152137.png]]
![[1654779870047.png]]
![[1654780172280.png]]
less 版本，脚手架里需要的不一定是最新的，npm install时需要指定合适版本
# 本地存储
![[1655107919074.png]]
localstorage 手动清除 支持 storage 事件   同域下页面共享
sessionstorage 浏览器关闭   页面私有
同源策略限制请求与响应的 协议、域名、端口都相同
getItem setItem removeItem clear
string
字符串，JSON.stringify，JSON.parse
不set就get，拿到null
有大小限制,无个数限制

cookie
-   浏览器也会在每次请求的时候主动组织所有域下的cookie到请求头 cookie 中，发送给服务器端
-   浏览器会主动存储接收到的 set-cookie 头信息的值
-   可以设置 http-only 属性为 true 来禁止客户端代码（js）修改该值
-   可以设置有效期 (默认浏览器关闭自动销毁)(不同浏览器有所不同)
-   同域下个数有限制，最好不要超过50个(不同浏览器有所不同)
-   单个cookie内容大小有限制，最好不要超过4000字节(不同浏览器有所不同
-   同源策略,通过设置 domain 属性可以让同主域下的不同`子域拿到父域`的 cookie

作用域大小对比：localstorage（同一个浏览器的不同窗口）> cookie（同一窗口不同Tab）> sessionstorage（同一窗口同一Tab）

应用场景上
-   cookie 用于存个性化主题、账号、密码、token
-   localstorage 可以用于存储一些永久的数据，如用户的注册时间
-   sessionstorage 可以用于存储临时购物车数据
 
IndexedDB
https://www.cnblogs.com/WindrunnerMax/p/14277582.html

# 组件自定义事件
1.子组件向父组件传递数据，props传函数，在子元素中调用

2.自定义事件，在父组件中给子组件绑定事件，添加父组件的回调
子组件触发事件：
![[Pasted image 20220612221613.png]]
父组件监听事件，添加回调
![[Pasted image 20220612220529.png]]
![[Pasted image 20220612220716.png]]
ps1.回调注意点：
直接写回调函数，不ok,this指向触发事件的实例对象，而不是接受事件的对象
![[Pasted image 20220612223847.png]]
写成箭头函数ok,往外找找到mounted的this
![[Pasted image 20220612224029.png]]
ps2
原生事件 加.native修饰符
![[Pasted image 20220612224337.png]]
![[Pasted image 20220612224422.png]]
# 全局事件总线：任意组件间通信
要求：
![[1655096212435.png]]
本质，自定义事件
1.所有组件实例都可以访问到-> 放在Vue.prototype
2.$on $emit $off方法在vue原型上，所以值要是vm或vc 
vc: Vue.prototype.x = new Vue.extend({})
vm: ![[1655097285675.png]]

使用：
触发：![[1655097337036.png]]
1655097362842.png]]
ps:
事件名冲突，1.配置config，把事件名都写进去 2.销毁组件前解绑 3.回调写成箭头函数或者写在methods中，保证this指向当前vc
![[1655097547026.png]]
# 消息订阅与发布
引入库，用得少
![[1655098346525.png]]
# $nextTick
![[1655103862893.png]]
# 动画与过渡
![[1655105135727.png]]
![[1655105909638.png]]
![[1655105956505.png]]
# 配置代理
跨域：服务器收到请求，数据返回给浏览器，浏览器发现跨域，没有交给js
跨域解决
1.cors 前端不用修改，服务器配置，返回响应配一些响应头
2.jsonp script标签 src 不受同源策略影响 前后端都改 只能get 用得少
3.配置一个代理服务器，开发中用得多
![[1655109366823.png]]
方式1：
vue-cli
配置
![[1655109760328.png]]
使用
![[1655109705061.png]]
缺点：
1.只能配置一个代理
2.不能控制是否走代理，本地有的就自动不走代理了
方式2：
配置
![[1655110776082.png]]
使用
![[1655110826267.png]]
![[1655110845992.png]]
![[1655110898578.png]]
引入css
1. app vue import引入，会进行严格的依赖检
 ![[1655111749173.png]]
2. index.html中link引入 
 ![[1655111889457.png]]
# 对象赋值
![[1655113795908.png]]
# slot插槽
1. 默认插槽
定义：
![[1655115303898.png]]
插入：
![[1655115366951.png]]
ps.样式写在父组件，子组件里都可以
2. 具名插槽
定义：
![[1655118284620.png]]
插入： slot="footer" 或用template时也可以用v-slot:footer
![[Pasted image 20220613190426.png]]
3. 作用域插槽（可带name）:
数据在子组件中，结构在使用者即父组件中，将数据从子组件传入父组件；将html由父组件传入子组件
![[1655121485978.jpg]]
必须用template标签，使用scope属性，或者使用新属性 slot-scope
![[1655121896389.png]]
![[1655122003718.png]]
![[1655122025941.png]]
![[1655122119179.png]]
# Vuex
![[Pasted image 20220613231600.png]]
vuex中的三个对象经过**store**管理
定义store
![[Pasted image 20220613233810.png]]
引入
![[Pasted image 20220613233749.png]]
![[Pasted image 20220613233940.png]]
![[Pasted image 20220613234010.png]]
![[Pasted image 20220613234044.png]]
在store中定义
![[Pasted image 20220614171135.png]]

![[Pasted image 20220614171154.png]]
在组件中使用
![[1655197154461.png]]

## 配置项：getters
用于将state中的数据进行加工
![[1655198185810.png]]
注意写return

## mapState与mapGetters
辅助生成函数代码，帮助映射vuex中的数据为计算属性
mapState：帮助映射state中的数据为计算属性
![[1655199271032.png]]
mapGetters：帮助映射getters中的数据为计算属性

## mapMutations与mapActions
mapMutations:帮助映射mutations中的方法为方法
使用：
![[1655200692033.png]]
![[1655200532352.png]]
![[Pasted image 20220614173542.png]]
![[Pasted image 20220614175949.png]]
## 多组件共享数据
## vuex模块化 + namespace
配置：
![[1655210034203.png]]
使用：用映射
![[1655210061333.png]]
不用映射
![[1655210457956.png]]
![[1655210724345.png]]
![[1655210758466.png]]
# 路由
 router路由器 route路由（key-value） route路由 route路由
![[Pasted image 20220614224314.png]]
![[Pasted image 20220614224408.png]]

![[Pasted image 20220615000207.png]]
![[Pasted image 20220615000450.png]]
![[1655264877818.png]]
路由组件，pages，靠router-view引入，不用的路由组件会销毁
一般组件，components，自己写标签
## 嵌套路由
![[1655269436532.png]]
![[1655269590082.png]]
![[1655269627255.png]]
## 路由传参 query
传入：
![[1655270312780.png]]
使用：
![[1655270914217.png]]
不需要修改route配置文件
![[Pasted image 20220615131851.png]]

## 命名路由
传入：
![[1655270470123.png]]
定义：
![[1655270506415.png]]
![[1655270530085.png]]
![[1655270546383.png]]
##  路由传参 params参数
配置(声明接收)：
![[1655270677205.png]]
传入：
![[1655270813435.jpg]]
使用：
![[1655270874113.png]]
## 路由的props配置
路由中配置：
![[1655271434919.png]]
![[1655271492657.png]]
组件接收参数：
![[1655271514073.png]]
![[Pasted image 20220615133915.png]]
## router-link 的replace属性
默认操作模式 push
replace替换栈顶的一条
开启：
![[1655277271225.png]]
![[1655277304791.png]]
## 编程式路由导航
![[1655277858873.png]]
## 缓存路由组件 keep-alive
![[1655278144074.png]]
多个组件用数组
![[1655278271516.png]]
![[1655278223666.png]]
## 路由组件独有的两个新的生命周期钩子 activated deactivated
![[Pasted image 20220615153902.png]]
## 全局前置--路由守卫
![[1655279366695.png]]
利用配置中的meta设置：
![[1655280171894.png]]
## 全局后置--路由守卫
![[1655280610540.png]]

![[1655280642748.png]]
## 独享路由守卫
![[1655280747138.png]]
## 组件内路由守卫
![[Pasted image 20220615162054.png]]
## history模式与hash模式
![[1655286008917.png]]
# UI组件库
# Vue3
![[Pasted image 20220615211327.png]]

![[Pasted image 20220615211812.png]]
![[Pasted image 20220615212102.png]]
![[Pasted image 20220615212336.png]]
![[Pasted image 20220615212516.png]]
## 常用的composition api
![[Pasted image 20220618164352.png]]
![[Pasted image 20220616002620.png]]
![[1655376336589.png]]
![[1655376981000.png]]
![[1655377068919.png]]
![[Pasted image 20220618002301.png]]
![[Pasted image 20220618002349.png]]
![[Pasted image 20220618145624.png]]
![[Pasted image 20220618150710.png]]
vue3watch
![[Pasted image 20220618153250.png]]
![[Pasted image 20220618154714.png]]
![[Pasted image 20220618154603.png]]
![[Pasted image 20220618154743.png]]
![[Pasted image 20220618155532.png]]
## vue3 生命周期
![[Pasted image 20220618161124.png]]
![[Pasted image 20220618161048.png]]
![[Pasted image 20220618161142.png]]
![[Pasted image 20220618161411.png]]
组合式api执行的生命周期比配置项快一点
![[Pasted image 20220618161640.png]]
## 其他composition API
![[Pasted image 20220618172513.png]]
![[Pasted image 20220618164940.png]]
![[Pasted image 20220618165106.png]]
![[Pasted image 20220618165633.png]]
### provide 与 inject
![[Pasted image 20220618172220.png]]
![[Pasted image 20220618172412.png]]
## composition API优势
![[Pasted image 20220618172606.png]]
![[Pasted image 20220618172719.png]]
![[Pasted image 20220618172739.png]] hook 同一块功能数据可以写进同一个hook中
如：打点相关的都写进一个hook中![[Pasted image 20220618172909.png]]
## 新的组件
![[Pasted image 20220618173009.png]]
![[Pasted image 20220618173021.png]]
![[Pasted image 20220618173835.png]]
![[Pasted image 20220618175019.png]]
![[Pasted image 20220618174839.png]]
![[Pasted image 20220618174758.png]]
![[Pasted image 20220618174941.png]]
## 其他
![[Pasted image 20220618175047.png]]
![[Pasted image 20220618175119.png]]
![[Pasted image 20220618175157.png]]
![[Pasted image 20220618180223.png]]
![[Pasted image 20220618180441.png]]


# ps
1. new vue配置项与vm实例上内容的对应关系
el
data
methods
computed
watch
2. 简写与完整写法
3. 配置项写， vm.$ 方法配置
4. this
5. ![[1655199216328.png]] 没有简写方式
# 面试题
vue面试题

## 1.vue优点

(1)轻量级，速度快
(2) 模块化：实现，优点：代码复用，低耦合
(3) 类mvvm实现，数据绑定，数据修改会直接反映到视图上：实现，优点
(4) 虚拟dom？？
(4)简单易学,文档齐全，且文档为中文文档
2 虚拟dom

## 2.虚拟DOM
[深入剖析：Vue核心之虚拟DOM]https://juejin.cn/post/6844903895467032589
（1）真实DOM及其缺点：真实`DOM`和其解析流程，缺点操作 `DOM` 的重排重绘代价大，频繁操作会出现页面卡顿，影响用户体验
（2）虚拟DOM原理与优势：虚拟 `DOM` 就是为了解决浏览器性能问题而被设计出来的。如前，若一次操作中有 10 次更新 `DOM` 的动作，虚拟 `DOM` 不会立即操作 `DOM`，而是将这 10 次更新的 `diff` 内容保存到本地一个 `JS` 对象中，最终将这个 `JS` 对象一次性 `attch` 到 `DOM` 树上，再进行后续操作，避免大量无谓的计算量。所以，用 `JS` 对象模拟 `DOM` 节点的好处是，页面的更新可以先全部反映在 `JS` 对象(虚拟 `DOM` )上，操作内存中的 `JS` 对象的速度显然要更快，等更新完成后，再将最终的 `JS` 对象映射成真实的 `DOM`，交由浏览器去绘制。
（3）算法 --todo
`Virtual DOM` 算法主要实现上面三个步骤来实现：
1.用 `JS` 对象模拟 `DOM` 树，vnode
2.比较两棵虚拟 `DOM` 树的差异diff算法
3.将两个虚拟 `DOM` 对象的差异应用到真正的 `DOM` 树 — `patch.js`

## 3、vue父组件向子组件传递数据
props
其他：事件总线
## 3、子组件向父组件传递数据
（1）父组件用props传函数进去，子组件调用父组件函数，传值给父组件
（2）在子组建中emit，父组件绑定事件回调@ v-on，或者接收事件this.$refs.on.childblabla
其他：事件总线
## 45、vue 中子组件调用父组件的方法?
（1）直接在子组件中通过 this.$parent.event 来调用父组件的方法。
（2）在子组件里用$emit()向父组件触发一个事件，父组件监听这个事件就行了。
（3）父组件把方法props传入子组件中，在子组件里直接调用这个方法。
## 44、组件传值方式有哪些
父传子：子组件通过props[‘xx’] 来接收父组件传递的属性 xx 的值
子传父：子组件通过 this.$emit(‘fnName’,value) 来传递,父组件通过接收 fnName 事件方法来接收回调
其他方式：通过创建一个bus，进行传值
使用Vuex

## 4、v-if和v-show指令的共同点和不同点

相同点:都可以控制dom元素的显示和隐藏
不同点:
v-if直接将dom元素从页面删除，再次切换需要重新渲染页面
v-show只是改变display属性，dom元素并未消失，切换时不需要重新渲染页面,display none

区别点：
v-if 是动态的向 DOM 树内添加或者删除 DOM 元素
v-show 是通过设置 DOM 元素的 display 样式属性控制显隐
v-if 切换有一个局部编译/卸载的过程，切换过程中合适地销毁和重建内部的事件监听和子组件
v-show 只是简单的基于 css 切换
性能消耗
v-if 有更高的切换消耗
v-show 有更高的初始渲染消耗
使用场景
v-if 适合运营条件不大可能改变
v-show 适合频繁切换

display: none
给一个元素设置了display: none后，该元素及其后代元素均会被隐藏。且重写后代元素的display属性无效。
该元素及其后代元素均不占用原空间，隐藏后的元素无法点击。

visibility:hidden
给元素设置visibility: hidden后，该元素隐藏。其子元素默认继承父元素visibility属性，但子元素若重写属性，则不受父级影响。
该元素隐藏后，仍保持占位。隐藏部分无法点击，可见的子元素可以点击。
display: none和visibility:hidden区别
visibility:hidden保持占位；display: none不保持占位
visibility:hidden设置后，其子元素可通过设置visibility:visible来单独控制子元素显示； display: none设置后，其子元素重写display属性无效，均隐藏。
display: none和visibility:hidden共同点
对应的标签仍存在DOM结构中，均可控制显隐

v-if和v-show区别
初始值为false时，v-if不会编译，v-show会编译并设置display:none
v-show只编译一次，通过控制display:none来控制显隐，始终可以在DOM中获取对应标签；v-if的显隐切换则是通过动态的向DOM树内添加或者删除DOM元素，所以v-if="false"时，无法在DOM中获取该标签。

## 5、如何让CSS只在当前组件中起作用
scoped
## 6 keep-alive的作用是什么

（1）缓存组件，主要是用于需要频繁切换的组件时进行缓存，不需要重新渲染页面
（2）生命周期钩子：
首次挂载 created-> mounted-> activated
退出时触发 `deactivated` 当再次进入（前进或者后退）时，只触发 `activated`
（3）3个属性做为参数进行组件匹配，对匹配的组件进行缓存
 `include` 包含的组件(可以为字符串，数组，以及正则表达式,只有匹配的组件会被缓存)
`exclude` 排除的组件(以为字符串，数组，以及正则表达式,任何匹配的组件都不会被缓存)
`max` 缓存组件的最大值(类型为字符或者数字,可以控制缓存组件的个数)
## 7、如何获取dom
（1）给dom元素加ref=‘refname’,然后通过this.$refs.refname进行获取dom元素
（2）js方法
## 9、vue-loader是什么？它的用途是什么？
vue文件的一个加载器，将template/js/style转换为js模块
用途:js可以写es6、style样式
## 10、为什么用key
给每个dom元素加上key作为唯一标识 ，diff算法可以正确的识别这个节点，使页面渲染更加迅速。
key是给每一个vnode的唯一id,可以依靠key,更准确, 更快的拿到oldVnode中对应的vnode节点。
更准确
因为带key就不是就地复用了，在sameNode函数 a.key === b.key对比中可以避免就地复用的情况。所以会更加准确。
更快
利用key的唯一性生成map对象来获取对应节点，比遍历方式更快
## 13、请说出vue.cli项目中src目录每个文件夹和文件的用法
components存放组件
app.vue主页面入口
index.js主文件入口
assets存放静态资源文件
## 14、computed和watch
使用场景：
用官网的一句话来说，所有需要用到计算的都应该使用计算属性。多条数据影响一条数据时使用计算属性，使用场景购物车。
如果是一条数据更改，影响多条数据时，使用watch，使用场景搜索框。
语义：
computed属性要有返回值，自动根据依赖的属性（可多个）变化时执行，返回一个值
watch 操作，监视指定的watch对象（单个）变化，进行改变（想改啥改啥），可延迟执行
## 15、v-on可以监听多个方法吗？
可以，比如 v-on=“onclick,onbure”
## 16、$nextTick的使用
在data()中的修改后，页面中无法获取data修改后的数据，使用$nextTick时，当data中的数据修改后，可以实时的渲染页面
## 17、vue组件中data为什么必须是一个函数？
因为javaScript的特性所导致，在component中，data必须以函数的形式存在，不可以是对象。
组件中的data写成一个函数，数据以函数返回值的形式定义，这样每次复用组件的时候，都会返回一份新的data，相当于每个组件实例都有自己私有的数据空间，他们值负责各自维护数据，不会造成混乱。而单纯的写成对象形式，就是所有组件实例共用了一个data，这样改一个全部都会修改。
## 18、渐进式框架的理解
主张最少
可以根据不同的需求选择不同的层级
## 19、vue在双向数据绑定是如何实现的？
vue双向数据绑定是通过数据劫持、组合、发布订阅模式的方式来实现的，也就是说数据和视图同步，数据发生变化，视图跟着变化，视图变化，数据也随之发生改变
核心：关于vue双向数据绑定，其核心是Object.defineProperty()方法

## 20、单页面应用和多页面应用区别及缺点
单页面应用（SPA），通俗的说就是指只有一个主页面的应用，浏览器一开始就加载所有的js、html、css。所有的页面内容都包含在这个主页面中。但在写的时候，还是分开写，然后再加护的时候有路由程序动态载入，单页面的页面跳转，仅刷新局部资源。多用于pc端。
多页面（MPA），就是一个应用中有多个页面，页面跳转时是整页刷新
单页面的优点：用户体验好，快，内容的改变不需要重新加载整个页面，基于这一点spa对服务器压力较小；前后端分离，页面效果会比较酷炫
单页面缺点：不利于seo；导航不可用，如果一定要导航需要自行实现前进、后退。初次加载时耗时多；页面复杂度提高很多。
## 22、父组件和子组件生命周期钩子执行顺序是什么？
加载渲染过程
父 beforeCreate -> 父 created -> 父 beforeMount -> 子 beforeCreate -> 子 created -> 子 beforeMount -> 子 mounted -> 父 mounted

子组件更新过程
父 beforeUpdate -> 子 beforeUpdate -> 子 updated -> 父 updated

父组件更新过程
父 beforeUpdate -> 父 updated

销毁过程
父 beforeDestroy -> 子 beforeDestroy -> 子 destroyed -> 父 destroyed

## 25、vue和jQuery的区别
jQuery是使用选择器（$）选取DOM对象，对其进行赋值、取值、事件绑定等操作，其实和原生的HTML的区别只在于可以更方便的选取和操作DOM对象，而数据和界面是在一起的。比如需要获取label标签的内容：$("lable").val();,它还是依赖DOM元素的值。
Vue则是通过Vue对象将数据和View完全分离开来了。对数据进行操作不再需要引用相应的DOM对象，可以说数据和View是分离的，他们通过Vue对象这个vm实现相互的绑定。这就是传说中的MVVM。

26、delete和Vue.delete删除数组的区别
delete只是被删除的元素变成了 empty/undefined 其他的元素的键值还是不变。
splice直接删除了数组，改变了数组的键值
Vue.delete 直接删除了数组 改变了数组的键值。
![[Pasted image 20220619164225.png]]

## 27、SPA首屏加载慢如何解决
安装动态懒加载所需插件；使用CDN资源。

## 28、vue项目是打包了一个js文件，一个css文件，还是有多个文件？
根据vue-cli脚手架规范，一个js文件，一个CSS文件。

## 29、vue更新数组时触发视图更新的方法
push()；
pop()；
shift()；
unshift()；
splice()；
sort()；
reverse()

## 30、什么是 vue 生命周期？有什么作用？
每个 Vue 实例在被创建时都要经过一系列的初始化过程——例如，需要设置数据监听、编译模板、将实例挂载到 DOM 并在数据变化时更新 DOM 等。同时在这个过程中也会运行一些叫做 生命周期钩子 的函数，这给了用户在不同阶段添加自己的代码的机会。

## 31、第一次页面加载会触发哪几个钩子？
beforeCreate， created， beforeMount， mounted

## 32、vue获取数据在一般在哪个周期函数
created
beforeMount
mounted

## 33、created和mounted的区别
created:在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。
mounted:在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。

## 34、vue生命周期的理解
总共分为8个阶段创建前/后，载入前/后，更新前/后，销毁前/后。
创建前/后： 在beforeCreated阶段，vue实例的挂载元素$el和数据对象data都为undefined，还未初始化。在created阶段，vue实例的数据对象data有了，$el还没有。
载入前/后：在beforeMount阶段，vue实例的$el和data都初始化了，但还是挂载之前为虚拟的dom节点，data.message还未替换。在mounted阶段，vue实例挂载完成，data.message成功渲染。
更新前/后：当data变化时，会触发beforeUpdate和updated方法。
销毁前/后：在执行destroy方法后，对data的改变不会再触发周期函数，说明此时vue实例已经解除了事件监听以及和dom的绑定，但是dom结构依然存在。

## 35、vuex是什么？
vue框架中状态管理。

## 36、vuex有哪几种属性？
有五种，State、 Getter、Mutation 、Action、 Module
state： 基本数据(数据源存放地)
getters： 从基本数据派生出来的数据
mutations ： 提交更改数据的方法，同步！
actions ： 像一个装饰器，包裹mutations，使之可以异步。
modules ： 模块化Vuex

## 37、vue全家桶
vue-cli、vuex、vueRouter、Axios

## 38、vue-cli 工程常用的 npm 命令有哪些?
npm install 下载 node_modules 资源包的命令
npm run dev 启动 vue-cli 开发环境的 npm 命令
npm run build vue-cli 生成 生产环境部署资源 的 npm 命令
npm run build–report 用于查看 vue-cli 生产环境部署资源文件大小的 npm 命令
## 39、请说出 vue-cli 工程中每个文件夹和文件的用处?
build 文件夹是保存一些 webpack 的初始化配置。
config 文件夹保存一些项目初始化的配置
node_modules 是 npm 加载的项目依赖的模块
src 目录是我们要开发的目录:
assets 用来放置图片
components 用来放组件文件
app.vue 是项目入口文件
main.js 项目的核心文件
## 41、v-for 与 v-if 的优先级?
v-for 和 v-if 同时使用，有一个先后运行的优先级，v-for 比 v-if 优先级更高，这就说明在
v-for 每次的循环赋值中每一次调用 v-if 的判断，所以不推荐 v-if 和 v-for 在同一个标签中同时使用。
在vue2中，**v**-for 的**优先级**比**v**-**if**更高。 在vue3中，**v**-**if**具有比**v**-for更高的**优先级**。

## 42、 vue 常用的修饰符?
事件修饰符

.stop 阻止事件继续传播
.prevent 阻止标签默认行为
.capture 使用事件捕获模式，即元素自身触发的事件先在此处处理，然后才交由内部元素进行处理
.self 只当在 event.target 是当前元素自身时触发处理函数
.once 事件只会触发一次
.passive 告诉浏览器你不想阻止事件的默认行为
v-model 的修饰符

.lazy 通过这个修饰符，转变为在 change 事件再同步
.number 自动将用户输入值转化为数值类型
.trim 自动过滤用户输入的收尾空格
键盘事件修饰符

.enter
.tab
.delete (捕获“删除”和“退格”键)
.esc
.space
.up
.down
.left
.right
系统修饰符

.ctrl
.alt
.shift
.meta
鼠标按钮修饰符

.left
.right
.middle
## 43、vue 事件中如何使用 event 对象?
获取事件对象，方法参数传递 $event 。注意在事件中要使用 $ 符号
<button @click="Event($event)">事件对象</button>

## 48、vue路由跳转
(一)声明式导航router-link
```html
不带参数：
// 注意：router-link中链接如果是'/'开始就是从根路由开始，如果开始不带'/'，则从当前路由开始。
<router-link :to="{name:'home'}">  
<router-link :to="{path:'/home'}"> //name,path都行, 建议用name 
//带参数：
<router-link :to="{name:'home', params: {id:1}}">
<router-link :to="{name:'home', query: {id:1}}">  
<router-link :to="/home/:id">  
//传递对象
<router-link :to="{name:'detail', query: {item:JSON.stringify(obj)}}"></router-link> 
```

(二)this.$router.push()
不带参数：
this.$router.push('/home')
this.$router.push({name:'home'})
this.$router.push({path:'/home'})

query传参
1.路由配置：
name: 'home',
path: '/home'
2.跳转：
this.$router.push({name:'home',query: {id:'1'}})
this.$router.push({path:'/home',query: {id:'1'}})
3.获取参数
html取参: $route.query.id
script取参: this.$route.query.id

params传参
1.路由配置：
name: 'home',
path: '/home/:id'(或者path: '/home:id')
2.跳转：
this.$router.push({name:'home',params: {id:'1'}})
注意：
// 只能用 name匹配路由不能用path
// params传参数(类似post)  路由配置 path: "/home/:id" 或者 path: "/home:id"否则刷新参数消失
3.获取参数
html取参:$route.params.id 
script取参:this.$route.params.id

直接通过path传参
1.路由配置：
name: 'home',
path: '/home/:id'
2.跳转：
this.$router.push({path:'/home/123'}) 
或者：
this.$router.push('/home/123') 
3.获取参数：
this.$route.params.id

params和query的区别
query类似 get，跳转之后页面 url后面会拼接参数，类似?id=1。
非重要性的可以这样传，密码之类还是用params，刷新页面id还在。
params类似 post，跳转之后页面 url后面不会拼接参数。
(三)this.$router.replace()
用法同上
(四)this.$router.go(n)

向前或者向后跳转n个页面，n可为正整数或负整数
区别:

this.$router.push
跳转到指定url路径，并在history栈中添加一个记录，点击后退会返回到上一个页面
this.$router.replace
跳转到指定url路径，但是history栈中不会有记录，点击返回会跳转到上上个页面 (就是直接替换了当前页面)
this.$router.go(n)
向前或者向后跳转n个页面，n可为正整数或负整数

## 49、Vue.js 双向绑定的原理
https://segmentfault.com/a/1190000021327394
Vue.js 2.0 采用数据劫持（Proxy 模式）结合发布者-订阅者模式（PubSub 模式）的方式，通过 Object.defineProperty()来劫持各个属性的 setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。



每个组件实例都有相应的watcher程序实例，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的setter被调用时，会通知watcher重新计算，从而致使它关联的组件得以更新。

Vue实现数据双向绑定主要利用的就是: **数据劫持**和**发布订阅模式**。  
所谓发布订阅模式就是，定义了对象间的一种**一对多的关系**，**让多个观察者对象同时监听某一个主题对象，当一个对象发生改变时，所有依赖于它的对象都将得到通知**。  
所谓数据劫持，就是**利用JavaScript的访问器属性**，即**Object.defineProperty()方法**，当对对象的属性进行赋值时，Object.defineProperty就可以**通过set方法劫持到数据的变化**，然后**通知发布者(主题对象)去通知所有观察者**，观察者收到通知后，就会对视图进行更新
![[Pasted image 20220619172637.png]]
如上图所示，View模板首先经过**Compiler(编译器对象)进行编译**，在编译的过程中，**会分析模板中哪里使用到了Vue数据(Model中的数据)**，**一旦使用到了Vue数据(Model中的数据)，就会创建一个Water(观察者对象)**，并且将这个观察者对象添加到发布者对象的数组中，同时获取到Vue中的数据替换编译生成一个新的View视图。  
在创建Vue实例的过程中，会对Vue data中的数据进行数据劫持操作，即将data上的属性都通过Object.definePropery()的方式代理到Vue实例上，**当View视图或者Vue Model中发生数据变化的时候，就会被劫持，然后通知Dep发布者对象进行视图的更新**，从而实现数据的双向绑定。

总之就是，在创建Vue实例的时候给传入的data进行数据劫持，同时视图编译的时候，对于使用到data中数据的地方进行创建Watcher对象，然后在数据劫持的getter中添加到发布者对象中，当劫持到数据发生变化的时候，就通过发布订阅模式以回调函数的方式通知所有观察者操作DOM进行更新，从而实现数据的双向绑定。

Vue.js 3.0, 放弃了Object.defineProperty ，使用更快的ES6原生 Proxy (访问对象拦截器, 也称代理器)
## 使用proxy代替defineProperty
熟悉vue的朋友都知道，vue2.x双向绑定的核心是`Object.defineProperty()`，那为什么要换掉呢，我们看看他们的语法就知道了。
`defineProperty`只能响应首次渲染时候的属性，`Proxy`需要的是整体，不需要关心里面有什么属性，而且`Proxy的配置项有13种`，可以做更细致的事情，这是之前的`defineProperty`无法达到的

### 2.2.1- Object.defineProperty()语法

重点：vue为什么对数组对象的深层监听无法实现，因为组件每次渲染都是将data里的数据通过`defineProperty`进行响应式或者双向绑定上，之前没有后加的属性是不会被绑定上，也就不会触发更新渲染

  
作者：@baby张  
链接：https://juejin.cn/post/6892295955844956167  
来源：稀土掘金  
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

## 50、Computed和Watch的区别

computed 计算属性 : 依赖其它属性值,并且 computed 的值有缓存,只有它依赖的 属性值发生改变,下一次获取 computed 的值时才会重新计算 computed 的值。

watch 侦听器 : 更多的是观察的作用,无缓存性,类似于某些数据的监听回调,每 当监听的数据变化时都会执行回调进行后续操作。

运用场景：

当我们需要进行数值计算,并且依赖于其它数据时,应该使用 computed,因为可以利用 computed的缓存特性,避免每次获取值时,都要重新计算。
当我们需要在数据变化时执行异步或开销较大的操作时,应该使用 watch,使用 watch 选项允许我们执行异步操作 ( 访问一个 API ),限制我们执行该操作的频率, 并在我们得到最终结果前,设置中间状态。这些都是计算属性无法做到的。
多个因素影响一个显示，用Computed；一个因素的变化影响多个其他因素、显示，用Watch;
Computed 和 Methods 的区别

computed: 计算属性是基于它们的依赖进行缓存的,只有在它的相关依赖发生改变时才会重新求值对于 method ，只要发生重新渲染，
method 调用总会执行该函数
## 51、过滤器 (Filter)
在Vue中使用filters来过滤(格式化)数据，filters不会修改数据，而是过滤(格式化)数据，改变用户看到的输出（计算属性 computed ，方法 methods 都是通过修改数据来处理数据格式的输出显示。
使用场景： 比如需要处理时间、数字等的的显示格式；
## 52、axios是什么
易用、简洁且高效的http库， 支持node端和浏览器端，支持Promise，支持拦截器等高级配置。

## 53、sass是什么？如何在vue中安装和使用？
sass是一种CSS预编译语言安装和使用步骤如下。

用npm安装加载程序（ sass-loader、 css-loader等加载程序)。
在 webpack.config.js中配置sass加载程序。
## 54、Vue.js页面闪烁
Vue. js提供了一个v-cloak指令，该指令一直保持在元素上，直到关联实例结束编译。当和CSS一起使用时，这个指令可以隐藏未编译的标签，直到实例编译结束。用法如下。
```
	[v-cloak]{ 
	 display:none; 
	} 
	<div v-cloak>{{ title }}</div>
```

## 55、如何解决数据层级结构太深的问题
在开发业务时，经常会岀现异步获取数据的情况，有时数据层次比较深，如以下代码: span 'v-text="a.b.c.d">, 可以使用vm.$set手动定义一层数据: vm.$set("demo"，a.b.c.d)
## 56、vue常用指令
v-model 多用于表单元素实现双向数据绑定（同angular中的ng-model）
v-bind 动态绑定 作用： 及时对页面的数据进行更改
v-on:click 给标签绑定函数，可以缩写为@，例如绑定一个点击函数 函数必须写在methods里面
v-for 格式： v-for=“字段名 in(of) 数组json” 循环数组或json(同angular中的ng-repeat)
v-show 显示内容 （同angular中的ng-show）
v-hide 隐藏内容（同angular中的ng-hide）
v-if 显示与隐藏 （dom元素的删除添加 同angular中的ng-if 默认值为false）
v-else-if 必须和v-if连用
v-else 必须和v-if连用 不能单独使用 否则报错 模板编译错误
v-text 解析文本
v-html 解析html标签
v-bind:class 三种绑定方法
对象型 ‘{red:isred}’
三元型 ‘isred?“red”:“blue”’
数组型 ‘[{red:“isred”},{blue:“isblue”}]’
v-once 进入页面时 只渲染一次 不在进行渲染
v-cloak 防止闪烁
v-pre 把标签内部的元素原位输出
## 57、$route和$router的区别
$route是“路由信息对象”，包括path，params，hash，query，fullPath，matched，name等路由信息参数。
$router是“路由实例”对象包括了路由的跳转方法，钩子函数等
## 58、怎样理解 Vue 的单项数据流
数据总是从父组件传到子组件，子组件没有权利修改父组件传过来的数据，只能请求父组件对原始数据进行修改。这样会防止从子组件意外改变父组件的状态，从而导致你的应用的数据流向难以理解。
注意：在子组件直接用 v-model 绑定父组件传过来的 props 这样是不规范的写法，开发环境会报警告。
如果实在要改变父组件的 props 值可以再data里面定义一个变量，并用 prop 的值初始化它，之后用$emit 通知父组件去修改。
## 59、虚拟DOM是什么？有什么优缺点？
由于在浏览器中操作DOM是很昂贵的。频繁操作DOM，会产生一定性能问题。这就是虚拟Dom的产生原因。Vue2的Virtual DOM 借鉴了开源库 snabbdom 的实现。Virtual DOM本质就是用一个原生的JS对象去描述一个DOM节点，是对真实DOM的一层抽象。

优点：
1、保证性能下限：框架的虚拟DOM需要适配任何上层API可能产生的操作，他的一些DOM操作的实现必须是普适的，所以它的性能并不是最优的；但是比起粗暴的DOM操作性能要好很多，因此框架的虚拟DOM至少可以保证在你不需要手动优化的情况下，依然可以提供还不错的性能，既保证性能的下限。
2、无需手动操作DOM：我们不需手动去操作DOM，只需要写好 View-Model的 代码逻辑，框架会根据虚拟DOM和数据双向绑定，帮我们以可预期的方式更新视图，极大提高我们的开发效率。
3、跨平台：虚拟DOM本质上是JavaScript对象，而DOM与平台强相关，相比之下虚拟DOM可以进行更方便地跨平台操作，例如服务器端渲染、weex开发等等。
缺点：
1、无法进行极致优化：虽然虚拟DOM + 合理的优化，足以应对大部分应用的性能需要，但在一些性能要求极高的应用中虚拟DOM无法进行针对性的极致优化。
2、首次渲染大量DOM时，由于多了一层DOM计算，会比innerHTML插入慢。
## 60、Vuex 页面刷新数据丢失怎么解决？
需要做 vuex 数据持久化，一般使用本地储存的方案来保存数据，可以自己设计存储方案，也可以使用第三方插件。
推荐使用 vuex-persist (脯肉赛斯特)插件，它是为 Vuex 持久化储存而生的一个插件。不需要你手动存取 storage，而是直接将状态保存至 cookie 或者 localStorage中。
## 61、Vuex 为什么要分模块并且加命名空间？

模块： 由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能会变得相当臃肿。为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块。
命名空间： 默认情况下，模块内部的 action、mutation、getter是注册在全局命名空间的 — 这样使得多个模块能够对同一 mutation 或 action 做出响应。如果希望你的模块具有更高的封装度和复用性，你可以通过添加 namespaced:true 的方式使其成为带命名的模块。当模块被注册后，他所有 getter、action、及 mutation 都会自动根据模块注册的路径调整命名。

## 62、vue 中使用了哪些设计模式
1、工厂模式 - 传入参数即可创建实例
虚拟 DOM 根据参数的不同返回基础标签的 Vnode 和组件 Vnode。
2、单例模式 - 整个程序有且仅有一个实例
vuex 和 vue-router 的插件注册方法 install 判断如果系统存在实例就直接返回掉。
3、发布-订阅模式。（vue 事件机制）
4、观察者模式。（响应式数据原理）
5、装饰器模式（@装饰器的用法）
6、策略模式，策略模式指对象有某个行为，但是在不同的场景中，该行为有不同的实现方案 - 比如选项的合并策略。
## 63、你都做过哪些 Vue 的性能优化？
这里只列举针对 Vue 的性能优化，整个项目的性能优化是一个大工程。

对象层级不要过深，否则性能就会差。
不需要响应式的数据不要放在 data 中（可以使用 Object.freeze() 冻结数据）
v-if 和 v-show 区分使用场景
computed 和 watch 区分场景使用
v-for 遍历必须加 key，key最好是id值，且避免同时使用 v-if
大数据列表和表格性能优化 - 虚拟列表 / 虚拟表格
防止内部泄露，组件销毁后把全局变量和时间销毁
图片懒加载
路由懒加载
异步路由
第三方插件的按需加载
适当采用 keep-alive 缓存组件
防抖、节流的运用
服务端渲染 SSR or 预渲染
## 64、Vue.set 方法原理
在两种情况下修改 Vue 是不会触发视图更新的。

1、在实例创建之后添加新的属性到实例上（给响应式对象新增属性）
2、直接更改数组下标来修改数组的值。
Vue.set 或者说是 $set 原理如下
因为响应式数据 我们给对象和数组本身新增了__ob__属性，代表的是 Observer 实例。当给对象新增不存在的属性，首先会把新的属性进行响应式跟踪 然后会触发对象 ob 的dep收集到的 watcher 去更新，当修改数组索引时我们调用数组本身的 splice 方法去更新数组。
## 65、函数式组件使用场景和原理
函数式组件与普通组件的区别

1、函数式组件需要在声明组件时指定 functional:true
2、不需要实例化，所以没有this，this通过render函数的第二个参数context代替
3、没有生命周期钩子函数，不能使用计算属性，watch
4、不能通过$emit对外暴露事件，调用事件只能通过context.listeners.click的方式调用外部传入的事件
5、因为函数组件时没有实例化的，所以在外部通过ref去引用组件时，实际引用的是HTMLElement
6、函数式组件的props可以不用显示声明，所以没有在props里面声明的属性都会被自动隐式解析为prop，而普通的组件所有未声明的属性都解析到$attrs里面，并自动挂载到组件根元素上（可以通过inheritAttrs属性禁止）
优点：1.由于函数组件不需要实例化，无状态，没有生命周期，所以渲染性要好于普通组件2.函数组件结构比较简单，代码结构更清晰

使用场景：

一个简单的展示组件，作为容器组件使用 比如 router-view 就是一个函数式组件。 “高阶组件”—用于接受一个组件为参数，返回一个被包装过的组件。
相关代码如下：
if (isTrue(Ctor.options.functional)) { // 带有functional的属性的就是函数式组件 return createFunctionalComponent(Ctor, propsData, data, context, children); } const listeners = data.on; data.on = data.nativeOn; installComponentHooks(data); // 安装组件相关钩子 （函数式组件没有调用此方法，从而性能高于普通组件）


## 67、vue项目创建。路由配置、环境配置以及组件传值等

## Vue.nextTick()原理
nextTick 是下次 DOM 更新循环结束后执行延迟回调。
todo
https://www.mdnice.com/writing/440b1ac98b4d44589326e9a9e427187c


## todo
源码：虚拟dom，双向绑定
vue3 proxy
类mvvm
用到的设计模式
过一下router


