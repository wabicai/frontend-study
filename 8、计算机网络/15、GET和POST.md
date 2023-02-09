## 一：区别

（1）post 更安全（不会作为 url 的一部分，**不会被缓存**、保存在服务器日志、以及浏览器浏览记录中）

- 可以做个简短的测试，使用 ajax 采用 get 方式请求静态数据（比如 html 页面，图片）的时候，如果两次传输的数据相同，第二次以后消耗的时间将会在 10ms 以内（chrome 测试），而 post 每次消耗的时间都差不多。

（2）post 发送的数据更大（get 有 url 长度限制）
（3）post 能发送更多的数据类型（get 只能发送 ASCII 字符）
（4）post 比 get 慢
（5）post 用于修改和写入数据，get 一般用于搜索排序和筛选之类的操作（淘宝，支付宝的搜索查询都是 get 提交），目的是资源的获取，读取数据

（6）get 的总耗是 post 的 2/3 左右

## POST 的预检请求 OPTIONS

1. 作用：可以去试探服务器能不能处理我后续要发起的请求，因为有些请求服务器无法处理
2. 什么情况：
   1. 请求的方法不是 GET/HEAD/POST
   2. POST 请求，但是是复杂的 POST 请求（指 Content-type 不是 application/x-www-form-urlencoded、multipart/form-data、text/plain 这种比较常见的。
   3. 自定义请求头 header。（例如鹰眼系统的鉴权，就是自定义了一个 authorization 的请求头，用来放 token 信息，可以防止 CSRF）
3. 如果 options 返回 500，那就不会在发送后续的请求。
4. 避免 OPTIONS 请求的方法
   1. 调整请求方法
   2. 去除自定义 header
   3. 修改 Content-Type，基本可以避免该请求发出 OPTIONS 预检请求。
   4. （也就是说跨域不一定触发 OPTIONS 请求）

## 二：GET 请求如何防止别人窃取信息
