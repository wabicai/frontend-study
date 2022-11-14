# 实现动画的三种方式
## transition
> 渐变动画

### properties
- duration:完成过渡效果需要的时间单位
- timing-function:完成效果的速度曲线
- property:填写需要变化的css属性如：width,line-height,font-size,color等,所有作用与dom样式的属性

### case
```css
    .base {
        width: 100px;
        height: 100px;
        display: inline-block;
        background-color: #0EA9FF;
        border-width: 5px;
        border-style: solid;
        border-color: #5daf34;
        transition-property: width,height,background-color,border-width;
        transition-duration: 2s;
        transition-timing-function: ease-in;
        transition-delay: 500ms;
    /*简写*/
    /*transition: all 2s ease-in 500ms;*/
        &:hover {
            width: 200px;
            height: 200px;
            background-color: #5daf34;
            border-width: 10px;
            border-color: #3a8ee6;
        }
    }
```

## transform 
> 转变动画
> transform属性应用于2D 或 3D转换。该属性允许我们能够对元素进行旋转、缩放、倾斜、移动这四类操作.一般是配合transition的属性一起使用。

### properties
- 旋转(rotate)：主要分为2D旋转和3D旋转，参数为角度，如45deg
- 缩放(scale)：一般用于元素的大小收缩设定
- 倾斜(skew)：主要用于对元素的样式倾斜。
- 移动(translate)：主要用于将元素移动。

### case
```css
    .base2{
        transform:none;
        transition-property: transform;
        &:hover {
            transform:scale(0.8, 1.5) rotate(35deg) skew(5deg) translate(15px, 25px);
        }
    }
```

### 一些特殊用法
1. 实现0.5px边框
```css
   .border {
        width: 200px;
        height: 200px;
        margin: 0 auto;
        position: relative;
    }
    .border::after {
        content: " ";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1px;
        background: red;
        transform: scaleY(0.5);
    }
```

2. 实现水平垂直居中
```css
.parent {
    width: 100px;
    height: 100px;
    background-color: #999;
}
.child {
    position: relative;
    height: 50px;
    width: 50px;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
}
```
## animation
> 自定义动画

## properties
(1) name：需要绑定到选择器的keyframe名称。
(2) duration：完成该动画需要花费的时间，秒或毫秒。
(3) timing-function：跟transition-linear一样。
(4) delay：设置动画在开始之前的延迟。
(5) iteration-count：设置动画执行的次数，infinite为无限次循环。
(6) direction：是否轮询反向播放动画。normal，默认值，动画应该正常播放；alternate，动画应该轮流反向播放。

## case
```css
.base3 {
    border-radius: 50%;
    transform:none;
    position: relative;
    width: 100px;
    height: 100px;
    background: linear-gradient(
        35deg,
        #ccffff,
        #ffcccc
    );
    &:hover {
        animation-name: bounce;
        animation-duration: 3s;
        animation-iteration-count: infinite;
    }
}
@keyframes bounce{
    0% {
        top: 0px;
    }
    50% {
        top: 249px;
        width: 130px;
        height: 70px;
    }
    100% {
        top: 0px;
    }
}
```