@[TOC](目录)

# promise的优缺点

优点：

 1. 对象的状态不受外界的影响，只有异步操作的结果可以决定是那种状态；
 2.  状态一旦改变，就不会再次改变。任何时候都可以得到这个结果。在这里跟（event）事件不同，如果错过了这个事件结果再去监听，是监听不到event事件的。

缺点：

 1. promise一旦执行无法取消。 如果不设置回调函数promise内部抛出的错误，不会反映到外部。
 2.  当处于pending（进行中）的状态时，无法得知进行到那一阶段（刚开始或者即将完成）。

# 三、 怎么用Promise

## resolve的用法

> resolve方法：将现有对象转为promise对象，它的参数分为四种情况：
>
> 1. 参数是一个promise实例；如果参数是promise实例，则不作修改，原样返回。
> 2. 参数是一个thenable对象，是指有then方法的对象；该方法会将这个对象转为promise对象，然后立即执行then方法。
> 3. 如果不是具有then方法的对象或者根本不是对象；如果参数是一个原始值，或者是一个不具有then方法的对象，则promise。resolve方法返回一个新的promise对象，状态为resolved
> 4. 不带有任何参数；如果不带有任何参数会直接返回一个resolved状态的promise对象。

### 实现间隔两次两秒打印函数

```javascript
    function timeout(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, ms, 'done');
        });
    }
    timeout(2000).then((value) => {
        console.log(value); //done
        return timeout(2000)
    }).then((value) => {
        console.log(value);
    });
```
