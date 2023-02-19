1. 数组去重、排序、扁平化

```js
Array.from(new Set(arr.flat(Infinity))).sort((a, b) => {
    return a - b
})
```

1. flat原生方法

```jsx
let new Array = arr.flat(depth)
// depth指深度，如果为 Infinity 的时候，直接转为一维数组
// 会移除空项，返回一个新数组
// 兼容性差
```

1. 递归+判断是否数组

```jsx
//常规方法
const flat = (arr, num = 1) => {
	if (num < 0) return arr // 可以实现指定多个展开多少层
  let arrResult = []
  for(let i=0, len=arr.lenxgth; i<len; i++){
		// 判断是否数组方法 isArray/ instanceof Array / constructor === Array 
		// Object.prototype.toString.call(arr) === '[object Array]'
    if(Array.isArray(arr[i])){
			let subArr = flat(arr[i])
      arrResult.push(...subArr)
      // arrResult = arrResult.concat(flat(arr[i]))
    }else{
      arrResult.push(arr[i])
    }
  }
  return arrResult;
}

// reduce
let flat = (arr) => {
        return arr.reduce((prev, cur) => {
            if (Array.isArray(cur)) {
                prev = prev.concat(flat(cur))
            } else {
                prev = prev.concat(cur)
            }
            return prev
        }, [])
    }
```

1. 栈思想

```jsx
const flat = (arr,) => {
        let stack = [arr];
        let res = [];
        while (stack.length) {
            const currVal = stack.pop();
            if (Array.isArray(currVal)) {
                stack.push(...currVal);
            } else {
                res.push(currVal);
            }
        }
        return res;
    }
```