## 什么是BOM和DOM
**1、BOM是浏览器对象模型**
> Browser Object Model

提供了独立于内容而与浏览器窗口进行交互的对象。描述了与浏览器进行交互的方法和接口，可以对浏览器窗口进行访问和操作，譬如可以弹出新的窗口，改变状态栏中的文本，对Cookie的支持，IE还扩展了BOM，加入了ActiveXObject类，可以通过js脚本实例化ActiveX对象等等）

​	包括：

1. 控制页面

2. 事件（onscroll）
3. 事件绑定（add.EventListener)
4. 事件取消（默认和冒泡）
5. cookie（getCookie）


**2、DOM是文档对象模型**
> Document Object Model 

DOM是针对XML的基于树的API。描述了处理网页内容的方法和接口，是HTML和XML的API，DOM把整个页面规划成由节点层级构成的文档。DOM本身是与语言无关的API，它并不与Java，JavaScript或其他语言绑定。
