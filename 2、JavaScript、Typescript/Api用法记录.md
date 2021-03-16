1. reduce()

   接收一个函数作用累加器，从左往右

   ```js
   function getSum(total,num){
       return total + num
   }
   let res = numbers.reduce(getSum,0)
   ```

   

2. Array.from()
   1. 类数组转化为数组
   2. Set结构转化为真正的数组
   3. Array.from第二个参数类似于map方法。

3. Object.keys()

   `Object.keys()` 方法会返回一个由一个给定对象的自身可枚举属性组成的数组，数组中属性名的排列顺序和正常循环遍历该对象时返回的顺序一致 。
   
4. map用法

   1. set（index，item）
   2. has（index）
   3. map.forEach((index,item,arr) =>{  })
   4. get(index)

5. set用法

   1. add(item)
   2. delete(item)