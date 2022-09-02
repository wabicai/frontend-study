> 数据统计模块
```ts
export abstract class TStatisticsBase extends TLoggerModule {
  constructor() {
    super();
    TEvent.instance.on(TTrtcEvent.Network_Statistis, (statistics: TTrtcStatistics) => {
        ...
    })
  }
}