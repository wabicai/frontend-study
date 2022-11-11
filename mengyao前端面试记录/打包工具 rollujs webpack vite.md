[主流前端代码构建工具评测]https://juejin.cn/post/6954891826604015630
[打包工具 rollup.js 入门教程-阮一峰]https://www.ruanyifeng.com/blog/2022/05/rollup.html
[中文文档]https://www.rollupjs.com/

# 为什么需要打包工具
构建工具指能自动对代码执行检验、转换、压缩等功能的工具。常见功能包括：代码转换、代码打包、代码压缩、HMR、代码检验。
打包工具的作用是，将多个 JavaScript 脚本合并成一个脚本，供浏览器使用。
浏览器需要脚本打包，主要原因有三个。
> （1）早期的浏览器不支持模块，大型网页项目只能先合并成单一脚本再执行。
> （2）Node.js 的模块机制与浏览器不兼容，必须通过打包工具进行兼容处理。
> （3）浏览器加载一个大脚本，要比加载多个小脚本，性能更好。

1.代码的兼容性（js版本）
2.抹平框架之间的差异性，生成统一可以在浏览器跑的代码（vue,react,ng）
3.CSS前缀补全/预处理器，JS压缩混淆，图片压缩
4.前端部署（如+ hash,静态文件路径问题）
# rollup.js
Rollup 是一个 JavaScript 模块打包器，可以将小块代码编译成大块复杂的代码，例如 library 或应用程序。
rollup.js 的开发本意，是打造一款简单易用的 ES 模块打包工具，不必配置，直接使用。
后来经过不断发展，它也可以打包 CommonJS 模块。但是，这时需要经过复杂配置，实际上并没有比 Webpack 简单多少。
因此建议，**只把 rollup.js 用于打包 ES 模块**，这样才能充分发挥它的优势。如果你的项目使用 CommonJS 模块，不推荐使用 rollup.js，优势不大。
### 特点
1.基于ES6打包（模块打包工具）
2.Tree-shaking
3.打包文件小且干净，执行效率更高
4.更专注于JS打包
### 安装
```bash
$ npm install --global rollup
```
或者不安装直接使用，把命令中的`rollup`，替换成`npx rollup`
### 示例
```bash
$ rollup main.js
$ rollup main.js --file bundle.js
```

摇树（tree-shaking），即打包时自动删除没有用到的代码。Rollup 只引入最基本最精简代码，所以可以生成轻量、快速，以及低复杂度的 library 和应用程序。因为这种基于显式的 `import` 和 `export` 语句的方式，它远比「在编译后的输出代码中，简单地运行自动 minifier 检测未使用的变量」更有效。（tree shaking是看实际使用的，若import了但是没有使用，也会被摇掉）
### 注意点
使用指令
使用配置文件

### 原理
https://juejin.cn/post/6971970604010307620#heading-13
https://juejin.cn/post/6966845420064473102
你给它一个入口文件 —— 通常是 index.js。Rollup 将使用 Acorn 读取解析文件 —— 将返回给我们一种叫抽象语法树（AST）的东西。 一旦有了 AST ，你就可以发现许多关于代码的东西，比如它包含哪些 import 声明。

假设 index.js 文件头部有这样一行：
```javascript
import foo from './foo.js';
复制代码
```
这就意味着 Rollup 需要去加载，解析，分析在 index.js 中引入的 ./foo.js。重复解析直到没有更多的模块被加载进来。更重要的是，所有的这些操作都是可插拔的，所以您可以从 node_modules 中导入或者使用 sourcemap-aware 的方式将 ES2015 编译成 ES5 代码。

在 Rollup 中，一个文件就是一个模块，每个模块都会根据文件的代码生成一个 AST 抽象语法树。 ​

分析 AST 节点，就是看这个节点有没有调用函数方法，有没有读到变量，有，就查看是否在当前作用域，如果不在就往上找，直到找到模块顶级作用域为止。如果本模块都没找到，说明这个函数、方法依赖于其他模块，需要从其他模块引入。如果发现其他模块中有方法依赖其他模块，就会递归读取其他模块，如此循环直到没有依赖的模块为止 找到这些变量或着方法是在哪里定义的，把定义语句包含进来即可 其他无关代码一律不要

以上，我们可以看到 **Rollup 只是会合并你的代码 —— 没有任何浪费**。所产生的包也可以更好的缩小。有人称之为 “作用域提升（scope hoisting）”。 其次，它把你导入的模块中的未使用代码移除。这被称为“（摇树优化）treeshaking”。 总之，Rollup 就是一个模块化的打包工具。 

接下来我们进入源码，具体分析下 Rollup 的构建流程

1.收集导入和导出变量
2.建立映射关系，方便后续使用
3.收集所有语句定义的变量
4.建立变量和声明语句之间的对应关系，方便后续使用
5.过滤 import 语句
6.删除关键词
7.输出语句时，判断变量是否为 import
8.如是需要递归再次收集依赖文件的变量
9.否则直接输出
10.构建依赖关系，创建作用域链，交由./src/ast/analyse.js 文件处理
11.在抽象语法树的每一条语句上挂载_source(源代码)、_defines(当前模块定义的变量)、_dependsOn(外部依赖的变量)、_included(是否已经包含在输出语句中)
12.收集每个语句上定义的变量，创建作用域链

3.generate
第一步：移除额外代码 例如从 foo.js 中引入的 foo() 函数代码是这样的：export function foo() {}。rollup 会移除掉 export，变 成 function foo() {}。因为它们就要打包在一起了，所以就不需要 export 了。 
第二步：把 AST 节点的源码 addSource 到 magicString,这个操作本质上相当于拼字符串,
第三步：**return magicString.toString() **。 返回合并后源代码

小结：
1.获取入口文件的内容，包装成 module，生成抽象语法树
2.对入口文件抽象语法树进行依赖解析
3.生成最终代码
4.写入目标文件

优点：
**1.treeShaking**: 可以看到，rollup打包出来的代码非常之简洁，没有用到的变量以及方法都不会被打包进来，所以一般开发库之类的一般都会采用rollup来减小代码体积。
Rollup通过对代码的静态分析，分析出冗余代码，在最终的打包文件中将这些冗余代码删除掉，进一步缩小代码体积。这是目前大部分构建工具所不具备的特点(Webpack 2.0+已经支持了，但是我本人觉得没有Rollup做得干净)。
在 rollup 中，一个文件就是一个模块。每一个模块都会根据文件的代码生成一个 AST 语法抽象树，rollup 需要对每一个 AST 节点进行分析。分析 AST 节点，就是看看这个节点有没有调用函数或方法。如果有，就查看所调用的函数或方法是否在当前作用域，如果不在就往上找，直到找到模块顶级作用域为止。如果本模块都没找到，说明这个函数、方法依赖于其他模块，需要从其他模块引入。
**2.ESM:** 这个也是其他构建工具所不具备的。Rollup直接不需要通过babel将import转化成Commonjs的require方式，极大地利用ES2015模块的优势（对比webpack 自己做了大量import的polyfill， iife实现模块）
3.总结：其实Webpack从2.0开始支持Tree-shaking，并在使用babel-loader的情况下支持了es6 module的打包了，实际上，Rollup已经在渐渐地失去了当初的优势了。但是它并没有被抛弃，反而因其简单的API、使用方式被许多库开发者青睐，如React、Vue等，都是使用Rollup作为构建工具的。而Webpack目前在中大型项目中使用得非常广泛。

