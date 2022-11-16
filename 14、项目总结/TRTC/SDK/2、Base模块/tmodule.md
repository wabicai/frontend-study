> SDK通用异常，主要作用：自定义promise，用于日志上报
1. 定义错误基类
```ts
export class TCICError extends Error {
  public errorCode = 0;
  public errorMsg = '';
  public errorDetail = '';

  constructor(code: number, msg: string, detail?: string) {
    super(msg);
    this.name = 'TCICError';
    this.errorCode = code;
    this.errorMsg = msg;
    this.errorDetail = detail;
  }

  public toString(): string {
    return `${this.errorCode} | ${this.errorMsg} | ${this.errorDetail}`;
  }
}
```

2. 定义日志打印基类
```ts
export class TLoggerModule {
    // 打印日志
  protected _debug(action: string, message: string) {
    TLogger.getInstance('TCIC').debug({ // debug、info、error方法定义在tlogger.ts里面。
      module: this._getClassName(),
      action,
      param: message,
    });
  }
  ....
}
```

3. 定义promise执行基类
```ts
export class TPromiseExecutor {
  private readonly _seq: number;
  private readonly _promise: Promise<unknown>;
  private _status = TPromiseExecutorStatus.Pending;
  private _resolve: any = null;
  private _reject: any = null;
  ...

  constructor(
    action: string,
    timeout: number,
    onFinished: (data?: any) => void,
  ) {
    TPromiseExecutor._globalSeq += 1;  // 全局序列号递增
    this._promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
    if (timeout > 0) {  // 处理超时参数
      this._timeoutTimer = window.setTimeout(() => {
        this.reject(new TCICError(-2, i18next.t('{{arg_0}} Pending状态超时: {{timeout}}', { arg_0: this._action, timeout }), ''), TPromiseExecutorStatus.Timeout);
      }, timeout);
    }
  }

  public resolve(data?: any): boolean {
    ...
  }
  ...
}
```

4. tmodule.ts主要方法类
```ts
export class TPromiseModule extends TLoggerModule {
    /**
    * 新加一个Promise，返回PromiseExecutor
    * @param action    Promise对应的操作名称
    * @param exclusive 针对操作是否独占（独占模式下，一个操作同时只能存在一个promise）
    * @param timeout   超时时间，0表示永不超时（promise超过timeout时间仍然处于pending状态，自动reject）
    * @private
    */
  protected newExecutor(
    action: string,
    exclusive = true,
    timeout: number = undefined,
  ): TPromiseExecutor {
    const executor = new TPromiseExecutor(action, timeout, (data?: any) => {
        ...
    })
    return executor;
  }

    /**
    * 新加一个Promise
    * @param action    Promise对应的操作名称
    * @param id        Promise ID，用于区分同一个action对应的不同Promise，默认为空，表示不区分
    * @param exclusive 针对操作是否独占（独占模式下，一个操作同时只能存在一个promise）
    * @param timeout   超时时间，0表示永不超时（promise超过timeout时间仍然处于pending状态，自动reject）
    * @private
    */
  protected newPromise(
    action: string,
    id = '',
    exclusive = true,
    timeout: number = undefined,
  ): Promise<any> {
    return this.newExecutor(`${action}_${id}`, exclusive, timeout).getPromise();
  }
}
```