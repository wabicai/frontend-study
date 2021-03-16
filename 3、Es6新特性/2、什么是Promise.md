@[TOC](目录)
# 一、什么是Promise

> Promise
> 是异步编程的一种解决方案：从语法上讲，promise是一个对象，从它可以获取异步操作的消息；从本意上讲，它是承诺，承诺它过一段时间会给你一个结果。promise有三种状态：
> **pending(等待态)，fulfiled(成功态)，rejected(失败态)**；状态一旦改变，就不会再变。创造promise实例后，它会立即执行。

## 为什么要用Promise
promise是用来解决两个问题的：

 1. 回调地狱，代码难以维护， 常常第一个的函数的输出是第二个函数的输入这种现象
 2. promise可以支持多个并发的请求，获取并发请求中的数据
- 另外
 3. promise可以解决异步的问题，本身不能说promise是异步的
 4. promise是一个对象，对象和函数的区别就是对象可以保存状态，函数不可以（闭包除外）
 5. 并未剥夺函数return的能力，因此无需层层传递callback，进行回调获取数据
 6. 代码风格，容易理解，便于维护
 7. 多个异步等待合并便于解决

# 二、promise的优缺点
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
>  1. 参数是一个promise实例；如果参数是promise实例，则不作修改，原样返回。
>  2. 参数是一个thenable对象，是指由then方法的对象；该方法会将这个对象转为promise对象，然后立即执行then方法。
>  3. 如果不是具有then方法的对象或者根本不是对象；如果参数是一个原始值，或者是一个不具有then方法的对象，则promise。resolve方法返回一个新的promise对象，状态为resolved
>  4. 不带有任何参数；如果不带有任何参数会直接返回一个resolved状态的promise对象。

下面先 new一个Promise
```javascript
let p = new Promise(function(resolve, reject){
		//做一些异步操作
		setTimeout(function(){
			console.log('执行完成Promise');
			resolve('要返回的数据可以任何数据例如接口返回数据');
		}, 2000);
	});
```

刷新页面会发现控制台过了**两秒**后直接打出 '**执行完成Promise**'

> 其执行过程是：执行了一个异步操作，也就是setTimeout，2秒后，输出“执行完成”，并且调用resolve方法。
>
> 注意！我只是new了一个对象，并没有调用它，我们传进去的函数就已经执行了，这是需要注意的一个细节。

所以我们**用Promise的时候一般是包在一个函数中，在需要的时候去运行这个函数**，如：

```javascript
<div onClick={promiseClick}>开始异步请求</div>
 
const promiseClick =()=>{
	 console.log('点击方法被调用')
	 let p = new Promise(function(resolve, reject){
		//做一些异步操作
		setTimeout(function(){
				console.log('执行完成Promise');
				resolve('要返回的数据可以任何数据例如接口返回数据');
			}, 2000);
		});
        return p
	}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210306115801745.png)
我们包装好的函数最后，**会return出Promise对象**，也就是说，执行这个函数我们得到了一个Promise对象。接下来就可以用Promise对象上有then、catch方法了，这就是Promise的强大之处了，

> **通过回调里的resolve(data)将这个promise标记为resolverd，然后进行下一步**
> **then((data)=>{//do  something})，resolve里的参数就是你要传入then的数据**

看下面的代码： 刷新页面的时候是没有任何反映的，但是点击后控制台打出

```javascript
promiseClick().then(function(data){
    console.log(data);
    //后面可以用传过来的数据做些其他操作
    //......
});
```
控制台：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210306115852927.png)
先是方法被调用，执行了promise，最后执行了promise的then方法，then方法是**一个函数接受一个参数**，参数是接受**resolve**（）里面的数据（就是说前面执行成功之后，“then”要怎样），就输出了‘**要返回的数据可以任何数据例如接口返回数据**’

你可能会觉得在这个和写一个回调函数没有什么区别；那么，如果有多层回调该怎么办？

如果callback也是一个异步操作，而且执行完后也需要有相应的回调函数，该怎么办呢？

总不能再定义一个callback2，然后给callback传进去吧。而Promise的优势在于，可以在then方法中继续写Promise对象并返回，然后继续调用then来进行回调操作。

- 所以：精髓在于：Promise只是能够简化层层回调的写法，而实质上，Promise的精髓是“状态”，用维护状态、传递状态的方式来使得回调函数能够及时调用，它比传递callback函数要简单、灵活的多。所以使用Promise的正确场景是这样的：

```javascript
    function timeout(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, ms, 'done');
        });
    }
    timeout(2000).then((value) => {
        console.log(value); //done
        return timeout(2000)
    }).then((value)=>{
        console.log(value);
    });
```
这样能够按顺序，就能隔两秒打印第一个done，然后再隔两秒再打印第二个done
>这里涉及到then的用法：then方法：then方法返回的是一个新的promise实例。
>**如果采用链式的then，可以指定一组按照次序调用的回调函数，如果前一个回调函数返回的是promise，后一个函数会等前一个状态发生改变才会调用。**
## reject的用法
以上是对promise的resolve用法进行了解释，相当于resolve是对promise成功时候的回调，它把promise的状态修改为fullfiled。
那么，reject就是失败的时候的回调，他把promise的状态修改为rejected，这样我们在then中就能捕捉到，然后执行“失败”情况的回调。

```javascript
    function promiseClick() {
        let p = new Promise(function (resolve, reject) {
            setTimeout(function () {
                var num = Math.ceil(Math.random() * 20); //生成1-10的随机数
                console.log('随机数生成的值：', num)
                if (num <= 10) {
                    resolve(num);
                } else {
                    reject('数字太于10了即将执行失败回调');
                }
            }, 2000);
        })
        return p
    }

    promiseClick().then(
        function (data) {
            console.log('resolved成功回调');
            console.log('成功回调接受的值：', data);
        },
        function (reason) {
            console.log('rejected失败回调');
            console.log('失败执行回调抛出失败原因：', reason);
        }
    );
