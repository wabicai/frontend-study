## Webpack核心概念

#### 入口 :

![image-20210407154732324](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210407154732324.png)

#### 输出：

![image-20210407154748049](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210407154748049.png)

#### Loader：

![image-20210407154835464](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210407154835464.png)

#### 插件：

![image-20210407154922138](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210407154922138.png)

#### 模块/兼容性:

![image-20210407155413032](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210407155413032.png)



## webpack的原理和配置

1. 基于node开发出来的，可以用node的所有指令
2. 作用：体积更小，可以编译高级语言：es6，scss，ts，模块化，兼容
3. entry（入口src文件下的index.js）ouput（出口dist文件下的main.js) loder
4. ![image-20210328173812197](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210328173812197.png)
5. 默认找index文件，打包到dist文件夹。npx.webpack命令
   1. 打包非JS文件（CSS，图片），需要使用loader，能导出一个函数的node模块，webpack只认识js
   2. pugin（拓展插件）
      1. 可以自动修改引入的入口文件
      2. 可以删除dist下面没用的文件
      3. 创建一个本地的服务
      4. 可以压缩css，js
   3. 通过modle（各个源文件），pugin的一系列操作生成代码块（chunk），还没有生成具体模块，最后再生成bundle，就是最终的文件
   4. 工作流程：
      1. 初始化：通过shell脚本和config解析options。通过options初始化compiler对象，加载所有配置的插件，执行run（）方法开始编译
      2. 编译：调用addEntry方法，找到入口文件。从入口文件触发，调用所有配置的loader对模块进行处理，同时处理依赖，得到编译结果，里面包含处理后的最终内容和依赖关系
      3. 输出：监听seal时间调用各个插件对构建后的结构进行封装，根据入口和模块的依赖关系，合并拆分组成chunk，按照output中的配置将文件输出到对应的path