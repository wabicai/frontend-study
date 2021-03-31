## 方法一：

```js
    var url = "http:www.xxx.net/x/x.html?id=898602B8261890349226&aa=123&bb=456"
    var params = url.split("?")[1].split("&")
    var obj = {}
    // for (i = 0; i < params.length; i++) {
    // var param = params[i].split("=");
    // obj[param[0]] = param[1]
    // }
    params.map(v => obj[v.split("=")[0]] = v.split("=")[1])
    console.log(obj) //{id: "898602B8261890349226", aa: "123", bb: "456"}
```

## 方法二：

```js
function getUrlParam(key) {
			var reg = new RegExp(key + '=([^&]*)');
			var results = location.href.match(reg);
			return results ? results[1] : null;
		}
```

