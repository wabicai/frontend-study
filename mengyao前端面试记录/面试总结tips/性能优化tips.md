优化tips
1.FPS 60 稳定
2.帧率检测手段
3.渲染机制
	1.**HTML解析**（Parse HTML）
	2.**解析CSS**（Parse CSS）
	3.**生成渲染树**（Render Tree / Frame Tree）
	4.**排版/重排**（Layout/Reflow）
	5.**绘图/重绘**（Painting）
4.优化
	1.**提升每一帧性能（缩短帧时长，提高帧率）**
	    -   避免频繁的重排。减少重排范围次数，分离读写操作，DOM离线操作，牺牲平滑1px->3px，脱离普通文档流，减少对其他元素的影响。
	    -   避免大面积的重绘。
	    -   优化JS运行性能。
	2.**保证帧率平稳（避免跳帧）**
	    -   不在连续的动画过程中做高耗时的操作（如大面积重绘、重排、复杂JS执行），避免发生跳帧。
	    -   若高耗时操作无法避免，则尝试化解，比如：
	        1.  将高耗时操作放在动画开始或结尾处。
	        2.  将高耗时操作分摊至动画的每一帧中处理。
	3.**针对硬件加速渲染通道的优化**
	    -   通过层的变化效果(如transform)实现位移、缩放等动画，可避免重绘。
	    -   合理划分层，动静分离，可避免大面积重绘。
	    -   使用分层优化动画时，需要留意内存消耗情况（通过Safari调试工具）。
	4.**低性能设备优先调试**
5..对于canvas来说
	1.使用requestAnimationFrame()
	**2.分层渲染：**
	**3.离屏绘制，使用缓存**
	**4.避免使用高性能的API**
	**5.使用webworker进行动画中的复杂运算**
	**6.静态的背景图，用CSS背景插进去**
	**7.避免浮点数坐标，会有额外计算**
## 检测浏览器是否开启硬件加速：
一般我们用到下面两个参数：
1.  ext.UNMASKED_VENDOR_WEBGL：图形驱动程序的供应商字符串。
2.  ext.UNMASKED_RENDERER_WEBGL：图形驱动程序的渲染器字符串。Safari默认开启GPU加速且无法关闭，可以跳过检测；谷歌浏览器在关闭硬件加速的情况下，渲染器名称会返回类似 SwiftShader driver，开启则返回当前使用的GPU相关信息。
```javascript
function isGPUAcceleratorEnabled() {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl');
  if (gl) {
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      // const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      return !/SwiftShader/gi.test(renderer);
    }
  }
  return false;
}
```

碰撞检测：
2d凸多边形碰撞检测
SAT 从 **分离** 的角度来判断物体间的碰撞。
**若两个物体没有发生碰撞，则总会存在一条直线，能将两个物体分离** 。于是，我们把这条能够隔开两个物体的线称为 **分离轴**

而 GJK 从 **重叠** 的角度来探索物体间的碰撞。
两个图形必须 **至少重合一个点** ，否则将不会产生碰撞。是否能从两个图形中，各自找到一个点，使得它们相减后为原点。
https://blog.otakutools.cn/archives/158

GJK相比SAT的优点，
首先是不需要特殊处理曲线的情况（如例子中的圆形），
其次if primed with the last penetration/separation vector，也就是优化后续中getFarthestPointInDirection()这个函数，可以使得其时间复杂度接近常数，也就是与顶点数几乎无关！而不需要像SAT那样遍历多边形所有的边来确定是否存在分离轴。