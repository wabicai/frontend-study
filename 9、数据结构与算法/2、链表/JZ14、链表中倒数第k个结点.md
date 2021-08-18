简简单单

注意：考虑num大于长度

牛客里面｛｝等于null

```js
function FindKthToTail( pHead ,  k ) {
    // write code here
    if (pHead == null) return null
    let temp = pHead
    let len = 0
    while(temp){
        temp = temp.next
        len++
    }
    let num = len - k
    while(num && pHead ){
        pHead = pHead.next
        num--
    }
    return pHead
}
module.exports = {
    FindKthToTail : FindKthToTail
};
```



