### 1、用两个栈来实现一个队列，完成队列的Push和Pop操作。 队列中的元素为int类型。

```js
let [stack1,stack2] = [[],[]]//Js中pop操作为删除最后一个元素，并将他返回出来
function push(node)
{
    stack1.push(node)
    return stack1.length
}
function pop(){
if(stack2.length===0){
    while(stack1.length){
        stack2.push(stack1.pop());
    }
}
    return stack2.pop();
}
```

