## 1.canvas原理
![[Pasted image 20220812154849.png]]
## 1.svg canvas的区别
  总结：
  1.svg是用xml技术描述二维图形，本质就是一个DOM元素。
  canvas是html5提供的新元素，使用JS绘图(动态生成)，像素级控制更适合绘制复杂的，像素级的内容
  2.标量图，矢量图：矢量图放大不失真，适合做地图，绘制小图标；但不能引入普通图片
  3.canvas绘制图形用canvas方法在js中实现；svg用标签实现
  4.canvas中的图形不能被JS抓取，不能对特定元素进行事件绑定
  5.渲染模式逻辑不同：
     Dom元素是作为矢量图进行渲染的。每一个元素都需要单独处理，layout+painting，由DOM+CSSOM=>rendertree 计算出位置信息，再绘制，全都处理成像素再能输出到屏幕上，计算量庞大。当内容非常多，存在大量DOM元素的时候，这些内容的渲染速度就会变得很慢。同时也会耗费更多的内存。驻留模式。
     Canvas与DOM的区别则是Canvas的本质就是一张**位图**，类似img标签，或者一个div加了一张背景图（background-image）。所以，DOM那种矢量图在渲染中存在的问题换到Canvas身上就完全不同了。调用完接口，就知道需要绘制的位置了，渲染时，浏览器只需要在JS引擎中执行绘制，在内存中构建出画布，遍历画布里**所有点**，直接输出对应颜色到屏幕就可以。不管Canvas里面的元素有多少个，浏览器在渲染阶段也仅需要处理一张画布。少了计算步骤，更快速，也少了大量DOM的存储，内存消耗是一定的。快速模式
## 2.优点：
1.Canvas站在DOM对面，浏览器对其内容一无所知，渲染权利掌握在开发者手上，性能优势，内存消耗稳定。
2.绘制种类更为丰富的UI元素，如线形、特殊图形等，
3.通过画法逻辑，实现更精准UI界面渲染，
4.解决浏览器差异带来样式误差，让更多应用场景可以顺利迁移到Web平台上来。
5.开启webgl进行GPU加速
## 3.canvas 污染
  （1）什么是 canvas 污染么：
  将一张跨域的图片绘制到 canvas 上，这个 canvas 就是被污染的，此时无法读取该 canvas 的数据。
  （2）为什么
  同源策略的限制。应该是为了避免第三方网站读取其他网站的图片数据（Canvas 渲染第三方图片请求不受 CORS 限制），避免用户隐私泄露。比如已知某个隐私图片的 url，进入第三方网站后，可以请求到该图片，如果不做数据读取限制的话，该数据将被传送到网站后台进而导致信息泄露。
  （3）怎么解决
  要看能否控制图片的响应了。如果可以控制的话，利用 cors 跨域，并在图片请求发起时增加 `crossOrigin = "Anonymous"` 设置；否则只能自己的网站做个代理，让网站与图片同源。
