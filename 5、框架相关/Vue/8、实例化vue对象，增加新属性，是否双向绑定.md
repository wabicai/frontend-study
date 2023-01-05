https://blog.csdn.net/m0_46212240/article/details/104954510

## 数组触发视图更新，哪些不可以，解决办法？

`push()、pop()、shift()、unshift()、splice()、sort()、reverse()`  **这些方法会改变被操作的数组**；
`filter()、concat()、slice()`  **这些方法不会改变被操作的数组，返回一个新的数组**。**以上方法都可以触发视图更新。**
**利用索引直接设置一个数组项**，例： `this.array[index]=newValue`

**直接修改数组的长度**，例： `this.array.length=newLength`

**以上两种方法不可以触发视图更新**；
可以用 `this.$set(this.array,index,newValue)` 或 `this.array.splice(index,1,newValue)` 解決方法 1
可以用 `this.array.splice(newLength)` 解决方法 2
