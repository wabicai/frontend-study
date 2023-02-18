## 什么是 will-change

摘自 MDN：

> 一种告知浏览器该元素会有哪些变化的方法，这样浏览器可以在元素属性真正发生变化之前提前做好对应的优化准备工作。 这种优化可以将一部分复杂的计算工作提前准备好，使页面的反应更为快速灵敏。
> 如果页面的某些部分应该独立为一个图层但没有被拆分，可以使用 will-change 属性来提示浏览器

注意事项：

1. **不要将 will-change 应用到太多元素上**：浏览器已经尽力尝试去优化一切可以优化的东西了。有一些更强力的优化，如果与 will-change 结合在一起的话，有可能会消耗很多机器资源，如果过度使用的话，可能导致页面响应缓慢或者消耗非常多的资源。

2. **有节制地使用**：通常，当元素恢复到初始状态时，浏览器会丢弃掉之前做的优化工作。但是如果直接在样式表中显式声明了 will-change 属性，则表示目标元素可能会经常变化，浏览器会将优化工作保存得比之前更久。所以最佳实践是当元素变化之前和之后通过脚本来切换 will-change 的值。

3. **不要过早应用 will-change 优化**：如果你的页面在性能方面没什么问题，则不要添加 will-change 属性来榨取一丁点的速度。 will-change 的设计初衷是作为最后的优化手段，用来尝试解决现有的性能问题。它不应该被用来预防性能问题。过度使用 will-change 会导致大量的内存占用，并会导致更复杂的渲染过程，因为浏览器会试图准备可能存在的变化过程。这会导致更严重的性能问题。

4. **给它足够的工作时间**：这个属性是用来让页面开发者告知浏览器哪些属性可能会变化的。然后浏览器可以选择在变化发生前提前去做一些优化工作。所以给浏览器一点时间去真正做这些优化工作是非常重要的。使用时需要尝试去找到一些方法提前一定时间获知元素可能发生的变化，然后为它加上 will-change 属性。
5. **添加了 will-change CSS 属性的元素，在 layer tree（即复合层）会被看做单独的一层**

### 如何使用

```css
.sidebar {
	will-change: transform;
}
```

> 直接添加了 will-change 属性，会导致浏览器将对应的优化工作一直保存在内存中，这其实是不必要的

> 下面是另一个展示如何使用脚本正确地应用 will-change 属性的示例

```js
var el = document.getElementById("element");

// 当鼠标移动到该元素上时给该元素设置 will-change 属性
el.addEventListener("mouseenter", hintBrowser);
// 当 CSS 动画结束后清除 will-change 属性
el.addEventListener("animationEnd", removeHint);

function hintBrowser() {
	// 填写上那些你知道的，会在 CSS 动画中发生改变的 CSS 属性名们
	this.style.willChange = "transform, opacity";
}

function removeHint() {
	this.style.willChange = "auto";
}
```

> 但是，如果某个应用在按下键盘的时候会翻页，比如相册或者幻灯片一类的，它的页面很大很复杂，此时在样式表中写上 will-change 是合适的。这会使浏览器提前准备好过渡动画，当键盘按下的时候就能立即看到灵活轻快的动画。

```css
.slide {
	will-change: transform;
}
```
