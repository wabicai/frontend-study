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