> 事件消费中心、中间层。主要对获取到的原始数据进行初次处理，如课堂列表排序、权限通知更新，包括需要注册状态订阅的状态

```ts
export class TStore extends TModule {
  private _memberList: TMemberInfo[] = [];
  private _handUpStatus = new Map<string, TMemberHandUpStatus>();

  public init() {
    TState.instance.registerState(TMainState.Hand_Up_Member_List, '举手成员列表', this._handUpMemberList, [this.constructor.name]);
    TEvent.instance.on(TMainEvent.Member_Join, (userId: string) => {
      this._updateMemberList();
    });
  }
  public updateMemberListFilter(filter: TMemberListFilter) {}
  public notifyChatPermission(memberlist: TMemberInfo[]) {
    ...
    TState.instance.setState(TMainState.Chat_Permission, chatFlag, this.constructor.name, true);
  }
}
```