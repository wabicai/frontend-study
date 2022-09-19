# Hook分类
- 除了useRef,其他都可以归类为 自变量/因变量

## 自变量
- useState
- useReducer
- useContext

### useState
```JS
  // 1 定义x的方法,并且初始值为 0 
  const [x,setX] = useState(0);
    
  // 3 定义改变x的方法,每次调用时 都会让x的只+1
  const changeX = () => setX(x + 1);

  // 2 接着定义组件所描述的字符,并将x的值 渲染为li 标签的值
  // 4 将changex 绑定为ul的回调函数,点击视图触发更新; x 变化 => 视图变化
	<ul onClick={changeX}>
    <li>x是{x}</li>
  </ul>
```
> 描述一下函数组件.useState定义了x,x 的变化导致li的变化，所以 useState是自变量,导致了li的变化=> 对应了视图变化;

### 组件的功能不仅描述视图,还能产生副作用 - useEffect

```js
 const [x,setX] = useState(0);
    
  const changeX = () => setX(x + 1);
    
  // 调用useEffect,依赖于x,当x 变化时,将title 赋值为x
  useEffect(()=>{
      document.title = x
  },[x])
  // 第一个参数是函数，异步操作。
  // 第二个参数是数组，代表依赖项，依赖项变化则执行第一个函数。
  // 数组可以省略，省略则在每一次组件渲染都会执行一次。
```

### 进阶: 从useState到useReducer
- useReducer解决的问题：假设有数据a，要进行传递。只有一级层次的情况下可以通过props传递，但是如果有n级组件,那么一级传到n级会很麻烦。
- 如何解决：在一级组件通过createContext后,在后续组件需要用到地方通过useContext可以直接消费一级组件的context。

## 因变量
- useMemo
- useEffect
- useCallback

### 可以缓存的useMemo和useCallback
1. 可以用 useMemo和useCallback分别包裹y和cahngeX
  - useMemo用来缓存一个因变量,需要显式的指定因变量依赖的自变量
  - useCallback 缓存一个函数类型的因变量,也需要显式的指定依赖的自变量


```js
const [x,setX] = useState(0);
    
const y = useMemo(() => 2 * x + 1,[x]); // 需要显式的指定y依赖于x的变化
// useCallback 缓存一个函数类型的因变量
const changX = useCallback(()=> setX(x + 1),[x]);
```

- 可以看到使用useMemo和useCallback也是一样的;
  1. 使用hooks显式指明因变量
  2. 使用的时候y和changeX会被缓存下来,只要x不变,始终读取的是缓存的值
  3. 不使用的时候,每次函数组件调用,都会创建新的y和changeX
  4. 在遇到性能瓶颈之前,都可以不使用这2个 hooks
