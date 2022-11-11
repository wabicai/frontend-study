参考： 牛客面试宝典
https://juejin.cn/post/7116736167906639886

事件循环：
-   首先检查宏任务队列是否为空，如果不为空，则从队列中取出最先加入的任务
-   把取出的宏任务标记为当前运行中的任务
-   执行宏任务
-   将取出的任务从宏任务队列里删除
-   执行完宏任务后，执行microtasks任务检查点
-   render opportunity() 检查是否需要更新页面，这里检查机制并不是简单的检查更新队列是否为空，浏览器还会考虑到屏幕刷新频率等因素（以下的引用有说明），标准中没有定义具体的规则。比如说，以大于 60HZ 的频率更新页面是没有必要的，因为 30HZ-60HZ 的更新频率在肉眼看来已经很流畅了。如果确定需要更新，则主线程切换到渲染线程，此时，主线程将停止事件循环，直到页面渲染完成。 在执行具体的更新操作操作之前，浏览器会依次触发下面的事件：
		-   dispatch pending UI events
		-   resize event
		-   scroll event
		-   mediaquery listeners
		-   CSSAnimation events
		-   Observers
		-   rAF
如果页面有注册这些事件的函数，则会生成一个宏任务放进宏任务队里，并返回事件循环。当由这一步触发的事件任务经过事件循环都执行完成后，最后才是真正的更新操作。如果在执行任务的期间使用 JavaScript 更改了样式或者DOM元素，使页面需要 reflow/repaint，则浏览器会将这些更改添加到更新队列，并在本轮更新中更新。


在Web应用中，实现动画效果的方法比较多，Javascript 中可以通过定时器 `setTimeout` 来实现，css3 可以使用 `transition` 和 `animation` 来实现，html5 中的 canvas 也可以实现。除此之外，html5 还提供一个专门用于请求动画的API，那就是 `requestAnimationFrame`，顾名思义就是**请求动画帧。**
requestAnimationFrame 

# 渲染页面：浏览器的工作原理
https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work

目标：页面内容快速加载和流畅的交互
手段：评价感知性能，和提升性能两方面

分析：影响用户体验的两个原因
等待资源加载时间和大部分情况下的浏览器单线程执行是影响 Web 性能的两大主要原因。

1.等待时间
网络等待时间+页面加载时间
是需要去克服来让浏览器快速加载资源的主要威胁。为了实现快速加载，开发者的目标就是尽可能快的发送请求的信息，至少看起来相当快。网络等待时间是在链路上传送二进制到电脑端所消耗的链路传输时间。Web 性能优化需要做的就是尽可能快的使页面加载完成。

2.流畅的交互
流畅的页面滚动，迅速的输入响应。渲染时间是关键要素，了解JS单线程，事件循环和渲染相关机制，最小化主线程的责任可以优化 Web 性能，确保渲染的流畅和交互响应的及时。

