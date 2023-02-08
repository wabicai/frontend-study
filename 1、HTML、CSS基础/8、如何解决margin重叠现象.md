**什么是 margin 重叠：**

- 两个或多个盒子可能（相邻）也可能（嵌套)的相邻边界(其间**没有任何非空内容、补白、边框**)重合在一起而形成一个单一边界。

- 有可能发生在父子元素，也有可能发生在兄弟元素之间

  - 兄弟之间之间：兄弟元素之间是真正的 margin 重叠。

    ![img](http://www.hujuntao.com/wp-content/uploads/2011/11/css_margin_1.gif)

  - 父子之间：父子之间实质为，当子元素的 margin 大于父元素时，会超过父元素的范围，显示出来就是那个大显哪个

    ![img](http://www.hujuntao.com/wp-content/uploads/2011/11/css_margin_2.gif)

    所以：

    ![image-20210225112732223](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210225112732223.png)

    ![image-20210225112448824](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210225112448824.png)

    ![image-20210225112611006](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210225112611006.png)

    实际上当子元素 margin 大于父元素 margin 的时候，其实是挤开了父元素的位置，导致看起来是重叠了。

- 发生在（垂直相邻边界），即**上下**

- 结果的边界宽度是相邻边界宽度中（最大的值）

- 边界的重叠也有例外情况：

  1、水平边距永远不会重合。
  2、在规范文档中，2 个或以上的块级盒模型相邻的垂直 margin 会重叠。最终的 margin 值计算方法如下：
  a、全部都为正值，取最大者；
  b、不全是正值，则都取绝对值，然后用正值减去最大值；
  c、没有正值，则都取绝对值，然后用 0 减去最大值。

**意义**：外边距的重叠只产生在**普通流文档**的**上下外边距**之间，这个看起来有点奇怪的规则，其实有其现实意义。

设想，当我们上下排列一系列规则的块级元素（如段落 P）时，那么块元素之间因为外边距重叠的存在，段落之间就不会产生双倍的距离。

**解决方法：**

## 对于父子元素：

1、子层元素取消 margin，用父元素的 padding 代替

2、内层元素透明边框 border:1px solid transparent; //这是基于最上面说的(其间**没有任何非空内容、补白、边框**)原理实现。

3、内层元素设置为 BFC。（什么为 BFC 详见下一篇）

## 对于兄弟元素：

1、设置两个兄弟为两个 BFC 区域

2、给其中一个兄弟套上一个 div，设置 border:1px solid white;也是用了(其间**没有任何非空内容、补白、边框**)原理实现。
