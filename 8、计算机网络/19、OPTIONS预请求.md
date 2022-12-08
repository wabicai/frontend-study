
1. 作用：可以去试探服务器能不能处理我后续要发起的请求，因为有些请求服务器无法处理
2. 什么情况：
    1. 请求的方法不是GET/HEAD/POST
    2. POST请求，但是是复杂的POST请求（指Content-type不是application/x-www-form-urlencoded、multipart/form-data、text/plain这种比较常见的。
    3. 自定义请求头header。（例如鹰眼系统的鉴权，就是自定义了一个authorization的请求头，用来放token信息，可以防止CSRF）