## 4. 判断是否开始webgl
var Detector = {
    canvas: !!window.CanvasRenderingContext2D,
    webgl: (function() {
        try {
            var canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch(e) {
            return false;
        }
    })(),
4.判断是否支持webasemmbly

todo 
canvas 保姆教程
https://juejin.cn/post/7008064185972031524
https://juejin.cn/post/7008811592733655077

web动画性能指南 
https://alexorz.github.io/animation-performance-guide/


## 量化动画的流畅程度
因为人眼视觉暂留效应，在帧率到50-60时会感觉动画很流畅舒服，在30帧以下会感到明显卡顿，同时帧率波动也会让人感觉到卡顿。所以说要想保证动画流畅要注意帧率要尽可能稳定在60帧最右。
帧率检测工具：chrome自带的performance rendering工具，
从渲染机制入手，进行流畅度的优化
渲染机制：
1.**HTML解析**（Parse HTML）
2.**解析CSS**（Parse CSS）
3.**生成渲染树**（Render Tree / Frame Tree）
4.**排版/重排**（Layout/Reflow）
5.**绘图/重绘**（Painting）
优化手段：
1.**提升每一帧性能（缩短帧时长，提高帧率）**
    -   避免频繁的重排。减少重排范围次数，分离读写操作，DOM离线操作，牺牲平滑1px->3px，脱离普通文档流，减少对其他元素的影响。
    -   避免大面积的重绘。
    -   优化JS运行性能。
2.**保证帧率平稳（避免跳帧）**
    -   不在连续的动画过程中做高耗时的操作（如大面积重绘、重排、复杂JS执行），避免发生跳帧。
    -   若高耗时操作无法避免，则尝试化解，比如：
        1.  将高耗时操作放在动画开始或结尾处。
        2.  将高耗时操作分摊至动画的每一帧中处理。
3.**针对硬件加速渲染通道的优化**
    -   通过层的变化效果(如transform)实现位移、缩放等动画，可避免重绘。
    -   合理划分层，动静分离，可避免大面积重绘。
    -   使用分层优化动画时，需要留意内存消耗情况（通过Safari调试工具）。
4.**低性能设备优先调试**
    -   Android设备优先调试：移动设备的硬件配置一般低于桌面设备，而移动端设备中，Android设备相比于iOS设备性能普遍较差，因此在Andorid设备下性能问题更加明显，幸运的是Android可以借助Chrome自带的远程调试工具方便调试动画性能（Android 4.0+），所以优先调试Android设备可以更早地发现问题，并能更方便地解决问题。
### 优化小抄tips
1.FPS 60 稳定
2.帧率检测手段
(1) chrome dev-tool rendering
(2)Web Performance Timing API 中的 Frame Timing API，可以轻松的拿到每一帧中，主线程以及合成线程的时间。或者更加容易，直接拿到每一帧的耗时。兼容性不好，没浏览器支持
 window.performance.timing：
![[Pasted image 20220904203643.png]]
（3）requestAnimationFrame API
原理是，正常而言 requestAnimationFrame 这个方法在一秒内会执行 60 次，也就是不掉帧的情况下。假设动画在时间 A 开始执行，在时间 B 结束，耗时 x ms。而中间 requestAnimationFrame 一共执行了 n 次，则此段动画的帧率大致为：n / (B - A)。

核心代码如下，能近似计算每秒页面帧率，以及我们额外记录一个 allFrameCount，用于记录 rAF 的执行次数，用于计算每次动画的帧率

如果我们需要统计某个特定动画过程的帧率，只需要在动画开始和结尾两处分别记录 `allFrameCount` 这个数值大小，再除以中间消耗的时间，也可以得出特定动画过程的 FPS 值。

值得注意的是，这个方法计算的结果和真实的帧率肯定是存在误差的，因为它是将每两次主线程执行 javascript 的时间间隔当成一帧，而非上面说的主线程加合成线程所消耗的时间为一帧。但是对于现阶段而言，算是一种可取的方法。


3.渲染机制
	1.**HTML解析**（Parse HTML）
	2.**解析CSS**（Parse CSS）
	3.**生成渲染树**（Render Tree / Frame Tree）
	4.**排版/重排**（Layout/Reflow）
	5.**绘图/重绘**（Painting）
4.优化
	1.**提升每一帧性能（缩短帧时长，提高帧率）**
	    -   避免频繁的重排。减少重排范围次数，分离读写操作，DOM离线操作，牺牲平滑1px->3px，脱离普通文档流，减少对其他元素的影响。
	    -   避免大面积的重绘。
	    -   优化JS运行性能。
	2.**保证帧率平稳（避免跳帧）**
	    -   不在连续的动画过程中做高耗时的操作（如大面积重绘、重排、复杂JS执行），避免发生跳帧。
	    -   若高耗时操作无法避免，则尝试化解，比如：
	        1.  将高耗时操作放在动画开始或结尾处。
	        2.  将高耗时操作分摊至动画的每一帧中处理。
	3.**针对硬件加速渲染通道的优化**
	    -   通过层的变化效果(如transform)实现位移、缩放等动画，可避免重绘。
	    -   合理划分层，动静分离，可避免大面积重绘。
	    -   使用分层优化动画时，需要留意内存消耗情况（通过Safari调试工具）。
	4.**低性能设备优先调试**
5..对于canvas来说
	1.使用requestAnimationFrame()
	**2.分层渲染：**
	**3.离屏绘制，使用缓存**
	**4.避免使用高性能的API**
	**5.使用webworker进行动画中的复杂运算**
	**6.静态的背景图，用CSS背景插进去**
	**7.避免浮点数坐标，会有额外计算**


1.事件循环，题目
2.事件委托
3.canvas，文字处理
4.vue2响应式处理与实现
5.低端机帧率保证
6.css :flex布局，对象选择器
7.

项目
1.从头到尾做一个文档或白板应该注意哪些细节，遇到问题，怎么解决
性能 模糊1px文档再看一遍
2.笔记场景，遇到问题，怎么解决

无边界滚动，碰撞检测

## 将DOM对象绘制到canvas上
https://simmin.github.io/2016/12/03/draw-dom-to-canvas/
## 方法1：使用html2canvas
引入后使用
```js
// 语法：html2canvas(element, options);
html2canvas(document.body, { 
    allowTaint: true, 
    taintTest: false,
    onrendered: function(canvas) { 
        canvas.id = "mycanvas";
        //document.body.appendChild(canvas); 
        //生成base64图片数据 
        var dataUrl = canvas.toDataURL(); 
        var newImg = document.createElement("img");
        newImg.src = dataUrl; 
        document.body.appendChild(newImg); 
    } 
});
```
![[Pasted image 20220812151803.png]]
## 原理：
https://segmentfault.com/a/1190000038551328
整体思路：将页面中指定的DOM元素渲染到一个离屏canvas中，并将渲染好的canvas返回给用户。
它主要做了以下事情：
1.解析用户传入的options，将其与默认的options合并，得到用于渲染的配置数据renderOptions
2.对传入的DOM元素进行解析，取到节点信息和样式信息，这些节点信息会和上一步的renderOptions配置一起传给canvasRenderer实例，用来绘制离屏canvas
3.canvasRenderer将依据浏览器渲染层叠内容的规则，将用户传入的DOM元素渲染到一个离屏canvas中，这个离屏canvas我们可以在then方法的回调中取到


## 方法2：DOM->Canvas
创建一个包含XML字符串的SVG，然后构造一个Blob对象。
> Blob对象是包含有只读原始数据的类文件对象。

Blob对象的要求：
1.  Blob对象的MIME应为”image/svg+xml”
2.  一个`<svg>`元素
3.  在SVG元素中包含`<foreignObject>`元素
4.  包裹到`<foreignObject>`中的HTML是格式化好的
> foreignObject元素允许包含外来的XML命名空间，其图形内容是别的用户代事绘制的。这个被包含的外来图形内容服从SVG变形和合成。


HTML  
```js
<canvas id="canvas" style="border:2px solid black;" width="200" height="200">
JavaScript  
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var data = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
           '<foreignObject width="100%" height="100%">' +
           '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:40px">' +
             '<em>I</em> like' + 
             '<span style="color:white; text-shadow:0 0 2px blue;">' +
             'cheese</span>' +
           '</div>' +
           '</foreignObject>' +
           '</svg>';
var DOMURL = window.URL || window.webkitURL || window;

var img = new Image();

var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});

var url = DOMURL.createObjectURL(svg);

img.onload = function () {

  ctx.drawImage(img, 0, 0);

  DOMURL.revokeObjectURL(url);

}

img.src = url;
```
仔细看代码会发现，其实是先为生成的svg图像创建了一个url路径，然后以此创建img对象，在这个img对象load时将图像画到canvas上。


