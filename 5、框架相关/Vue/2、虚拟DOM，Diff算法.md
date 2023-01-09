选自：
[vue 之虚拟 DOM、diff 算法](https://www.cnblogs.com/gxp69/p/11325381.html)

# 一、真实 DOM 和其解析流程？

浏览器渲染引擎工作流程都差不多，大致分为 5 步，**创建 DOM 树——创建 StyleRules——创建 Render 树——布局 Layout——绘制 Painting**

第一步，用 HTML 分析器，分析 HTML 元素，构建一颗 DOM 树(标记化和树构建)。

第二步，用 CSS 分析器，分析 CSS 文件和元素上的 inline 样式，生成页面的样式表。

第三步，将 DOM 树和样式表，关联起来，构建一颗 Render 树(这一过程又称为 Attachment)。每个 DOM 节点都有 attach 方法，接受样式信息，返回一个 render 对象(又名 renderer)。这些 render 对象最终会被构建成一颗 Render 树。

第四步，有了 Render 树，浏览器开始布局，为每个 Render 树上的节点确定一个在显示屏上出现的精确坐标。

第五步，Render 树和节点显示坐标都有了，就调用每个节点 paint 方法，把它们绘制出来。

**DOM 树的构建是文档加载完成开始的**。构建 DOM 数是一个渐进过程，为达到更好用户体验，渲染引擎会尽快将内容显示在屏幕上。它**不必**等到整个 HTML 文档**解析完毕之后才开始构建 render 数和布局**。

Render 树是 DOM 树和 CSSOM 树构建完毕才开始构建的吗？这三个过程在实际进行的时候又不是完全独立，而是会有交叉。**会造成一边加载，一遍解析，一遍渲染的工作现象**。

CSS 的解析是从右往左逆向解析的(从 DOM 树的下－上解析比上－下解析效率高)，嵌套标签越多，解析越慢。

- webkit 渲染引擎工作流程:

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210310151823428.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FidWFuZGVu,size_16,color_FFFFFF,t_70)

# Virtual Dom 的优势在哪里？(B_Cornelius)

「Virtual Dom 的优势」其实这道题目面试官更想听到的答案不是上来就说「直接操作/频繁操作 DOM 的性能差」，如果 DOM 操作的性能如此不堪，那么 jQuery 也不至于活到今天。所以面试官更想听到 VDOM 想解决的问题以及为什么频繁的 DOM 操作会性能差。
首先我们需要知道：

1. DOM 引擎、JS 引擎 相互独立，但又工作在同一线程（主线程）
2. JS 代码调用 DOM API 必须 挂起 JS 引擎、转换传入参数数据、激活 DOM 引擎，DOM 重绘后再转换可能有的返回值，最后激活 JS 引擎并继续执行若有频繁的 DOM API 调用，且浏览器厂商不做“批量处理”优化，
3. 引擎间切换的单位代价将迅速积累若其中有强制重绘的 DOM API 调用，重新计算布局、重新绘制图像会引起更大的性能消耗。
   其次是 VDOM 和真实 DOM 的区别和优化：

4. 虚拟 DOM 不会立马进行排版与重绘操作
5. 虚拟 DOM 进行频繁修改，然后一次性比较并修改真实 DOM 中需要改的部分，最后在真实 DOM 中进行排版与重绘，减少过多 DOM 节点排版与重绘损耗
6. 虚拟 DOM 有效降低大面积真实 DOM 的重绘与排版，因为最终与真实 DOM 比较差异，可以只渲染局部

# 四、实现虚拟 DOM

例如一个真实的 DOM 节点。

- 真实 DOM

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210310152009710.png)

- 我们用 JS 来模拟 DOM 节点实现虚拟 DOM。虚拟 DOM

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210310152032152.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FidWFuZGVu,size_16,color_FFFFFF,t_70)

- 其中的 Element 方法具体怎么实现的呢？

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210310152056991.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FidWFuZGVu,size_16,color_FFFFFF,t_70)

第一个参数是节点名（如 div），第二个参数是节点的属性（如 class），第三个参数是子节点（如 ul 的 li）。除了这三个参数会被保存在对象上外，还保存了 key 和 count。其相当于形成了虚拟 DOM 树。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210310152127611.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FidWFuZGVu,size_16,color_FFFFFF,t_70)

