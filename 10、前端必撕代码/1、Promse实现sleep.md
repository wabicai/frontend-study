```JS
//Promise实现Sleep函数
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function test() {
  console.log(new Date());
  await sleep(3000);
  console.log(new Date());
}
test();
console.log('continue execute！');
```

@[TOC]

>sleep函数作用是让线程休眠，等到指定时间在重新唤起。

# 方法一：伪死循环阻塞主线程

这种实现方式是利用一个**伪死循环阻塞主线程**。因为JS是单线程的。所以通过这种方式可以实现真正意义上的sleep()。

```javascript
function sleep(delay) {
  var start = (new Date()).getTime();
  while ((new Date()).getTime() - start < delay) {
    continue;
  }
}

function test() {
  console.log('111');
  sleep(2000);
  console.log('222');
}

test()

```

# 方法二：定时器

```javascript
    function sleep1(ms, callback) {
        setTimeout(callback, ms)
    }
    //sleep 1s
    sleep1(1000, () => {
        console.log(1000)
    })
	
```

# 方法三：es6异步处理(Promise)

```javascript
    const sleep = (time) => {
        return new Promise(resolve => setTimeout(resolve, time))
    }
    sleep(1000).then(() => {
        console.log(1)
    })
```

# 方法四：es7---- async/await

async/await是基于Promise的，是进一步的一种优化

```javascript
    function sleep(time) {
        return new Promise(resolve =>
            setTimeout(resolve, time)
        )
    }
    async function output() {
        let out = await sleep(1000);
        console.log(1);
        return out;
    }
    output();
```