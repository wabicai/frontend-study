> 事件监听相关，其实就是Eventbus，观察者系统。
1. 定义Event事件基类
```ts
class TEventListenerStore {
  public listener: TEventListener = null;
  public options?: TEventOptions = null;

  constructor(listener: TEventListener, options?: TEventOptions) {
    this.listener = listener;
    this.options = options;
  }
}
```

2. Event列表
```ts
export class TEvent extends TModule {
  private _eventListenerStores: Map<string, TEventListenerStore[]> = new Map();
  private _onceListenerStores: Map<string, TEventListenerStore[]> = new Map();

    public on(event: string, listener: TEventListener, options?: TEventOptions): boolean {
        if (typeof listener !== 'function') {
        this._warn(`${event}@on`, `${event} listener ${listener} is not a function`);
        return false;
        }
        if (!this._eventListenerStores.has(event)) {
        this._eventListenerStores.set(event, []);
        }
        const stores = this._eventListenerStores.get(event);
        const store = new TEventListenerStore(listener, options);
        if (options && options.capture) {
        stores.unshift(store);
        } else {
        stores.push(store);
        }
        return true;
    }
  public off(event: string, listener?: TEventListener, options?: TEventOptions) {}
  public one(event: string, listener: TEventListener, options?: TEventOptions): boolean {}
  public notify(event: string, data: any, report = true, complexParams = false) {
    if (report) { // 避免日志刷屏
      this._info(event, `${JSON.stringify(data)}`);
    }
    // 通知事件
    if (this._eventListenerStores.has(event)) {
      const stores = this._eventListenerStores.get(event);
      for (const store of stores) {
        try {
          const ret = complexParams ? store.listener(...data) : store.listener(data);
          if (ret && ret.prevent && Promise.resolve(ret) !== ret) {
            this._info(event, `break by ${ret} / ${event}`);
            break;
          }
        } catch (err) {
          this._warn(event, `process fail: ${err}`);
          console.error(err);
        }
      }
    }
  }
}
```
