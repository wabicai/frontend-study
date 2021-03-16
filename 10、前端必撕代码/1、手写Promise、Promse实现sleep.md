```JS
//Promise实现Sleep函数
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function test() {
  console.log(new Date());
  await sleep(3000);
  console.log(new Date());
}
test();
console.log('continue execute！');
```

