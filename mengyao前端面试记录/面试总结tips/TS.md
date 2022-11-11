https://juejin.cn/post/6999985372440559624  
### 接口 vs. 类型别名
1. 接口创建了一个新的类型，可以在其它任何地方使用。 类型别名并不创建新类型
2. 另一个重要区别是类型别名不能被`extends`和`implements`（自己也不能`extends`和`implements`其它类型）。 因为[软件中的对象应该对于扩展是开放的，但是对于修改是封闭](https://en.wikipedia.org/wiki/Open/closed_principle)
3. 你应该尽量去使用接口代替类型别名。除非描述一个类型并且需要使用联合类型或元组类型，这时通常会使用类型别名。
4.  两者都可以用来描述对象或函数的类型。与接口不同，类型别名还可以用于其他类型，如基本类型（原始值）、联合类型、元组等。
5. 接口可以多次声明并且会自动合并，类型别名只能声明一次
使用 interface 描述‘数据结构’，使用 type 描述‘类型关系’
![[Pasted image 20220817170109.png]]

## 接口：
interface Shape {
    color: string;
}
interface PenStroke {
    penWidth: number;
}
interface Square extends Shape, PenStroke {
    sideLength: number;
}
## 类型别名：
类型别名会给一个类型起个新名字。 类型别名有时和接口很像，但是可以作用于原始值，联合类型，元组以及其它任何你需要手写的类型。
## Why TS
1. 项目越来越复杂，js维护困难，安全隐患
2. 没有类型检查，不报错，函数参数没有类型检查
回答：TypeScript 是 JavaScript 的一个超集，它本质上其实是在 JavaScript 上添加了可选的静态类型和基于类的面向对象编程。
TypeScript 的特点：
解决大型项目的代码复杂性
可以在编译期间发现并纠正错误
支持强类型、接口、模块、范型
在实际的使用中，最大的好处还是：第一个是强类型，规范大型工程中变量声明，可控可预知，减少不同开发人员引入的隐性 bug。第二个是接口，在XXX里面的接口，其实主要是用于定义数据结构，也是规范数据结构的作用。第三个是继承，避免重复实现一些功能，protected、public、private 等关键字也可以实现方法的隔离
**8. TypeScript 中的 this 和 JavaScript 中的 this 有什么差异？**
1.TypeScript：noImplicitThis: true 的情况下，必须去声明 this 的类型，才能在函数或者对象中使用this。
2.Typescript 中箭头函数的 this 和 ES6 中箭头函数中的 this 是一致的。
## ** 模块的加载机制**
假设有一个导入语句 `import { a } from "moduleA"`;  
1. 首先，编译器会尝试定位需要导入的模块文件，通过绝对或者相对的路径查找方式；  
2. 如果上面的解析失败了，没有查找到对应的模块，编译器会尝试定位一个`外部模块声明`（.d.ts）；  
3. 最后，如果编译器还是不能解析这个模块，则会抛出一个错误 `error TS2307: Cannot find module 'moduleA'.`
## **对 TypeScript 类型兼容性的理解**
`ts 类型兼容：` 当一个类型 Y 可以赋值给另一个类型 X 时， 我们就可以说类型 X 兼容类型 Y。也就是说两者在结构上是一致的，而不一定非得通过 extends 的方式继承而来  
`接口的兼容性：X = Y` 只要目标类型 X 中声明的属性变量在源类型 Y 中都存在就是兼容的（ Y 中的类型可以比 X 中的多，但是不能少）  
`函数的兼容性：X = Y` Y 的每个参数必须能在 X 里找到对应类型的参数，参数的名字相同与否无所谓，只看它们的类型（参数可以少但是不能多。与接口的兼容性有区别，原因参考第 17 问）
## **协变、逆变、双变和抗变的理解**
`协变：X = Y` Y 类型可以赋值给 X 类型的情况就叫做协变，也可以说是 X 类型兼容 Y 类型

```typescript
interface X { name: string; age: number; } 
interface Y { name: string; age: number; hobbies: string[] }
let x: X = { name: 'xiaoming', age: 16 }
let y: Y = { name: 'xiaohong', age: 18, hobbies: ['eat'] }
x = y
复制代码
```

`逆变：printY = printX` 函数X 类型可以赋值给函数Y 类型，因为函数Y 在调用的时候参数是按照Y类型进行约束的，但是用到的是函数X的X的属性和方法，ts检查结果是类型安全的。这种特性就叫做逆变，函数的参数有逆变的性质。

```typescript
let printY: (y: Y) => void
printY = (y) => { console.log(y.hobbies) }
let printX: (x: X) => void
printX = (x) => { console.log(x.name) }
printY = printX
复制代码
```

`双变（双向协变）：X = Y；Y = X`父类型可以赋值给子类型，子类型可以赋值给父类型，既逆变又协变，叫做“双向协变”（ts2.x 之前支持这种赋值，之后 ts 加了一个编译选项 strictFunctionTypes，设置为 true 就只支持函数参数的逆变，设置为 false 则支持双向协变）  
`抗变（不变）：`非父子类型之间不会发生型变，只要类型不一样就会报错

## **如何使 TypeScript 项目引入并识别编译为 JavaScript 的 npm 库包**
1.  选择安装 ts 版本，`npm install @types/包名 --save`；
2.  对于没有类型的 js 库，需要编写同名的.d.ts文件
## **tsconfig.json 中有哪些配置项信息**
```json
{
  "files": [],
  "include": [],
  "exclude": [],
  "compileOnSave": false,
  "extends": "",
  "compilerOptions": { ... }
}
复制代码
```

`files` 是一个数组列表，里面包含指定文件的相对或绝对路径，用来指定待编译文件，编译器在编译的时候只会编译包含在files中列出的文件。  
`include & exclude` 指定编译某些文件，或者指定排除某些文件。  
`compileOnSave：true` 让IDE在保存文件的时候根据tsconfig.json重新生成文件。  
`extends` 可以通过指定一个其他的tsconfig.json文件路径，来继承这个配置文件里的配置。  
`compilerOptions` 编译配置项，如何对具体的ts文件进行编译
## keyof
TypeScript 允许我们遍历某种类型的属性，并通过 keyof 操作符提取其属性的名称。**`keyof` 操作符是在 TypeScript 2.1 版本引入的，该操作符可以用于获取某种类型的所有键，其返回类型是联合类型。**
interface Person {  
  name: string;  
  age: number;  
  location: string;  
}  
  
type K1 = keyof Person; // "name" | "age" | "location"  
type K2 = keyof Person[];  // number | "length" | "push" | "concat" | ...  
type K3 = keyof { [x: string]: Person };  // string | number