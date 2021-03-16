### 2、定义栈的数据结构，请在该类型中实现一个能够得到栈中所含最小元素的min函数（时间复杂度应为O（1））。

```js
let stack = []
let minStack = []
let temp = null
function push(node)
{
    // write code here
    if(temp !=null){
        if(temp > node) temp = node //1、核心思想是每一次增加元素都保留放置最小的元素在minStack里面
        stack.push(node)
        minStack.push(temp)
    }else{
        temp = node //这里最开始要给temp赋值，下面才能判读大小
        stack.push(node)
        minStack.push(node)
    }
    return stack.length
}
function pop()
{
    minStack.pop() //2、每次删除的时候，minStack起一个记录当时push时候最小元素的作用。
    return stack.pop()
}
function top()//返回栈顶元素
{
    return stack[stack.length - 1]
}
function min()
{
    return minStack[minStack.length - 1]
}
//上面的min函数相当于 
Math.min(...stack)
```



