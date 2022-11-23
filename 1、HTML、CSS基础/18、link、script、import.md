# link 和 @import
相同点：两者都可以引用外部CSS的方式
- link 的使用
```js
<link href="index.css" rel="stylesheet">
```
- @import 的使用
```js
<style type="text/css">
    @import url(index.css);
</style>
```
## link 和 @import 的区别

1. 引入的内容不同

link 除了引用样式文件，还可以引用图片等资源文件，而 @import 只引用样式文件

2. 加载顺序不同

link 引用 CSS 时，在页面载入时同时加载；@import 需要页面网页完全载入以后加载

4. 兼容性不同

link 是 XHTML 标签，无兼容问题；@import 是在 CSS2.1 提出的，低版本的浏览器不支持

5. 对 JS 的支持不同

link 支持使用 Javascript 控制 DOM 去改变样式；而 @import 不支持

# 为什么link用href获取资源 script和img用src
> src用于替换当前元素，href用于在当前文档和引用资源之间确立联系。

## src

src是source的缩写，指向外部资源的位置，指向的内容将会嵌入到文档中当前标签所在位置；在请求src资源时会将其指向的资源下载并应用到文档内，例如js脚本，img图片和frame等元素

<script src ="js.js"></script> 
​ 当浏览器解析到该元素时，会暂停其他资源的下载和处理，直到将该资源加载、编译、执行完毕，图片和框架 等元素也如此，类似于将所指向资源嵌入当前标签内。这也是为什么将js脚本放在底部而不是头部

## href

href是Hypertext Reference的缩写，指向网络资源所在位置，建立和当前元素（锚点）或当前文档（链接）之间的链接

在文档中添加link标签，浏览器会识别该文档为css文件，就会并行下载资源并且不会停止对当前文档的处理。这也是为什么建议使用link方式来加载css，而不是使用@import方式

<link href="common.css" rel="stylesheet"/>

# @import 和 import from 的区别
- @import 是作用于css文件
- import from 是ES6 引入js模块的方法

# 加载css 、 js等资源是否会阻塞
## CSS
1. css加载不会阻塞DOM树的解析
   1. DOM解析和CSS解析是两个并行的进程，所以这也解释了为什么CSS加载不会阻塞DOM的解析。
2. css加载会阻塞DOM树的渲染 
   1. Render Tree是依赖于DOM Tree和CSSOM Tree的，所以他必须等待到CSSOM Tree构建完成，也就是CSS资源加载完成(或者CSS资源加载失败)后，才能开始渲染。因此，CSS加载是会阻塞Dom的渲染的。
3. css加载会阻塞后面js语句的执行
   1. 由于js可能会操作之前的Dom节点和css样式，因此浏览器会维持html中css和js的顺序。因此，样式表会先加载执行完毕再处理后面的js。所以css会阻塞后面js的执行。
即：
正常：
1. CSS、DOM并行加载、解析
   1. 等DOM、CSS都解析完毕，再渲染
2. 遇到JS立马执行，同时停止渲染

异常情况：
1. CSS加载、解析到一半，遇到script标签
   1. script立马执行，阻塞Dom解析


## 注意点：
1. 解析html生成DOM tree->根据DOM tree和样式表生成render tree->渲染render tree展示：
   1. 浏览器是边解析html生成局部的DOM tree，浏览器就生成部分render tree然后展示出来
2. 两种外部资源会阻塞脚本执行，从而阻塞渲染。（外部CSS阻塞渲染，不阻塞解析。）
   1. 外部js、外部css
   2. 其他外部资源是不阻塞渲染的，比如图片，我们能看到很多时候页面大体的框架都呈现出来了，就是图片的位置没有显示出来的情况，等到图片下载下来以后再重新渲染。

## script 加载 js
- web的模式是同步的，开发者希望解析到一个script标签时立即解析执行脚本，并阻塞文档的解析直到脚本执行完；如果脚本是外引的，当引用了JS的时候，浏览器发送一个js request就会一直等待该request的返回，这个过程也是同步的，会阻塞文档的解析直到资源被请求到
