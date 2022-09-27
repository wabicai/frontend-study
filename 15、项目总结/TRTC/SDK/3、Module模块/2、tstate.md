> 观察者系统

1. 定义State监听器基类
```ts
class TStateListenerStore {
  public listener: TStateUpdateListener = null;
  public options?: TStateOptions = null;

  constructor(listener: TStateUpdateListener, options?: TStateOptions) {
    this.listener = listener;
    this.options = options;
  }
}
```

2. state主要类
```ts
// 发布者
class TStateInfo extends TLoggerModule {
  private _listenerStores: TStateListenerStore[] = [];
  private _executor: TStateReportExecutor = null;
  // 添加监听
  public addListener(listener: TStateUpdateListener, options?: TStateOptions) {
    if (typeof listener !== 'function') {
      return false;
    }
    const store = new TStateListenerStore(listener, options);
    // (property) TEventOptions.capture?: boolean 是否在捕获阶段触发
    if (options && options.capture) {
      this._listenerStores.unshift(store);
    } else {
      this._listenerStores.push(store);
    }
    // 补发当前状态回调
    if (!options || !options.noEmitWhileSubscribe) {
      listener(this._value, this._value, 'subscribe');
    }
    return true;
  }
  // 移除监听
  public removeListener(listener: TStateUpdateListener, options?: TStateOptions) {}
  // 尝试做状态上报，传参表示往上报队列增加任务，不传参表示只尝试上报队列里的第一个任务
  private _tryReport(value?: any) {}
}

// 订阅者
export class TState extends TModule {
  private _state_map: Map<string, TStateInfo> = new Map();       // 状态表

  public registerState(name: string, desc: string, value: any = null, validCallers: string[] = []) {
    const stateInfo = this._getStateInfo(name);
    if (stateInfo.checkRegister()) {
      this._warn('registerState', `${name} registered`);
      return false;
    }
    if (typeof desc !== 'string' || desc.length < 4) {
      this._error('registerState', `${name}: ${desc} desc invalid (must be string and length >= 4)`);
      return false;
    }
    stateInfo.register(desc, value, validCallers);
    TLogger.getInstance('TCIC').logStart(stateInfo.getDesc());  // 更新起始时间，用于计算耗时
    TLogger.getInstance('TCIC').logEnded('', TLevel.INFO, {
      module: this._getClassName(),
      action: 'registerState',
      param: `${stateInfo.getDesc()} = ${value}`,
      ext: `${name}: ${validCallers}`,
    });
    return true;
  }

    /**
   * 更新状态
   * @param name    状态名称
   * @param value   状态内容
   * @param caller  状态更新者
   * @param log     是否打印日志
   * @param reason  状态更新的原因，会被透传给状态监听函数
   */
  public setState(name: string, value: any, caller = '', log = true, reason = '') {
    const stateInfo = this._getStateInfo(name);
    if (!stateInfo.checkRegister()) {
      this._warn('setState', `${name} not register`);
      return false;
    }
    if (!stateInfo.checkAuth(caller)) {
      this._warn('setState', `${name} refuse caller [${caller}]`);
      return false;
    }
    if (!stateInfo.updateValue(value, reason)) {
      return false;
    }
    if (log) {
      TLogger.getInstance('TCIC').logEnded(stateInfo.getDesc(), TLevel.INFO, {
        module: this._getClassName(),
        action: 'setState',
        param: `${stateInfo.getDesc()} = ${JSON.stringify(value)}`,
        ext: `${caller}: ${reason}`,
      });
    }
    TLogger.getInstance('TCIC').logStart(stateInfo.getDesc());  // 更新起始时间，用于计算耗时
    return true;
  }

    /**
   * 订阅状态变更
   * @param name      状态名称
   * @param listener  状态更新回调
   * @param options   状态监听选项
   */
  public subscribeState(name: string, listener: TStateUpdateListener, options?: TStateOptions) {
    return this._getStateInfo(name).addListener(listener, options);
  }

    /**
   * 确认状态值符合预期
   * @param name        状态名称
   * @param exceptValue 预期的状态值
   * @param equalFunc   状态值比较函数，默认使用 === 进行比较
   */
  public promiseState(name: string, exceptValue: any, equalFunc?: TStateEqualFunc): Promise<void> {
    return new Promise<void>((resolve) => {
      if (typeof equalFunc !== 'function') {
        equalFunc = (v, ev) => v === ev;
      }
      const stateInfo = this._getStateInfo(name);
      if (stateInfo.checkRegister() && equalFunc(stateInfo.getValue(), exceptValue)) {
        resolve();
        return;
      }
      const changed = (v: any) => {
        if (equalFunc(v, exceptValue)) {
          this.unsubscribeState(name, changed);
          resolve();
        }
      };
      this.subscribeState(name, changed);
    });
  }

  private _getStateInfo(name: string): TStateInfo {
    if (!name) {
      this._error('_getStateInfo', `state ${name} name invalid`);
    }
    let stateInfo = this._state_map.get(name);
    if (!stateInfo) {
      stateInfo = new TStateInfo();
      this._state_map.set(name, stateInfo);
    }
    return stateInfo;
  }
}
```