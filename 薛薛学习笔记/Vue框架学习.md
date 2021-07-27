# Vue

## 基础

### 实例化对象

```js
var vm = new Vue({
    el: '#vue_det',
    data = {
      site: "菜鸟教程",
      url: "www.runoob.com",
      alexa: 10000
    }
})
```

### 模板语法

#### 插值

```html
<body>
<div id="app">
    <div v-html="message"></div>
</div>
	
<script>
new Vue({
  el: '#app',
  data: {
    message: '<h1>小A小A</h1><br><h1>小A小A</h1><h1>小A小A</h1><h1>小A小A</h1>'
  }
})
</script>
</body>
```

<img src="C:\Users\Ocean\AppData\Roaming\Typora\typora-user-images\image-20210314221937192.png" alt="image-20210314221937192" style="zoom:50%;" />



数据插值使用双大括号 {{ message }}

```html
<div id="app" v-once>
	{{msg}}
</div>
```

如果在标签加入 **v-once** 则标签内的元素只能被修改一次 



#### 属性

HTML 属性中的值应使用 v-bind 指令。

以下实例判断 use 的值，如果为 true 使用 class1 类的样式，否则不使用该类：

```html
<div id="app">
  <label for="r1">修改颜色</label><input type="checkbox" v-model="use" id="r1">
  <br><br>
  <div v-bind:class="{'class1': use}">
    v-bind:class 指令
  </div>
</div>
    
<script>
new Vue({
    el: '#app',
  data:{
      use: false
  }
});
</script>
```

一般我在写项目的时候都会将 **v-bind:class** 写成 **:class** 更加简介一些 代码质量更高

表达式

Vue.js 都提供了完全的 JavaScript 表达式支持。

```html
<div id="app">
    {{5+5}}<br>
    {{ ok ? 'YES' : 'NO' }}<br>
    {{ message.split('').reverse().join('') }}
    <div v-bind:id="'list-' + id">菜鸟教程</div>
</div>
    
<script>
new Vue({
  el: '#app',
  data: {
    ok: true,
    message: 'RUNOOB',
    id : 1
  }
})
</script>
```



#### 指令

指令是带有 v- 前缀的特殊属性。

指令用于在表达式的值改变时，将某些行为应用到 DOM 上。如下例子：

```html
<div id="app">
    <p v-if="seen">现在你看到我了</p>
</div>
    
<script>
new Vue({
  el: '#app',
  data: {
    seen: true
  }
})
</script>
```



#### 参数

参数在指令后以冒号指明。例如， v-bind 指令被用来响应地更新 HTML 属性：

```html
<div id="app">
    <pre><a v-bind:href="url">菜鸟教程</a></pre>
</div>
    
<script>
new Vue({
  el: '#app',
  data: {
    url: 'http://www.runoob.com'
  }
})
</script>
```



#### 修饰符

修饰符是以半角句号 **.** 指明的特殊后缀，用于指出一个指令应该以特殊方式绑定。例如，**.prevent** 修饰符告诉 **v-on** 指令对于触发的事件调用 **event.preventDefault()**：

```html
<form v-on:submit.prevent="onSubmit"></form>
```



#### 用户输入

在 input 输入框中我们可以使用 v-model 指令来实现双向数据绑定：

```html
<div id="app">
    <p>{{ message }}</p>
    <input v-model="message">
</div>
    
<script>
new Vue({
  el: '#app',
  data: {
    message: 'Runoob!'
  }
})
</script>
```





#### 过滤器

Vue.js 允许你自定义过滤器，被用作一些常见的文本格式化。由"管道符"指示, 格式如下：

```html
<!-- 在两个大括号中 -->
{{ message | capitalize }}

<!-- 在 v-bind 指令中 -->
<div v-bind:id="rawId | formatId"></div>
```

```html
<body>
<div id="app">
  {{ message | capitalize }}
</div>
	
<script>
new Vue({
  el: '#app',
  data: {
	message: 'runoob'
  },
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
})
</script>
</body>
```

可以创造全局的过滤器也可以创造一个组件的过滤器，过滤器可以串联   {{ message | filterA | filterB }}



