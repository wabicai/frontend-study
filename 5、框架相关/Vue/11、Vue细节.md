# key 的使用

## 两种 key

1. 使用 index
   1. 需要数据没有独立状态，不会进行增加/删除等影响后续元素 key 变化
   2. 利于 Vue 虚拟 DOM 原地复用节点
2. 使用 id
   1. 适用于单选框的列表数据
   2. 有独立状态的数据
   3. 效率会比较低，但是会比较精确的 diff

# v-for 和 v-if

- Vue2 中不要把这两个放在一个节点
  - 因为 v-for 优先级高，浪费性能
- Vue3 会把 v-if 提前，但是还是不建议放在一起
- 解决方案
  - template
  - v-if 提前
  - 使用 computed 控制显示节点

# v-model 和 .sync 修饰符

> 两者本质都是一样，并没有任何区别： “监听一个触发事件”="(val) => value = val"。

细微差异：

1. v-model 默认对应的是 input 或者 textarea 等组件的 input 事件，如果在子组件替换这个 input 事件，其本质和.sync 修饰符一模一样。比较单一，不能有多个
2. 一个组件可以多个属性用.sync 修饰符，可以同时"双向绑定多个“prop”，而并不像 v-model 那样，一个组件只能有一个。

使用场景：

1. v-model 针对更多的是最终操作结果，是双向绑定的结果，是 value，是一种 change 操作。比如：输入框的值、多选框的 value 值列表
2. sync 针对更多的是各种各样的状态，是状态的互相传递，是 status，是一种 update 操作。比如：组件 loading 状态、

```jsx
<input v-model="searchText" />

// 等价于
<input :value="searchText" @input="searchText = $event.target.value" />
// 组件上使用的时候
<CustomInput
	:modelValue="searchText"
	@update:modelValue="newValue => searchText = newValue"
/>
```
