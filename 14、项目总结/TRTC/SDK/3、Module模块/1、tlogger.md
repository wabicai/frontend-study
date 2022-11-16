> 日志上报
- 离线日志如何上报：
  - 存储至indexDB，通过长轮询，等网络正常时把异常上报。


1. 定义日志参数
```ts
/**
 * 日志和上报级别
 */
export enum TLevel {
  DEBUG = 1,
  INFO,
  WARN,
  ERROR
}
export class TLogger {
  private static _instances: Map<string, TLogger> = new Map<string, TLogger>();
  ...
  public info(param: TLoggerParam) {
    // 添加合并日志上报处理逻辑
    const logModule = param.module;
    const logAction = param.action;
    const logMergeKey = `${logModule}_${logAction}`;
    const logs = this._mergeInfoLogs.get(logMergeKey);
    if (logs === undefined) {
      // 原逻辑直接上报
      this.log(TLevel.INFO, param);
    } else {
      const timestamp = TUtil.dateToTimeStr(Date.now());
      const msg = `${timestamp} : ${param.param}`;
      logs.mergeLogs.push(msg);
      if (logs.mergeLogs.length >= logs.mergeSize) {
        // 原逻辑直接上报
        this.log(TLevel.INFO, {
          module: logModule,
          action: logAction,
          param: `${JSON.stringify(logs.mergeLogs)}`,
        });
        logs.mergeLogs = [];
      }
    }
  }
    /**
   * 合并上报日志白名单
   * @param module 日志模块
   * @param action 日志方法名
   * @param mergeSize 合并的条数
   * @param isAdd 添加（true）/取消(false)合并日志上报逻辑
   */
  public mergeInfoLog(module: string, action: string, mergeSize = 10, isAdd = true) {
    const logMergeKey = `${module}_${action}`;
    const logs = this._mergeInfoLogs.get(logMergeKey);
    if (isAdd) {
      if (logs === undefined) {
        // 没添加过，直接添加
        this._mergeInfoLogs.set(logMergeKey, {
          mergeSize,
          mergeLogs: [],
        });
      }
    } else {
      if (logs !== undefined) {
        // 已有日志先上传
        // 原逻辑直接上报
        this.log(TLevel.INFO, {
          module,
          action,
          param: `${JSON.stringify(logs.mergeLogs)}`,
        });
        this._mergeInfoLogs.delete(logMergeKey);
      }
    }
  }
}

```





