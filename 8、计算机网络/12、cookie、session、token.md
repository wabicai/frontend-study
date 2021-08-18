## 一、验证方式

1. **cookie**：客户端使用 cookie直接认证。

   1. 设置 cookie为 httpOnly，**可以防止 xss攻击。但是无法防止 csrf攻击**。需要设置伪随机数 X-XSRF-TOKEN。（推荐！不需要处理 xss，并且csrf 随机数有完善的应用机制）

   2. SameSite可以防止 CSRF 攻击和用户追踪。

      1. Strict：完全禁止第三方 Cookie，跨站点时，任何情况下都不会发送 Cookie。换言之，只有当前网页的 URL 与请求目标一致，才会带上 Cookie。

         > 这个规则过于严格，可能造成非常不好的用户体验。比如，当前网页有一个 GitHub 链接，用户点击跳转就不会带有 GitHub 的 Cookie，跳转过去总是未登陆状态。

      2. Lax：规则稍稍放宽，大多数情况也是不发送第三方 Cookie，但是导航到目标网址的 Get 请求除外。

         > 设置了`Strict`或`Lax`以后，基本就杜绝了 CSRF 攻击。当然，前提是用户浏览器支持 SameSite 属性。

      3. None：网站可以选择显式关闭`SameSite`属性，将其设为`None`。不过，前提是必须同时设置`Secure`属性（Cookie 只能通过 HTTPS 协议发送），否则无效。

2. **自定义请求头**：客户端使用 auth授权头认证，token存储在 cookie中。这样可以防止 csrf攻击，但是需要防止xss攻击。，因为 csrf只能在请求中携带 cookie，而这里必须从 cookie中拿出相应的值并放到 authorization 头中。实际上cookie不能跨站（同源政策）被取出，因此可以避免 csrf 攻击。（适用于 ajax请求或者 api请求，可以方便的设置 auth头）

3. **localstorage**：可以将token存储在 localstorage里面，需要防止xss攻击。实现方式可以在一个统一的地方复写请求头，让每次请求都在header中带上这个token， 当token失效的时候，后端肯定会返回401，这个时候在你可以在前端代码中操作返回登陆页面，清除localstorage中的token。（适用于 ajax请求或者 api请求，可以方便的存入 localstorage）

## 二、如何防止cookie劫持

1. HttpOnly（解决XSS，只能通过HTTP链接获取，不能通过js代码获取cookie）
2. secure（只能通过HTTPS传输数据，如果是 HTTP 连接则不会传递该信息）
3. 在cookie中添加校验信息（如添加用户的环境信息，ip地址,token）
4. SameSite

#### 怎么设置cookie有效期

> expires/Max-Age 字段为此cookie超时时间。若设置其值为一个时间，那么当到达此时间后，此cookie失效。不设置的话默认值是Session，意思是cookie会和session一起失效。当浏览器关闭(不是浏览器标签页，而是整个浏览器) 后，此cookie失效。
>
> Max-Age 如果设置为负值的话，则为浏览器进程Cookie(内存中保存)，关闭浏览器就失效；如果设置为0，则立即删除该Cookie。

1. Expires（document.setCookie = name + '=' + value + ';expires=' ）
2. Max-age

## 三、cookie、session、token区别

- cookie 存储在客户端， 不可跨域

- seesionID存入cookie中，同时cookie记录此sessionId属于那个域名

- cookie只支持字符串数据，session支持任意数据类型

- cookie可以设置为长时间保持

- session时间短，客户端关闭或者session超时都会关闭

- token： 服务端无状态化、支持移动设备、支持跨程序调用、



## 四、token

**简单token：**uid+time（时间戳）+sign（签名，token前几位以哈希算法压缩成一定长度的十六进制字符）

**token存储：**token一般存在**cookie和localstorage**中，每次请求资源需要携带token，放在HTTP的请求头里面。服务端不用存token数据，用解析时间换储存空间，完全由应用管理，可以避开同源策略

