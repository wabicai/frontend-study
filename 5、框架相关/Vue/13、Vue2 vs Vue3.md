1.  双向绑定原理不同
    vue2：
    - vue2的双向数据绑定是利用ES5的一个APIObject.definePropert() 对数据进行劫持，结合发布订阅模式的方式来实现的。

    vue3：
    - vue3中使用了ES6的Proxy API对数据代理。相比vue2.x，使用proxy的优势如下：
      - defineProperty只能监听某个属性，不能对全对象监听
      - 可以省去for in，闭包等内容来提升效率(直接绑定整个对象即可)
      - 可以监听数组，不用再去单独的对数组做特异性操作vue3.x可以检测到数组内部数据的变化。

2. 是否支持碎片
vue2：vue2不支持碎片。
vue3：vue3支持碎片（Fragments），就是说可以拥有多个根节点。

3. API类型不同
Vue2:选项型API（Options API）
Vue3:组合式API（Composition API）

4. 定义数据变量和方法不同
vue2：vue2是把数据放入data中，在vue2中定义数据变量是data(){}，创建的方法要在methods:{}中。
vue3：，vue3就需要使用一个新的setup()方法，此方法在组件初始化构造的时候触发。使用以下三个步骤来建立反应性数据： 
    1. 从vue引入reactive；
    2. 使用reactive() 方法来声明数据为响应性数据；
    3. 使用setup()方法来返回我们的响应性数据，从而template可以获取这些响应性数据。

5、生命周期钩子函数不同
vue2：vue2中的生命周期：

beforeCreate 组件创建之前
created 组件创建之后
beforeMount 组价挂载到页面之前执行
mounted 组件挂载到页面之后执行
beforeUpdate 组件更新之前
updated 组件更新之后

vue3：vue3中的生命周期：

setup 开始创建组件
onBeforeMount 组价挂载到页面之前执行
onMounted 组件挂载到页面之后执行
onBeforeUpdate 组件更新之前
onUpdated 组件更新之后
而且vue3.x 生命周期在调用前需要先进行引入。除了这些钩子函数外，vue3.x还增加了onRenderTracked 和onRenderTriggered函数。