https://segmentfault.com/a/1190000006879700

![img](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91c2VyLWdvbGQtY2RuLnhpdHUuaW8vMjAxOC80LzE5LzE2MmRiNWU5ODVhYWJkYmU?x-oss-process=image/format,png)

1. 浏览器进程检查 url，组装协议，构成完整 url
2. 浏览器进程通过进程间通信，把 url 发给网络进程
3. 网络进程查看该 url 是否有本地缓存，如果有就返回给浏览器进程
   1. 强缓存，max-age，Expires
   2. 没有强缓存再走协商缓存
4. 如果没有，网络进程向 web 服务器发起 http 请求

   1. 进行 DNS 解析，获取 IP 地址（首先在本地 DNS 缓存里查找）
   2. 利用 ip 地址和端口建立 TCP 连接
   3. 如果是 HTTPS 会有 “非堆成加密” 获取密钥过程
   4. TCP 三次握手
   5. 服务器响应后，网络进程接受响应头和响应数据，并解析其内容

5. 网络进程响应
   1. 检查状态码，如果是 301、302，则从 location 中读取地址，重新请求
   2. 200 处理：检查 Content-Type, 如果是字节流类型，则提交给下载管理器，不再进行后续渲染；
   3. 如果是 html 则通知浏览器进程准备进行渲染
6. 准备渲染进程
7. 传输数据，更新状态
   1. 渲染进程准备好后，浏览器进程向渲染进程发起消息，渲染进程收到消息后和网络进程建立传输数据的管道
   2. 渲染进程接收完数据后，向浏览器进程回复消息
   3. 浏览器进程收到消息后更新浏览器界面状态
8. 渲染进程渲染页面
