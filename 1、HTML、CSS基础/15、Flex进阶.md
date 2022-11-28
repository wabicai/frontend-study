# flex

## flex的两种形态
### flex 和 inline-flex
- 当display 指定为 flex 时，FlexBox 的宽度会填充父容器，当display指定为 inline-flex 时，FlexBox的宽度会包裹子Item
## flex基本属性/特性
- 设为 Flex 布局以后，子元素的`float`、`clear`和`vertical-align`属性将失效。
父项属性
```css
以下6个属性是对父元素设置的：
 - flex-direction:设置主轴的方向
 - justify-content:设置主轴上的子元素排列方式
 - flex-wrap:设置子元素是否换行
 - align-items:设置侧轴上的子元素排列方式(单行)
 - flex-flow:复合属性，相当于同时设置了flex-direction和flex-wrap
```
子项属性
```css
- order 定义项目的排列顺序。数值越小，排列越靠前，默认为0
- flex-grow 定义项目的放大比例，默认为`0`，即如果存在剩余空间，也不放大。
- flex-shrink 项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。
- flex-basis 在分配多余空间之前，占据的主轴空间（main size）.默认`auto`，本来大小。
- flex [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ] 
- auto (`1 1 auto`) 和 none (`0 0 auto`)。
- align-self 单个项目有与其他项目不一样的对齐方式align-items 默认auto
```

## flex实战
### 百分比布局
```css
.father {
	display: flex;
}
.son {
 /*  0表示不自动填充，1表示自动填充剩余空间 */
	  flex-grow: 0;   
 /* 0表示不会缩小，并且可以超出父元素宽度，1表示空间不足则缩小 */
	  flex-shrink: 1;  
 /* 占父元素宽度20%，auto表示长度将根据内容决定 */
	  flex-basis: 20%; 
}
```

### 圣杯布局
```css
.box {
	display: flex;
	height: 100vh;
 /*  竖向布局 */
	flex-direction: column; 
}

header,
footer {
 /*  头部、尾部自动填充 */
	flex: 1; 
}

.box-body {
	display: flex;
	flex: 1;
}

.box-body__content {
	flex: 1;
}
.box-body__nav, .box-body__ads {
 /* 两个边栏的宽度设为12em */
	flex: 0 0 12em
}
/* 或者把nav放到第一个元素也可以 */
.box-body__nav {
  /* 导航放到最左边 */
  order: -1;
}
```


### 流式布局
> 每行的项目数固定，会自动分行

```css
.parent {
  width: 200px;
  height: 150px;
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
}

.child {
  flex: 0 0 25%;
  height: 50px;
}
```