### rollup vs webpack
https://juejin.cn/post/7054752322269741064
1.treeshaking 干净
2.ESM polyfill
3.处理对外暴露模块，非常不一样
rollup的配置文件无需特殊配置，而且还可以支持**多种模块导出（esm，cjs，umd，amd）**
webpack 导出 （区别巨大，注入代码较多，导出esm支持的不太好）(babel-loader的情况下支持了es6 module)(为什么要注入，早期浏览器不支持cjs，iife模块化方案，后续webpack为了兼容，没有放弃这种方案)

#### rollup如何打包第三方依赖 和 懒加载模块 和 公共模块？
1.单chunk包
无额外配置，一般会把所有js打成一个包。打包外部依赖（第三方）也是一样的。
**此处rollup打包有个注意点**：
-   很多第三方依赖很早就有了，所以用的是**commonjs模块导出**，rollup打包的话，需要安装插件@rollup/plugin-node-resolve。因为是cjs的包，所以也不存在tree shaking
    -   插件原理是，把cjs的包，转成esm包，在打包
-   现在比较流行的monorepo，就是完全用esm写库+rollup打包，可以很轻易的做到tree shaking，**让核心库变的更小，解析速度更快，还可以对外提供工具，扩大影响力**
2.多个chunk包（代码分离）
(1) 配置多个入口，此法比较简单，可自行测试
(2) 代码分离 （**动态import，懒加载， import(xxx).then(module => {})** ）
3.rollup如何处理公共模块？（比如， a、b、c 3个模块 同时依赖 d）
**有2种情况：**
(1)源代码内 **不存在 动态import**，那么会打成**一个chunk**（a、b、c、d 4个模块都在一包内，d只正常有一份）
(2)源代码内 **存在 懒加载模块，并且懒加载的模块也访问了公共依赖**，公共依赖只会出来一份，然后对外 export。**并且完全无注入代码！无需额外配置。** 对比webpack的话，webpack需要配置 optimization.splitChunks


# vite(与 vue cli)

[Vite 官方中文文档]https://cn.vitejs.dev/guide/#overview
https://zhuanlan.zhihu.com/p/424842555
## 一.总览
发音 `/vit/`
是什么：是一种新型的前端构建工具，它能显著改善前端开发体验。
主要由两部分组成：
1.dev server：利用浏览器的ESM能力来提供源文件，具有丰富的内置功能并具有高效的HMR
2.生产构建：生产环境利用Rollup来构建代码，提供指令用来优化构建过程
Vite作为一个基于浏览器原生ESM的构建工具，它省略了开发环境的打包过程，利用浏览器去解析imports，在服务端按需编译返回。同时，在开发环境拥有速度快到惊人的模块热更新，且热更新的速度不会随着模块增多而变慢。因此，使用Vite进行开发，至少会比Webpack快10倍左右。

## 二.why vite
vite vs webpack
### 1.开发阶段vite的速度远快于webpack  
**webpack是先打包再启动开发服务器，vite是直接启动开发服务器，然后按需编译依赖文件。**
![[Pasted image 20220824111514.png]]
1.**流程不同，冷启动时间短**：
webpack先打包，再启动开发服务器，请求服务器时直接给予打包后的结果；
vite直接启动开发服务器，请求哪个模块再对哪个模块进行实时编译；
2.**热更新快**：HMR时**不全部打包，只按需编译，还可以利用浏览器缓存**：由于vite启动的时候不需要打包，也就无需分析模块依赖、编译，所以启动速度非常快。当浏览器请求需要的模块时，再对模块进行编译，这种按需动态编译的模式，极大缩短了编译时间，当项目越大，文件越多时，打包的bundle.js越来越大，速度越来越慢，对比下vite开发时优势越明显；（打包编译的区别）
3.当需要打包到生产环境时，vite使用传统的rollup进行打包，所以，vite的优势是体现在开发阶段，另外，由于vite使用的是ES Module，所以代码中不可以使用CommonJs；
4.轻量

webpack dev server 在启动时需要先build一遍，而这个过程需要消耗很多时间
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3fecbe47be9400ea4cf206d71a34f9c~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)
而Vite 不同的是 执行vite serve 时，内部直接启动了web Server, 并不会先编译所有的代码文件。
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6dce39d902264a5a8aba4936b48c65ec~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

### 2.**使用简单，开箱即用**
相比Webpack需要对entry、loader、plugin等进行诸多配置，Vite的使用可谓是相当简单了。只需执行初始化命令，就可以得到一个预设好的开发环境，开箱即获得一堆功能，包括：CSS预处理、html预处理、异步加载、分包、压缩、HMR等。他使用复杂度介于Parcel和Webpack的中间，只是暴露了极少数的配置项和plugin接口，既不会像Parcel一样配置不灵活，又不会像Webpack一样需要了解庞大的loader、plugin生态，灵活适中、复杂度适中。适合前端新手。
#### Webpack
与vite的打包相比， webpack 会需要打包一个一个大体积的bundle.js？ 之前会产生打包需求的主要原因：
1.浏览器环境并不支持模块化
2.零散模块文件会产生大量的http请求（大量请求在浏览器端会出现并发请求资源的问题）
#### Vite
而vite的打包原理是基于es新特性 Dynamic imports 实现的，那对老浏览器必然会有兼容问题 处理方案还是用大家熟悉的 [Polyfill](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FGoogleChromeLabs%2Fdynamic-import-polyfill "https://github.com/GoogleChromeLabs/dynamic-import-polyfill")。
##### Typescript的编译
Vite引用了EsBuild 通过go语言对ts jsx 等语言的支持，编译上百个ts文件甚至比 tsc 要快几十倍，esbuild不做类型检查，只是删除，若要类型检查还是要tsc --no-emit

## 三.开发环境生产环境
开发环境不需要对所有资源打包，只是使用esbuild对依赖进行预构建，将CommonJS和UMD发布的依赖转换为浏览器支持的ESM，同时提高了后续页面的加载性能（lodash的请求）。Vite会将于构建的依赖缓存到node_modules/.vite目录下，它会根据几个源来决定是否需要重新运行预构建，包括 packages.json中的dependencies列表、包管理器的lockfile、可能在vite.config.js相关字段中配置过的。只要三者之一发生改变，才会重新预构建。

同时，开发环境使用了浏览器缓存技术，解析后的依赖请求以http头的max-age=31536000,immutable强缓存，以提高页面性能。

在生产环境，由于嵌套导入会导致发送大量的网络请求，即使使用HTTP2.x（多路复用、首部压缩），在生产环境中发布未打包的ESM仍然性能低下。因此，对比在开发环境Vite使用esbuild来构建依赖，生产环境Vite则使用了更加成熟的Rollup来完成整个打包过程。因为esbuild虽然快，但针对应用级别的代码分割、CSS处理仍然不够稳定，同时也未能兼容一些未提供ESM的SDK。

为了在生产环境中获得最佳的加载性能，仍然需要对代码进行tree-shaking、懒加载以及chunk分割（以获得更好的缓存）。

