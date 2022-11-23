https://segmentfault.com/a/1190000006879700

![img](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91c2VyLWdvbGQtY2RuLnhpdHUuaW8vMjAxOC80LzE5LzE2MmRiNWU5ODVhYWJkYmU?x-oss-process=image/format,png)

1. ## DNS解析

2. ## TCP连接

3. ## 发送HTTP请求

4. ## 服务器处理请求并返回HTTP报文

5. ## 浏览器解析渲染页面
   1. HTML、CSS文件并行解析生成DOM Tree 和 CSS Tree
   2. 渲染：等HTML、CSS都解析完成，再合并生成Render Tree
   3. JS脚本加载，一般来说遇到JS脚本就立马解析执行，并停止DOM解析。而CSS解析会阻塞js执行，所以有时候css解析会阻塞DOM解析
### 怎么解决js阻塞dom解析
1. script 添加defer属性
   1. defer会使脚本在dom解析完成之后执行。（无需等待样式表、图像、子框架完成加载）
   2. 但是遇到script标签还是会正常下载
   3. 执行顺序和script标签一样
   4. 适用于与其他js有互相引用，或者涉及dom操作的时候使用
2. 添加async
   1. 异步执行，遇到script立马下载，并且完成之后立马异步执行
   2. 顺序不能保障
   3. 适用于 js 与 dom 和其他 js 文件无关的情况


3. ## 连接结束