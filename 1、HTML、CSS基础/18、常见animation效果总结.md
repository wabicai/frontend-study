# 阴影

## box-shadow

> 元素添加边框阴影（特点：无法覆盖子元素）

## mask（遮罩）

> 使用 mask 最重要结论：图片与 mask 生成的渐变的 transparent 的重叠部分，将会变得透明。
> 可以覆盖在子元素上面

- mask: url(mask.png); (使用位图来做遮罩)
- mask: url(masks.svg#star); 使用 SVG (图形中的形状来做)
- mask: linear-gradient(#000, transparent) (使用渐变来做遮罩)
  - linear-gradient 函数：包含斜线、圆心扩散、正则等表达式

## filter（滤镜）

> 类似图片滤镜

- blur：高斯模糊
- 色相、饱和度、反差……

### backdrop-filter

> 安卓端兼容性差

# 动画

# animation
