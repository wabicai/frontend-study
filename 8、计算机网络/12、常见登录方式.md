## 认证机制
https://juejin.cn/post/6933115003327217671
-Cookie + Session 登录
-Token 登录
-SSO 单点登录
-OAuth 第三方登录
### 一、Cookie + Session 登录
HTTP 是一种无状态的协议，客户端每次发送请求时，首先要和服务器端建立一个连接，在请求完成后又会断开这个连接。这种方式可以节省传输时占用的连接资源，但同时也存在一个问题：每次请求都是独立的，服务器端无法判断本次请求和上一次请求是否来自同一个用户，进而也就无法判断用户的登录状态。

> 为了解决 HTTP 无状态的问题，Lou Montulli 在 1994 年的时候，推出了 Cookie。 Cookie 是服务器端发送给客户端的一段特殊信息，这些信息以文本的方式存放在客户端，客户端每次向服务器端发送请求时都会带上这些特殊信息。

在 B/S 系统（Browser/Server，即**浏览器/服务器结构**）中，登录功能通常都是基于 `Cookie` 来实现的。当用户登录成功后，一般会将登录状态记录到 `Session` 中。要实现服务端对客户端的登录信息进行验证都，需要在客户端保存一些信息（`SessionId`），并要求客户端在之后的每次请求中携带它们。在这样的场景下，使用 `Cookie` 无疑是最方便的，因此我们一般都会将 `Session` 的 `Id` 保存到 `Cookie` 中，当服务端收到请求后，通过验证 `Cookie` 中的信息来判断用户是否登录 。

#### Cookie + Session 实现流程
`Cookie` + `Session` 的登录方式是目前最经典的一种登录方式，现在仍然有大量的企业在使用。
![[Pasted image 20220902112944.png]]
1.  用户访问 `a.com/pageA`，并输入密码登录。
2.  服务器验证密码无误后，会创建 `SessionId`，并将它保存起来。
3.  服务器端响应这个 HTTP 请求，并通过 `Set-Cookie` 头信息，将 `SessionId` 写入 `Cookie` 中。

