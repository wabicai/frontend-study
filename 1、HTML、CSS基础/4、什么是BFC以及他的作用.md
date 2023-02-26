@[TOC](BFC（Block formatting context）)

- 转载自：[什么是 BFC？](https://blog.csdn.net/sinat_36422236/article/details/88763187)

# BFC(Box Fomatting Context(格式上下文))

## BFC 的布局规则

- 内部的 Box 会在垂直方向，一个接一个地放置。
- Box 垂直方向的距离由 margin 决定。属于**同一个**BFC 的两个相邻 Box 的 margin 会发生重叠。
- 每个盒子（块盒与行盒）的 margin box 的左边，与包含块 border box 的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
- BFC 的区域不会与 float box 重叠。
- BFC 就是页面上的一个隔离的独立容器，**容器里面的子元素不会影响到外面的元素**。反之也如此。
- **计算 BFC 的高度时，浮动元素也参与计算。**

## 如何创建 BFC

#### 1、`float`的值不是 none。（right、left、inherit）

#### 2、`position`的值不是 static 或者 relative。（absolute、fixed、 sticky）

#### 3、`display`的值是**inline-block**、table-cell、**flex**、table-caption 或者 inline-flex

#### 4、`overflow`的值不是 visible（hidden、scroll、auto）

## BFC 的作用

### 1.利用 BFC 避免 margin 重叠。

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

- 兄弟元素都设置了 float 之后，margin 不会发生重叠

### 2.自适应两栏布局

根据：

- 每个盒子的 margin box 的左边，与包含块 border box 的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta http-equiv="X-UA-Compatible" content="ie=edge" />
		<title>Document</title>
	</head>
	<style>
		* {
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
			float: left; /* 看这里，左浮动 */
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

- BFC 的区域不会与 float box 重叠。所以我们让 right 单独成为一个 BFC

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta http-equiv="X-UA-Compatible" content="ie=edge" />
		<title>Document</title>
	</head>
	<style>
		* {
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
			overflow: hidden; /* overflow使他变成BFC */
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

- right 会自动的适应宽度，这时候就形成了一个两栏自适应的布局。

### 3.清除浮动。

当我们不给父节点设置高度，子节点设置浮动的时候，会发生高度塌陷，这个时候我们就要清楚浮动。

这个时候我们根据最后一条：
**计算 BFC 的高度时，浮动元素也参与计算。给父节点激活 BFC**

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta http-equiv="X-UA-Compatible" content="ie=edge" />
		<title>清除浮动</title>
	</head>
	<style>
		.par {
			border: 5px solid rgb(91, 243, 30);
			width: 300px;
			overflow: hidden; /*这里就是BFC*/
		}

		.child {
			border: 5px solid rgb(233, 250, 84);
			width: 100px;
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

**BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。**

因为 BFC 内部的元素和外部的元素绝对不会互相影响，因此，
**当 BFC 外部存在浮动时，它不应该影响 BFC 内部 Box 的布局，BFC 会通过变窄，而不与浮动有重叠。同样的，当 BFC 内部有浮动时，为了不影响外部元素的布局，BFC 计算高度时会包括浮动的高度。避免 margin 重叠也是这样的一个道理。**

# IFC

## 形成 IFC 的条件

1. font-size
2. line-height
3. height
4. vertical-aligin

## IFC 特性

1. IFC 的元素会在一行中从左至右排列
2. 在一行上的所有元素会在该区域形成一个行框
3. 行宽的高度为包含框的高度，高度为行框中最高元素的高度 iv)浮动的元素不会在行框中，并且浮动元素会压缩行框的宽度
4. 行框的宽度容纳不下子元素时，子元素会换下一行显示，并且会产生新行框 vi)行框的元素内遵循 text-align 和 vertical-align
