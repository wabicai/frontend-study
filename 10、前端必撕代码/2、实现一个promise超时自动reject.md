```js
    const p1 = new Promise((resolve, reject) => {
        let test = fetch("http://www.rushmc.top/api/dynamicState/select/all").then(response => response
                .json()) //解析为可读数据
            .then(data => console.log(data))
        //执行结果是 resolve就调用then方法 
    })
    const p2 = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject("err啦")
        }, 2000);
    })
    Promise.race([p1, p2]).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    })
```

