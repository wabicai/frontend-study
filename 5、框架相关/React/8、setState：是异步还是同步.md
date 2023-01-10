详见：
[seState是异步还是同步](https://juejin.cn/post/6850418109636050958)
[useState和setState](https://juejin.cn/post/6959885030063603743)

# 结论：
1. 在正常的react的事件流里（如onClick等）
- setState和useState是异步执行的（不会立即更新state的结果）
- 多次执行setState和useState，只会调用一次重新渲染render
- 不同的是，setState会进行state的合并，而useState则不会

2. 在setTimeout，Promise.then等异步事件中


- setState和useState是同步执行的（立即更新state的结果）
- 多次执行setState和useState，每一次的执行setState和useState，都会调用一次render


2. 原因是：react会整合多个状态合并更新，减少re-render调用
3. 只要你进入了 react 的调度流程，那就是异步的。只要你没有进入 react 的调度流程，那就是同步的。什么东西不会进入 react 的调度流程？ setTimeout setInterval ，直接在 DOM 上绑定原生事件等。这些都不会走 React 的调度流程，你在这种情况下调用 setState ，那这次 setState 就是同步的。 否则就是异步的。


4. this.setState和useState有所不同
   1. 同步执行时useState也会对state进行逐个处理，而setState则只会处理最后一次
如
```JS
class Component extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: 1,
    }
  }

  handleClickWithPromise = () => {
    Promise.resolve().then(() => {
      this.setState({a: this.state.a + 1})
      this.setState({a: this.state.a + 1})
    })
  }

  handleClickWithoutPromise = () => {
    this.setState({a: this.state.a + 1})
    this.setState({a: this.state.a + 1})
  }

  render() {
    console.log('a', this.state.a)
    return (
      <Fragment>
        <button onClick={this.handleClickWithPromise}>异步执行</button>
        <button onClick={this.handleClickWithoutPromise}>同步执行</button>
      </Fragment>
    )
  }
}
//当点击同步执行按钮时，两次 setState 合并，只执行了最后一次，打印 2
// 当点击异步执行按钮时，两次 setState 各自 render 一次，分别打印 2，3
```

```js
function Component() {
  const [a, setA] = useState(1)
  console.log('a', a)

  function handleClickWithPromise() {
    Promise.resolve().then(() => {
      setA((a) => a + 1)
      setA((a) => a + 1)
    })
  }

  function handleClickWithoutPromise() {
    setA((a) => a + 1)
    setA((a) => a + 1)
  }

  return (
    <Fragment>
      <button onClick={handleClickWithPromise}>{a} 异步执行</button>
      <button onClick={handleClickWithoutPromise}>{a} 同步执行</button>
    </Fragment>
  )
// 当点击同步执行按钮时，两次 setA 都执行，但合并 render 了一次，打印 3
// 当点击异步执行按钮时，两次 setA 各自 render 一次，分别打印 2，3
```