下面按照步骤来考虑浏览器工作原理以及优化手段：
## 导航
加载 web 页面的第一步。它发生在以下情形：用户通过在地址栏输入一个 URL、点击一个链接、提交表单或者是其他的行为。
性能优化的目标之一就是缩短导航完成所花费的时间，一般不会消耗太多时间，但是等待时间和带宽可能会导致延时。
### DNS查询
导航的第一步是要去寻找页面资源的位置。依次查询DNS缓存，直到查到最终得到一个 IP 地址。然后把他缓存起来。（缓存可以加快后续的查询速度）
### TCP三次握手建立链接
用来让两端尝试进行通信——在浏览器和服务器通过上层协议 [HTTPS](https://developer.mozilla.org/zh-CN/docs/Glossary/https) 发送数据之前，可以协商网络 TCP 套接字连接的一些参数。
### TLS协商
HTTPS中
它决定了什么密码将会被用来加密通信，验证服务器，在进行真实的数据传输之前建立安全连接。在发送真正的请求内容之前还需要三次往返服务器。
![[Pasted image 20220802155125.png]]
## 响应
建立了到 web 服务器的连接，浏览器就代表用户发送一个初始的get请求，这个请求通常是一个 HTML 文件。一旦服务器收到请求，它将使用相关的响应头和 HTML 的内容进行回复。
### TCP慢启动和堵塞控制
![[Pasted image 20220802155636.png]]

## 解析
一旦浏览器收到数据的第一块，它就可以开始解析收到的信息。[“解析”](https://developer.mozilla.org/zh-CN/docs/Glossary/Parse)是浏览器将通过网络接收的数据转换为 [DOM](https://developer.mozilla.org/zh-CN/docs/Glossary/DOM) 和 [CSSOM](https://developer.mozilla.org/zh-CN/docs/Glossary/CSSOM) 的步骤，通过渲染器把 DOM 和 CSSOM 在屏幕上绘制成页面。
### 第一步：构建DOM树
第一步：处理 HTML 标记并构造 DOM 树
HTML 解析涉及到 [tokenization](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMTokenList) 和树的构造。HTML 标记包括开始和结束标记，以及属性名和值。 如果文档格式良好，则解析它会简单而快速。解析器将标记化的输入解析到文档中，构建文档树。

DOM 树描述了文档的内容。[`<html>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/html) 元素是第一个标签也是文档树的根节点。树反映了不同标记之间的关系和层次结构。嵌套在其他标记中的标记是子节点。**DOM 节点的数量越多，构建 DOM 树所需的时间就越长。**

当解析器发现**非阻塞资源**，例如一张**图片**，浏览器会请求这些资源并且继续解析。当遇到一个 **CSS 文件**时，解析也可以继续进行，**但是对于 `<script>` 标签（特别是没有 [`async`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function) 或者 `defer` 属性的）会阻塞渲染并停止 HTML 的解析**。尽管浏览器的预加载扫描器加速了这个过程，但过多的脚本仍然是一个重要的瓶颈。

### 预加载扫描器
浏览器构建 DOM 树时，这个过程占用了主线程。当这种情况发生时，预加载扫描仪将解析可用的内容并请求高优先级资源，如 CSS、JavaScript 和 web 字体。多亏了预加载扫描器，我们不必等到解析器找到对外部资源的引用来请求它。它将在后台检索资源，以便在主 HTML 解析器到达请求的资源时，它们可能已经在运行，或者已经被下载。预加载扫描仪提供的优化减少了阻塞。

当主线程在解析 HTML 和 CSS 时，预加载扫描器将找到脚本和图像，并开始下载它们。为了确保脚本不会阻塞进程，当 JavaScript 解析和执行顺序不重要时，可以添加 `async` 属性或 `defer` 属性。

**等待获取 CSS 不会阻塞 HTML 的解析或者下载**，但是它确实**会阻塞 JavaScript**，因为 JavaScript 经常用于查询元素的 CSS 属性。

### 第二步：构建CSSOM树
构建 CSSOM 非常非常快,总时间通常小于一次 DNS 查询所需的时间

### 其他过程
#### JavaScript 编译
#### 构建辅助功能树

## 渲染
渲染步骤包括样式、布局、绘制，在某些情况下还包括合成。在解析步骤中创建的 CSSOM 树和 DOM 树组合成一个 Render 树，然后用于计算每个可见元素的布局，然后将其绘制到屏幕上。在某些情况下，可以将内容提升到它们自己的层并进行合成，通过在 GPU 而不是 CPU 上绘制屏幕的一部分来提高性能，从而释放主线程。

### 第三步是将 DOM 和 CSSOM 组合成一个 Render 树

### 第四步是 layout 布局 在渲染树上运行布局以计算每个节点的几何体。
布局是确定呈现树中所有节点的宽度、高度和位置，以及确定页面上每个对象的大小和位置的过程。回流是对页面的任何部分或整个文档的任何后续大小和位置的确定。
第一次确定节点的大小和位置称为布局。随后对节点大小和位置的重新计算称为回流

### 第五步也是最后一步：paint 绘制
最后一步是将各个节点绘制到屏幕上，第一次出现的节点称为 [first meaningful paint (en-US)](https://developer.mozilla.org/en-US/docs/Glossary/first_meaningful_paint "Currently only available in English (US)")。在绘制或光栅化阶段，浏览器将在布局阶段计算的每个框转换为屏幕上的实际像素。绘画包括将元素的每个可视部分绘制到屏幕上，包括文本、颜色、边框、阴影和替换的元素（如按钮和图像）。浏览器需要非常快地完成这项工作。
绘制可以将布局树中的元素分解为多个层。将内容提升到 GPU 上的层（而不是 CPU 上的主线程）可以提高绘制和重新绘制性能。有一些特定的属性和元素可以实例化一个层，包括 [`<video>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video) 和 [`<canvas>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/canvas)，任何 CSS 属性为 [`opacity`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/opacity) 、3D [`transform`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform)、[`will-change`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/will-change) 的元素，还有一些其他元素。这些节点将与子节点一起绘制到它们自己的层上，除非子节点由于上述一个（或多个）原因需要自己的层。

分层确实可以提高性能，但是它以内存管理为代价，因此不应作为 web 性能优化策略的一部分过度使用。

### compositing
当文档的各个部分以不同的层绘制，相互重叠时，必须进行合成，以确保它们以正确的顺序绘制到屏幕上，并正确显示内容。

## 交互
一旦主线程绘制页面完成，你会认为我们已经“准备好了”，但事实并非如此。如果加载包含 JavaScript（并且延迟到 [`onload`](https://developer.mozilla.org/zh-CN/docs/conflicting/Web/API/Window/load_event) 事件激发后执行），则主线程可能很忙，无法用于滚动、触摸和其他交互。

[Time to Interactive (en-US)](https://developer.mozilla.org/en-US/docs/Glossary/Time_to_interactive "Currently only available in English (US)")（TTI）是测量从第一个请求导致 DNS 查询和 SSL 连接到页面可交互时所用的时间——可交互是 [First Contentful Paint (en-US)](https://developer.mozilla.org/en-US/docs/Glossary/First_contentful_paint "Currently only available in English (US)") 之后的时间点，页面在 50ms 内响应用户的交互。如果主线程正在解析、编译和执行 JavaScript，则它不可用，因此无法及时（小于 50ms）响应用户交互。

# Webgl
isGPUAcceleratorEnabled

非硬件加速环境下渲染优化
```js
// 判断是否是硬件加速环境
function isGPUAcceleratorEnabled() {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl');
  if (gl) {
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      // const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      return !/SwiftShader/gi.test(renderer);
    }
  }
  return false;
}

const isGPUAcceleratorEnabled_ = isGPUAcceleratorEnabled();
```

``` JS
    if (this._width > 0 && this._height > 0) {
      if (isGPUAcceleratorEnabled_) {
        this._canvasCtx.clearRect(-1, -1, this._width + 2, this._height + 2);
        this._canvasCtx.drawImage(this._offscreenEl, 0, 0, this._width, this._height);
      } else {
        this.canvasElement.parentElement?.replaceChild(this._offscreenEl, this.canvasElement);
        const element = this.canvasElement;
        this.canvasElement = this._offscreenEl;
        this._offscreenEl = element;
        const ctx = this._canvasCtx;
        this._canvasCtx = this._offscreenCtx;
        this._offscreenCtx = ctx;
      }
    }
```
