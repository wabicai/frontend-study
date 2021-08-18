## SVG和Canvas的区别

1. SVG 是一种使用 XML 描述 2D 图形的语言。
2. Canvas 通过 JavaScript 来绘制 2D 图形。
3. SVG 基于 XML，这意味着 SVG DOM 中的每个元素都是可用的。您可以为某个元素附加 JavaScript 事件处理器。
4. 在 SVG 中，每个被绘制的图形均被视为对象。如果 SVG 对象的属性发生变化，那么浏览器能够自动重现图形。
5. Canvas 是逐像素进行渲染的。在 canvas 中，一旦图形被绘制完成，它就不会继续得到浏览器的关注。如果其位置发生变化，那么整个场景也需要重新绘制，包括任何或许已被图形覆盖的对象。

## 客户端存储方案**Web Storage**

使用HTML5可以在本地存储用户的浏览数据。早些时候,本地存储使用的是==cookies==。（一个cookies储存4k的数据，不同浏览器可以储存的个数不同，如IE6每个域20个）

Web 存储需要更加的安全与快速. 这些数据不会被保存在服务器上，但是这些数据只用于用户请求网站数据上.

它也可以存储大量的数据，而==不影响网站的性能==。

数据以 键/值 对存在, ==web网页的数据只允许该网页访问使用==。

客户端存储数据的两个对象为：

==localStorage - 没有时间限制的数据存储==（储存大小为5M左右）

==sessionStorage - 针对一个 session 的数据存储, 当用户关闭浏览器窗口后，数据会被删除。==

### localStorage和sessionStorage的区别

1. 他们均只能存储字符串类型的对象
   1. 不同浏览器无法共享localStorage或sessionStorage中的信息。
   2. 相同浏览器的不同页面间可以共享相同的 localStorage（页面属于相同域名和端口）
   3. 但是不同页面或标签页间无法共享sessionStorage的信息

在使用 web 存储前,应检查浏览器是否支持 localStorage 和sessionStorage

```js
if(typeof(Storage)!=="undefined")
   {
   // 是的! 支持 localStorage  sessionStorage 对象!
   // 一些代码.....
   }
 else
   {
   // 抱歉! 不支持 web 存储。
   }
```

不管是 localStorage，还是 sessionStorage，可使用的API都相同，常用的有如下几个（以localStorage为例）：

- - 保存数据：localStorage.setItem(key,value);
  - 读取数据：localStorage.getItem(key);
  - 删除单个数据：localStorage.removeItem(key);
  - 删除所有数据：localStorage.clear();
  - 得到某个索引的key：localStorage.key(index);

## Web Socket

详见：[WebSocket是什么原理？](https://www.zhihu.com/question/20215561)

WebSocket是HTML5开始提供的一种在单个 TCP 连接上进行全双工通讯的协议。在WebSocket API中，浏览器和服务器只需要做一个握手的动作，然后，浏览器和服务器之间就形成了一条快速通道。两者之间就直接可以数据互相传送。

浏览器通过 JavaScript 向服务器发出建立 WebSocket 连接的请求，连接建立以后，客户端和服务器端就可以通过 TCP 连接直接交换数据。当你获取 Web Socket 连接后，你可以通过 **send()** 方法来向服务器发送数据，并通过 **onmessage** 事件来接收服务器返回的数据。

```js
<!DOCTYPE HTML>
<html>
   <head>
   <meta charset="utf-8">
   <title>W3Cschool教程(w3cschool.cn)</title>
    
      <script type="text/javascript">
         function WebSocketTest()
         {
            if ("WebSocket" in window)
            {
               alert("您的浏览器支持 WebSocket!");
               
               // 打开一个 web socket
               var ws = new WebSocket("ws://localhost:9998/echo");
                
               ws.onopen = function()
               {
                  // Web Socket 已连接上，使用 send() 方法发送数据
                  ws.send("发送数据");
                  alert("数据发送中...");
               };
                
               ws.onmessage = function (evt) 
               { 
                  var received_msg = evt.data;
                  alert("数据已接收...");
               };
                
               ws.onclose = function()
               { 
                  // 关闭 websocket
                  alert("连接已关闭..."); 
               };
            }
            
            else
            {
               // 浏览器不支持 WebSocket
               alert("您的浏览器不支持 WebSocket!");
            }
         }
      </script>
        
   </head>
   <body>
   
      <div id="sse">
         <a href="javascript:WebSocketTest()">运行 WebSocket</a>
      </div>
      
   </body>
</html>
```

