@[TOC](BFC（Block formatting context）)
- 转载自：[什么是BFC？](https://blog.csdn.net/sinat_36422236/article/details/88763187)


## 什么是BFC

- BFC(Block formatting context)直译为"块级格式化上下文"。它是一个独立的渲染区域，只有Block-level box参与， 它规定了内部的Block-level Box如何布局，并且与这个区域外部毫不相干。

在解释什么是BFC之前，我们需要先知道Box、Formatting Context的概念。（下述有点难理解，我也不太懂）

**Box：css布局的基本单位**

一个页面是由很多个 Box 组成的。元素的类型和 display 属性，决定了这个 Box 的类型。 不同类型的 Box， 会参与不同的 Formatting Context（一个决定如何渲染文档的容器），因此Box内的元素会以不同的方式渲染。

- block-level box:display 属性为 **block, list-item, table** 的元素，会生成 block-level box。并且参与 block fomatting context；
- inline-level box:display 属性为 **inline, inline-block, inline-table** 的元素，会生成 inline-level box。并且参与 inline formatting context；
- run-in box:
  -  run-in元素是一个块/ 行内元素混合，可以使某些会计元素成为下一个元素的行内部分。对于标题效果比较有用，就是**可以将标题作为文本段落的一部分出现**。
  - 在css中，只需要改变元素的display值，并让下一个元素作为块级元素框，就可以使元素成为run-in元素。
  - 如果一个元素生成run-in框，那么该框后面是一个块级框，那么该run-in元素将成为块级框开始处的一个行内框。
  - run-in元素会从其原先的父元素继承属性，只有run-in后面是一个块级框时run-in才起作用，如果不是这样，run-in框本身会成为块级框。
  - **目前很少有浏览器支持run-in元素**

**Formatting Context**

Formatting context 是 W3C CSS2.1 规范中的一个概念。它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用。最常见的 Formatting context 有 Block fomatting context (简称BFC)和 Inline formatting context (简称IFC)。

## BFC的布局规则

- 内部的Box会在垂直方向，一个接一个地放置。
- Box垂直方向的距离由margin决定。属于**同一个**BFC的两个相邻Box的margin会发生重叠。
- 每个盒子（块盒与行盒）的margin box的左边，与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
- BFC的区域不会与float box重叠。
- BFC就是页面上的一个隔离的独立容器，**容器里面的子元素不会影响到外面的元素**。反之也如此。
- **计算BFC的高度时，浮动元素也参与计算。**

## 如何创建BFC

#### 1、`float`的值不是none。（right、left、inherit）

#### 2、`position`的值不是static或者relative。（absolute、fixed、 sticky）

#### 3、`display`的值是**inline-block**、table-cell、**flex**、table-caption或者inline-flex

#### 4、`overflow`的值不是visible（hidden、scroll、auto）

## BFC的作用
### 1.利用BFC避免margin重叠。
一起来看一个例子：
```css
        .father1 {
            height: 20px;
            width: 100%;
            margin: 5px;
            background-color: black;
            float: left;

       }

        .father2 {
            height: 20px;
            width: 100%;
            margin: 5px;
            float: left;
            background-color: green;
        }
```
![](https://img-blog.csdnimg.cn/20210225170758659.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FidWFuZGVu,size_16,color_FFFFFF,t_70)
- 兄弟元素都设置了float之后，margin不会发生重叠
### 2.自适应两栏布局
根据：

- 每个盒子的margin box的左边，与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<style>
    *{
        margin: 0;
        padding: 0;
    }
    body {
        width: 100%;
        position: relative;
    }
 
    .left {
        width: 100px;
        height: 150px;
        float: left;/* 看这里，左浮动 */
        background: rgb(139, 214, 78);
        text-align: center;
        line-height: 150px;
        font-size: 20px;
    }
 
    .right {
        height: 300px;
        background: rgb(170, 54, 236);
        text-align: center;
        line-height: 300px;
        font-size: 40px;
    }
</style>
<body>
    <div class="left">LEFT</div>
    <div class="right">RIGHT</div>
</body>
</html>
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210225171231890.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FidWFuZGVu,size_16,color_FFFFFF,t_70)

又因为：

- BFC的区域不会与float box重叠。所以我们让right单独成为一个BFC
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<style>
    *{
        margin: 0;
        padding: 0;
    }
    body {
        width: 100%;
        position: relative;
    }
 
    .left {
        width: 100px;
        height: 150px;
        float: left;
        background: rgb(139, 214, 78);
        text-align: center;
        line-height: 150px;
        font-size: 20px;
    }
 
    .right {
        overflow: hidden;/* overflow使他变成BFC */
        height: 300px;
        background: rgb(170, 54, 236);
        text-align: center;
        line-height: 300px;
        font-size: 40px;
    }
</style>
<body>
    <div class="left">LEFT</div>
    <div class="right">RIGHT</div>
</body>
</html>

```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210225171241666.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FidWFuZGVu,size_16,color_FFFFFF,t_70)
- right会自动的适应宽度，这时候就形成了一个两栏自适应的布局。

### 3.清除浮动。
当我们不给父节点设置高度，子节点设置浮动的时候，会发生高度塌陷，这个时候我们就要清楚浮动。

这个时候我们根据最后一条：
**计算BFC的高度时，浮动元素也参与计算。给父节点激活BFC**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>清除浮动</title>
</head>
<style>
    .par {
        border: 5px solid rgb(91, 243, 30);
        width: 300px;
        overflow: hidden;/*这里就是BFC*/
    }
    
    .child {
        border: 5px solid rgb(233, 250, 84);
        width:100px;
        height: 100px;
        float: left;
    }
</style>
<body>
    <div class="par">
        <div class="child"></div>
        <div class="child"></div>
    </div>
</body>
</html>

```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210225171440812.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FidWFuZGVu,size_16,color_FFFFFF,t_70)
### 总结
以上例子都体现了：

**BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。**

因为BFC内部的元素和外部的元素绝对不会互相影响，因此，
**当BFC外部存在浮动时，它不应该影响BFC内部Box的布局，BFC会通过变窄，而不与浮动有重叠。同样的，当BFC内部有浮动时，为了不影响外部元素的布局，BFC计算高度时会包括浮动的高度。避免margin重叠也是这样的一个道理。**