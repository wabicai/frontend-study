## 一、token存放在哪里

1. 客户端使用 cookie直接认证，需要设置 cookie为 httpOnly，可以防止 xss攻击。但是无法防止 csrf攻击。需要设置伪随机数 X-XSRF-TOKEN。（推荐！不需要处理 xss，并且xsrf 随机数有完善的应用机制）
2. 客户端使用 auth授权头认证，token存储在 cookie中，可以防止 csrf攻击，但是需要防止xss攻击。，因为 csrf只能在请求中携带 cookie，而这里必须从 cookie中拿出相应的值并放到 authorization 头中。实际上cookie不能跨站（同源政策）被取出，因此可以避免 csrf 攻击。（适用于 ajax请求或者 api请求，可以方便的设置 auth头）
3. 可以将token存储在 localstorage里面，需要防止xss攻击。实现方式可以在一个统一的地方复写请求头，让每次请求都在header中带上这个token， 当token失效的时候，后端肯定会返回401，这个时候在你可以在前端代码中操作返回登陆页面，清除localstorage中的token。（适用于 ajax请求或者 api请求，可以方便的存入 localstorage）

## 二、如何不传递cookie





三、cookie 存储在客户端， 不可跨域

seesionID存入cookie中，同时cookie记录此sessionId属于那个域名

cookie只支持字符串数据，session支持任意数据类型

cookie可以设置为长时间博爱吃

session时间短，客户端关闭或者session超时都会关闭

token： 服务端无状态化、支持移动设备、支持跨程序调用、

简单token：uid+time（时间戳）+sign（签名，token前几位以哈希算法压缩成一定长度的十六进制字符

token一般存在cookie和localstorage中，每次请求资源需要携带token，放在HTTP的请求头里面。

服务端不用存token数据，用解析时间换储存空间，完全由应用管理，可以避开同源策略

Refresh token ：Refresh token 以及过期时间储存在服务器中，在申请新的access token 时才会验证。

session和token不矛盾。session使服务端有状态化。token是令牌，服务端无状态。可以结合起来，实现服务端有状态化，并且验证。

如果用户数据可能和第三方共享，或者允许第三方调用API接口，用Token。因为拥有SessionId就拥有此资源的全部权利

JWT：JSON Web Token 最流行的一种跨域认证方案。使用RES公/私钥进行签名，因为数字签名的存在，传递的信息是可靠的

用户想访问受保护的路由或资源时，需要在请求头的Authorization的Bearer模式添加JWT：

方法一：Authorization：Bearer 代码……

JWT自己包含会话信息，可以减少查询数据库 需要

JWT不使用cookie，所以不用担心跨域问题。

方法二：放在POST请求的数据体里面。 

方法三：通过URL后面凭借传输

JWT和token的区别；

Token：服务端需要验证客户端发送过来token，还需要查询数据库获取用户信息，然后验证

JWT：将Token和Payload加密后储存在客户端，服务端只需要使用密钥解密即可校验，不需要额外的查询，因为JWT自包含用户信息和加密数据

常见前后端鉴权方式：

1. Session-cookie
2. Token验证（包括JWT，SSO）
3. OAuth.2.0（开放授权）



哈希算法特点：

1. 正向快速
2. 逆向困难
3. 输入敏感（原始数据有一点变化，得到的哈希值变化就会很大）
4. 冲突避免（算出的哈希值基本不会冲突）

艺术不能保证数据不被恶意篡改，可以使用REA公钥+哈希值进行保证。

使用sessiond需要考虑的问题

1. session在服务端会占用较多空间，要定时清理
2. 当网站采用CDN时，session在多个服务器之间无法共享
3. 多个应用要共享session，会遇到跨域问题
4. sessionId储存在cookie中，如果浏览器禁止cookie或者不支持cookie怎么办？一般会把sessionId跟在URL参数后面即重写URL，所以session不一定需要靠cookie实现



使用cookie：

1. 不要存敏感信息，如账号密码
2. 使用httponly（预防XSS）
3. 容易被客户端修改，需要验证合法性
4. 移动端对cookie的支持不是很好

使用token时

1. token完全由应用管理，可以避开同源策略
2. 可以避免csrf攻击，因为不需要cookie了



使用JWT

1. 支持跨域
2. 默认不加密，可以生成原始Token后，通过密钥再加密一次
3. JWT不加密时，不能储存密码之类的敏感数据
4. JWT不仅可以用于认证，还可以用于交换信息。有效使用JWT可以降低服务器查询数据库的次数
5. JWT一旦签发了，到期之前始终有效。
6. JWT本身包含认证信息，一旦泄漏，任何人可以获取该令牌的所有权限。所以应该将JWT的有效期设置得比较短，对于一些重要的权限，还要再认证一次
7. JWT适合一次性的命令认证，签发一个有效期极短的JWT。
8. 为了减少盗用，JWT应该使用HTTPS协议传输



使用加密算法：

1. 不要以明文储存密码
2. 永远用  哈希算法 来处理密码，不要使用base64或者其他编码方法来储存。
3. 不要用弱哈希或已经破解的哈希算法，像MD5或者SHA1。
4. 不要明文显示密码。对密码的所有者，如果“忘记密码”功能，也要随机生成新的  “一次性”的密码，然后发给用户

