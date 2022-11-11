 [从浏览器多进程到JS单线程，JS运行机制最全面的一次梳理](https://segmentfault.com/a/1190000012925872)
[一文看懂Chrome浏览器运行机制]https://zhuanlan.zhihu.com/p/102149546  
##  概念
### CPU
### GPU
### 进程和线程
一个进程有一个或多个线程，线程之间共同完成进程分配下来的任务
进程是cpu资源分配的最小单位（是能拥有资源和独立运行的最小单位），线程是cpu调度的最小单位（线程是建立在进程的基础上的一次程序运行单位）。
### 进程
是操作系统资源分配的基本单位，即正在运行的应用实例。启动应用就会创建一个进程
每个进程都有自己独立的一块内存空间，关闭该进程时，操作系统会释放本进程的内存空间。由于不同进程间是相互独立的，各自拥有自己的内存空间资源，所以两个进程之间的通信，需要通过进程间通信IPC（Inter-Process Communication）来实现。
### 线程
是处理器任务调度和执行的基本单位，即存在于进程并执行程序任意部分，每个进程至少做一件事，所以一个进程至少有一个线程，甚至多线程进行工作。

同一进程的线程会共享本进程的内存地址空间，线程之间的通信可以通过全局变量进行通信，所以如果多个线程在操作写变量时将会带来不可预测的后果，也就引入了各种锁（例如互斥锁）的作用。同时，多个线程也是不安全的，当一个线程崩溃了，将会导致整个进程崩溃。但多个进程之间就不会，一个进程崩溃了，另一个进程仍然可以继续运行。
### 协程
早有异步编程的解决方案（其实是多任务的解决方案）。其中有一种叫做["协程"](https://en.wikipedia.org/wiki/Coroutine)（coroutine），意思是多个线程互相协作，完成异步任务。
又称微线程，协程是属于线程的，是在线程里面跑的。协程的特点在于是一个线程执行的，协程的调度切换是由用户（程序本身）手动控制的，不存在线程上下文切换的消耗；同时，因为协程是在一个线程执行的，所以不需要多线程的锁机制。所以协程的执行效率比多线程高的多。
`Generator` 函数是`协程`在 `ES6` 的实现
协程有点像函数，又有点像线程。它的运行流程大致如下。

> 第一步，协程A开始执行。
> 
> 第二步，协程A执行到一半，进入暂停，执行权转移到协程B。
> 
> 第三步，（一段时间后）协程B交还执行权。
> 
> 第四步，协程A恢复执行。

上面流程的协程A，就是异步任务，因为它分成两段（或多段）执行。

举例来说，读取文件的协程写法如下。

> ```javascript
> 
> function asnycJob() {
>   // ...其他代码
>   var f = yield readFile(fileA);
>   // ...其他代码
> }
> ```

上面代码的函数 asyncJob 是一个协程，它的奥妙就在其中的 yield 命令。它表示执行到此处，执行权将交给其他协程。也就是说，yield命令是异步两个阶段的分界线。

协程遇到 yield 命令就暂停，等到执行权返回，再从暂停的地方继续往后执行。它的最大优点，就是代码的写法非常像同步操作，如果去除yield命令，简直一模一样。

## 浏览器内的进程
其实大概可以分为两种架构，一种是单进程架构，也就是只启动一个进程，这个进程里面有多个线程工作。第二种是多进程架构，浏览器会启动多个进程，每个进程里面有多个线程，不同进程通过IPC进行通信。
## 浏览器多进程
### 包括哪些
chrome浏览器架构，它采用的是**多进程架构**
![[Pasted image 20220526145650.png]]
Chrome浏览器会有一个浏览器进程（browser process），这个进程会和其他进程一起协作来实现浏览器的功能。对于渲染进程（renderer process），Chrome会尽可能为每一个tab甚至是页面里面的每一个iframe都分配一个单独的进程
![[Pasted image 20220526145717.png]]
![[Pasted image 20220526145734.png]]
上面列出来的进程，Chrome还有很多其他进程在工作，例如扩展进程（Extension Process）和工具进程（utility process）
### 好处/坏处
1. 一个好处是多进程可以使浏览器具有很好的容错性：一个tab的崩溃时，你可以随时关闭这个tab并且其他tab不受到影响
2. 另外一个好处就是可以提供安全性和沙盒性（sanboxing）：因为操作系统可以提供方法让你限制每个进程拥有的能力，所以浏览器可以让某些进程不具备某些特定的功能。例如，由于tab渲染进程可能会处理来自用户的随机输入，所以Chrome限制了它们对系统文件随机读写的能力。
3. 坏处：进程的内存消耗：由于每个进程都有各自独立的内存空间，所以它们不能像存在于同一个进程的线程那样共用内存空间，这就造成了一些基础的架构（例如V8 JavaScript引擎）会在不同进程的内存空间同时存在的问题，这些重复的内容会消耗更多的内存。所以为了节省内存，Chrome会限制被启动的进程数目，当进程数达到一定的界限后，Chrome会将**访问同一个网站的tab都放在一个进程里面跑**。（chrome本身也有优化）

## 浏览器渲染进程
### 多线程
1.GUI渲染线程
2.JS引擎线程
3.事件触发线程
4.定时触发器线程
5.异步http请求线程
## JS引擎线程
为什么js引擎是单线程的：这个问题其实应该没有标准答案，譬如，可能仅仅是因为由于多线程的复杂性，譬如多线程操作一般要加锁，因此最初设计时选择了单线程。。
## 一次简单的导航发生了什么
 [从浏览器多进程到JS单线程，JS运行机制最全面的一次梳理](https://segmentfault.com/a/1190000012925872)
### 1. 处理输入
用户开始在导航栏上面输入内容，UI线程（UI thread），判定是将用户输入发送给搜索引擎还是直接请求你输入的站点资源
### 2.开始导航
当用户按下回车键的时候，UI线程会叫网络线程（network thread），
传统：初始化一个网络请求来获取站点的内容。这时候tab上会展示一个提示资源正在加载中的旋转圈圈，而且网络线程会进行一系列诸如DNS寻址以及为请求建立TLS连接的操作。这时如果网络线程收到服务器的HTTP 301重定向响应，它就会告知UI线程进行重定向然后它会再次发起一个新的网络请求。
若请求的域名已经在service worker的作用范围（scope）内，即之前注册过： 网络线程会根据请求的域名在已经注册的service worker作用范围里面寻找有没有对应的service worker。如果有命中该URL的service worker，UI线程就会为这个service worker启动一个渲染进程（renderer process）来执行它的代码。Service worker既可能使用之前缓存的数据也可能发起新的网络请求。（若还是要发起请求，岂不是浪费事件->优化导航预加载，[导航预加载](https://link.zhihu.com/?target=https%3A//developers.google.com/web/updates/2017/02/navigation-preload)就是一种通过在service worker启动的时候并行加载对应资源的方式来加快整个导航过程效率的技术。）
todo: 网络线程做了什么，DNS/TLS/收发请求
todo:缓存？ service worker
### 3. 读取响应
网络线程，在收到HTTP响应的主体（payload）流（stream）时，
（不重要）（在必要的情况下它会先检查一下流的前几个字节以确定响应主体的具体媒体类型（MIME Type）。响应主体的媒体类型一般可以通过HTTP头部的Content-Type来确定，不过Content-Type有时候会缺失或者是错误的，这种情况下浏览器就要进行[MIME类型嗅探](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)来确定响应类型了。MIME类型嗅探并不是一件容易的事情，你可以从[Chrome的源代码](https://link.zhihu.com/?target=https%3A//cs.chromium.org/chromium/src/net/base/mime_sniffer.cc%3Fsq%3Dpackage%3Achromium%26dr%3DCS%26l%3D5)的注释来了解不同浏览器是如何根据不同的Content-Type来判断出主体具体是属于哪个媒体类型的。）
如果响应的主体是一个HTML文件，浏览器会将获取的响应数据交给渲染进程（renderer process）来进行下一步的工作。（网络线程还会做[SafeBrowsing](https://link.zhihu.com/?target=https%3A//safebrowsing.google.com/)检查，和CORB检查，保证敏感的跨站数据不会发送至渲染进程）
如果拿到的响应数据是一个压缩文件（zip file）或者其他类型的文件，响应数据就会交给下载管理器（download manager）来处理。
### 4.寻找一个渲染进程（renderer process）
网络线程做完检查，并且确定浏览器应该导航到该请求的站点，就会告诉UI线程所有的数据都已经被准备好了，UI线程会为这个网站寻找一个渲染进程（renderer process）来渲染界面。（优化：渲染进程提前准备，第二步UI线程已经知道URL链接时，就会准备渲染进程，如重定向，则废弃已准备的渲染进程，重新启动一个）
### 5.提交（commit）导航
数据和渲染进程都已经准备好，浏览器进程（browser process）会通过IPC告诉渲染进程去提交本次导航（commit navigation）。
浏览器进程还会将刚接收到的响应数据流传递给对应的渲染进程让它继续接收到来的HTML数据。
一旦浏览器进程收到渲染线程的回复说导航已经被提交了（commit），导航这个过程就结束了，文档的加载阶段（document loading phase）会正式开始。
这个时候，导航栏会被更新，安全指示符（security indicator）和站点设置UI（site settings UI）会展示新页面相关的站点信息。当前tab的会话历史（session history）也会被更新

### 额外步骤
渲染进程开始着手加载资源以及渲染页面
todo  渲染进程渲染页面的细节
一旦渲染进程“完成”（finished）渲染，它会通过IPC告知浏览器进程，此时页面上所有侦的onload事件都已经触发，且onload的处理函数也执行完。
UI线程就会停止导航栏上旋转的圈圈。

### 导航到不同的站点
询问一下当前的渲染进程需不需要处理一下**[beforeunload](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/en-US/docs/Web/Events/beforeunload)**事件。
然后重复上述步骤**
1.在URL栏输入一个不同的地址
2.页面内发起：导航请求是由渲染进程给浏览器进程发起的

起一个新的渲染进程，当前进程处理一些收尾工作，例如**unload**事件的监听函数执行

## 渲染进程里面发生的事
**渲染进程的主要任务是将HTML，CSS，以及JavaScript转变为我们可以进程交互的网页内容**。
渲染进程负责标签（tab）内发生的所有事情。在渲染进程里面，主线程（main thread）处理了绝大多数你发送给用户的代码。如果你使用了web worker或者service worker，相关的代码将会由工作线程（worker thread）处理。合成（compositor）以及光栅（raster）线程运行在渲染进程里面用来高效流畅地渲染出页面内容。
渲染进程中的线程：
•主线程(Main thread)一个：下载资源、执行js、计算样式、进行布局、绘制合成
•光栅线程（Raster thread）
•合成线程（Compositor thread）
•工作线程（Worker thread）可能有几个：用web worker或者service worker
### 解析
#### 构建DOM
渲染进程就会开始接收HTML数据，主线程也会开始解析接收到的文本数据（text string）并把它转化为一个DOM（**D**ocument **O**bject **M**odel）对象
#### 子资源加载
诸如图片，CSS样式以及JavaScript脚本等子资源，从缓存或者网络上获取。
主线程会按照在构建DOM树时遇到各个资源的循序一个接着一个地发起网络请求。（提升效率，预加载扫描：如果在HTML文档里面存在诸如\或者\这样的标签，预加载扫描程序会在HTML解析器生成的token里面找到对应要获取的资源，并把这些要获取的资源告诉浏览器进程里面的网络线程。）
![[Pasted image 20220526155043.png]]
#### JavaScript会阻塞HTML的解析过程
当HTML解析器碰到script标签的时候，它会停止HTML文档的解析从而转向JavaScript代码的加载，解析以及执行。
为什么：因为script标签中的JavaScript可能会使用诸如`document.write()`这样的代码改变文档流（document）的形状，从而使整个DOM树的结构发生根本性的改变
todo: JS的加载，解析和执行 https://mathiasbynens.be/notes/shapes-ics

#### 如何加载资源的提示[async](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/en-US/docs/Web/HTML/Element/script%23attr-async) [defer](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/en-US/docs/Web/HTML/Element/script%23attr-defer)[JavaScript Module](https://link.zhihu.com/?target=https%3A//developers.google.com/web/fundamentals/primers/modules)<link rel="preload">
。如果你的JavaScript不会使用到诸如`document.write()`的方式去改变文档流的内容的话你可以为script标签添加一个[async](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/en-US/docs/Web/HTML/Element/script%23attr-async)或者[defer](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/en-US/docs/Web/HTML/Element/script%23attr-defer)属性来使JavaScript脚本进行异步加载。当然如果能满足到你的需求，你也可以使用[JavaScript Module](https://link.zhihu.com/?target=https%3A//developers.google.com/web/fundamentals/primers/modules)。同时`<link rel="preload">`资源预加载可以用来告诉浏览器这个资源在当前的导航肯定会被用到，你想要尽快加载这个资源。更多相关的内容，你可阅读[Resource Prioritization - Getting the Browser to Help You](https://link.zhihu.com/?target=https%3A//developers.google.com/web/fundamentals/performance/resource-prioritization)这篇文章。

#### 样式计算 - Style calculation
主线程会解析页面的CSS从而确定每个DOM节点的计算样式（computed style）。
![[Pasted image 20220526154931.png]]
#### 布局 - Layout
还需要通过布局（layout）来计算出每个节点的**几何信息**（geometry）。。布局的具体过程是：主线程会遍历刚刚构建的DOM树，根据DOM节点的计算样式计算出一个布局树（layout tree）。布局树上每个节点会有它在页面上的x，y坐标以及盒子大小（bounding box sizes）的具体信息。布局树长得和先前构建的DOM树差不多，不同的是这颗树只有那些可见的（visible）节点信息。举个例子，如果一个节点被设置为了**display:none**，这个节点就是不可见的就不会出现在布局树上面（**visibility:hidden**的节点会出现在布局树上面，你可以思考一下这是为什么）。同样的，如果一个伪元素（pseudo class）节点有诸如`p::before{content:"Hi!"}`这样的内容，它会出现在布局上，而不存在于DOM树上。
![[Pasted image 20220526154910.png]]
#### 绘画 - Paint
在绘画这个步骤中，主线程会遍历之前得到的布局树（layout tree）来生成一系列的绘画记录（paint records）。绘画记录是对绘画过程的注释，例如“首先画背景，然后是文本，最后画矩形”。
![[Pasted image 20220526155025.png]]

#### 高成本的重排+重绘
![[v2-cf7e1d2d962f0fc935b6b38b85139897_b.gif]]
即使你的渲染流水线更新是和屏幕的刷新频率保持一致的，这些更新是运行在主线程上面的，这就意味着它可能被同样运行在主线程上面的JavaScript代码阻塞。

  

![](https://pic3.zhimg.com/80/v2-a0de2b17580a4b6a1fffbbf471ce7f3e_1440w.jpg)

某些动画帧被JavaScript阻塞了

对于这种情况，你可以将要被执行的JavaScript操作拆分为更小的块然后通过`requestAnimationFrame`这个API把他们放在每个动画帧中执行。想知道更多关于这方面的信息的话，可以参考[Optimize JavaScript Execution](https://link.zhihu.com/?target=https%3A//developers.google.com/web/fundamentals/performance/rendering/optimize-javascript-execution)。当然你还可以将JavaScript代码放在[WebWorkers](https://link.zhihu.com/?target=https%3A//www.youtube.com/watch%3Fv%3DX57mh8tKkgE)中执行来避免它们阻塞主线程。

  

![](https://pic2.zhimg.com/80/v2-edcf6d3cb0948d20187e7574eebeb6d9_1440w.jpg)

在动画帧上运行一小段JavaScript代码
#### 合成
Compostite Layers：CPU 把生成的 BitMap（位图）传输到 GPU，渲染到屏幕。

**光栅化（rasterizing）**：文档结构，元素的样式，元素的几何信息以及它们的绘画顺序转化为显示器的像素的过程。
最简单的做法就是只光栅化视口内（viewport）的网页内容。如果用户进行了页面滚动，就移动光栅帧（rastered frame）并且光栅化更多的内容以补上页面缺失的部分。
![动图](https://pic1.zhimg.com/v2-9ed512afc63c664458faf1bd42247cc0_b.webp)
现代的浏览器采用合成（compositing）：合成是一种将页面分成若干层，然后分别对它们进行光栅化，最后在一个单独的线程 - 合成线程（compositor thread）里面合并成一个页面的技术。
当用户滚动页面时，由于页面各个层都已经被光栅化了，浏览器需要做的只是合成一个新的帧来展示滚动后的效果罢了。页面的动画效果实现也是类似，将页面上的层进行移动并构建出一个新的帧即可。
![动图](https://pic2.zhimg.com/v2-ae1b6d19e8aeb45841f04bbfa72760dd_b.webp)
##### 页面分层

1.为了确定哪些元素需要放置在哪一层，**主线程**需要遍历渲染树来创建一棵层次树（Layer Tree）（在DevTools中这一部分工作叫做“Update Layer Tree”）。
2.层次树创建出来并且页面元素的绘制顺序确定后，**主线程**就会向**合成线程**（compositor thread）提交这些信息。
3.**合成线程**就会光栅化页面的每一层。因为页面的一层可能有整个网页那么大，所以合成线程需要将它们切分为一块又一块的小图块（tiles）然后将图块发送给一系列**光栅线程（raster threads）**。（合成线程可以给不同的光栅线程赋予不同的**优先级**（prioritize）；响应用户对页面的放大和缩小操作，页面的图层（layer）会为不同的**清晰度**配备不同的图块。）
4.**光栅线程**会栅格化每个图块并且把它们存储在**GPU的内存**中。
5.当图层上面的图块都被栅格化后，**合成线程**会收集图块上面叫做**绘画四边形**（draw quads）的信息来构建一个**合成帧**（compositor frame）。
6.完成后，**合成线程**就会通过IPC向**浏览器进程**（browser process）提交（commit）一个渲染帧。这个时候可能有另外一个合成帧被浏览器进程的UI线程（UI thread）提交以改变浏览器的UI。这些合成帧都会被发送给**GPU**从而展示在屏幕上。如果合成线程收到页面滚动的事件，合成线程会构建另外一个合成帧发送给GPU来更新页面。
#### 从浏览器的角度来看输入事件
用户做了一些诸如触碰屏幕的手势动作时，
1.**浏览器进程**（browser process）首先接收到，但是标签内（tab）的处理逻辑在渲染进程中，
2.因此**浏览器进程**将事件的类型（如`touchstart`）以及坐标（coordinates）发送给**渲染进程**
3.**渲染进程**hit test找到target,然后运行这个事件绑定的监听函数（listener）.
##### 非快速滚动区域
如果当前页面不存在任何用户事件的监听器（event listener），合成线程完全不需要主线程的参与就能创建一个新的合成帧来响应事件。可是如果页面有一些事件监听器（event listeners）,通过标记非快速滚动区域，来判断是否需要交由主线程处理。
因为页面的JavaScript脚本是在主线程（main thread）中运行的，所以当一个页面被合成的时候，合成线程会将页面那些注册了事件监听器的区域标记为“非快速滚动区域”（Non-fast Scrollable Region）。由于知道了这些信息，当用户事件发生在这些区域时，合成线程会将输入事件发送给主线程来处理。如果输入事件不是发生在非快速滚动区域，合成线程就无须主线程的参与来合成一个新的帧。
事件委托，会将大面积区域标记为非快速滚动区域。当用户输入事件发生时，合成线程每次都会告知主线程并且会等待主线程处理完它才干活。因此这种情况下合成线程就丧失提供流畅用户体验的能力 解决：传递`passive：true`选项，选项会告诉浏览器您仍要在主线程中侦听事件，可是合成线程也可以继续合成新的帧。
#### 浏览器最小化发送给主线程的事件数
事件淹没了屏幕刷新的时间轴，导致页面很卡顿![[Pasted image 20220619132049.png]]
为了最大程度地减少对主线程的过多调用，Chrome会合并连续事件（例如`wheel`，`mousewheel`，`mousemove`，`pointermove`，`touchmove`），并将调度延迟到下一个`requestAnimationFrame`之前。

  

![](https://pic1.zhimg.com/80/v2-1dbca643e243b47a3a1ac5ef1aa4183c_1440w.jpg)

和之前相同的事件轴，可是这次事件被合并并延迟调度了

任何诸如`keydown`，`keyup`，`mouseup`，`mousedown`，`touchstart`和`touchend`等相对不怎么频繁发生的事件都会被立即派送给主线程。
#### 使用getCoalesecedEvents来获取帧内（intra-frame）事件
如果你正在构建的是一个根据用户的`touchmove`坐标来进行绘图的应用的话，合并事件可能会使页面画的线不够顺畅和连续。在这种情况下，你可以使用鼠标事件的`getCoalescedEvents`来获取被合成的事件的详细信息。
```js
window.addEventListener('pointermove', event => {
    const events = event.getCoalescedEvents();
    for (let event of events) {
        const x = event.pageX;
        const y = event.pageY;
        // draw a line using x and y coordinates.
    }
});
```


# 重排重绘
https://juejin.cn/post/6844904083212468238
## 重排比重绘大：

大，在这个语境里的意思是：谁能影响谁？

-   重绘：某些元素的外观被改变，例如：元素的填充颜色
-   重排：重新生成布局，重新排列元素。

就如上面的概念一样，单单改变元素的外观，肯定不会引起网页重新生成布局，但当浏览器完成重排之后，将会重新绘制受到此次重排影响的部分。比如改变元素高度，这个元素乃至周边dom都需要重新绘制。

也就是说：**重绘不一定导致重排，但重排一定会导致重绘**。

## 重排(reflow)：

### 概念：

当DOM的变化影响了元素的几何信息(元素的的位置和尺寸大小)，浏览器需要重新计算元素的几何属性，将其安放在界面中的正确位置，这个过程叫做重排。

重排也叫回流，简单的说就是重新生成布局，重新排列元素。

### 下面情况会发生重排：

-   页面初始渲染，这是开销最大的一次重排
-   添加/删除可见的DOM元素
-   改变元素位置
-   改变元素尺寸，比如边距、填充、边框、宽度和高度等
-   改变元素内容，比如文字数量，图片大小等
-   改变元素字体大小
-   改变浏览器窗口尺寸，比如resize事件发生时
-   激活CSS伪类（例如：`:hover`）
-   设置 style 属性的值，因为通过设置style属性改变结点样式的话，每一次设置都会触发一次reflow
-   查询某些属性或调用某些计算方法：offsetWidth、offsetHeight等，除此之外，当我们调用 `getComputedStyle`方法，或者IE里的 `currentStyle` 时，也会触发重排，原理是一样的，都为求一个“即时性”和“准确性”。

常见引起重排属性和方法

![[Pasted image 20220619115045.png]]

### 重排影响的范围：

由于浏览器渲染界面是基于流式布局模型的，所以触发重排时会对周围DOM重新排列，影响的范围有两种：

-   全局范围：从根节点html开始对整个渲染树进行重新布局。
-   局部范围：对渲染树的某部分或某一个渲染对象进行重新布局

**全局范围重排：**

```js
<body>
  <div class="hello">
    <h4>hello</h4>
    <p><strong>Name:</strong>BDing</p>
    <h5>male</h5>
    <ol>
      <li>coding</li>
      <li>loving</li>
    </ol>
  </div>
</body>
复制代码
```

当p节点上发生reflow时，hello和body也会重新渲染，甚至h5和ol都会收到影响。

**局部范围重排：**

用局部布局来解释这种现象：把一个dom的宽高之类的几何信息定死，然后在dom内部触发重排，就只会重新渲染该dom内部的元素，而不会影响到外界。

## 重绘(Repaints):

### 概念：

当一个元素的外观发生改变，但没有改变布局,重新把元素外观绘制出来的过程，叫做重绘。

### 常见的引起重绘的属性：
![[Pasted image 20220619115113.png]]

## 重排优化建议：
重排的代价是高昂的，会破坏用户体验，并且让UI展示非常迟缓。通过减少重排的负面影响来提高用户体验的最简单方式就是尽可能的减少重排次数，重排范围。下面是一些行之有效的建议，大家可以用来参考。
### 1.减少重排范围
应该尽量以局部布局的形式组织html结构，尽可能小的影响重排的范围。-  尽可能在低层级的DOM节点上，而不是像上述全局范围的示例代码一样，如果你要改变p的样式，class就不要加在div上，通过父元素去影响子元素不好。
### 2.减少重排次数
#### 1.样式集中改变
#### 2.分离读写操作
DOM 的多个读操作（或多个写操作），应该放在一起。不要两个读操作之间，加入一个写操作。
渲染队列机制：当我们修改了元素的几何属性，导致浏览器触发重排或重绘时。它会把该操作放进渲染队列，等到队列中的操作到了一定的数量或者到了一定的时间间隔时，浏览器就会批量执行这些操作。但是访问某些属性时，浏览器为了得到最新的属性值，就会清空渲染队列，立即执行重排操作，所以避免访问会引起flush队列的属性，如要访问，利用缓存
#### 3.将 DOM 离线
（1）使用 display:none
（2）通过 [documentFragment](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FDocumentFragment "https://developer.mozilla.org/zh-CN/docs/Web/API/DocumentFragment") 创建一个 `dom` 碎片,在它上面批量操作 `dom`，操作完成之后，再添加到文档中，这样只会触发一次重排。
（3）复制节点，在副本上工作，然后替换它！
#### 4.使用 absolute 或 fixed 脱离文档流
元素脱离了文档流之后，不会影响其他元素的布局，所以只会导致导致其他元素重绘，避免重排，可以减少开销
#### 5.优化动画
（1）应用到 `position`属性为 `absolute` 或 `fixed` 的元素上，这样对其他元素影响较小。
（2）牺牲一些平滑，来换取速度，以1个像素为单位移动这样最平滑，但是Layout就会过于频繁，大量消耗CPU资源，如果以3个像素为单位移动则会好很多
（3）启用GPU加速 `GPU` 硬件加速是指应用 `GPU` 的图形性能对浏览器中的一些图形操作交给 `GPU` 来完成，因为 `GPU` 是专门为处理图形而设计，所以它在速度和能耗上更有效率。
`GPU` 加速通常包括以下几个部分：Canvas2D，布局合成, CSS3转换（transitions），CSS3 3D变换（transforms），WebGL和视频(video)。

# 图层
普通图层
复合图层
硬件加速
渲染步骤中就提到了`composite`概念。

可以简单的这样理解，浏览器渲染的图层一般包含两大类：`普通图层`以及`复合图层`

首先，普通文档流内可以理解为一个复合图层（这里称为`默认复合层`，里面不管添加多少元素，其实都是在同一个复合图层中）

其次，absolute布局（fixed也一样），虽然可以脱离普通文档流，但它仍然属于`默认复合层`。

然后，可以通过`硬件加速`的方式，声明一个`新的复合图层`，它会单独分配资源  
（当然也会脱离普通文档流，这样一来，不管这个复合图层中怎么变化，也不会影响`默认复合层`里的回流重绘）

可以简单理解下：**GPU中，各个复合图层是单独绘制的，所以互不影响**，这也是为什么某些场景硬件加速效果一级棒

可以`Chrome源码调试 -> More Tools -> Rendering -> Layer borders`中看到，黄色的就是复合图层信息

如下图。可以验证上述的说法

![](https://segmentfault.com/img/remote/1460000012925882)

**如何变成复合图层（硬件加速）**

将该元素变成一个复合图层，就是传说中的硬件加速技术

-   最常用的方式：`translate3d`、`translateZ`
-   `opacity`属性/过渡动画（需要动画执行的过程中才会创建合成层，动画没有开始或结束后元素还会回到之前的状态）
-   `will-chang`属性（这个比较偏僻），一般配合opacity与translate使用（而且经测试，除了上述可以引发硬件加速的属性外，其它属性并不会变成复合层），

作用是提前告诉浏览器要变化，这样浏览器会开始做一些优化工作（这个最好用完后就释放）

-   `<video><iframe><canvas><webgl>`等元素
-   其它，譬如以前的flash插件

**absolute和硬件加速的区别**

可以看到，absolute虽然可以脱离普通文档流，但是无法脱离默认复合层。  
所以，就算absolute中信息改变时不会改变普通文档流中render树，  
但是，浏览器最终绘制时，是整个复合层绘制的，所以absolute中信息的改变，仍然会影响整个复合层的绘制。  
（浏览器会重绘它，如果复合层中内容多，absolute带来的绘制信息变化过大，资源消耗是非常严重的）

而硬件加速直接就是在另一个复合层了（另起炉灶），所以它的信息改变不会影响默认复合层  
（当然了，内部肯定会影响属于自己的复合层），仅仅是引发最后的合成（输出视图）

**复合图层的作用？**

一般一个元素开启硬件加速后会变成复合图层，可以独立于普通文档流中，改动后可以避免整个页面重绘，提升性能

但是尽量不要大量使用复合图层，否则由于资源消耗过度，页面反而会变的更卡

**硬件加速时请使用index**

使用硬件加速时，尽可能的使用index，防止浏览器默认给后续的元素创建复合层渲染

具体的原理时这样的：  
**webkit CSS3中，如果这个元素添加了硬件加速，并且index层级比较低，  
那么在这个元素的后面其它元素（层级比这个元素高的，或者相同的，并且releative或absolute属性相同的），  
会默认变为复合层渲染，如果处理不当会极大的影响性能**

简单点理解，其实可以认为是一个隐式合成的概念：**如果a是一个复合图层，而且b在a上面，那么b也会被隐式转为一个复合图层**，这点需要特别注意



### 总结： 览器的渲染过程（小抄）
1.  **Create/Update DOM And request css/image/js**：浏览器请求到HTML代码后，在生成DOM的最开始阶段（应该是 Bytes → characters 后），并行发起css、图片、js的请求，无论他们是否在HEAD里。  
    _注意：发起 js 文件的下载 request 并不需要 DOM 处理到那个 script 节点，比如：简单的正则匹配就能做到这一点，虽然实际上并不一定是通过正则：）。这是很多人在理解渲染机制的时候存在的误区。_
2.  **Create/Update Render CSSOM**：CSS文件下载完成，开始构建CSSOM
3.  **Create/Update Render Tree**：所有CSS文件下载完成，CSSOM构建结束后，和 DOM 一起生成 Render Tree。
4.  **Layout**：有了Render Tree，浏览器已经能知道网页中有哪些节点、各个节点的CSS定义以及他们的从属关系。下一步操作称之为Layout，顾名思义就是计算出每个节点在屏幕中的位置。
5.  **Painting**：Layout后，浏览器已经知道了哪些节点要显示（which nodes are visible）、每个节点的CSS属性是什么（their computed styles）、每个节点在屏幕中的位置是哪里（geometry）。就进入了最后一步：Painting，按照算出来的规则，通过显卡，把内容画到屏幕上。
以上五个步骤前3个步骤之所有使用 “Create/Update” 是因为DOM、CSSOM、Render Tree都可能在第一次Painting后又被更新多次，比如JS修改了DOM或者CSS属性。
Layout 和 Painting 也会被**重复**执行，除了DOM、CSSOM更新的原因外，图片下载完成后也需要调用Layout 和 Painting来更新网页。