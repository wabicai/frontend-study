## 1.选择器优先级
#### 权重计算规则
0.第一优先级：`!important`会覆盖页面内任何位置的元素样式
1.内联样式，如`style="color: green"`，权值为`1000`
2.ID选择器，如`#app`，权值为`0100`
3.类、伪类、属性选择器，如`.foo, :first-child, div[class="foo"]`，权值为`0010`
4.标签、伪元素选择器，如`div::first-line`，权值为`0001`
5.通配符、子类选择器、兄弟选择器，如`*, >, +`，权值为`0000`
6.继承的样式没有权值
#### 比较规则
1.`1000 > 0100`，从左向右逐个比较，前一级相等才能往后比较
2.行内>id>class>元素(标签)`
3.权重相同的情况下，位于后面的样式会覆盖前面的样式
4.通配符、子选择器、兄弟选择器，虽然权重为`0000`，但是优先于继承的样式
## 2.flex布局
设为 Flex 布局以后，子元素的`float`、`clear`和`vertical-align`属性将失效。
父项属性
```
以下6个属性是对父元素设置的：
 - flex-direction:设置主轴的方向
 - justify-content:设置主轴上的子元素排列方式
 - flex-wrap:设置子元素是否换行
 - align-items:设置侧轴上的子元素排列方式(单行)
 - flex-flow:复合属性，相当于同时设置了flex-direction和flex-wrap
```
子项属性
```
- order 定义项目的排列顺序。数值越小，排列越靠前，默认为0
- flex-grow 定义项目的放大比例，默认为`0`，即如果存在剩余空间，也不放大。
- flex-shrink 项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。
- flex-basis 在分配多余空间之前，占据的主轴空间（main size）.默认`auto`，本来大小。
- flex [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ] 
- auto (`1 1 auto`) 和 none (`0 0 auto`)。
- align-self 单个项目有与其他项目不一样的对齐方式align-items 默认auto
```
## 3.盒子模型
box-sizing 属性可以被用来调整这些表现:
1.`content-box`  是默认值。如果你设置一个元素的宽为100px，那么这个元素的内容区会有100px 宽，并且任何边框和内边距的宽度都会被增加到最后绘制出来的元素宽度中。**width = content**
2.`border-box` 告诉浏览器：你想要设置的边框和内边距的值是包含在width内的。也就是说，如果你将一个元素的width设为100px，那么这100px会包含它的border和padding，内容区的实际宽度是width减去(border + padding)的值。大多数情况下，这使得我们更容易地设定一个元素的宽高 **width  = content+padding+border**
## 4.BFC
BFC（Block Formatting Context）格式化上下文，是 Web 页面中盒模型布局的 CSS 渲染模式，指一个独立的渲染区域或者说是一个隔离的独立容器。
形成 BFC 的条件 五种：
1.**浮动元素**，float 除 none 以外的值
2.**定位元素**，position（absolute，fixed）
3.**display** 为以下其中之一的值 inline-block，table-cell，table-caption
4.**overflow** 除了 visible 以外的值（hidden，auto，scroll）
5.HTML 就是一个 BFC
BFC 的特性：
1.内部的 Box 会在垂直方向上一个接一个的放置。
2.垂直方向上的距离由 margin 决定
3.bfc 的区域不会与 float 的元素区域重叠。
4.计算 bfc 的高度时，浮动元素也参与计算
5.bfc 就是页面上的一个独立容器，容器里面的子元素不会影响外面
### 5.清除浮动
不清楚会发生高度塌陷：浮动元素父元素高度自适应（父元素不写高度时，子元素写了浮动后，父元素会发生高度塌陷）
1.**clear清除浮动**（添加空div法）在浮动元素下方添加空div,并给该元素写css样式：{clear:both;height:0;overflow:hidden;}
2.给浮动元素父级设置高度
3.父级同时浮动（需要给父级同级元素添加浮动）
4.父级设置成inline-block，其margin: 0 auto居中方式失效
5.给父级添加overflow:hidden 清除浮动方法
6.万能清除法 **after伪类** 清浮动（现在主流方法，推荐使用）
```css
.float_div:after{
  content:".";
  clear:both;
  display:block;
  height:0;
  overflow:hidden;
  visibility:hidden;
}
.float_div{
  zoom:1
}
```
6.**CSS优化、提高性能的方法有哪些？**
1.避免过度约束
2.避免后代选择符
3.避免链式选择符
4.使用紧凑的语法
5.避免不必要的命名空间
6.避免不必要的重复
7.最好使用表示语义的名字。一个好的类名应该是描述他是什么而不是像什么
8.避免！important，可以选择其他选择器
9.尽可能的精简规则，你可以合并不同类里的重复规则