有了 JS 对象后，最终还需要将其映射成真实 DOM：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210310152146268.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FidWFuZGVu,size_16,color_FFFFFF,t_70)

我们已经完成了创建虚拟 DOM 并将其映射成真实 DOM，这样所有的更新都可以先反应到虚拟 DOM 上，如何反应？需要用到**Diff 算法**。

# diff 算法

> diff 算法就是进行虚拟节点对比，并返回一个 patch 对象，用来存储两个节点不同的地方，最后用 patch 记录的消息去局部更新 Dom。
>
> 意思就是：
> **diff 的过程就是调用名为 patch 的函数，比较新旧节点，一边比较一边给真实的 DOM 打补丁**

标准的的 Diff 算法复杂度需要 O(n^3)，然而 Facebook 工程师结合 Web 界面的特点做出了两个简单的假设，使得 Diff 算法复杂度直接降低到 O(n)

既然传统 diff 算法性能开销如此之大，Vue 做了什么优化呢？

- **跟 react 一样，只进行同层级比较，忽略跨级操作**

下面讲讲怎么实现：

1. Vue 是怎样描述一个节点的呢？

```json
// body下的 <div id="v" class="classA"><div> 对应的 oldVnode 就是

{
  el:  div  //对真实的节点的引用，本例中就是document.querySelector('#id.classA')
  tagName: 'DIV',   //节点的标签
  sel: 'div#v.classA'  //节点的选择器
  data: null,       // 一个存储节点属性的对象，对应节点的el[prop]属性，例如onclick , style
  children: [], //存储子节点的数组，每个子节点也是vnode结构
  text: null,    //如果是文本节点，对应文本节点的textContent，否则为null
}
```

2. **patch**
   diff 时调用 patch 函数，patch 接收两个参数 vnode，oldVnode，分别代表新旧节点。

```js
function patch(oldVnode, vnode) {
	if (sameVnode(oldVnode, vnode)) {
		patchVnode(oldVnode, vnode);
	} else {
		const oEl = oldVnode.el;
		let parentEle = api.parentNode(oEl);
		createEle(vnode);
		if (parentEle !== null) {
			api.insertBefore(parentEle, vnode.el, api.nextSibling(oEl));
			api.removeChild(parentEle, oldVnode.el);
			oldVnode = null;
		}
	}
	return vnode;
}
```

patch 函数内第一个 if 判断 sameVnode(oldVnode, vnode)就是判断这两个节点是否为同一类型节点，以下是它的实现：

```js
function sameVnode(oldVnode, vnode) {
	//两节点key值相同，并且sel属性值相同，即认为两节点属同一类型，可进行下一步比较
	return vnode.key === oldVnode.key && vnode.sel === oldVnode.sel;
}
```

**也就是说，即便同一个节点元素比如 div，他的 className 不同，Vue 就认为是两个不同类型的节点，执行删除旧节点、插入新节点操作。这与 react diff 实现是不同的，react 对于同一个节点元素认为是同一类型节点，只更新其节点上的属性。**

3. **patchVnode**
   对于同类型节点调用 patchVnode(oldVnode, vnode)进一步比较:

4. **updateChildren**
   patchVnode 中有一个重要的概念 updateChildren，这是 Vue diff 实现的核心：

# 六、关键点

1. 虚拟 DOM 以对象形式存储 DOM 结构
2. 以递归形式去判断新旧 DOM
3. 头尾比较，通过双指针，总共四个节点来判断（新前，新后，旧前，旧后）
4. 虚拟 DOM 的 class 不同怎么对比
   1. 直接不管，认准 key

### 源码

```js
patchVnode(oldVnode, vnode) {
    const el = vnode.el = oldVnode.el //让vnode.el引用到现在的真实dom，当el修改时，vnode.el会同步变化。
    let i, oldCh = oldVnode.children,
        ch = vnode.children
    if (oldVnode === vnode) return //新旧节点引用一致，认为没有变化
    //文本节点的比较
    if (oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text) {
        api.setTextContent(el, vnode.text)
    } else {
        updateEle(el, vnode, oldVnode)
        //对于拥有子节点(两者的子节点不同)的两个节点，调用updateChildren
        if (oldCh && ch && oldCh !== ch) {
            updateChildren(el, oldCh, ch)
        } else if (ch) { //只有新节点有子节点，添加新的子节点
            createEle(vnode) //create el's children dom
        } else if (oldCh) { //只有旧节点内存在子节点，执行删除子节点操作
            api.removeChildren(el)
        }
    }
}
```

