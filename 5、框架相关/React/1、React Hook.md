### useState()

设置状态、初始值。

```JavaScript
const [buttonValue, setButton] = useState('button'）

```

### useContext()

在组件间共享状态

```JavaScript
const AppContext = React.createContext({});

<AppContext.Provider value={{
  username: 'superawesome'
}}>
  <div className="App">
    <Navbar/>
    <Messages/>
  </div>
</AppContext.Provider>

const Navbar = () => {
  const { username } = useContext(AppContext);
  return (
    <div className="navbar">
      <p>AwesomeSite</p>
      <p>{username}</p>
    </div>
  );
}

```

### useReducer

action 钩子。没用过，用过再说

### useEffect

```JavaScript
useEffect(()=>{

},[])

```

第一个参数是函数，异步操作。

第二个参数是数组，代表依赖项，依赖项变化则执行第一个函数。

数组可以省略，省略则在每一次组件渲染都会执行一次。
