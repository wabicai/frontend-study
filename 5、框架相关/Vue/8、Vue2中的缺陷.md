https://blog.csdn.net/m0_46212240/article/details/104954510

# 实例化vue对象，增加新属性，是否双向绑定？
* 虽然我们通过Object.defineProperty方法实现了对object数据的可观测，但是这个方法仅仅只能观测到object数据的取值及设置值
* 当我们向object数据里添加一对新的key/value或删除一对已有的key/value时，它是无法观测到的
* 导致当我们对object数据添加或删除值时，无法通知依赖，无法驱动视图进行响应式更新。
* 

## 数组触发视图更新，哪些不可以，解决办法？

### 以下两种方法不可以触发视图更新

**利用索引直接设置一个数组项**，例： `this.array[index]=newValue`

**直接修改数组的长度**，例： `this.array.length=newLength`

### 解决方案

`push()、pop()、shift()、unshift()、splice()、sort()、reverse()`  **这些方法会改变被操作的数组**；
`filter()、concat()、slice()`  **这些方法不会改变被操作的数组，返回一个新的数组**。**以上方法都可以触发视图更新。**

可以用 `this.$set(this.array,index,newValue)` 或 `this.array.splice(index,1,newValue)`

可以用 `this.array.splice(newLength)`