## 四.原理
### 1.ESM&esbuild
ESM: 与CommonJS、AMD不同，ESM的对外接口只是一种静态定义，为编译时加载，遇到模块加载命令import，就会生成一个只读引用。等脚本真正执行时，再根据这个只读引用，到被加载的那个模块内取值。由于ESM编译时就能确定模块的依赖关系，因此能够只包含要运行的代码，可以显著减少文件体积，降低浏览器压力。
过程：当浏览器解析 import HelloWorld from './components/HelloWorld.vue' 时，会向当前域名发送一个请求获取对应的资源（ESM支持解析相对路径）
浏览器下载对应的文件，然后解析成模块记录。接下来会进行实例化，为模块分配内存，然后按照导入、导出语句建立模块和内存的映射关系。最后，运行上述代码，把内存空间填充为真实的值。
esbuild: 对 js/ts 的处理使用了 esbuild。esbuild 是一个全新的js打包工具，底层使用了go，大量使用了并行操作，可以充分利用CPU资源。esbuild支持如babel, 压缩等的功能。
### 2.请求拦截
启动一个 koa 服务器拦截由浏览器请求 ESM的请求。通过请求的路径找到目录下对应的文件做一定的编译处理，最终以 ESM的格式返回给客户端。
1.node-module:Vite 在拦截的请求里，对直接引用 `node_modules` 的模块都做了路径的替换，换成了 `/@modules/` 并返回回去。而后浏览器收到后，会发起对 `/@modules/xxx` 的请求，然后被 Vite 再次拦截，并由 Vite 内部去访问真正的模块，并将得到的内容再次做同样的处理后，返回给浏览器。
2..vue:一个 `.vue` 的文件拆成了三个请求（分别对应 `script`、`style` 和`template`） ，浏览器会先收到包含 `script` 逻辑的 `App.vue` 的响应，然后解析到 `template` 和 `style` 的路径后，会再次发起 HTTP 请求来请求对应的资源，此时 Vite 对其拦截并再次处理后返回相应的内容。


![[Pasted image 20220824112033.png]]
### 3.热更新原理
在**客户端与服务端建立了一个 websocket 连接**，当代码被修改时，服务端发送消息通知客户端去请求修改模块的代码，完成热更新。
1.服务端：服务端做的就是监听代码文件的改变，在合适的时机向客户端发送 websocket 信息通知客户端去请求新的模块代码。
2.客户端：Vite 中客户端的 websocket 相关代码在处理 html 中时被写入代码中。可以看到在处理 html 时，vite/client 的相关代码已经被插入。
3.Vite 会接受到来自客户端的消息。通过不同的消息触发一些事件。做到浏览器端的即时热模块更换（热更新）。包括 connect、vue-reload、vue-rerender 等事件，分别触发组件vue 的重新加载，render等。
## 五.使用

## 六.问题
1、构建工具和打包工具的区别？
构建过程应该包括 预编译、语法检查、词法检查、依赖处理、文件合并、文件压缩、单元测试、版本管理等 。
打包工具更注重打包这一过程，主要包括依赖管理和版本管理。
2、Vite有什么缺点？
（1）目前 Vite 还是使用的 es module 模块不能直接使用生产环境（兼容性问题）。默认情况下，无论是 dev 还是 build 都会直接打出 ESM 版本的代码包，这就要求客户浏览器需要有一个比较新的版本，这放在现在的国情下还是有点难度的。不过 Vite 同时提供了一些弥补的方法，使用 build.polyfillDynamicImport 配置项配合 @vitejs/plugin-legacy 打包出一个看起来兼容性比较好的版本。
（2）生产环境使用 rollup 打包会造成开发环境与生产环境的不一致。
（3）很多 第三方 sdk 没有产出 ems 格式的的代码，这个需要自己去做一些兼容。
3、Vite生产环境用了Rollup，那能在生产环境中直接使用 esm 吗？
（1）其实目前的主要问题可能还是兼容性问题。
（2）如果你的项目不需要兼容 IE11 等低版本的浏览器，自然是可以使用的。
（3）但是更通用的方案可能还是类似 [ployfill.io](https://link.zhihu.com/?target=http%3A//ployfill.io/) 的原理实现， 提前构建好 bundle.js 与 es module 两个版本的代码，根据浏览器的实际兼容性去动态选择导入哪个模块。
4、对于一些 没有产出 commonjs 的模块，如何去兼容呢？
首先业界是有一些如 lebab 的方法可以将 commjs 代码快速转化为 esm 的，但是对于一些格式不规范的代码，可能还是需要单独处理。
5、如果组件嵌套层级比较深，会影响速度吗？
（1）可以看到请求 lodash 时 651 个请求只耗时 1.53s。这个耗时是完全可以接受的。
（2）Vite 是完全按需加载的，在页面初始化时只会请求初始化页面的一些组件，也就是说即使层级深，但如果未展示可以不加载。
（3）缓存可以降低耗时
### 不支持
Vite 打包 TS 类型声明文件目前没有可用的 `plugin`。有人在 `issue` 中提出希望 Vite 内部支持在库模式打包时导出声明文件，但 Vite 官方表示不希望因此增加维护的负担和结构的复杂性
因此在 Vite 开发中，我们要想一些其他办法来生成声明文件
不管使用什么方法，生成类型声明文件，最根本的还是通过 TypeScript 本身的特性及配置项去提取 `.d.ts` 文件，再使用一些手段将文件写到打包路径下

# webpack
Webpack的运行流程是一个串行的过程，从启动到结束依次执行以下流程：
1.  初始化：启动构建，读取与合并配置参数，加载 Plugin，实例化 Compiler。
2.  编译：从 Entry 发出，针对每个 Module 串行调用对应的 Loader 去翻译文件内容，再找到该 Module 依赖的 Module，递归地进行编译处理。
3.  输出：对编译后的 Module 组合成 Chunk，把 Chunk 转换成文件，输出到文件系统。
如果只执行一次构建，以上阶段将会按照顺序各执行一次。但在开启监听模式下，流程将变为如下：
https://juejin.cn/post/7053998924071174175
### webpack特点
1.预编译模块化方案（工程化：大而全）
2.通过配置文件达到一站式配置
3.loader进行资源转换，功能全面（css+js+icon+front）
4.插件丰富，灵活扩展
5.社群庞大
6.大型项目构建慢
### webpack优化
**1.提取公共代码**
 出现：多入口的情况，为防止重复打包而进行的优化操作，好处是可以减少文件体积，加快打包和启动速度
 （1)提取js公共代码：使用`optimization.splitChunks.cacheGroups`实现提取公共代码
 (2)利用externals提取第三方库
  `CDN`来引入jQuery，webpack给我们提供的`externals`
  externals: { jquery: "jQuery", }
  (3)提取css公共代码:只需要使用`mini-css-extract-plugin`插件就可以实现
**2.压缩代码**
**3.Tree Shaking**
**4.Code Splitting代码分割**

