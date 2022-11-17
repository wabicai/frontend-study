原生JS：

```js
// 这里仅以get请求为例
function ajax(url){
	// 返回一个Promise对象，才能通过then和catch链式调用
	return new Promise(resolve,reject=>{
	// 创建XMLHttpRequest对象，这里就不做兼容老版本浏览器的考虑了
		var xhr = new XMLHttpRequest()
		// open()设置请求方式，请求url，是否异步，true代表异步
		xhr.open('GET',url,true)
		// onreadystatechange存储函数，每当readystate改变时，都会调用这个函数
		xhr.onreadystatechange = function (){
			// readystate,存有XMLHttpRequest的状态，对这个状态进行判断，为4则代表：请求已完成，并且已经准备就绪
			if(xhr.readystate === 4){
			// 这里对http状态码进行判断，如果200，代表请求成功
				if(xhr.status === 200){
				// 将请求成功后服务端返回的responseText传入回调函数进行处理
					resolve(xhr.responseText)
				}else if(xhr.status === 404){
				// reject错误回调处理
					reject(new Error('404 NOT FOUND'))
				}
			}
		}
		// 发送ajax请求，当发送get请求时，send方法参数为null，只有当发送post请求时，send方法才有对应string参数
		xhr.send(null)
	})
}

//调用
ajax('/api/data/test.json').
then(res =>{
// 请求成功回调
	console.log(res)
}).
catch(error =>{
// 请求失败回调
	console.error(error)
})


```

****
