> 全局属性模块，用于判断当前平台、角色、userId、Token、环境、课堂信息等全局信息。

```ts
export class TSession {
  private _isMac = false;
  private _isWindows = false;
  private _isMiniprogram = false;
  ...
  private static _isLocalUrl(url: string): boolean {}
}
```