### freeze

vue 如果不想让一个属性随着绑定改变 那就使用 **Object.freeze()**

```js
var obj = {
  foo: 'bar'
}

Object.freeze(obj)

new Vue({
  el: '#app',
  data: obj
})
```

```html
<div id="app">
  <p>{{ foo }}</p>
  <!-- 这里的 `foo` 不会更新！ -->
  <button v-on:click="foo = 'baz'">Change it</button>
</div>
```

 

### watch

顾名思义 这个方法的用处是监听某一个属性

```html
<script type="text/javascript">
var data = { a : 1 };
var vm = new Vue({
	el   : "#app",
	data : data
});

vm.$watch('a', function(newVal, oldVal){
	console.log(newVal, oldVal);
})

vm.$data.a = "test...."

</script>
```

当 a 的值变化时 控制台打印出变化后和变化前的属性值，监听数据变化的方法。



### **computed** 

**computed** 与 **watch** 类似 如果数据要通过复杂逻辑来得出结果，那么就推荐使用计算属性

- 如果一个数据需要经过复杂计算就用 computed
- 如果一个数据需要被监听并且对数据做一些操作就用 watch

```js
var vm = new Vue({
  el: '#app',
  data: {
    message: 'hello'
  },
  template: `
  <div>
  <p>我是原始值: "{{ message }}"</p>
  <p>我是计算属性的值: "{{ computedMessage}}"</p> // computed 在 DOM 里直接使用不需要调用
  </div>
  `,
  computed: {
    // 计算属性的 getter
    computedMessage: function () {
      // `this` 指向 vm 实例
      return this.message.split('').reverse().join('')
    }
  }
})
```



### 生命周期钩子