```
执行结果
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210306141102540.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FidWFuZGVu,size_16,color_FFFFFF,t_70)

## 对resolve和reject的总结（特别重要）：
可以这样理解，在新建 promise 的时候就传入了两个参数

这两个参数用来标记 promise的状态的，这两个参数是两个方法，并且这两个参数可以随意命名，我这里的使用的是omg  也不影响使用用于表示 promise 的状态

到执行到 resolve()这个方法的时候，就改变promise的状态为fullfiled ，当状态为 fuulfiled的时候就可以执行.then()。

当执行到 reject()  这个方法的时候，就改变 promise 的状态为reject，当 promise 为reject 就可以.catch() 这个promise了。

然后这两个方法可以带上参数，用于.then() 或者 .catch() 中使用。

所以这两个方法不是替代，或者是执行什么，他们的作用就是 用于改变

promise 的状态。

然后，因为状态改变了，所以才可以执行相应的 .then() 和 .catch()操作。


##  其他用法
### catch的用法
我们知道Promise对象除了then方法，还有一个catch方法，它是做什么用的呢？其实它和then的第二个参数一样，用来指定reject的回调。用法是这样：

```javascript
p.then((data) => {
    console.log('resolved',data);
}).catch((err) => {
    console.log('rejected',err);
});复制代码
```
效果和写在then的第二个参数里面一样。不过它还有另外一个作用：在执行resolve的回调（也就是上面then中的第一个参数）时，如果抛出异常了（代码出错了），那么并不会报错卡死js，而是会进到这个catch方法中。

```javascript
    let p = new Promise((resolve, reject) => {
        //做一些异步操作
        setTimeout(function () {
            var num = Math.ceil(Math.random() * 10); //生成1-10的随机数
            if (num <= 5) {
                resolve(num);
            } else {
                reject('数字太大了');
            }
        }, 2000);
    });
    //前面和上面一样
    p.then((data) => {
            console.log('resolved', data);
            console.log(somedata); //此处的somedata未定义
        })
        .catch((err) => {
            console.log('rejected', err);
        });
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210306161323423.png)

在resolve的回调中，我们console.log(somedata);而somedata这个变量是没有被定义的。如果我们不用Promise，代码运行到这里就直接在控制台报错了，不往下运行了。但是在这里，会得到这样的结果：


也就是说进到catch方法里面去了，而且把错误原因传到了reason参数中。即便是有错误的代码也不会报错了，这与我们的try/catch语句有相同的功能

### all的用法：谁跑的慢，以谁为准执行回调。
- all接收一个数组参数，里面的值最终都算返回Promise对象

Promise的all方法提供了并行执行异步操作的能力，并且在所有异步操作执行完后才执行回调。看下面的例子：

```javascript
let Promise1 = new Promise(function(resolve, reject){})
let Promise2 = new Promise(function(resolve, reject){})
let Promise3 = new Promise(function(resolve, reject){})
 
let p = Promise.all([Promise1, Promise2, Promise3])
 
p.then(funciton(){
  // 三个都成功则成功  
}, function(){
  // 只要有失败，则失败 
})
```
有了all，你就可以并行执行多个异步操作，并且在一个回调中处理所有的返回数据，是不是很酷？有一个场景是很适合用这个的。
**一些游戏类的素材比较多的应用，打开网页时，预先加载需要用到的各种资源如图片、flash以及各种静态文件。所有的都加载完后，我们再进行页面的初始化。**

### race的用法：谁跑的快，以谁为准执行回调
race的使用场景：比如我们可以用race给某个异步请求设置超时时间，并且在超时后执行相应的操作，代码如下：

```javascript
 //请求某个图片资源
    function requestImg(){
        var p = new Promise((resolve, reject) => {
            var img = new Image();
            img.onload = function(){
                resolve(img);
            }
            img.src = '图片的路径';
        });
        return p;
    }
    //延时函数，用于给请求计时
    function timeout(){
        var p = new Promise((resolve, reject) => {
            setTimeout(() => {
                reject('图片请求超时');
            }, 5000);
        });
        return p;
    }
    Promise.race([requestImg(), timeout()]).then((data) =>{
        console.log(data);
    }).catch((err) => {
        console.log(err);
    });

```
requestImg函数会异步请求一张图片，我把地址写为"图片的路径"，所以肯定是无法成功请求到的。timeout函数是一个延时5秒的异步操作。我们把这两个返回Promise对象的函数放进race，于是他俩就会赛跑，如果5秒之内图片请求成功了，那么遍进入then方法，执行正常的流程。如果5秒钟图片还未成功返回，那么timeout就跑赢了，则进入catch，报出“图片请求超时”的信息。
### any
any方法：接收一组promise实例作为参数，只要有一个变为fulfilled状态，包装的实例就会变成fulfilled状态，如果所有的参数都变成rejected状态，就会变成rejected状态。
### try
try方法：在实际开发中遇到无法区分函数是同步还是异步操作时，但是还想用promise来处理，可以使用try方法。