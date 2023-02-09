https://juejin.cn/post/6844904094281236487#heading-9

1. 多进程/多实例构建：HappyPack(不维护了)、thread-loader
2. 压缩代码
   1. 多进程并行压缩
      - webpack-paralle-uglify-plugin
      - uglifyjs-webpack-plugin 开启 parallel 参数 (不支持 ES6)
      - terser-webpack-plugin 开启 parallel 参数
   2. 通过 mini-css-extract-plugin 提取 Chunk 中的 CSS 代码到单独文件，通过 css-loader 的 minimize 选项开启 cssnano 压缩 CSS。
3. 图片压缩
   1. image-webpack-loader
4. Tree shaking
   1. 树摇，检测没有用到的代码
   2. 使用 PurifyCSS(不在维护) 或者 uncss 去除无用 CSS 代码
   3. purgecss-webpack-plugin 和 mini-css-extract-plugin 配合使用(建议)
5. 充分利用缓存提升二次构建速度：
   1. babel-loader 开启缓存
   2. terser-webpack-plugin 开启缓存
6. DLL
   1. 使用 DllPlugin 进行分包，使用 DllReferencePlugin(索引链接) 对 manifest.json 引用，让一些基本不会改动的代码先打包成静态资源，避免反复编译浪费时
   2. HashedModuleIdsPlugin 可以解决模块数字 id 问题
7. Scope hoisting: 将代码放在一个函数作用域，减低开阔函数作用域带来的内存消耗
8.