比如 [`created`](https://cn.vuejs.org/v2/api/#created) 钩子可以用来在一个实例被创建之后执行代码：

```js
new Vue({
  data: {
    a: 1
  },
  created: function () {
    // `this` 指向 vm 实例
    console.log('a is: ' + this.a)
  }
})
// => "a is: 1"
```



在一个实例被创建的过程中存在许多生命周期，更多的生命周期查看文档，这里只是举了一个created的例子，生命周期写在实例对象的属性内，function 内不许使用箭头函数。



### vue事件冒泡

阻止事件冒泡例如两个 div 嵌套 绑定了@click 事件 最便捷的方式是在最里层的 click后面加一个.stop。

```html
	<div @click="click1">
		<div @click.stop="click2">
			click me
		</div>
	</div>
```

当内部的 click2 事件执行完过后就会立即停止，不会产生事件冒泡



### 动态绑定样式

在绑定标签元素的动态样式时，如果需要通过判断变量的真假值来决定是否渲染时，class 外面要为对象的形式，如：

```html
	<div 
	class="test" 
	v-bind:class="{isActive : active}" 
	style="width:200px; height:200px; text-align:center; line-height:200px;">
		hi vue
	</div>
```

```js
var vm = new Vue({
	el : "#app",
	data : {
		isActive : true,
		isGreen : true,
		color : "#FFFFFF",
		size : '50px',
		isRed : true
	}
});
```

如果在绑定样式 class 时 需要用到三目运算符来判断如何渲染时，class 外面要为数组的形式，如：

```html
	<div 
	class="test" 
	v-bind:class="[isActive ? 'active' : 'green']" 
	style="width:200px; height:200px; text-align:center; line-height:200px;">
		hi vue
	</div>
```

其中 active 和 green 已经在 style 标签中定义对应的样式 isActive 为布尔类型变量。



**style  动态绑定**时对象里面的值是字符串类型，如果需要判断三目运算符 最外的括号为对象。

```html
	<div 
	:style="{color:color, fontSize:size, background: isRed ? '#FF0000' : ''}">
		hi vue
	</div>
```

```js
var vm = new Vue({
	el : "#app",
	data : {
		isActive : true,
		isGreen : true,
		color : "#FFFFFF",
		size : '50px',
		isRed : true
	}
});
```



### 条件渲染	

**v-if** 和 **v-show**

学完条件渲染说说我个人的理解，如果在使用页面过程中需要变换渲染的次数很多 建议使用 v-show , 如果只是在页面加载时或者是在运行中很少切换渲染的 我们推荐使用 v-if ，v-if 是真正的条件渲染，v-show 只是简单切换 display 样式 ，标签存在于DOM中。

```html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```



```html
<h1 v-show="ok">Hello!</h1>
```

用法大致相同



### 列表渲染

**v-for**

列表渲染在我们开发前端的过程中是十分重要并且常用的，例如在项目博客中，后台会返回一个数组里面是每一条博客的信息，此时我们就需要使用 v-for 遍历整个数组 在页面上显示出用户想要看到的内容 ， 遍历对象和数组的写法稍有不同，将在下方列举：

遍历数组例子

```html
<ul id="example-1">
  <li v-for="(item, index) in exampleLi" :key="index">
    {{ item.message }}
  </li>
</ul>
```

```js
var example1 = new Vue({
  el: '#example-1',
  data: {
    exampleLi: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
```

这里 item 是每个遍历的对象，index 对应索引，绑定索引值给 key 能提高遍历的效率 

遍历对象例子

```html
<ul id="v-for-object" class="demo">
  <li v-for="value in object">
    {{ value }}
  </li>
</ul>
```

```js
new Vue({
  el: '#v-for-object',
  data: {
    object: {
      title: 'How to do lists in Vue',
      author: 'Jane Doe',
      publishedAt: '2016-04-10'
    }
  }
})
```



### 事件处理

按钮的事件我们可以使用 v-on 监听事件，并对用户的输入进行响应。

如果处理的 JS 事件较为简单，也可以直接写在 v-on 的函数中

```html
 <button v-on:click="counter += 1">Add 1</button>
```

以下实例在用户点击按钮后对字符串进行反转操作：

```html
<div id="app">
    <p>{{ message }}</p>
    <button v-on:click="reverseMessage">反转字符串</button>
</div>
    
<script>
new Vue({
  el: '#app',
  data: {
    message: 'Runoob!'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
</script>
```

可以将 **v-on:click** 改为 **@click** 更加简洁， 代码质量更高



有时也需要在内联语句处理器中访问原始的 DOM 事件。可以用特殊变量 `$event` 把它传入方法

```html
<button v-on:dblclick="greet('abc', $event)">Greet</button>
```

```js
var vm = new Vue({
	el : "#app",
	data : {
		counter: 0,
		name : "vue"
	},
	methods:{
		greet : function (str, e) {
			alert(str);
			console.log(e);
		}
	}
});
```

<img src="C:\Users\Ocean\AppData\Roaming\Typora\typora-user-images\image-20210316125345514.png" alt="image-20210316125345514" style="zoom:67%;" />	控制台输出的对象



### 表单输入绑定

input checkbox radio 例子

```html
<body>
<div id="app">
	<div id="example-1">
		<input v-model="message" placeholder="edit me">
		<p>Message is: {{ message }}</p>
		<textarea v-model="message2" placeholder="add multiple lines"></textarea>
		<p style="white-space: pre-line;">{{ message2 }}</p>
		<br />
		
		<div style="margin-top:20px;">
			<input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
			<label for="jack">Jack</label>
			<input type="checkbox" id="john" value="John" v-model="checkedNames">
			<label for="john">John</label>
			<input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
			<label for="mike">Mike</label>
			<br>
			<span>Checked names: {{ checkedNames }}</span>
		</div>
		
		<div style="margin-top:20px;">
			<input type="radio" id="one" value="One" v-model="picked">
			<label for="one">One</label>
			<br>
			<input type="radio" id="two" value="Two" v-model="picked">
			<label for="two">Two</label>
			<br>
			<span>Picked: {{ picked }}</span>
		</div>
		<button type="button" @click="submit">提交</button>
	</div>
	
</div>
<script type="text/javascript">
var vm = new Vue({
	el : "#app",
	data : {
		message : "test",
		message2 :"hi",
		checkedNames : ['Jack', 'John'],
		picked : ""
	},
	methods: {
		submit : function () {
			console.log(this.message);
			
		}
	}
});
</script>
```

![image-20210316130225684](C:\Users\Ocean\AppData\Roaming\Typora\typora-user-images\image-20210316130225684.png)	在实际操作的过程中，各个数据都能够于 data内的数据进行双向绑定。

在文本区域插值 (`<textarea>{{text}}</textarea>`) 并不会生效，应用 `v-model` 来代替。



## 组件

经常重复的封装成组件，便捷

#### 引入和使用

```js
Vue.component('button-counter', {
	props: ['title'],
	data: function () {
		return {
		  count: 0
		}
	},
	template: '<div><h1>hi...</h1><button v-on:click="clickfun">{{title}} You clicked me {{ count }} times.</button><slot></slot></div>',
	methods:{
		clickfun : function () {
			this.count ++;
			this.$emit('clicknow', this.count);
		}
	}
})
var vm = new Vue({
	el : "#app",
	data : {
		
	},
	methods:{
		clicknow : function (e) {
			console.log(e);
		}
	}
});
```

```html
<div id="app">
	<button-counter title="title1 : " @clicknow="clicknow">
		<h2>hi...h2</h2>
	</button-counter>
	<button-counter title="title3 : "></button-counter>
</div>
```

用 Vue.components 为全局注册

props 为传递给组件的属性值

template 为在页面显示的html标签，可以使用slot插槽在父标签插入想要的内容

this.$emit 为监听函数，后面第一个参数为 事件名称 第二个参数可以携带想要的参数，在父标签写@事件名称=“函数名” ，在Vue 的对象实例里面写入对应的方法。如上示例



#### 局部注册组件

```js
var vm = new Vue({
	el : "#app",
	data : {
		
	},
	methods:{
		clicknow : function (e) {
			console.log(e);
		}
	},
	components:{
		test : {
			template:"<h2>h2...</h2>"
		}
	}
});
```

在引入一个新的Vue对象实例时就注册组件，该组件就是局部组件，和全局组件用法类似。



单文件组件 安装 vue - cli 脚手架后 你可以快速的使用 vue ui 命令行创建你自己的项目 ，创建后使用组件的过程为这样：

此处是引入组件的页面写法

```html
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>
```

组件内部是这样子的：

```html
<template>
	<div>
		<h1>{{ msg }}</h1>
	</div>
</template>

<script>
	export default {
		name: 'HelloWorld',
		props: {
			msg: {
				type: String,
				default: "123"
			}
		},
		methods: {},
		data() {
			return {

			}
		}
	}
</script>
```

我来理解一下，使用局部组件会带来更快的运行速度和感觉，麻烦的地方就是在使用页面需要引入组件和注册。



## 路由

### 引入路由

可以通过 https://unpkg.com/vue-router/dist/vue-router.js 直接下载在Script 中引入

也可以通过命令行 cnpm install vue-router 



### 实例

Vue.js + vue-router 可以很简单的实现单页应用。

**<router-link>** 是一个组件，该组件用于设置一个导航链接，切换不同 HTML 内容。 **to** 属性为目标地址， 即要显示的内容。

以下实例中我们将 vue-router 加进来，然后配置组件和路由映射，再告诉 vue-router 在哪里渲染它们。代码如下所示

```html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>

<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- 使用 router-link 组件来导航. -->
    <!-- 通过传入 `to` 属性指定链接. -->
    <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
    <router-link to="/foo">Go to Foo</router-link>
    <router-link to="/bar">Go to Bar</router-link>
  </p>
  <!-- 路由出口 -->
  <!-- 路由匹配到的组件将渲染在这里 -->
  <router-view></router-view>
</div>
```

```js
// 0. 如果使用模块化机制编程，导入Vue和VueRouter，要调用 Vue.use(VueRouter)

// 1. 定义 (路由) 组件。
// 可以从其他文件 import 进来
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
// 我们晚点再讨论嵌套路由。
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
const app = new Vue({
  router
}).$mount('#app')

// 现在，应用已经启动了！
```

