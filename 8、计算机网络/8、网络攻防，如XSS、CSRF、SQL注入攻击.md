## 一、HTTPS中间人攻击

https://segmentfault.com/a/1190000013075736

如何预防中间人攻击

## 二、CSRF

如何预防XSS

### 三、XSS

如何预防XSS

## 四、SQL

### OPTIONS请求

- OPTIONS请求即预检请求
- GET和POST在某些情况都有可能发出OPTIONS请求，如
  - 跨域请求，非跨域不会出现OPTIONS请求
  - 自定义请求头
  - 请求头中的content-type是……之外的格式
  - 满足12/13即发起OPTIONS请求
- 用于
  - 获取服务器支持的HTTP请求方法。（黑客常用）
  - 检查服务器性能
- 服务器若接受跨域请求，浏览器才继续发起正式请求

1. ### 预防CSRF漏洞（跨站请求伪造）（Cross-site request forgery）

   - 通过伪装来自受信任用户的请求来利用受信任的网站

   - 防御攻略
     - 检测HTTP referer 字段同域  （检测是否跨域）（在IE6存在漏洞）
     - 在请求里添加token验证。（token即防伪码，不在cookie中。随机产生，可以放在session中）
     - 把token放在HTTP头自定义属性中，通过 XMLHttpRequest 给所有该类请求加上 csrftoken 这个 HTTP 头属性。并把 token 值放入其中。（这样更方便，也不会被记录在地址栏，或者token通过referer泄露）
     - 验证码
     - 使用POST请求

2. ### XSS跨站脚本攻击（Cross Site Scripting）

   1. 想办法获取目标攻击网站的cookie
   2. 。预防措施，防止下发界面显示html标签，把</>等符号转义。

   - CSRF跨站请求伪造

  3. ### CSRF成功的前提用户必须登录到目标站点，且用户浏览了攻击者控制的站点。

     2. 与XSS最为不同一点是CSRF可以不用JS就能达到目的（GET和POST的区别）。

   - DoS服务拒绝攻击（enial of Service）
     1. 带宽攻击：以极大的通信量冲击网络，使得所有可用网络资源都被消耗殆尽，最后导致合法的用户请求就无法通过。
     2. 连通性攻击：用大量的连接请求冲击计算机，使得所有可用的操作系统资源都被消耗殆尽，最终计算机无法再处理合法用户的请求。 
   - DDoS（分布式拒绝服务）
     1. 将多个计算机联合起来作为攻击平台，对一个或多个目标发动DoS攻击，从而成倍地提高拒绝服务攻击的威力。
   - SSRF服务端请求伪造（Server-side Request Forge）

4. 跨域请求，设置请求withCredentials="true"（请求头），可携带cookie

5. 4. 
6. 