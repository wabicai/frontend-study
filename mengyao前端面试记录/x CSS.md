# css预处理器  Sass Less

why CSS预处理器 
-   语法不够强大，比如无法嵌套书写导致模块化开发中需要书写很多重复的选择器；
-   没有变量和合理的样式复用机制，使得逻辑上相关的属性值必须以字面量的形式重复输出，导致难以维护。

## Sass
按照 sass 的缩进方式省去「大括号」和「分号」
```
/*style.sass*/
h1
  color: #666
  background-color: #666	
```

## Less
-   变量：就像写其他语言一样，免于多处修改。
-   混合：class 之间的轻松引入和继承。
-   嵌套：选择器之间的嵌套使你的 less 非常简洁。
-   函数&运算：就像 js 一样，对 less 变量的操控更灵活。

# 盒模型
CSS盒模型本质上是一个盒子，封装周围的HTML元素，它包括：外边距（margin）、边框（border）、内边距（padding）、实际内容（content）四个属性。  
CSS盒模型：**标准模型 + IE模型**、
标准模型 width content box-sizing: content-box;( 浏览器默认设置 )
IE盒模型 width content+padding+border box-sizing: border-box;
## 如何获取盒模型对应的宽高
JS如何获取盒模型对应的宽和高
（1）dom.style.width/height只能取到行内样式的宽和高，style 标签中和 link 外链的样式取不到。  
（2）dom.currentStyle.width/height（只有IE兼容）取到的是最终渲染后的宽和高  
（3）window.getComputedStyle(dom).width/height同（2）但是多浏览器支持，IE9 以上支持。  
（4）dom.getBoundingClientRect().width/height也是得到渲染后的宽和高包含了 `padding` 和 `border-width`，大多浏览器支持。IE9 以上支持，除此外还可以取到相对于视窗的上下左右的距离。  
（6）dom.offsetWidth/offsetHeight包括高度（宽度）、内边距和边框，不包括外边距。最常用，兼容性最好。
# BFC 块级格式化上下文
BFC是CSS布局的一个概念，是一块独立的渲染区域，是一个环境，里面的元素不会影响到外部的元素 。
# css优先级

选择器类型

-   ID　　#id
-   class　　.class
-   标签　　p
-   通用　　*
-   属性　　[type="text"]
-   伪类　　:hover
-   伪元素　　::first-line
-   子选择器、相邻选择器

权重计算规则

第一等：代表内联样式，如: style=””，权值为1000。  
第二等：代表ID选择器，如：#content，权值为0100。  
第三等：代表类，伪类和属性选择器，如.content，权值为0010。  
第四等：代表类型选择器和伪元素选择器，如div p，权值为0001。  
通配符、子选择器、相邻选择器等的。如*、>、+,权值为0000。  
继承的样式没有权值。

比较规则
遵循如下法则：
-   选择器都有一个权值，权值越大越优先；
-   当权值相等时，后出现的样式表设置要优于先出现的样式表设置；
-   创作者的规则高于浏览者：即网页编写者设置的 CSS 样式的优先权高于浏览器所设置的样式；
-   继承的 CSS 样式不如后来指定的 CSS 样式；
-   在同一组属性设置中标有!important规则的优先级最大
-   通配符、子选择器、相邻选择器等的。虽然权值为0000，但是也比继承的样式优先。

！important

# offsetWidth、clientWidth和scrollWidth
![[Pasted image 20220624151912.png]]


# event对象中的clientX,offsetX,screenX,pageX