**Refresh token ：**Refresh token 以及过期时间储存在服务器中，在申请新的access token 时才会验证。

### 怎么用token

- session和token不矛盾。session使服务端有状态化。token是令牌，服务端无状态。可以结合起来，实现服务端有状态化，并且验证。
- 如果用户数据可能和第三方共享，或者允许第三方调用API接口，用Token。因为拥有SessionId就拥有此资源的全部权利，所以不建议用sesssion验证。

### 怎么判读token过期

小程序用了JWT这个包，通过getExpersion这个方式设定过期值。（expires_in 这个就是过期时间）

1. 传统方法：放在cookie中，通过cookie判断是否过期。（容易被XSS攻击，可以设置httpOnly 以及 secure ） 
2. 也可以前端自己在storage里面设定一个过期时间，过期了清除token

## 五、JWT

**JWT：JSON Web Token 最流行的一种跨域认证方案。使用RES公/私钥进行签名，因为数字签名的存在，传递的信息是可靠的**



#### **方法一：Authorization：Bearer 代码……**

用户想访问受保护的路由或资源时，需要在请求头的Authorization的Bearer模式添加JWT：

JWT自己包含会话信息，可以减少查询数据库 需要

JWT不使用cookie，所以不用担心跨域问题。

#### 方法二：放在POST请求的数据体里面。 

#### 方法三：通过URL后面作为参数传输



### JWT和token的区别；

**Token：服务端需要验证客户端发送过来token，还需要查询数据库获取用户信息，然后验证**

**JWT：将Token和Payload加密后储存在客户端，服务端只需要使用密钥解密即可校验，不需要额外的查询，因为JWT自包含用户信息和加密数据**



## 六、常见前后端鉴权方式：

1. Session-cookie
2. Token验证（包括JWT，SSO）
3. OAuth.2.0（开放授权）



### 使用时考虑的问题：

#### **使用sessiond需要考虑的问题**

1. session在服务端会占用较多空间，要定时清理
2. 当网站采用CDN时，session在多个服务器之间无法共享
3. 多个应用要共享session，会遇到跨域问题
4. sessionId储存在cookie中，如果浏览器禁止cookie或者不支持cookie怎么办？一般会把sessionId跟在URL参数后面即重写URL，所以session不一定需要靠cookie实现

#### 使用cookie：

1. 不要存敏感信息，如账号密码
2. 使用httponly（预防XSS）
3. 容易被客户端修改，需要验证合法性
4. 移动端对cookie的支持不是很好

#### 使用token时

1. token完全由应用管理，可以避开同源策略
2. 可以避免csrf攻击，因为不需要cookie了

#### 使用JWT

1. 支持跨域
2. 默认不加密，可以生成原始Token后，通过密钥再加密一次
3. JWT不加密时，不能储存密码之类的敏感数据
4. JWT不仅可以用于认证，还可以用于交换信息。有效使用JWT可以降低服务器查询数据库的次数
5. JWT一旦签发了，到期之前始终有效。
6. JWT本身包含认证信息，一旦泄漏，任何人可以获取该令牌的所有权限。所以应该将JWT的有效期设置得比较短，对于一些重要的权限，还要再认证一次
7. JWT适合一次性的命令认证，签发一个有效期极短的JWT。
8. 为了减少盗用，JWT应该使用HTTPS协议传输

#### 使用加密算法：

1. 不要以明文储存密码
2. 永远用  哈希算法 来处理密码，不要使用base64或者其他编码方法来储存。
3. 不要用弱哈希或已经破解的哈希算法，像MD5或者SHA1。
4. 不要明文显示密码。对密码的所有者，如果“忘记密码”功能，也要随机生成新的  “一次性”的密码，然后发给用户

#### 哈希算法特点：

1. 正向快速
2. 逆向困难
3. 输入敏感（原始数据有一点变化，得到的哈希值变化就会很大）
4. 冲突避免（算出的哈希值基本不会冲突）
5. token不能保证数据不被恶意篡改，可以使用REA公钥+哈希值进行保证。

