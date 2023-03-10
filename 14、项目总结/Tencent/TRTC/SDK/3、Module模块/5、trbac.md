> Rbac权限模块
```ts
export class TRBAC extends TModule {
  private _getRole() {}
  public initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
        TBusinessRBAC.instance.getPermissions(token).then((result) => {
            result.permissions.forEach((item) => {
            if (!this._permissionMap.has(item.role)) {
                this._permissionMap.set(item.role, new Map<string, TPermissionFlag>());
            }
            const resourceMap = this._permissionMap.get(item.role)!;
            resourceMap.set(item.resource, item.permission);
        });
        resolve();
      })
    })
  }
}

```