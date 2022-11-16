> 业务代码，封装url接口请求
1. 目录组成
```ts
- tbusiness：业务请求，封装request
- tbusiness_class
- tbusiness_command
- tbusiness_document
.... // 业务代码请求
```

2. 各组件主要内容
### tbusiness
```ts
export class TBusiness extends TModule {
      public request(action: string, param: object, token: string, result: TModel, apiVersion = 'v1'): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const url = this.getUrl(action, token, apiVersion);
        const body = JSON.stringify(param);
        const headers: { [key: string]: string } = {
          'Content-Type': 'application/json',
        };
        const label = action + TUtil.getTimestamp().toString();
        this._logStart(label);
        const logParam = new TLoggerParam();
        logParam.module = 'TBusiness';
        logParam.action = action;
        logParam.param = body;
        logParam.ext = JSON.stringify({ token });
        logParam.report = true;
        TRequest.instance.httpRequest('POST', url, headers, body)
          .then((resp) => {
            const json = JSON.parse(resp.data);
            const errorInfo = new TErrorInfo();
            errorInfo.deserialize(json);
            if (errorInfo.errorCode === 0) {
              if (result) {
                result.deserialize(json);
              }
              resolve(result);
            } else {
              reject(errorInfo);
            }
            logParam.code = resp.code;
            logParam.desc = resp.data;
            this._logEnded(label, TLevel.INFO, logParam);
          }, (resp) => {
            if (resp && resp.code === -1 && !this.useBackUpHost) {
              this.useBackUpHost = true;
              this.request(action, param, token, result, apiVersion).then(resolve, reject);
            } else {
              const errorInfo = new TErrorInfo(resp.code, resp.data);
              reject(errorInfo);
              logParam.code = resp.code;
              logParam.desc = resp.data;
              this._logEnded(label, TLevel.ERROR, logParam);
            }
          });
      }, 0);
    });
  }
}
```

### tbusiness_user
```ts
export class TBusinessUser extends TModule {
    /**
   * 获取用户信息（仅限本人）
   * @param {string}                  token       token
   */
  public getUserInfo(token: string): Promise<TUserInfo> {
    const param = {};
    const userInfo = new TUserInfo();
    const url = 'user/info';
    return TBusiness.instance.request(url, param, token, userInfo);
  }
}
....
// 封装接口请求
```