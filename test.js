function* test() {
  var list = [1, 3, 5];
  for (let index = 0; index < list.length; index++) {
    yield list[index];
  }
}
console.log(test);

var arr = test();
console.log(arr);

console.log(arr.next(test()));

console.log(arr.next());
console.log(arr.next());
console.log(arr.next());
