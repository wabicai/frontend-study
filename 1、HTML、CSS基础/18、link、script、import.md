# link 和 @import

相同点：两者都可以引用外部 CSS 的方式

- link 的使用

```js
< link href = "index.css"
rel = "stylesheet" >
```

- @import 的使用

```js
<style type="text/css">@import url(index.css); </style>
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

# 为什么 link 用 href 获取资源 script 和 img 用 src

> src 用于替换当前元素，href 用于在当前文档和引用资源之间确立联系。

## src

src 是 source 的缩写，指向外部资源的位置，指向的内容将会嵌入到文档中当前标签所在位置；在请求 src 资源时会将其指向的资源下载并应用到文档内，例如 js 脚本，img 图片和 frame 等元素

<script src ="js.js"></script>

​ 当浏览器解析到该元素时，会暂停其他资源的下载和处理，直到将该资源加载、编译、执行完毕，图片和框架 等元素也如此，类似于将所指向资源嵌入当前标签内。这也是为什么将 js 脚本放在底部而不是头部

## href

href 是 Hypertext Reference 的缩写，指向网络资源所在位置，建立和当前元素（锚点）或当前文档（链接）之间的链接

在文档中添加 link 标签，浏览器会识别该文档为 css 文件，就会并行下载资源并且不会停止对当前文档的处理。这也是为什么建议使用 link 方式来加载 css，而不是使用@import 方式

<link href="common.css" rel="stylesheet"/>

# @import 和 import from 的区别

- @import 是作用于 css 文件
- import from 是 ES6 引入 js 模块的方法

# 加载 css 、 js 等资源是否会阻塞

## CSS

1. css 加载不会阻塞 DOM 树的解析
   1. DOM 解析和 CSS 解析是两个并行的进程，所以这也解释了为什么 CSS 加载不会阻塞 DOM 的解析。
2. css 加载会阻塞 DOM 树的渲染
   1. Render Tree 是依赖于 DOM Tree 和 CSSOM Tree 的，所以他必须等待到 CSSOM Tree 构建完成，也就是 CSS 资源加载完成(或者 CSS 资源加载失败)后，才能开始渲染。因此，CSS 加载是会阻塞 Dom 的渲染的。
3. css 加载会阻塞后面 js 语句的执行
   1. 由于 js 可能会操作之前的 Dom 节点和 css 样式，因此浏览器会维持 html 中 css 和 js 的顺序。因此，样式表会先加载执行完毕再处理后面的 js。所以 css 会阻塞后面 js 的执行。
      即：
      正常：
4. CSS、DOM 并行加载、解析
   1. 等 DOM、CSS 都解析完毕，再渲染
5. 遇到 JS 立马执行，同时停止渲染

异常情况：

1. CSS 加载、解析到一半，遇到 script 标签
   1. script 立马执行，阻塞 Dom 解析

## 注意点：

1. 解析 html 生成 DOM tree->根据 DOM tree 和样式表生成 render tree->渲染 render tree 展示：
   1. 浏览器是边解析 html 生成局部的 DOM tree，浏览器就生成部分 render tree 然后展示出来
2. 两种外部资源会阻塞脚本执行，从而阻塞渲染。（外部 CSS 阻塞渲染，不阻塞解析。）
   1. 外部 js、外部 css
   2. 其他外部资源是不阻塞渲染的，比如图片，我们能看到很多时候页面大体的框架都呈现出来了，就是图片的位置没有显示出来的情况，等到图片下载下来以后再重新渲染。

## script 加载 js

- web 的模式是同步的，开发者希望解析到一个 script 标签时立即解析执行脚本，并阻塞文档的解析直到脚本执行完；如果脚本是外引的，当引用了 JS 的时候，浏览器发送一个 js request 就会一直等待该 request 的返回，这个过程也是同步的，会阻塞文档的解析直到资源被请求到

## script 的 async 和 defer 特性

`async`   特性意味着脚本是完全独立的：

- 浏览器有可能因  `async`  脚本而阻塞。
- 其他脚本不会等待  `async`  脚本加载完成，同样，`async`  脚本也不会等待其他脚本。
- `DOMContentLoaded`  和异步脚本不会彼此等待： - `DOMContentLoaded`  可能会发生在异步脚本之前（如果异步脚本在页面完成后才加载完成） - `DOMContentLoaded`  也可能发生在异步脚本之后（如果异步脚本很短，或者是从 HTTP 缓存中加载的）
  换句话说， `async`   脚本会在后台加载，并在加载就绪时运行。DOM 和其他脚本不会等待它们，它们也不会等待其它的东西。 `async`   脚本就是一个会在加载完成时执行的完全独立的脚本。

`defer`   特性告诉浏览器不要等待脚本。相反，浏览器将继续处理 HTML，构建 DOM。脚本会“在后台”下载，然后等 DOM 构建完成后，脚本才会执行。
换句话说：

- 具有  `defer`  特性的脚本不会阻塞页面。
- 具有  `defer`  特性的脚本总是要等到 DOM 解析完毕，但在  `DOMContentLoaded`  事件之前执行。

`defer`   特性仅适用于外部脚本

本被附加到文档   `(*)`   时，脚本就会立即开始加载, **默认情况下，动态脚本的行为是“异步”的。**

- 它们不会等待任何东西，也没有什么东西会等它们。
- 先加载完成的脚本先执行（“加载优先”顺序）。
  显式地设置了   `script.async=false` ，则可以改变这个规则, 会按顺序执行

在实际开发中， `defer`   用于需要整个 DOM 的脚本，和/或脚本的相对执行顺序很重要的时候。

** `async`   用于独立脚本，例如计数器或广告，这些脚本的相对执行顺序无关紧要。**

### DOM 阻塞总结

阻塞 DOM 构建的有：

1. JavaScript 标签之前的 CSS
2. 外联普通 JavaScript
3. 外联 defer-JavaScript 的执行过程
4. 内联 JavaScript
   不会阻塞 DOM 构建的有：
5. JavaScript 标签之后的 CSS
6. 外联 async-JavaScript
7. 外联 defer-JavaScript 的加载过程
8. image
9. iframe
