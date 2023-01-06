# computed
1. computed 属性值默认会**缓存**计算结果，在重复的调用中，只要依赖数据不变，直接取缓存中的计算结果，只有**依赖型数据**发生**改变**，computed 才会重新计算；
2. computed 中的成员可以只定义一个函数作为只读属性, 也可以定义成 get/set 变成可读写属性, 但是 methods 中的成员没有这样的。

## 源码

1. 判断传入的computed为函数或者对象
2. 非服务器渲染情况才需要缓存
3. 使用监听者查看数据是否发生变化，并触发update等方法更新数据和视图

### initComputed

```js
function initComputed(vm: Component, computed: Object) {
    // 定义了一个变量watchers并将其赋值为空对象，同时将其作为指针指向vm._computedWatchers
    const watchers = vm._computedWatchers = Object.create(null)
    for (const key in computed) {
        const userDef = computed[key]
        // 如果是函数，则该函数默认为取值器getter，将其赋值给变量getter；
        // 如果不是函数，则说明是一个对象，则取对象中的get属性作为取值器赋给变量getter。
        const getter = typeof userDef === 'function' ? userDef : userDef.get
        if (process.env.NODE_ENV !== 'production' && getter == null) {
            warn(
                `Getter is missing for computed property "${key}".`,
                vm
            )
        }
    }
    // 如果不是在服务端渲染环境下，则创建一个watcher实例
    // 并将当前循环到的的属性名作为键，创建的watcher实例作为值存入watchers对象中。
    if (!isSSR) {
        // create internal watcher for the computed property.
        watchers[key] = new Watcher(
            vm,
            getter || noop,
            noop,
            computedWatcherOptions
        )
    }
    // 判断当前循环到的的属性名是否存在于当前实例vm上，如果存在，则在非生产环境下抛出警告；
    // 如果不存在，则调用defineComputed函数为实例vm上设置计算属性。
    if (!(key in vm)) {
        defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
        if (key in vm.$data) {
            warn(`The computed property "${key}" is already defined in data.`, vm)
        } else if (vm.$options.props && key in vm.$options.props) {
            warn(`The computed property "${key}" is already defined as a prop.`, vm)
        }
    }
}
```

### defineComputed

```js
export function defineComputed(target, key, userDef) {
    const shouldCache = !isServerRendering()
    if (typeof userDef === 'function') {
        sharedPropertyDefinition.get = shouldCache ?
            createComputedGetter(key) :
            userDef
        sharedPropertyDefinition.set = noop
    } else {
        sharedPropertyDefinition.get = userDef.get ?
            shouldCache && userDef.cache !== false ?
            createComputedGetter(key) :
            userDef.get :
            noop
        sharedPropertyDefinition.set = userDef.set ?
            userDef.set :
            noop
    }
}
```

### createComputedGetter

```js
function createComputedGetter(key) {
    // 最终get执行函数
    return function computedGetter() {
        const watcher = this._computedWatchers && this._computedWatchers[key]
        if (watcher) {
            watcher.depend()
            return watcher.evaluate()
        }
    }
}
```

### depend和evaluate

![](https://vue-js.com/learn-vue/assets/img/2.3828fb66.png)

# watch
1. 可以看作是 computed 和 methods 的结合体；
2. 支持**异步**，意味着可以做请求
3. **不支持缓存**
4. 可以监听**data，props，computed**内的数据；

## 源码

### createWatcher

```js
function createWatcher(
    vm: Component,
    expOrFn: string | Function,
    handler: any,
    options ? : Object
) {
    if (isPlainObject(handler)) {
        options = handler
        handler = handler.handler
    }
    if (typeof handler === 'string') {
        handler = vm[handler]
    }
    return vm.$watch(expOrFn, handler, options)
}
```

### $watch

属性：
1. immediate
2. deep
3. handler

```js
Vue.prototype.$watch = function(expOrFn, cb, options) {
    const vm: Component = this
    if (isPlainObject(cb)) {
        return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
        cb.call(vm, watcher.value)
    }
    return function unwatchFn() {
        watcher.teardown()
    }
}
```
