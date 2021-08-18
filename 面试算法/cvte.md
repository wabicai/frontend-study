1. ### 给定两个字符串s1，s2，要求判定s2是否能够被s1做循环移位得到的字符串包含。

```js
    function rotateInclude(s1, s2) {
        let len = s1.length
        for (let i = 0; i < len; i++) {
            let temp = s1[0]
            let array = s1.split("")
            for (let j = 0; j < len - 1; j++) {
                array[j] = array[j + 1]
            }
            array[len - 1] = temp
            s1 = array.join("")
            if (s1.indexOf(s2)>-1) {
                console.log(s1)
            }
        }
    }
    let s1 = "ABCD"
    let s2 = "CDA"
    rotateInclude(s1, s2)
//js只有通过split和join方法一起用才能替换字符串
//indexOf会返回-1。if里面-1，依旧执行
//slice(start,end),substr(弃用),substring(start，length)
```

2. ### 输入rgba字符串，将rgba字符串拆分为相应的十六进制颜色和透明度，并返回一个包含两者的数组。例如

   ### rgba（255,255,255,0.4)=>["#ffffff","0.4"]

```js
    let rgba = "rgba(255,255,255,0.4)"
    function handleRgba(rgba) {
        let stack = []
        let temp = rgba.slice(5, rgba.length - 1)
        temp = temp.split(",")
        for (let i = 0; i < 3; i++) {
            stack.push(Number(temp[i]).toString(16))
        }
        res1 = "#" + stack.join("")
        console.log([res1,temp[3]])
    }
    handleRgba(rgba)
//toString(16)只能将数字转化为16进制。
//parseInt(string,10)  字符串转10进制，变成数字
```

