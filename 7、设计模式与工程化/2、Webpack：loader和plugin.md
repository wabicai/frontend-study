### 一：什么是loader

- `loader` 用于对模块的源代码进行转换，在 `import` 或"加载"模块时预处理文件
- 因为webpack只认识js，所以需要loader对其他文件进行预处理

### 二、常见的loader

在页面开发过程中，我们经常性加载除了`js`文件以外的内容，这时候我们就需要配置响应的`loader`进行加载

常见的`loader`如下：

- style-loader: 将css添加到DOM的内联样式标签style里
- css-loader :允许将css文件通过require的方式引入，并返回css代码
- less-loader: 处理less
- sass-loader: 处理sass
- postcss-loader: 用postcss来处理CSS
- autoprefixer-loader: 处理CSS3属性前缀，已被弃用，建议直接使用postcss
- file-loader: 分发文件到output目录并返回相对路径
- url-loader: 和file-loader类似，但是当文件小于设定的limit时可以返回一个Data Url
- html-minify-loader: 压缩HTML
- babel-loader :用babel来转换ES6文件到ES



### 一、什么是plugin

- `plugin`赋予webpack各种灵活的功能，例如打包优化、资源管理、环境变量注入等，它们会运行在 `webpack` 的不同阶段（钩子 / 生命周期），贯穿了`webpack`整个编译周期

![图片](https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibQfxicUfGuYySiax3Sziar4T44GWBj3RTd8grYvITric8r1E87ib7Heojz1rDkJaViaJ72oBTRKamo6oNNw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

- 目的在于解决`loader` 无法实现的其他事

### 二、常见的plugin

![图片](https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibQfxicUfGuYySiax3Sziar4T44ccwicIYJaGALCInia789ARyh668syLTm9hrOW7EDpRgYsHE5RAYOnvhw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)





## Loader和Plugin的区别

- 在`Webpack` 运行的生命周期中会广播出许多事件，`Plugin` 可以监听这些事件，在合适的时机通过`Webpack`提供的 `API`改变输出结果
- 对于`loader`，实质是一个转换器，将A文件进行编译形成B文件，操作的是文件，比如将`A.scss`或`A.less`转变为`B.css`，单纯的文件转换过程