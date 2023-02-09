### 什么是 loader

- `loader` 用于对模块的源代码进行转换，在 `import` 或"加载"模块时预处理文件
- 因为 webpack 只认识 js，所以需要 loader 对其他文件进行预处理

### 什么是 plugin

- `plugin`赋予 webpack 各种灵活的功能，例如打包优化、资源管理、环境变量注入等，它们会运行在 `webpack` 的不同阶段（钩子 / 生命周期），贯穿了`webpack`整个编译周期

![图片](https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibQfxicUfGuYySiax3Sziar4T44GWBj3RTd8grYvITric8r1E87ib7Heojz1rDkJaViaJ72oBTRKamo6oNNw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

### 常见的 loader 和 plugin

在页面开发过程中，我们经常性加载除了`js`文件以外的内容，这时候我们就需要配置响应的`loader`进行加载

常见的`loader`如下：

- style-loader: 将 css 添加到 DOM 的内联样式标签 style 里
- css-loader :允许将 css 文件通过 require 的方式引入，并返回 css 代码
- less-loader: 处理 less
- sass-loader: 处理 sass
- postcss-loader: 用 postcss 来处理 CSS
- autoprefixer-loader: 处理 CSS3 属性前缀，已被弃用，建议直接使用 postcss
- file-loader: 分发文件到 output 目录并返回相对路径
- url-loader: 和 file-loader 类似，但是当文件小于设定的 limit 时可以返回一个 Data Url
- html-minify-loader: 压缩 HTML
- babel-loader :用 babel 来转换 ES6 文件到 ES
- i18n-loader: 国际化
- cache-loader: 可以在一些性能开销较大的 Loader 之前添加，目的是将结果缓存到磁盘里

常见的 plugin：

- define-plugin：定义环境变量
- webpack-bundle-analyzer: 可视化 Webpack 输出文件的体积 (业务组件、依赖第三方模块)
- mini-css-extract-plugin: 分离样式文件，CSS 提取为独立文件，支持按需加载 (替代 extract-text-webpack-plugin)
- webpack-dashboard：可以更友好的展示相关打包信息。
- webpack-merge：提取公共配置，减少重复配置代码
- speed-measure-webpack-plugin：简称 SMP，分析出 Webpack 打包过程中 Loader 和 Plugin 的耗时，有助于找到构建过程中的性能瓶颈。
- size-plugin：监控资源体积变化，尽早发现问题
- HotModuleReplacementPlugin：模块热替换
- 目的在于解决`loader` 无法实现的其他事

## Loader 和 Plugin 的区别

- Loader 本质就是一个函数，在该函数中对接收到的内容进行转换，返回转换后的结果。 因为 Webpack 只认识 JavaScript，所以 Loader 就成了翻译官。
  - 对于`loader`，实质是一个转换器，将 A 文件进行编译形成 B 文件，操作的是文件，比如将`A.scss`或`A.less`转变为`B.css`，单纯的文件转换过程
- 在`Webpack` 运行的生命周期中会广播出许多事件，`Plugin` 可以监听这些事件，在合适的时机通过`Webpack`提供的 `API`改变输出结果