### 为什么webpack打出来的包，很乱
1.诞生在esm标准出来前，commonjs出来后
 当时的浏览器只能通过script标签加载模块
    -   **script标签加载代码是没有作用域的，只能在代码内 用iife的方式 实现作用域效果**，
        -   **这就是webpack打包出来的代码 大结构都是iife的原因**
        -   并且**每个模块都要装到function里面**，才能保证互相之间作用域不干扰。
        -   **这就是为什么 webpack打包的代码为什么乍看会感觉乱，找不到自己写的代码的真正原因**
2.关于webpack的代码注入问题，是因为**浏览器不支持cjs**，所以**webpack要去自己实现require和module.exports方法**（才有很多注入）
    -   这么多年了，甚至到现在2022年，**浏览器为什么不支持cjs**？
        -   **cjs是同步的，运行时的，node环境用cjs，node本身运行在服务器，无需等待网络握手，所以同步处理是很快的**
        -   **浏览器是 客户端，访问的是服务端资源，中间需要等待网络握手，可能会很慢，所以不能 同步的 卡在那里等服务器返回的，体验太差**
3.**后续出来esm后，webpack为了兼容以前发在npm上的老包**（并且当时心还不够决绝，导致这种“丑结构的包”越来越多，以后就更不可能改这种“丑结构了”），所以保留这个iife的结构和代码注入，**导致现在看webpack打包的产物，乍看结构比较乱且有很多的代码注入，自己写的代码都找不到**

# Babel
手册 https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md#toc-paths
https://juejin.cn/post/6992134202430849061
https://bobi.ink/2019/10/01/babel/
### 1.是什么
是一个JavaScript 编译器。此外也拥有众多模块可用于不同形式的静态分析。

编译器：更确切地说是源码到源码的编译器，通常也叫做“转换编译器（transpiler）”。 意思是说你为 Babel 提供一些 JavaScript 代码，Babel 更改这些代码，然后返回给你新生成的代码。
### 2.处理步骤
三个主要处理步骤： （源码）**解析（parse）**（AST)**转换（transform）**(添加替换移除 作用域信息+new AST)，**生成（generate）**（目标源码+source map）
**解析**: 把源码 parse 成 ast
**转换**：遍历 ast，生成作用域信息和 path，调用各种插件来对 ast 进行转换
**生成**：把转换以后的 ast 打印成目标代码，并生成 sourcemap
![[Pasted image 20220820124732.png]]
![[Pasted image 20220820134017.png]]

![[Pasted image 20220820134050.png]]
#### (1 解析
接收代码并输出 AST。 
两个阶段：**词法分析（Lexical Analysis)和语法分析（Syntactic Analysis）**

**词法分析阶段**把字符串形式的代码转换为 **令牌（tokens）** 流
令牌流：扁平的语法片段数组
n * n; 
[
  { type: { ... }, value: "n", start: 0, end: 1, loc: { ... } },
  { type: { ... }, value: "*", start: 2, end: 3, loc: { ... } },
  { type: { ... }, value: "n", start: 4, end: 5, loc: { ... } },
  ...
]
每一个 type 有一组属性来描述该令牌：
{
  type: {
    label: 'name',
    keyword: undefined,
    beforeExpr: false,
    startsExpr: true,
    rightAssociative: false,
    isLoop: false,
    isAssign: false,
    prefix: false,
    postfix: false,
    binop: null,
    updateContext: null
  },
  ...
}

**语法分析**阶段会把一个令牌流转换成 AST 的形式。
（AST抽象语法树，每一个节点都存有type 位置信息等，结合成树用于描述静态分析的程序语法）
#### (2转换
接收 AST 并对其进行遍历，在此过程中对节点进行添加、更新及移除等操作。 这是 Babel 或是其他编译器中最复杂的过程 同时也是插件将要介入工作的部分，
转换原理https://juejin.cn/post/6847902223629090824
#### (3生成
最终（经过一系列转换之后）的 AST 转换成字符串形式的代码，同时还会创建[源码映射（source maps）](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/)。.
代码生成其实很简单：深度优先遍历整个 AST，然后构建可以表示转换后代码的字符串。
### 3.转译不同阶段使用不同api
**1.parse 阶段使用`@babel/parser`，作用是把源码转成 AST**
2.transform 阶段使用 `@babel/traverse`，可以遍历 AST，并调用 visitor 函数修改 AST，修改 AST 涉及到 AST 的判断、创建、修改等，这时候就需要 `@babel/types` 了，当需要批量创建 AST 的时候可以使用 `@babel/template` 来简化 AST 创建逻辑。
3.**generate 阶段会把 AST 打印为目标代码字符串，同时生成 sourcemap，需要 `@babel/generate`包,中途遇到错误想打印代码位置的时候，使用`@babel/code-frame`包**
4.内置功能
如果使用了 **@babel/plugin-transform-runtime**，会做两个改动：
1.把 helper 部分的代码从注入的方式改为从 @babel/runtime 包引入的方式
2.polyfill 部分的代码也不再是全局引入，会改为模块引入。
所以 transform runtime 的好处就有两个：
1.抽离重复注入的 helper 代码，减少产物体积
2.polyfill 不污染全局
**但是也有相对应的问题**
babel 会按照如下顺序处理插件和 preset：
1.先应用 plugin，再应用 preset
2.plugin 从前到后，preset 从后到前

### 4.transform阶段
高亮的这部分就是我们要改的变量`a`的`AST`节点，我们知道它是一个`Identifier`类型的节点，所以我们就在`visitor`中编写一个`Identifier`方法
```js
module.exports = function ({ types: bts }) {
    return {
        visitor: {
            /**
             * 负责处理所有节点类型为 Identifier 的 AST 节点
             * @param {*} path AST 节点的路径信息，可以简单理解为里面放了 AST 节点的各种信息
             * @param {*} state 有一个很重要的 state.opts，是 .babelrc 中的配置项
            */
            Identifier (path, state) {
                // 节点信息
                const node = path.node
                // 从节点信息中拿到 name 属性，即 a 和 b
                const name = node.name
                // 如果配置项中存在 name 属性，则将 path.node.name 的值替换为配置项中的值
                if (state.opts[name]) {
                    path.node.name = state.opts[name]
                }
            }
        }
    }
}

// 其中的配置信息，是我们写在配置文件中的
{
  "plugins": [
    [
      "lyn",
      {
        "a": "aa",
        "b": "bb"
      }
    ]
  ]
}
```
### 6.编译过程
使用 @babel/cli 与 @babel/core 编译文件的主要过程
1.加载配置文件  
    （1）尝试加载 babel.config.js、babel.config.cjs、babel.config.mjs、babel.config.json文件
    （2）加载 package.json 文件
    （3）尝试加载 .bebelrc、.babelrc.js、.babelrc.cjs、.babelrc.mjs、.babelrc.json 文件
    （4）合并参数
2.加载 plugins 与 presets，分别遍历他们（plugins 每一项会调用它的回调，返回包含 visitor 的对象） 
3解析部分
    -   以 utf8 格式读入口文件得到代码
    -   之后解析生成 ast
4.遍历与转换部分
    -   遍历插件数组，生成最后的访问者（visitor）对象
    -   开始遍历节点，碰到感兴趣的节点就调用回调
5.生成部分
    -   遍历 ast，将得到的代码保存在数组中，最后拼接起来