```js
function updateChildren(
	parentElm,
	oldCh,
	newCh,
	insertedVnodeQueue,
	removeOnly
) {
	var oldStartIdx = 0;
	var newStartIdx = 0;
	var oldEndIdx = oldCh.length - 1;
	var oldStartVnode = oldCh[0];
	var oldEndVnode = oldCh[oldEndIdx];
	var newEndIdx = newCh.length - 1;
	var newStartVnode = newCh[0];
	var newEndVnode = newCh[newEndIdx];
	var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

	// removeOnly is a special flag used only by <transition-group>
	// to ensure removed elements stay in correct relative positions
	// during leaving transitions
	var canMove = !removeOnly;

	{
		checkDuplicateKeys(newCh);
	}
	// 如果索引正常
	while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
		// 当前的开始旧节点没有定义，进入下一个节点
		if (isUndef(oldStartVnode)) {
			oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
			// 当前的结束旧节点没有定义，进入上一个节点
		} else if (isUndef(oldEndVnode)) {
			oldEndVnode = oldCh[--oldEndIdx];
			// 如果旧的开始节点与新的开始节点相同，则开始更新该节点，然后进入下一个节点
		} else if (sameVnode(oldStartVnode, newStartVnode)) {
			// 更新节点
			patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
			oldStartVnode = oldCh[++oldStartIdx];
			newStartVnode = newCh[++newStartIdx];
			// 如果旧的结束节点与新的结束节点相同，则开始更新该节点，然后进入下一个节点
		} else if (sameVnode(oldEndVnode, newEndVnode)) {
			patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
			oldEndVnode = oldCh[--oldEndIdx];
			newEndVnode = newCh[--newEndIdx];
			// 如果旧的开始节点与新的结束节点相同，更新节点后把旧的开始节点移置节点末尾
		} else if (sameVnode(oldStartVnode, newEndVnode)) {
			// Vnode moved right
			patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
			canMove &&
				nodeOps.insertBefore(
					parentElm,
					oldStartVnode.elm,
					nodeOps.nextSibling(oldEndVnode.elm)
				);
			oldStartVnode = oldCh[++oldStartIdx];
			newEndVnode = newCh[--newEndIdx];
			// 如果旧的结束节点与新的开始节点相同，更新节点后把旧的结束节点移置节点开头
		} else if (sameVnode(oldEndVnode, newStartVnode)) {
			// Vnode moved left
			patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
			canMove &&
				nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
			oldEndVnode = oldCh[--oldEndIdx];
			newStartVnode = newCh[++newStartIdx];
		} else {
			// 如果旧的节点没有定义key，则创建key
			if (isUndef(oldKeyToIdx)) {
				oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
			}
			idxInOld = isDef(newStartVnode.key)
				? oldKeyToIdx[newStartVnode.key]
				: findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
			// 如果没有定义index,则创建新的新的节点元素
			if (isUndef(idxInOld)) {
				// New element
				createElm(
					newStartVnode,
					insertedVnodeQueue,
					parentElm,
					oldStartVnode.elm
				);
			} else {
				vnodeToMove = oldCh[idxInOld];
				if (sameVnode(vnodeToMove, newStartVnode)) {
					patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
					oldCh[idxInOld] = undefined;
					canMove &&
						nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
				} else {
					// same key but different element. treat as new element
					createElm(
						newStartVnode,
						insertedVnodeQueue,
						parentElm,
						oldStartVnode.elm
					);
				}
			}
			newStartVnode = newCh[++newStartIdx];
		}
	}
	// 如果旧节点的开始index大于结束index,则创建新的节点  如果新的开始节点index大于新的结束节点则删除旧的节点
	if (oldStartIdx > oldEndIdx) {
		refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
		addVnodes(
			parentElm,
			refElm,
			newCh,
			newStartIdx,
			newEndIdx,
			insertedVnodeQueue
		);
	} else if (newStartIdx > newEndIdx) {
		removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
	}
}
```
