```js
    class EventBus {
        constructor() {
            this.events = {}
        }

        // 发送信息
        emit(name, ...args) {
            const event = this.events[name]
            if (!event) return console.error('没有这个事件');
            event.forEach(item => item.apply(this, args))
            return this
        }

        // 实现监听
        on(name, listener) {
            if (Array.isArray(name)) {
                for (let index = 0; index < name.length; index++) {
                    this.on(name[i], listener)
                }
            } else {
                if (!this.events[name]) {
                    this.events[name] = []
                }
                this.events[name].push(listener);
            }
            return this
        }

        // 执行一次
        once(name, listener) {
            const func = (...args) => {
                listener.apply(this, args)
                this.off(name, func)
                // console.log(this, 'insidethis');
            }
            // console.log(this, 'outthis');
            this.on(name, func)
            return this
        }

        // 注销监听,这样可以实现传入一个数组。批量注销监听
        off(name) {
            if (Array.isArray(name)) {
                for (let index = 0; index < name.length; index++) {
                    this.off(name)
                }
            } else {
                if (this.events[name]) {
                    delete this.events[name];
                }
            }
            return this
        }

    }
    const add = (a, b) => console.log(a + b);
    const log = (...args) => console.log(...args);
    const event = new EventBus()
    // event.on('addFun', add)
    // event.on('logFun', log)
    // event.off('logFun')
    // event.emit('addFun', 1, 2)
    // event.emit('logFun', 'hi')
    event.once('onceAddFun', add) 
    event.emit('onceAddFun', 2, 3) //5 
    event.emit('onceAddFun', 2, 3) // m
    console.log(event);
```

