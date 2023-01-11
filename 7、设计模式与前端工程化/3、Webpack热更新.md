选自：

[Webpack 热更新机制](https://segmentfault.com/a/1190000017387984)

[Webpack 如何实现热更新？](https://segmentfault.com/a/1190000017387984)

来源：简书

## 一：什么是热更新

- 热更新，是指 **Hot Module Replacement**，缩写为 **HMR**。

模块热更新(热替换)，其目的是为了加快用户的开发速度，提高编程体验。它并不适用于生产环境，这意味着它应当只在开发环境使用

#### 热更新的作用：

>微信小程序的开发工具，没有提供类似 Webpack 热更新的机制，所以在本地开发时，每次修改了代码，预览页面都会刷新，于是之前的路由跳转状态、表单中填入的数据，都没了。
>
>哪怕只是一个文案或属性配置的修改，都会导致刷新，而要重新进入特定页面和状态，有时候很麻烦。对于开发时需要频繁修改代码的情况，这样比较浪费时间。
>
>而如果有类似 Webpack 热更新的机制存在，则是修改了代码，不会导致刷新，而是保留现有的数据状态，只将模块进行更新替换。也就是说，既保留了现有的数据状态，又能看到代码修改后的变化。

####  什么是模块热替换

  **模块热替换**（**HMR** - Hot Module Replacement）是 webpack 提供的最有用的功能之一。它允许在运行时替换，添加，删除各种模块，而无需进行完全刷新重新加载整个页面，其思路主要有以下几个方面

- 保留在完全重新加载页面时丢失的应用程序的状态
- 只更新改变的内容，以节省开发时间
- 调整样式更加快速，几乎等同于就在浏览器调试器中更改样式

## 二：启用HMR

 HMR的启用十分简单，这归功于webpack内置插件使用上的便利。我们要做的仅仅是更新[webpack-dev-server](https://github.com/webpack/webpack-dev-server)的配置，和使用webpack内置的HMR插件

  一个带有热替换功能的webpack.config.js 文件的配置如下，做了这么几件事

1. 引入了webpack库
2. 使用了`new webpack.HotModuleReplacementPlugin()`
3. 设置`devServer`选项中的`hot`字段为`true`

```js
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const CleanWebpackPlugin = require('clean-webpack-plugin');
  const webpack = require('webpack');

  module.exports = {
    entry: {
      app: './src/index.js'
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
      hot: true
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Hot Module Replacement'
      }),
      new webpack.HotModuleReplacementPlugin()
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };

```

- 模块的热替换相对来说比较难掌握，很容以一不小心就犯错导致失效，好在存在很多 loader，使得模块热替换的过程变得更容易。

#### 案例： HMR 修改样式表

  借助于 `style-loader` 的帮助，CSS 的模块热替换实际上是相当简单的。当更新 CSS 依赖模块时，此 loader 在后台使用 `module.hot.accept` 来修补(`patch`) `<style>` 标签。

  需要使用npm安装如下两个加载器

```undefined
npm install --save-dev style-loader css-loader
```

接下来我们来更新 webpack.config.js 中`module`的配置，让这两个 loader 生效。

```css
module: {
  rules: [
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }
  ]
},
```

至此，在修改css样式时，经过webpack编译过后的文件就已经被这两个加载器转化过了，HMR将自动更模块内容



## 三：热更新原理

https://blog.csdn.net/chern1992/article/details/106893227/

![图片](https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibQOqf8ia3haGPMK3tUKmlS8ZSDlXjGKdOot13ekiciclzG9vBEev0y6odaMWaQJn2dpr3GnjKDQOBRCw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

- Webpack Compile：将 JS 源代码编译成 bundle.js
- HMR Server：用来将热更新的文件输出给 HMR Runtime
- Bundle Server：静态资源文件服务器，提供文件访问路径
- HMR Runtime：socket服务器，会被注入到浏览器，更新文件的变化
- bundle.js：构建输出的文件
- 在HMR Runtime 和 HMR Server之间建立 websocket，即图上4号线，用于实时更新文件变化

上面图中，可以分成两个阶段：

- 启动阶段为上图 1 - 2 - A - B

在编写未经过`webpack`打包的源代码后，`Webpack Compile` 将源代码和 `HMR Runtime` 一起编译成 `bundle`文件，传输给`Bundle Server` 静态资源服务器

- 更新阶段为上图 1 - 2 - 3 - 4

当某一个文件或者模块发生变化时，`webpack`监听到文件变化对文件重新编译打包，编译生成唯一的`hash`值，这个`hash`值用来作为下一次热更新的标识

根据变化的内容生成两个补丁文件：`manifest`（包含了 `hash` 和 `chundId`，用来说明变化的内容）和`chunk.js` 模块

由于`socket`服务器在`HMR Runtime` 和 `HMR Server`之间建立 `websocket`链接，当文件发生改动的时候，服务端会向浏览器推送一条消息，消息包含文件改动后生成的`hash`值，如下图的`h`属性，作为下一次热更新的标识

![图片](https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibQOqf8ia3haGPMK3tUKmlS8ZYexoqQRWgnNdRIyRW4mNCtK3s2cvQcERQzBpMOu1uXxuCe4Pia8ZEicw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

在浏览器接受到这条消息之前，浏览器已经在上一次`socket` 消息中已经记住了此时的`hash` 标识，这时候我们会创建一个 `ajax` 去服务端请求获取到变化内容的 `manifest` 文件

`mainfest`文件包含重新`build`生成的`hash`值，以及变化的模块，对应上图的`c`属性

浏览器根据 `manifest` 文件获取模块变化的内容，从而触发`render`流程，实现局部模块更新

![图片](https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibQOqf8ia3haGPMK3tUKmlS8ZZwaZ6UuIaopRicvmLlicyRYqUFzRV1ca8KygK0lkM7Ediaeich7vd8ndaw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## 三、总结

关于`webpack`热模块更新的总结如下：

- 通过`webpack-dev-server`创建两个服务器：提供静态资源的服务（express）和Socket服务
- express server 负责直接提供静态资源的服务（打包后的资源直接被浏览器请求和解析）
- socket server 是一个 websocket 的长连接，双方可以通信
- 当 socket server 监听到对应的模块发生变化时，会生成两个文件.json（manifest文件）和.js文件（update chunk）
- 通过长连接，socket server 可以直接将这两个文件主动发送给客户端（浏览器）
- 浏览器拿到两个新的文件后，通过HMR runtime机制，加载这两个文件，并且针对修改的模块进行更新