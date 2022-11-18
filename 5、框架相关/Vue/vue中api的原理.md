## watch&&computed

### computed

1. computed 属性值默认会**缓存**计算结果，在重复的调用中，只要依赖数据不变，直接取缓存中的计算结果，只有**依赖型数据**发生**改变**，computed 才会重新计算；
2.  computed中的成员可以只定义一个函数作为只读属性, 也可以定义成 get/set变成可读写属性, 但是methods中的成员没有这样的。

### watch

1. 可以看作是 computed 和 methods 的结合体；
2. 支持**异步**
3. **不支持缓存**
4. 可以监听**data，props，computed**内的数据；

## keep-alive
> 用处：由列表页面进入数据详情页面，再返回该列表页面，我们希望：列表页面可以保留用户的筛选（或选中）状态。总的来说，keep-alive用于保存组件的渲染状态。
> keep-alive 缓存机制便是根据LRU策略来设置缓存组件新鲜度，将很久未访问的组件从缓存中删除。

1. 为什么keep-alive标签不会生成真正Dom节点
   1. abstract属性（抽象节点），根据这个属性跳过生成该实例

2. 使用LRU机制


https://juejin.cn/post/6862206197877964807

https://ustbhuangyi.github.io/vue-analysis/v2/extend/keep-alive.html#%E5%86%85%E7%BD%AE%E7%BB%84%E4%BB%B6

https://juejin.cn/post/6844903837770203144