# 1.！Doctype
不是 HTML 标签；它是指示 web 浏览器关于页面使用哪个 HTML 版本规范（或者XHTML）进行编写的指令。
必须是 HTML 文档的第一行，位于html 标签之前

常用的doctype声明
在 HTML5 中只有一种： <!DOCTYPE html> 不基于 SGML（标准通用标记语言），所以不需要引用 DTD。
在 HTML 4.01 中有三种：
 1. strict  该 DTD（文档类型定义） 包含所有 HTML 元素和属性，但不包括展示性的和弃用的元素（比如 font）。不允许框架集。<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
 2. Transitional 包含所有 HTML 元素和属性，包括展示性的和弃用的元素（比如 font）。不允许框架集。<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" 
"http://www.w3.org/TR/html4/loose.dtd">
 3. Frameset 同Transitional，允许框架集内容<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" 
"http://www.w3.org/TR/html4/frameset.dtd">

XHTML 1.0  Strict Transitional Frameset XHTML 1.1

# 2. h5新特性
## -   本地存储 localStorage 和 sessionStorage
todo
## -   绘画 canvas
## -   跨窗口通信 PostMessage
## -   多任务 webworker
## -   全双工通信协议 websocket
WebSocket 协议本质上是一个基于 TCP 的协议。

-语义化标签 article、footer、header、nav、section
-跨域资源共享(CORS) Access-Control-Allow-Origin
-历史管理 history
-媒体播放的 video 和 audio
-新增选择器 document.querySelector、document.querySelectorAll

移除元素
-纯表现的元素：basefont、big、center、font、s、strike、tt、u
-对可用性产生负面影响的元素：frame、frameset、noframes

# 3.伪类和伪元素
伪类：用于已有元素处于某种状态时为其添加对应的样式，这个状态是根据用户行为而动态变化的。它只有处于DOM树无法描述的状态下才能为元素添加样式，所以称为伪类。
伪元素：用于通过css创建一些不在DOM树中的元素，并为其添加样式。我们可以通过::before来在一个元素之前添加一些文本，并为这些文本添加样式，虽然用户可以看见 这些文本，但是它实际上并不在DOM文档中。
优点：1.不占用DOM节点，减少节点数 2.css实现的，替代了js部分工作 3.避免增加一些无意义的页面元素
缺点：不利于挑事，不能被抓取

# 4.HTML语义化
标签语义化 header nav footor  title ul li article section q strong
优点：1.样式丢失时，可读性 2.SEO 3.盲人阅读器 4.代码可读性，便于开发维护