### Babel +TS
为什么说用 babel 编译 typescript 是更好的选择 https://juejin.cn/post/6968636129239105549
### typescript compiler 的编译流程
![[Pasted image 20220820130907.png]]
1.scanner + parser： 分词和组装 ast，从源码到 ast 的过程
2.binder + checker： 生成作用域信息，进行类型推导和检查
3.transform：对经过类型检查之后的 ast 进行转换
4.emitter： 打印 ast 成目标代码生成 sourcemap 和类型声明文件（根据配置）

其实 babel 的编译阶段和 tsc 的编译阶段是类似的，只是 tsc 多了一个 checker用于生成类型信息和类型声明文件。
无法基于Babel插件在 traverse 的时候实现 checker：因为 tsc 的类型检查是需要拿到整个工程的类型信息，需要做类型的引入、多个文件的 namespace、enum、interface 等的合并，而 babel 是单个文件编译的，不会解析其他文件的信息。所以做不到和 tsc 一样的类型检查。**一个是在编译过程中解析多个文件，一个是编译过程只针对单个文件，流程上的不同，导致 babel 无法做 tsc 的类型检查。**
### babel怎么编译TS
先看一下 babel 的工作流程，babel 主要有三个处理步骤：解析、转换和生成。
1.解析：将原代码处理为 AST。对应 babel-parse
2.转换：对 AST 进行遍历，在此过程中对节点进行添加、更新、移除等操作。对应 babel-tranverse。
3.生成：把转换后的 AST 转换成字符串形式的代码，同时创建源码映射。对应 babel-generator。

在加入@babel/preset-typescript 之后，babel 这三个步骤是如何运行呢
1.解析：调用 babel-parser 的 typescript 插件，将源代码处理成 AST。
2.转换：babel-tranverse 的过程中会调用 babel-plugin-transform-typescript 插件，遇到类型注解节点，直接移除。
3.生成：遇到类型注解类型节点，调用对应输出方法。其它如常。
使用 babel，不仅能处理 typescript，之前 babel 就已经存在的 polyfill 功能也能一并享受。并且由于 babel 只是移除类型注解节点，所以速度相当快。
babel 只是能够 parse ts 代码成 ast，不会做类型检查，会直接把类型信息去掉，然后打印成目标代码。

#### 缺陷
导致了有一些 ts 语法是 babel 所不支持：
编译方式的不同导致不支持：
**const enum 不支持**。const enum 是在编译期间把 enum 的引用替换成具体的值，需要解析类型信息，而 babel 并不会解析，所以不支持。可以用相应的插件把 const enum 转成 enum。
**namespace 部分支持。不支持 namespace 的跨文件合并，不支持导出非 const 的值。**
export = import = 这种 ts 特有语法不支持
如果开启了 jsx 编译，那么 尖括号stringaa 这种类型断言不支持，通过 aa as string 来替代
**结论：babel 不能编译所有 typescript 代码，但是除了 namespace 的两个特性外，其余的都可以做编译。**
#### 为什么要用 babel 编译 typescript 代码？为什么采用直接移除类型注释的方式？
参考：为什么说用 babel 编译 typescript 是更好的选择 https://juejin.cn/post/6968636129239105549
1.性能方面，移除类型注解速度最快。收集类型并且验证类型是否正确，是一个相当耗时的操作。
2.babel 本身的限制。本文第一节分析过，进行类型验证之前，需要解析项目中所有文件，收集类型信息。而 babel 只是一个单文件处理工具。Webpack 在调用 loader 处理文件时，也是一个文件一个文件调用的。所以 babel 想验证类型也做不到。并且 babel 的三个工作步骤中，并没有输出错误的功能。
3.没有必要。类型验证错误提示可以交给编辑器。

# tsc使用
设置目标语言版本：在 compilerOptions 里面配置 target、
```javascript
{
    compilerOptions: {
        target: "es5" // es3、es2015
    }
}
```

引入 polyfill 呢：在入口文件里面引入 core-js.
```javascript
import 'core-js';
```
#### babel7
配置编译目标：在 preset-env 里面指定 targets，直接指定目标运行环境（浏览器、node）版本，或者指定 query 字符串，由 browserslist 查出具体的版本
```javascript
{
    presets: [
        [
            "@babel/preset-env",
            {
                targets: {
                    chrome: 45
                }
            }
        ]
    ]
}
```

```javascript
{
    presets: [
        [
            "@babel/preset-env",
            {
                targets: "last 1 version,> 1%,not dead"
            }
        ]
    ]
}
```
引入 polyfill：在 @babel/preset-env 里面配置，除了指定 targets 之外，还要指定 polyfill 用哪个（corejs2 还是 corejs3），如何引入（entry 在入口引入 ，usage 每个模块单独引入用到的）
```javascript
{
    presets: [
        [
            "@babel/preset-env",
            {
                targets: "last 1 version,> 1%,not dead",
                corejs: 3,
                useBuiltIns: 'usage'
            }
        ]
    ]
}
```
**先根据 targets 查出支持的目标环境的版本，再根据目标环境的版本来从所有特性中过滤支持的，剩下的就是不支持的特性。只对这些特性做转换和 polyfill 即可。**
babel 还可以通过 @babel/plugin-transform-runtime 来把全局的 corejs 的 import 转成模块化引入的方式。
**babel优点：**
1.babel 从**产物**上看有两个优点：
（1 能够做更精准的按需编译和 polyfill，产物**体积更小**
（2 能够通过插件@babel/plugin-transform-runtime来把 polyfill 变成**模块化的引入**，不污染全局环境
2.**支持的语言特性**
typescript 默认支持很多 es 的特性，但是不支持还在草案阶段的特性，babel 的 preset-env 支持所有标准特性，还可以通过 proposal 来支持更多还未进入标准的特性。
3.**编译速度**
tsc 会在编译过程中进行类型检查，类型检查需要综合多个文件的类型信息，要对 AST 做类型推导，比较耗时，而 babel 不做类型检查，所以编译速度会快很多。
**缺点**
缺失类型检查，还是要用tsc来做，可以在 npm scripts 中配一个命令：
```javascript
{
    "scripts": {
        "typeCheck": "tsc --noEmit"
    }
}
```

这样在需要进行类型检查的时候单独执行一下 npm run typeCheck 就行了，但最好在 git commit 的 hook 里（通过 husky 配置）再执行一次强制的类型检查。

# npm
### npm install发生了什么
https://cloud.tencent.com/developer/article/1555982
1.检查 `.npmrc` 文件：优先级为：项目级的 `.npmrc` 文件 > 用户级的 `.npmrc` 文件> 全局级的 `.npmrc` 文件 > npm 内置的 `.npmrc` 文件（npm running cnfiguration, 即npm运行时配置文件 npm config set registry ...）
2.检查项目中有无 `lock` 文件。
（1）无 `lock` 文件：
    1.从 `npm` 远程仓库获取包信息
    2.根据 `package.json` 的首层依赖为起点构建依赖树，构建过程：
        - 扁平化：构建依赖树时，不管其是直接依赖还是子依赖的依赖，优先将其放置在 `node_modules` 根目录。
        - 重复依赖，版本范围不同：当遇到相同模块时，判断已放置在依赖树的模块版本是否符合新模块的版本范围，如果符合则跳过，不符合则在当前模块的 `node_modules` 下放置该模块。
        - 注意这一步只是确定逻辑上的依赖树，并非真正的安装，后面会根据这个依赖结构去下载或拿到缓存中的依赖包
    3.在缓存中依次查找依赖树中的每个包
        - 不存在缓存：
            1.从 `npm` 远程仓库下载包
            2.校验包的完整性
	            不通过：重新下载
	            通过：将下载的包复制到 `npm` 缓存目录，按照依赖结构解压到 `node_modules`
        - 存在缓存：将缓存按照依赖结构解压到 `node_modules`
    4.生成 `lock` 文件

