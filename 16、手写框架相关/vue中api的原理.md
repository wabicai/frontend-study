### watch&&computed

#### computed

1. computed 属性值默认会**缓存**计算结果，在重复的调用中，只要依赖数据不变，直接取缓存中的计算结果，只有**依赖型数据**发生**改变**，computed 才会重新计算；
2.  computed中的成员可以只定义一个函数作为只读属性, 也可以定义成 get/set变成可读写属性, 但是methods中的成员没有这样的。

#### watch

1. 可以看作是 computed 和 methods 的结合体；
2. 支持**异步**
3. **不支持缓存**
4. 可以监听**data，props，computed**内的数据；



### 