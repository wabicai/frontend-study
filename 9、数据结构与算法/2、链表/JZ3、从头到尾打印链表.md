

简简单单

```js
function printListFromTailToHead(head)
{
    // write code here
    let printListFromTailToHead = []
    while(head){
        printListFromTailToHead.push(head.val)
        head = head.next
    }
    printListFromTailToHead = printListFromTailToHead.reverse()
    return printListFromTailToHead
}
module.exports = {
    printListFromTailToHead : printListFromTailToHead
};
```