（2）有 `lock` 文件：
     1.检查 `package.json` 中的依赖版本是否和 `package-lock.json` 中的依赖有冲突。
     2.没有冲突，跳过获取包信息、构建依赖树过程，开始在缓存中查找包信息，后续过程相同；
       有冲突，做无lock文件相同处理

# ts编译原理
https://juejin.cn/post/6844903745503903758
https://zhuanlan.zhihu.com/p/409715330
分为以下几个关键部分，每个部分在源文件中均有独立文件
-**Scanner 扫描器**（`scanner.ts`）
-**Parser 解析器**（`parser.ts`）
-**Binder 绑定器**（`binder.ts`）
-**Checker 检查器**（`checker.ts`）
-**Emitter 发射器**（`emitter.ts`）

![[Pasted image 20220827223527.png]]
1.源码 ～ scanner(扫描器)（类比词法分析阶段) ->token数据流 ～ parser(解析器)(类比语法分析阶段) -> AST(抽象语法树)
2.1AST(抽象语法树) ～ binder(绑定器) -> symbols(符号)
2.2-AST(抽象语法树) + symbols ~ checker(检查器) -> 类型检查功能，收集错误
3.-AST(抽象语法树) + checker(检查器) ～ emitter(发射器) -> js代码

1.TypeScript 源码经过扫描器扫描之后变成一系列 Token；
2.解析器解析 token，得到一棵 AST 语法树；
3.绑定器遍历 AST 语法树，生成一系列 Symbol，并将这些 Symbol 连接到对应的节点上；
4.检查器再次扫描 AST，检查类型，并将错误收集起来；
5.发射器根据 AST 生成 JavaScript 代码。

### AST
AST 中的节点称为 Node，Node 中记录了这个节点的类型、在源码中的位置等信息。不同类型的 Node 会记录不同的信息。如对于 FunctionDeclaration 类型的 Node，会记录 name（函数名）、parameters（参数）、body（函数体）等信息，而对于 VariableDeclaration 类型的 Node，会记录 name（变量名）、initializer（初始化）等信息。一个源文件也是一个 Node —— SourceFile，它是 AST 的根节点。

### 绑定器
绑定器的终极目标是协助检查器进行类型检查，它遍历 AST，给每个 Node 生成一个 Symbol，并将源码中有关联的部分（在 AST 节点的层面）关联起来。

Symbol 是语义系统的基本构造块，它有两个基本属性：members 和 exports。members 记录了类、接口或字面量实例成员，exports 记录了模块导出的对象。Symbols 是一个对象的标识，或者说是一个对象对外的身份特征。如对于一个类实例对象，我们在使用这个对象时，只关心这个对象提供了哪些变量/方法；对于一个模块，我们在使用这个模块时，只关心这个模块导出了哪些对象。通过读取 Symbol，我们就可以获取这些信息。

绑定器如何将源码中有关联的部分（在 AST 节点的层面）关联起来。这需要再了解两个属性：Node 的 locals 属性以及 Symbol 的 declarations 属性。 对于容器类型的 Node，会有一个 locals 属性，其中记录了在这个节点中声明的变量/类/类型/函数等。如对于上面代码中的 func 函数，对应 FunctionDeclaration 节点中的 locals 中有一个属性 p。而对于 SourceFile 节点，则含有 a 和 func 两个属性。

**Symbol 的 declarations 属性记录了这个 Symbol 对应的变量的声明节点**。如对于上文代码中第 1 行和第 7 行中的 a 变量，各自创建了一个 Symbol，但是这两个 Symbol 的 declarations 的内容是一致的，都是第一行代码 var a = 1;所对应的 VariableDeclaration 节点

### 检查器
检查器如何工作的也非常明了了。**Node 和 Symbol 是关联的，Node 上含有这个 Node 相关的类型信息，Symbol 含有这个 Node 对外暴露的变量，以及 Symbol 对应的声明节点**。对于赋值操作，检查给这个 Node 赋的值是否匹配这个 Node 的类型。对于导入操作，检查 Symbol 是否导出了这个变量。对于对象调用操作，先从 Symbol 的 members 属性找到调用方法的 Symbol，根据这个 Symbol 找到对应的 declaration 节点，然后循环检查。具体实现这里就不再研究。

检查结果被记录到 SourceFile 节点的 diagnostics 属性中。

### **Language Service Protocal** IDE TS插件
VSCode 中新建一个 TypeScript 文件并输入 TS 代码时，可以发现 VSCode 自动对代码做了高亮，甚至在类型不一致的地方，VSCode 还会进行标红，提示类型错误。因为 VSCode 内置了对 TypeScript 语言的支持，类型检查主要通过 TypeScript 插件（extension）进行。插件背后就是 Language Service Protocal。

LSP 是由微软提出的的一个协议，目的是为了解决插件在不同的编辑器之间进行复用的问题。LSP 协议在语言插件和编辑器之间做了一层隔离，插件不再直接和编辑器通信，而是通过 LSP 协议进行转发。这样在遵循了 LSP 的编译器中，相同功能的插件，可以一次编写，多处运行。
![[Pasted image 20220827225134.png]]
从图中可以看出，遵循了 LSP 协议的插件存在两个部分

1.  LSP 客户端，它用来和 VSCode 环境交互。通常用 JS/TS 写成，可以获取到 VSCode API，因此可以监听 VSCode 传过来的事件，或者向 VSCode 发送通知。
2.  语言服务器。它是语言特性的核心实现，用来对文本进行词法分析、语法分析、语义诊断等。它在一个单独的进程中运行。
VSCode 内置了对 TypeScript 的支持，其实就是 VSCode 内置了 TypeScript 插件
#### **tsserver**
由于 TypeScript 插件不需要将 TS 文件编译成 JS 文件，所以 typescript-core 只会运行到检查器这一步。

### @babel/preset-typescript
### 总结
![[Pasted image 20220827225814.png]]



