https://segmentfault.com/a/1190000006879700

![img](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91c2VyLWdvbGQtY2RuLnhpdHUuaW8vMjAxOC80LzE5LzE2MmRiNWU5ODVhYWJkYmU?x-oss-process=image/format,png)

1. 浏览器进程检查url，组装协议，构成完整url
2. 浏览器进程通过进程间通信，把url发给网络进程
3. 网络进程查看该url是否有本地缓存，如果有就返回给浏览器进程
4. 如果没有，网络进程向web服务器发起http请求
   1. 进行DNS解析，获取IP地址（首先在本地DNS缓存里查找）
   2. 利用ip地址和端口建立TCP连接
   3. 构建请求头信息并发送
   4. 服务器响应后，网络进程接受响应头和响应数据，并解析其内容

5. 网络进程响应
   1. 检查这状态码，如果是301、302，则从location中读取地址，重新请求
   2. 200处理：检查Content-Type, 如果是字节流类型，则提交给下载管理器，不再进行后续渲染；如果是html则通知浏览器进程准备进行渲染
6. 准备渲染进程
7. 传输数据，更新状态
   1. 渲染进程准备好后，浏览器进程向渲染进程发起消息，渲染进程收到消息后和网络进程建立传输数据的管道
   2. 渲染进程接收完数据后，向浏览器进程回复消息
   3. 浏览器进程收到消息后更新浏览器界面状态
8. 渲染进程渲染页面
