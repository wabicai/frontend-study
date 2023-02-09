## source map 是什么？生产环境怎么用？

1. 打包后代码没有可读性，source map 可以用于调试源码
2. map 不打开开发者工具，浏览器不会加载
3. 线上环境一般有三种处理方案：
   - hidden-source-map：借助第三方错误监控平台 Sentry 使用
   - nosources-source-map：只会显示具体行数以及查看源代码的错误栈。安全性比 sourcemap 高
   - sourcemap：通过 nginx 设置将 .map 文件只对白名单开放(公司内网)

## Webpack 文件监听原理

1. 轮询判断文件最后编辑时间，如 300ms
2. 不是状态同步，而是变化同步

## 怎么监听 bundle 变化

1. vscode 插件 :import Cost
2. webpack-bundle-analyzer

## 你刚才也提到了代码分割，那代码分割的本质是什么？有什么意义呢？

- 代码分割的本质其实就是在源代码直接上线和打包成唯一脚本 main.bundle.js 这两种极端方案之间的一种更适合实际场景的中间状态。

1. 源代码直接上线：虽然过程可控，但是 http 请求多，性能开销大。
2. 打包成唯一脚本：一把梭完自己爽，服务器压力小，但是页面空白期长，用户体验不好。

##