总结：
1.**dev开发方面**：vite提供dev服务器，以及比webpack快的多的热更新，dev开发的体验更好了
2.**prod生产方面**：vite 打生产包，实际上用的就是**rollup**，笔者用vite已经上过真实项目，开发体验很棒，**打的生产包比用webpack小了很多，有不错的性能提升**
    -   vite的优点和特点，可以看我另一篇：[vite原理浅析-dev篇（对比webpack）](https://juejin.cn/post/7050293652739850271 "https://juejin.cn/post/7050293652739850271")
3.**理论上 chorme63以上 可以开箱即用，chorme63以下也不是完全不能用**，需要自己加**polyfill**或vite插件（[vite推荐的兼容做法](https://link.juejin.cn?target=https%3A%2F%2Fcn.vitejs.dev%2Fguide%2Fbuild.html%23browser-compatibility "https://cn.vitejs.dev/guide/build.html#browser-compatibility") ）
4.ts类型检查，依然用tsc --noEmit
# 打包体积优化
## tree shaking
`Tree Shaking` 指基于 ES Module 进行静态分析，通过 AST 将用不到的函数进行移除，从而减小打包体积。
## polyfill
[core-js (opens new window)](https://github.com/zloirock/core-js)是关于 ES 标准最出名的 `polyfill`，polyfill 意指当浏览器不支持某一最新 API 时，它将帮你实现，中文叫做垫片。你也许每天都与它打交道，但你毫不知情。
由于垫片的存在，打包后体积便会增加，所需支持的浏览器版本 ​ 越高，垫片越少，体积就会越小
`core-js` 的包含了所有 `ES6+` 的 polyfill，并集成在 `babel` 等编译工具之中
# Bundless 基础设施建设
## 浏览器中如何使用原生的 ESM
通过 `script[type=module]`，可直接在浏览器中使用原生 `ESM`。这也使得前端不打包 (`Bundless`) 成为可能。
```
<script type="module">
  import lodash from "https://cdn.skypack.dev/lodash";
</script>
```
由于前端跑在浏览器中，**因此它也只能从 URL 中引入 `Package`**
1.绝对路径: `https://cdn.sykpack.dev/lodash`
2.相对路径: `./lib.js`
现在打开浏览器控制台，把以下代码粘贴在控制台中。由于 `http import` 的引入，你发现你调试 `lodash` 此列工具库更加方便了。
```
> lodash = await import('https://cdn.skypack.dev/lodash')
> lodash.get({ a: 3 }, 'a')
```
### ImportMap
但 `Http Import` 每次都需要输入完全的 URL，相对以前的裸导入 (`bare import specifiers`)，很不太方便，如下例:
```
import lodash from "lodash";
```
原因：浏览器不像`Node.JS` 可以依赖系统文件系统，层层寻找 `node_modules`
在 ESM 中，可通过 `importmap` 使得裸导入可正常工作:
```
<script type="importmap">
  {
    "imports": {
      "lodash": "https://cdn.skypack.dev/lodash",
      "ms": "https://cdn.skypack.dev/ms"
    }
  }
</script>
```
此时可与以前同样的方式进行模块导入
```
import lodash from 'lodash'
import("lodash").then(_ => ...)
```
那么通过裸导入如何导入子路径呢？
```
<script type="importmap">
  {
    "imports": {
      "lodash": "https://cdn.skypack.dev/lodash",
      "lodash/": "https://cdn.skypack.dev/lodash/"
    }
  }
</script>
<script type="module">
  import get from "lodash/get.js";
</script>
```
#### Import Assertion
通过 `script[type=module]`，不仅可引入 Javascript 资源，甚至可以引入 JSON/CSS，示例如下
```
<script type="module">
  import data from "./data.json" assert { type: "json" };

  console.log(data);
</script>
```
## commonjs -> ESM
CommonJS 向 ESM 转化，自然有构建工具的参与，比如
[@rollup/plugin-commonjs(opens new window)](https://github.com/rollup/plugins/tree/master/packages/commonjs)
甚至把一些 CommonJS 库转化为 ESM，并且置于 CDN 中，使得我们可以直接使用，而无需构建工具参与
[https://cdn.skypack.dev/(opens new window)](https://cdn.skypack.dev/)
[https://jspm.org/](https://jspm.org/)
# 运维篇
## 分包，代码分离
**1.为什么需要分包？**
为什么需要进行分包，一个大的 `bundle.js` 不好吗？
（1）一行代码将导致整个 `bundle.js` 的缓存失效
（2）一个页面仅仅需要 `bundle.js` 中 1/N 的代码，剩下代码属于其它页面，完全没有必要加载
**2.如何分包**
（1) 打包工具运行时
webpack(或其他构建工具) 运行时代码不容易变更，需要单独抽离出来，比如 `webpack.runtime.js`。由于其体积小，**必要时可注入 `index.html` 中**，减少 HTTP 请求数，优化关键请求路径
（2）前端框架运行时
React(Vue) 运行时代码不容易变更，且每个组件都会依赖它，可单独抽离出来 `framework.runtime.js`。请且注意，**务必将 React 及其所有依赖(react-dom/object-assign)共同抽离出来**，否则有可能造成性能损耗，见下示例
（3）高频库
一个模块被 N(2 个以上) 个 Chunk 引用，可称为公共模块，可把公共模块给抽离出来，形成 `vendor.js`。
问：若一模块被用多次 (2 次以上)，但**体积过大**(1MB)，每个页面都会加载(无必要，不是每个页面都依赖它)，导致性能变差，此时如何分包？
答：一个模块虽是公共模块，但体积过大，可直接 `import()` 引入，异步加载，单独分包，比如 `echarts` 等

问：若公共模块数量多，导致 vendor.js 体积过大(1MB)，每个页面都会加载它，导致性能变差，如何分包
答：有以下两个思路
1.思路一: 可对 vendor.js 改变策略，比如被引用了十次以上，被当做公共模块抽离成 verdor-A.js，五次的抽离为 vendor-B.js，两次的抽离为 vendor-C.js
2.思路二: 控制 vendor.js 的体积，当大于 100KB 时，再次进行分包，多分几个 vendor-XXX.js，但每个 vendor.js 都不超过 100KB
**3.使用 webpack 分包**
常用的代码分离方法有三种：
- **入口起点**：使用 [`entry`](https://webpack.docschina.org/configuration/entry-context) 配置手动地分离代码。
- **防止重复**：使用 [Entry dependencies](https://webpack.docschina.org/configuration/entry-context/#dependencies) 或者 [`SplitChunksPlugin`](https://webpack.docschina.org/plugins/split-chunks-plugin) 去重和分离 chunk。
- **动态导入**：通过模块的内联函数调用来分离代码。

在 webpack 中可以使用 [SplitChunksPlugin (opens new window)](https://webpack.js.org/plugins/split-chunks-plugin)进行分包，它需要满足三个条件:
1.minChunks: 一个模块是否最少被 minChunks 个 chunk 所引用
2.maxInitialRequests/maxAsyncRequests: 最多只能有 maxInitialRequests/maxAsyncRequests 个 chunk 需要同时加载 (如一个 Chunk 依赖 VendorChunk 才可正常工作，此时同时加载 chunk 数为 2)
3.minSize/maxSize: chunk 的体积必须介于 (minSize, maxSize) 之间
以下是 `next.js` 的默认配置，可视作最佳实践

# 按需加载
## element UI等按需加载
`Vant`和`antd`也都是采用这种方式，只是使用的插件不一样，这两个使用的都是[babel-plugin-import](https://link.segmentfault.com/?enc=FeNE4Q91VhuGuntRDzPTng%3D%3D.goqlrwLzF8dHjREF0kM%2Br9FY%2BlTCORFD%2FuTY2gxgvyI6ymOEM%2B84tkhHuNqsndVS)，`babel-plugin-component`其实也是`fork`自`babel-plugin-import`。
element UI采用`babel-plugin-component`。
## 在Vue中引入element
```js
// main.js
import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
```
看打包后的大小 `npm run build -- --report`
## 借助 babel-plugin-component
我们可以只引入需要的组件，以达到减小项目体积的目的
```js
// 安装
npm install babel-plugin-component -D

// 配置
// babel.config.js
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
// 使用
// 可以直接写在main.js中，也可以写在单独的js中并导出
// 1.直接写在main.js中
import Vue from 'vue'
import App from './App.vue'

import {
  Carousel,
  CarouselItem,
} from 'element-ui';

Vue.use(Carousel)
Vue.use(CarouselItem)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

// 2.单独写
// 导入自己需要的组件
import { Select, Option, OptionGroup, Input, Tree, Dialog, Row, Col } from 'element-ui'
const element = {
  install: function (Vue) {
    Vue.use(Select)
    Vue.use(Option)
    Vue.use(OptionGroup)
    Vue.use(Input)
    Vue.use(Tree)
    Vue.use(Dialog)
    Vue.use(Row)
    Vue.use(Col)
  }
}
export default element
// 再在main.js中引入
// css样式还是需要全部引入
import 'element-ui/lib/theme-chalk/index.css'
import element from './element/index'
Vue.use(element)
```
### 原理与源码分析
https://juejin.cn/post/6847902223629090824
https://segmentfault.com/a/1190000041062139
```javascript
import { Button } from 'element-ui'
```
怎么就变成了
```javascript
var Button = require('element-ui/lib/button.js')
require('element-ui/lib/theme-chalk/button.css')
```

在 babel 遍历 ast 的时候，这个插件主要关注了 ImportDeclaration 与 CallExpression 与 Program
1.找到引入 element-ui 的类型为 ImportDeclaration 节点，将感兴趣的值存在对象里（比如引入 button，就存起来），之后移除当前这个节点。
2.在遍历到 CallExpression 类型节点的时候（假设使用了 button，就判断是否存在了上面的对象里），之后创建新的 ImportDeclaration 节点，用于之后加载对应的 js 与 css 文件。
# 懒加载
为给客户更好的客户体验，首屏组件加载速度更快一些，解决白屏问题。懒加载简单来说就是延迟加载或按需加载，即在需要的时候的时候进行加载。
## Vue中懒加载
### webpack中懒加载
https://webpack.docschina.org/guides/lazy-loading/
懒加载或者按需加载，是一种很好的优化网页或应用的方式。这种方式实际上是先把你的代码在一些逻辑断点处分离开，然后在一些代码块中完成某些操作后，立即引用或即将引用另外一些新的代码块。这样加快了应用的初始加载速度，减轻了它的总体体积，因为某些代码块可能永远不会被加载。
我们在[代码分离](https://webpack.docschina.org/guides/code-splitting#dynamic-imports)中的例子基础上，进一步做些调整来说明这个概念。那里的代码确实会在脚本运行的时候产生一个分离的代码块 `lodash.bundle.js` ，在技术概念上“懒加载”它。问题是加载这个包并不需要用户的交互 - 意思是每次加载页面的时候都会请求它。这样做并没有对我们有很多帮助，还会对性能产生负面影响。
我们试试不同的做法。我们增加一个交互，当用户点击按钮的时候用 console 打印一些文字。但是会等到第一次交互的时候再加载那个代码块（`print.js`）。为此，我们返回到代码分离的例子中，把 `lodash` 放到主代码块中，重新运行 _代码分离_ 中的代码 [final _Dynamic Imports_ example](https://webpack.docschina.org/guides/code-splitting#dynamic-imports)。
**project**
```
webpack-demo
|- package.json
|- package-lock.json
|- webpack.config.js
|- /dist
|- /src
  |- index.js
+ |- print.js
|- /node_modules
```

**src/print.js**

```
console.log(
  'The print.js module has loaded! See the network tab in dev tools...'
);

export default () => {
  console.log('Button Clicked: Here\'s "some text"!');
};
```

**src/index.js**

```
+ import _ from 'lodash';
+
- async function getComponent() {
+ function component() {
    const element = document.createElement('div');
-   const _ = await import(/* webpackChunkName: "lodash" */ 'lodash');
+   const button = document.createElement('button');
+   const br = document.createElement('br');

+   button.innerHTML = 'Click me and look at the console!';
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+   element.appendChild(br);
+   element.appendChild(button);
+
+   // Note that because a network request is involved, some indication
+   // of loading would need to be shown in a production-level site/app.
+   button.onclick = e => import(/* webpackChunkName: "print" */ './print').then(module => {
+     const print = module.default;
+
+     print();
+   });

    return element;
  }

- getComponent().then(component => {
-   document.body.appendChild(component);
- });
+ document.body.appendChild(component());
```
## webpack中动态导入
当涉及到动态代码拆分时，webpack 提供了两个类似的技术。第一种，也是推荐选择的方式是，使用符合 [ECMAScript 提案](https://github.com/tc39/proposal-dynamic-import) 的 [`import()` 语法](https://webpack.docschina.org/api/module-methods/#import-1) 来实现动态导入。第二种，则是 webpack 的遗留功能，使用 webpack 特定的 [`require.ensure`](https://webpack.docschina.org/api/module-methods/#requireensure)。
第一种方法
**webpack.config.js**

```js
 const path = require('path');

 module.exports = {
   mode: 'development',
   entry: {
     index: './src/index.js',
-    another: './src/another-module.js',
   },
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
   },
-  optimization: {
-    splitChunks: {
-      chunks: 'all',
-    },
-  },
 };
```
再使用 statically import(静态导入) `lodash`，而是通过 dynamic import(动态导入) 来分离出一个 chunk：

**src/index.js**

```js
-import _ from 'lodash';
-
-function component() {
+function getComponent() {
-  const element = document.createElement('div');

-  // Lodash, now imported by this script
-  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+  return import('lodash')
+    .then(({ default: _ }) => {
+      const element = document.createElement('div');
+
+      element.innerHTML = _.join(['Hello', 'webpack'], ' ');

-  return element;
+      return element;
+    })
+    .catch((error) => 'An error occurred while loading the component');
 }

-document.body.appendChild(component());
+getComponent().then((component) => {
+  document.body.appendChild(component);
+});
```
由于 `import()` 会返回一个 promise，因此它可以和 [`async` 函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)一起使用。下面是如何通过 async 函数简化代码：

**src/index.js**

```
-function getComponent() {
+async function getComponent() {
+  const element = document.createElement('div');
+  const { default: _ } = await import('lodash');

-  return import('lodash')
-    .then(({ default: _ }) => {
-      const element = document.createElement('div');
+  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

-      element.innerHTML = _.join(['Hello', 'webpack'], ' ');
-
-      return element;
-    })
-    .catch((error) => 'An error occurred while loading the component');
+  return element;
 }

 getComponent().then((component) => {
   document.body.appendChild(component);
 });
```
## 使用unplugin-vue-components插件
这种方式的优点是完全不需要自己来引入组件，直接在模板里使用，由插件来扫描引入并注册，这个插件内置支持了很多市面上流行的组件库，对于已经内置支持的组件库，直接参考上图引入对应的解析函数配置一下即可。