> 服务器端的 `SessionId` 可能存放在很多地方，例如：内存、文件、数据库等。
##### 第一次登录完成之后，后续的访问就可以直接使用 `Cookie` 进行身份验证了：
![Cookie + Session 实现流程](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fcd605e0ebaa4731b5a4e976c83d1067~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

1.  用户访问 `a.com/pageB` 页面时，会自动带上第一次登录时写入的 `Cookie`。
2.  服务器端比对 `Cookie` 中的 `SessionId` 和保存在服务器端的 `SessionId` 是否一致。
3.  如果一致，则身份验证成功，访问页面；如果无效，则需要用户重新登录。

#### 小结
虽然我们可以使用 `Cookie` + `Session` 的方式完成了登录验证，但仍然存在一些问题：
1.  由于服务器端需要对接大量的客户端，也就需要存放大量的 `SessionId`，这样会导致服务器压力过大。
2.  如果服务器端是一个集群，为了同步登录态，需要将 `SessionId` 同步到每一台机器上，无形中增加了服务器端维护成本。
3.  由于 `SessionId` 存放在 `Cookie` 中，所以无法避免 `CSRF` 攻击。

### 二、Token 登录
Token 是通过服务端生成的一串字符串，以作为客户端请求的一个令牌。当第一次登录后，服务器会生成一个 Token 并返回给客户端，客户端后续访问时，只需带上这个 Token 即可完成身份认证。
#### Token 机制实现流程
##### 用户首次登录时：
![[Pasted image 20220902113206.png]]
1.  用户访问 `a.com/pageA`，输入账号密码，并点击登录。
2.  服务器端验证账号密码无误，创建 `Token`。
3.  服务器端将 `Token` 返回给客户端，由**客户端自由保存**。
##### 后续页面访问时：
![[Pasted image 20220902113228.png]]
1.  用户访问 `a.com/pageB` 时，带上第一次登录时获取的 `Token`。
2.  服务器端验证该 `Token` ，有效则身份验证成功，无效则踢回重新的登录。
#### Token 生成方式
最常见的 `Token` 生成方式是使用 `JWT`（`Json Web Token`），它是一种简洁的、自包含的方法，用于通信双方之间以 JSON 对象的形式安全的传递信息。
使用 `Token` 后，服务器端并不会存储 `Token`，那怎么判断客户端发过来的 `Token` 是合法有效的呢？
答案其实就在 `Token` 字符串中，其实 `Token` 并不是一串杂乱无章的字符串，而是通过多种算法拼接组合而成的字符串。
`JWT` 算法主要分为 3 个部分：`header`（头信息），`playload`（消息体），`signature`（签名）。
-`header` 部分指定了该 `JWT` 使用的签名算法；
-`playload` 部分表明了 `JWT` 的意图；
-`signature` 部分为 `JWT` 的签名，主要为了让 `JWT` 不能被随意篡改。
**优缺点：**
-服务器端不需要存放 `Token`，所以不会对服务器端造成压力，即使是服务器集群，也不需要增加维护成本。
-`Token` 可以存放在前端任何地方，可以不用保存在 `Cookie` 中，提升了页面的安全性。
-`Token` 下发之后，只要在生效时间之内，就一直有效，但是如果服务器端想收回此 `Token` 的权限，并不容易。
### 三、SSO 单点登录
单点登录是指在同一帐号平台下的多个应用系统中，用户只需登录一次，即可访问所有相互信任的应用系统。本质就是在多个应用系统中共享登录状态。举例来说，百度贴吧和百度地图是百度公司旗下的两个不同的应用系统，如果用户在百度贴吧登录过之后，当他访问百度地图时无需再次登录，那么就说明百度贴吧和百度地图之间实现了单点登录。
#### 实现流程
##### 用户首次访问时，需要在认证中心登录：
![[Pasted image 20220902113629.png]]
1.用户访问网站 `a.com` 下的 `pageA` 页面。
2.由于没有登录，则会重定向到认证中心，并带上回调地址 `www.sso.com?return_uri=a.com/pageA`，以便登录后直接进入对应页面。
3.用户在认证中心输入账号密码，提交登录。
4.认证中心验证账号密码有效，然后重定向 `a.com?ticket=123` 带上授权码 `ticket`，并将认证中心 `sso.com` 的登录态写入 `Cookie`。
5.在 `a.com` 服务器中，拿着 `ticket` 向认证中心确认，授权码 `ticket` 真实有效。
6.验证成功后，服务器将登录信息写入 `Cookie`（此时客户端有 2 个 `Cookie` 分别存有 `a.com` 和 `sso.com` 的登录态）。
##### 认证中心登录完成之后，继续访问 `a.com` 下的其他页面：
![[Pasted image 20220902113808.png]]
这个时候，由于 `a.com` 存在已登录的 `Cookie` 信息，所以服务器端直接认证成功。
##### 如果认证中心登录完成之后，访问 `b.com` 下的页面：
![[Pasted image 20220902113957.png]]
这个时候，由于认证中心存在之前登录过的 `Cookie`，所以也不用再次输入账号密码，直接返回第 4 步，下发 `ticket` 给 `b.com` 即可。
单点登录主要有三种实现方式：
1.  父域 Cookie
2.  认证中心
3.  LocalStorage 跨域
一般情况下，用户的登录状态是记录在 `Session` 中的，要实现共享登录状态，就要先共享 `Session`，但是由于不同的应用系统有着不同的域名，尽管 `Session` 共享了，但是由于 `SessionId` 是往往保存在浏览器 `Cookie` 中的，因此存在作用域的限制，无法跨域名传递，也就是说当用户在 `a.com` 中登录后，`Session Id` 仅在浏览器访问 `a.com` 时才会自动在请求头中携带，而当浏览器访问 `b.com` 时，`Session Id` 是不会被带过去的。实现单点登录的关键在于，如何让 `Session Id`（或 Token）在多个域中共享。
##### 1. 父域 Cookie
如果将 `Cookie` 的 `domain` 属性设置为当前域的父域，那么就认为它是父域 `Cookie`。`Cookie` 有一个特点，即父域中的 `Cookie` 被子域所共享，也就是说，子域会自动继承父域中的 `Cookie`。
利用 `Cookie` 的这个特点，可以将 `Session Id`（或 `Token`）保存到父域中就可以了。我们只需要将 `Cookie` 的 `domain` 属性设置为父域的域名（主域名），同时将 `Cookie` 的 `path` 属性设置为根路径，这样所有的子域应用就都可以访问到这个 `Cookie` 了。不过这要求应用系统的域名需建立在一个共同的主域名之下，如 tieba.baidu.com 和 map.baidu.com，它们都建立在 baidu.com 这个主域名之下，那么它们就可以通过这种方式来实现单点登录。
**总结：此种实现方式比较简单，但不支持跨主域名。**
##### 2. 认证中心
**此种实现方式相对复杂，支持跨域，扩展性好，是单点登录的标准做法。**
##### 3. LocalStorage 跨域
在前后端分离的情况下，完全可以不使用 `Cookie`，我们可以选择将 `Session Id` （或 `Token` ）保存到浏览器的 `LocalStorage` 中，让前端在每次向后端发送请求时，主动将 `LocalStorage` 的数据传递给服务端。这些都是由前端来控制的，后端需要做的仅仅是在用户登录成功后，将 `Session Id` （或 `Token` ）放在响应体中传递给前端。

在这样的场景下，单点登录完全可以在前端实现。前端拿到 `Session Id` （或 `Token` ）后，除了将它写入自己的 `LocalStorage` 中之外，还可以通过特殊手段将它写入多个其他域下的 `LocalStorage` 中。

实现：
不同浏览器无法共享localStorage和sessionStorage中的信息。同一浏览器的相同域名和端口的不同页面间可以共享相同的 localStorage，但是不同页面间无法共享sessionStorage的信息。
目前广泛采用的是postMessage和iframe相结合的方法。**postMessage(data,origin)**方法允许来自不同源的脚本采用异步方式进行通信，可以实现跨文本档、多窗口、跨域消息传递。接受两个参数：
- data：要传递的数据，[HTML5](https://link.jianshu.com?t=http://lib.csdn.net/base/html5)规范中提到该参数可以是[JavaScript](https://link.jianshu.com?t=http://lib.csdn.net/base/javascript)的任意基本类型或可复制的对象，然而并不是所有浏览器支持任意类型的参数，部分浏览器只能处理字符串参数，所以在传递参数时需要使用JSON.stringify()方法对对象参数序列化。
- origin：字符串参数，指明目标窗口的源，协议+主机+端口号[+URL]，URL会被忽略，所以可以不写，只是为了安全考虑，postMessage()方法只会将message传递给指定窗口，当然也可以将参数设置为"*"，这样可以传递给任意窗口，如果要指定和当前窗口同源的话设置为"/"。window.addEventListener('message'）

safari浏览器的默认限制，父页面无法向iframe里的跨域页面传递信息。这时针对safari浏览器就得另辟蹊径了。本人在项目中用的方法是在safari浏览器下，用url传值的方法来实现跨域存储功能，可以支持超过64k个字符的长度。Safari 隐私限制iframe内不能操作localstorage怎么破……必须关闭隐私=>跨站跟踪数据 才行。
**总结：此种实现方式完全由前端控制，几乎不需要后端参与，同样支持跨域。**
#### SSO 单点登录退出
原理：在每一个产品在向认证中心验证 `ticket(token)` 时，可以顺带将自己的退出登录 `api` 发送到认证中心。

当某个产品 `c.com` 退出登录时：
1.清空 `c.com` 中的登录态 `Cookie`。
2.请求认证中心 `sso.com` 中的退出 `api`。
3.认证中心遍历下发过 `ticket(token)` 的所有产品，并调用对应的退出 `api`，完成退出。
### 四、OAuth 第三方登录
QQ 微信 微博等
#### OAuth 机制实现流程
这里以微信开放平台的接入流程为例：
![[Pasted image 20220902121716.png]]
1.首先，`a.com` 的运营者需要在微信开放平台注册账号，并向微信申请使用微信登录功能。
2.申请成功后，得到申请的 `appid`、`appsecret`。
3.用户在 `a.com` 上选择使用微信登录。
4.这时会跳转微信的 OAuth 授权登录，并带上 `a.com` 的回调地址。
5.用户输入微信账号和密码，登录成功后，需要选择具体的授权范围，如：授权用户的头像、昵称等。
6.授权之后，微信会根据拉起 `a.com?code=123` ，这时带上了一个临时票据 `code`。
7.获取 `code` 之后， `a.com` 会拿着 `code` 、`appid`、`appsecret`，向微信服务器申请 `token`，验证成功后，微信会下发一个 `token`。
8.有了 `token` 之后， `a.com` 就可以凭借 `token` 拿到对应的微信用户头像，用户昵称等信息了。
9.`a.com` 提示用户登录成功，并将登录状态写入 `Cookie`，以作为后续访问的凭证。
#### 总结
上面四种登录实现方案，基本囊括了现有的登录验证方案，原理以及实现流程基本都了解。
-`Cookie + Session` 历史悠久，适合于简单的后端架构，需开发人员自己处理好安全问题。
-`Token` 方案对后端压力小，适合大型分布式的后端架构，但已分发出去的 `token` ，如果想收回权限，就不是很方便了。
-SSO 单点登录，适用于中大型企业，想要统一内部所有产品的登录方式的情况。
-OAuth 第三方登录，简单易用，对用户和开发者都友好，但第三方平台很多，需要选择合适自己的第三方登录平台。

## cookie跨域
https://www.51cto.com/article/666576.html
### 什么是Cookie
Cookie就是用来绕开HTTP的无状态性的手段，它是Web的标准技术(是web标准而不局限于只是Servlet)，隶属于RFC6265，现今的所有的浏览器、服务器均实现了此规范。
-   同域Cookie：每次访问的是同一个域下的不同页面、API(每次去的是同一家银行的不同网点，带上这家银行卡即可识别身份)
-   不同域Cookie：同一个浏览器窗口内可能同时访问A网站和B网站，它们均有各自的Cookie，但访问A时只会带上A的Cookie(你可能有不同银行的多张银行卡，而去某个银行时只有带着他们家的银行卡才去有用嘛)
-   跨域Cookie共享：访问A站点时已经登录从而保存姓名、头像等基本信息，这时访问该公司的B站点时就自然而然的能显示出这些基本信息，也就是实现信息共享(在银联体系中A银行办理的卡也能在B银行能取出钱来，也就是实现余额“共享”)

❝说明：Cookie实现跨域共享要求根域必须是一样才行，比如都是www.baidu.com和map.baidu.com的根域都是 baidu.com。这道理就相当于只有加入了银联的银行才能用银行卡去任意一家银联成员行取钱一样❞
### Cookie的交互机制
四个步骤
1.浏览器(客户端)发送一个请求到服务器
2.服务器响应。并在HttpResponse里增加一个响应头：Set-Cookie
3.浏览器保存此cookie在本地，然后以后每次请求都带着它，且请求头为：Cookie
4.服务器收到请求便可读取到此Cookie，做相应逻辑后给出响应
由此可见，Cookie用于保持请求状态，而这个状态依赖于浏览器端(客户端)的本地存储。
![[Pasted image 20220901191944.png]]
详细过程：
浏览器访问：http://localhost:8080/cookie，可以看到响应里带有Cookie头信息Set-Cookie告知浏览器要保存此Cookie，如下所示：
![[Pasted image 20220901192051.png]]
浏览器收到响应，并且依照Set-Cookie这个响应头，在本地存储上此Cookie(至于存在内存还是硬盘上，请参照文下的生命周期部分分解)：
![[Pasted image 20220901192129.png]]
再次发送本请求，它会将此域的Cookie全都都携带发给后端服务器
![[Pasted image 20220901192159.png]]

### Cookie的生命周期
缺省情况下，Cookie的生命周期是Session级别(会话级别)。若想用Cookie进行状态保存、资源共享，服务端一般都会给其设置一个过期时间maxAge，短则1小时、1天，长则1星期、1个月甚至永久，这就是Cookie的生命(周期)。

Cookie的存储形式，根据其生命周期的不同而不同。这由maxAge属性决定，共有这三种情况：

1.  maxAge > 0：cookie不仅内存里有，还会持久化到硬盘，也叫持久Cookie。这样的话即使你关机重启(甚至过几天再访问)，这个cookie依旧存在，请求时依旧会携带
2.  maxAge < 0：一般值为-1，也就临时Cookie。该Cookie只在内存中有(如session级别)，一旦管理浏览器此Cookie将不复存在。值得注意的是：若使用无痕模式访问也是不会携带此Cookie的哟
3.  maxAge = 0：内存中没有，硬盘中也没有了，也就立即删除Cookie。此种case存在的唯一目的：服务浏览器可能的已存在的cookie，让其立马失效(消失)
❝Tips：请注意maxAge<0(负数)和maxAge=0的区别。前者会存在于内存，只有关闭浏览器or重启才失效;后者是立即删除❞当然啦，Cookie的生命周期除了受到后端设置的Age值来决定外，还有两种方式可“改变”它：
1.JavaScript操作Cookie document.cookie读写（要有权限 httponly）
```js
// 取cookie： 
function getCookie(name) {            
    var arr = document.cookie.split(';');            
    for (var i = 0; i < arr.length; i++) { 
        var arr2 = arr[i].split('='); 
        var arrTest = arr2[0].trim(); // 此处的trim一定要加              
        if (arrTest == name) { 
            return arr2[1]; 
        } 
    } 
 
} 
// 删cookie： 
function delCookie(name) { 
    var exp = new Date(); 
    exp.setTime(exp.getTime() - 1); 
    var cval = getCookie(name); 
    if (cval != null) { 
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString(); 
    } 
} 
```
2.浏览器的开发者工具操作Cookie
### Cookie的安全性和劣势
Cookie存储在客户端，正所谓客户端的所有东西都认为不是安全的，因此敏感的数据(比如密码)尽量不要放在Cookie里。Cookie能提高访问服务端的效率，但是安全性较差!
**劣势：**
-每次请求都会携带Cookie，这无形中增加了流量开销，这在移动端对流量敏感的场景下是不够友好的
-Http请求中Cookie均为明文传输，所以安全性成问题(除非用Https)
-Cookie有大小限制，一般最大为4kb，对于复杂的需求来讲就捉襟见肘

由于Cookie有不安全性和众多劣势，所以现在JWT大行其道。当然喽，很多时候Cookie依旧是最好用的，比如内网的管理端、Portal门户、UUAP统一登录等。
### Cookie的域和路径
Cookie是不可以跨域的，隐私安全机制禁止网站非法获取其他网站(域)的Cookie。
❝淘宝有两个页面：A页面a.taotao.com/index.html和B页面b.taotao.com/index.html，默认情况下A页面和B页面的Cookie是互相独立不能共享的。若现在有需要共享(如单点登录共享token )，我们只需要这么做：将A/B页面创建的Cookie的path设置为“/”，domain设置为“.taobtao.com”，那么位于a.taotao.com和b.taotao.com域下的所有页面都可以访问到这个Cookie了。❞
-   domain：创建此cookie的服务器主机名(or域名)，服务端设置。但是不能将其设置为服务器所属域之外的域(若这都允许的话，你把Cookie的域都设置为baidu.com，那百度每次请求岂不要“累死”)
注：端口和域无关，也就是说Cookie的域是不包括端口的
-   path：域下的哪些目录可以访问此cookie，默认为/，表示所有目录均可访问此cookie
- ### 跨域Cookie共享
两个域具有相同的domain，因此才有共享Cookie的可能
默认情况下，浏览器是不会去为你保存下跨域请求响应的Cookie的。具体现象是：跨域请求的Response响应了即使有Set-Cookie响应头(且有值)，浏览器收到后也是不会保存此cookie的。

要实现Cookie的跨域共享，有3个关键点：
1.  服务端负责在响应中将Set-Cookie发出来(由Access-Control-Allow-Credentials响应头决定 设置true)(服务端能正确的在响应中有**Set-Cookie**响应)
2.  浏览器端只要响应里有Set-Cookie头，就将此Cookie存储(由异步对象的XMLHttpRequest对象的 withCredentials属性决定 设置true)
3.  浏览器端发现只要有Cookie，即使是跨域请求也将其带着(由异步对象的withCredentials属性决定)
    (当异步对象设置了**withCredentials=true**时，浏览器会保留下响应的Cookie等信息，并且下次发送请求时将其携带。因此要指示浏览器存储Cookie并且每次跨域请求都携带，仅需加上此参数，此时服务端的**Access-Control-Allow-Origin**这个响应头的值不能是通配符*，而只能是具体的值)
## JWT
https://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html
JSON Web Token（JWT）是一个开放标准（RFC 7519），它定义了一种紧凑且独立的方式，可以在各方之间作为JSON对象安全地传输信息。此信息可以通过数字签名进行验证和信任。JWT可以使用秘密（使用HMAC算法）或使用RSA或ECDSA的公钥/私钥对进行签名。
JWT 的原理是，服务器认证以后，生成一个 JSON 对象，发回给用户，就像下面这样。
> ```javascript
> {
>   "姓名": "张三",
>   "角色": "管理员",
>   "到期时间": "2018年7月1日0点0分"
> }
> ```

以后，用户与服务端通信的时候，都要发回这个 JSON 对象。服务器完全只靠这个对象认定用户身份。为了防止用户篡改数据，服务器在生成这个对象的时候，会加上签名（详见后文）。

服务器就不保存任何 session 数据了，也就是说，服务器变成无状态了，从而比较容易实现扩展。
#### JWT 的数据结构
它是一个很长的字符串，中间用点（`.`）分隔成三个部分。注意，JWT 内部是没有换行的，这里只是为了便于展示，将它写成了几行。
```javascript
Header.Payload.Signature
```
**Header**部分是一个 JSON 对象，描述 JWT 的元数据，通常是下面的样子。

```javascript
> 
> {
>   "alg": "HS256",
>   "typ": "JWT"
> }
> ```

上面代码中，`alg`属性表示签名的算法（algorithm），默认是 HMAC SHA256（写成 HS256）；`typ`属性表示这个令牌（token）的类型（type），JWT 令牌统一写为`JWT`。

最后，将上面的 JSON 对象使用 Base64URL 算法（详见后文）转成字符串。
**Payload**部分也是一个 JSON 对象，用来存放实际需要传递的数据。JWT 规定了7个官方字段，供选用。
> -   iss (issuer)：签发人
> -   exp (expiration time)：过期时间
> -   sub (subject)：主题
> -   aud (audience)：受众
> -   nbf (Not Before)：生效时间
> -   iat (Issued At)：签发时间
> -   jti (JWT ID)：编号

除了官方字段，你还可以在这个部分定义私有字段，
注意，JWT 默认是不加密的，任何人都可以读到，所以不要把秘密信息放在这个部分。
这个 JSON 对象也要使用 Base64URL 算法转成字符串。
**Signature**部分是对前两部分的签名，防止数据篡改。
首先，需要指定一个密钥（secret）。这个密钥只有服务器才知道，不能泄露给用户。然后，使用 Header 里面指定的签名算法（默认是 HMAC SHA256），按照下面的公式产生签名。

> ```javascript
> 
> HMACSHA256(
>   base64UrlEncode(header) + "." +
>   base64UrlEncode(payload),
>   secret)
> ```

算出签名以后，把 Header、Payload、Signature 三个部分拼成一个字符串，每个部分之间用"点"（`.`）分隔，就可以返回给用户。
#### JWT 的使用方式
客户端收到服务器返回的 JWT，可以储存在 Cookie 里面，也可以储存在 localStorage。
此后，客户端每次与服务器通信，都要带上这个 JWT。你可以把它放在 Cookie 里面自动发送，但是这样不能跨域，所以更好的做法是放在 HTTP 请求的头信息`Authorization`字段里面。
> Authorization: Bearer \<token>
另一种做法是，跨域的时候，JWT 就放在 POST 请求的数据体里面。

#### 五、JWT 的几个特点
（1）JWT 默认是不加密，但也是可以加密的。生成原始 Token 以后，可以用密钥再加密一次。
（2）JWT 不加密的情况下，不能将秘密数据写入 JWT。
（3）JWT 不仅可以用于认证，也可以用于交换信息。有效使用 JWT，可以降低服务器查询数据库的次数。
（4）JWT 的最大缺点是，由于服务器不保存 session 状态，因此无法在使用过程中废止某个 token，或者更改 token 的权限。也就是说，一旦 JWT 签发了，在到期之前就会始终有效，除非服务器部署额外的逻辑。
（5）JWT 本身包含了认证信息，一旦泄露，任何人都可以获得该令牌的所有权限。为了减少盗用，JWT 的有效期应该设置得比较短。对于一些比较重要的权限，使用时应该再次对用户进行认证。
（6）为了减少盗用，JWT 不应该使用 HTTP 协议明码传输，要使用 HTTPS 协议传输

## 单点登录
https://juejin.cn/post/6844903664985866253
https://developer.aliyun.com/article/636281
单点登录英文全称Single Sign On，简称就是SSO。它的解释是：**在多个应用系统中，只需要登录一次，就可以访问其他相互信任的应用系统。**
### 同域下的单点登录
利用cookie域可设置为顶域的特性
sso登录以后，可以将Cookie的域设置为顶域，即.a.com，这样所有子域的系统都可以访问到顶域的Cookie。**我们在设置Cookie时，只能设置顶域和自己的域，不能设置其他的域。比如：我们不能在自己的系统中给baidu.com的域设置Cookie。**
### 不同域下的单点登录
SSO一般都需要一个独立的认证中心（passport），子系统的登录均得通过passport，子系统本身将不参与登录操作，当一个系统成功登录以后，passport将会颁发一个令牌给各个子系统，子系统可以拿着令牌会获取各自的受保护资源，为了减少频繁认证，各个子系统在被passport授权以后，会建立一个局部会话，在一定时间内可以无需再次向passport发起认证。
**CAS**
中央认证服务，一种独立开放指令协议，旨在为 Web 应用系统提供一种可靠的单点登录方法。
1.  用户访问app系统，app系统是需要登录的，但用户现在没有登录。
2.  跳转到CAS server，即SSO登录系统，**以后图中的CAS Server我们统一叫做SSO系统。** SSO系统也没有登录，弹出用户登录页。
3.  用户填写用户名、密码，SSO系统进行认证后，将登录状态写入SSO的session，浏览器（Browser）中写入SSO域下的Cookie。
4.  SSO系统登录完成后会生成一个ST（Service Ticket），然后跳转到app系统，同时将ST作为参数传递给app系统。
5.  app系统拿到ST后，从后台向SSO发送请求，验证ST是否有效。
6.  验证通过后，app系统将登录状态写入session并设置app域下的Cookie。

至此，跨域单点登录就完成了。以后我们再访问app系统时，app就是登录的。接下来，我们再看看访问app2系统时的流程。

1.  用户访问app2系统，app2系统没有登录，跳转到SSO。
2.  由于SSO已经登录了，不需要重新登录认证。
3.  SSO生成ST，浏览器跳转到app2系统，并将ST作为参数传递给app2。
4.  app2拿到ST，后台访问SSO，验证ST是否有效。
5.  验证成功后，app2将登录状态写入session，并在app2域下写入Cookie。

这样，app2系统不需要走登录流程，就已经是登录了。SSO，app和app2在不同的域，它们之间的session不共享也是没问题的。
**OAuth2**
OAuth（开放授权）是一个开放标准，允许用户让第三方应用访问该用户在某一网站上存储的私密的资源（如照片，视频，联系人列表），而无需将用户名和密码提供给第三方应用。

通俗说，OAuth就是一种授权的协议，只要授权方和被授权方遵守这个协议去写代码提供服务，那双方就是实现了OAuth模式。

  

跨域前端能做什么：
此代码采用OAuth2。关于`token`存储问题，参考了网上许多教程，大部分都是将`token`存储在`cookie`中，然后将`cookie`设为顶级域来解决跨域问题，但我司业务需求是某些产品顶级域也各不相同。故实现思路是将`token`存储在`localStorage`中，然后通过H5的新属性`postMessage`来实现跨域共享。
