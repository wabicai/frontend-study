```js
    function request(options) {
        return new Promise((resolve, reject) => {
            const {
                url,
                timeout
            } = options
            let requestNode = document.createElement("script")
            //创建请求
            requestNode.src = url;
            // <script src="">
            Promise.race([setTimeout(function () {
                reject("没有返回数据")
            }, timeout), window.cb = result => {
                resolve(result)
            }])
			// js加载异常的情况
            jsNode.addEventListener('error', () => {
                delete window[callbackName]
                document.body.removeChild(jsNode)
                reject('JavaScript资源加载失败')
            }, false)
            // 添加js节点到document上时，开始请求
            document.body.appendChild(requestNode)
        })
    }

    request({
        url: "https://suggest.taobao.com/sug?code=utf-8&q=%E5%8D%AB%E8%A1%A3&callback=cb",
        timeout: 2000
    }).then((result) => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    })
```

