> SDK总出口
1. 定义状态基类
```ts
/**
 * 权限更新原因
 */
export enum TPermissionUpdateReason {
   /**
   * 进房后初始化
   */
  Init = 'init',
  ...
}
/**
 * 业务层相关事件
 * @enum {string}
 */
export enum TMainEvent {
   /**
   * 已加入课堂
   */
  After_Enter = 'tcic@tmain@after-enter',
}
/**
 * 业务层相关状态
 * @enum {string}
 */
export enum TMainState {
   /**
   * 消息未读计数
   */
  Message_Unread_Count = 'tcic@tmain@message-unread-count',
}
/**
 * 组件布局信息
 */
export interface TComponentLayout {
   /**
   * 展示类型
   */
  display?: string;
}
...

```

2. 定义Component类
```ts
class ComponentInfo {
  public name: string;
  public visible = false;
  public layout: TComponentLayout = {};
  public listeners: ComponentEventListener[] = [];
  ...
  public toggleComponentDraggable(
    draggable: boolean,
    domSelector: string,
    draggableRect: DOMRect | (() => DOMRect) = null,
    forceUpdate = true,
  ) {}
    /**
   * 将当前组件添加到可拖动组件列表，并将层级移动到所有组件之上，其它组件层级填充空位
   * @param update 是否马上更新层级展示
   */
  public appendToDraggableComponentList(update = true) {}
}

```

3. 定义SDK功能类
```ts
/**
 * SDK功能类，SDK的主要功能入口
 * @hideconstructor
 */
export class TMain extends TModule {
  /**
   * 加载组件
   * @param {string} name 组件名称
   * @param {TComponentLayout} layout 初始布局
   * @param {string} parentDomId 父节点 ID
   * @param {string} label 标识
   * @return {Promise<HTMLElement | null>} HTML元素
   */
  public loadComponent(name: string, layout?: TComponentLayout, parentDomId?: string, label = 'default'): Promise<HTMLElement | null> {
    // this._debug('loadComponent', `${name}-${label} -> ${JSON.stringify(layout)}`);
    return new Promise<HTMLElement>((resolve) => {
      const comInfo = this._getComponentInfo(name, label);
      comInfo.loaded = true;  // 标记为已加载
      if (layout) {
        comInfo.layout = layout;
      }
      if (parentDomId) {
        comInfo.parentDomId = parentDomId;
      }
      comInfo.create = true;
      comInfo.resolves.push((result) => {
        if (result) {
          resolve(comInfo.dom);
        } else {
          resolve(null);
        }
      });
      this._updateAllComponents();
    });
  }
    /**
   * 更新所有组件状态
   * @private
   */
  private _updateAllComponents() {
    if (this._componentsUpdateTask) {
      cancelAnimationFrame(this._componentsUpdateTask);
    }
    this._componentsUpdateTask = requestAnimationFrame(() => {
      this._componentsUpdateTask = 0;
      const rootDom = this._getRootDom();
      if (!rootDom) {
        this._reportEvent('updateAllComponents@error', 'root dom not found');
        this._error('_updateAllComponents@error', 'root dom not found');
        return;
      }
      let hasNewComponent = false;
      let hasSomethingChanged = false;
      const keys = Array.from(this._componentsMap.keys());
      const startTime = window.performance.now();
      for (let i = 0; i < keys.length; ++i) {
        const comInfo = this._componentsMap.get(keys[i]);
        do {
          // 记录状态
          const remove = comInfo.remove;
          const create = comInfo.create;
          const update = comInfo.update;
          if (remove) {  // 明确指定需要删除
            comInfo.remove = false;
            if (comInfo.dom) {
              comInfo.destroy();
              this._info('_updateAllComponents@remove', `${comInfo.fullName()} done`);
              hasSomethingChanged = true;
            } else {
              this._reportEvent('updateAllComponents@removeError', comInfo.fullName());
              this._info('_updateAllComponents@remove', `${comInfo.fullName()} not found`);
            }
          }
          if (create) {  // 明确指定需要创建
            if (!comInfo.dom) {
              comInfo.dom = document.createElement(comInfo.name);
              if (!(comInfo.dom instanceof TBase) && !(TVueComponent.instance.find(comInfo.name))) {
                this._reportEvent('updateAllComponents@createError', comInfo.fullName());
                this._error('_updateAllComponents@create', `${comInfo.fullName()} name illegal`);
                comInfo.dom = null;
                comInfo.resolve(false);
                break;
              }

              comInfo.dom.classList.add('tcic-component-container');
              comInfo.dom.classList.add(comInfo.fullName());
              comInfo.dom.setAttribute('label', comInfo.label);
              comInfo.dom.id = comInfo.fullName();
              let parentDom = rootDom;
              if (comInfo.parentDomId) {
                parentDom = document.getElementById(comInfo.parentDomId);
                if (!parentDom) {
                  this._reportEvent('updateAllComponents@createError', comInfo.fullName());
                  this._error('_updateAllComponents@create', `${comInfo.fullName()} parent dom ${comInfo.parentDomId} not found`);
                  comInfo.dom = null;
                  comInfo.resolve(false);
                  break;
                }
              }
              parentDom.appendChild(comInfo.dom);
              this._info('_updateAllComponents@create', `${comInfo.fullName()} done`);
              hasNewComponent = true;
              hasSomethingChanged = true;
            }
            comInfo.create = false;
          }
          if (update || create) {  // 明确指定需要更新，或者刚创建完成
            if (comInfo.dom) {
              // 更新属性
              const strStyle = `position: ${comInfo.layout.position || 'absolute'};`
                + `left: ${comInfo.layout.left || 0};`
                + `top: ${comInfo.layout.top || 0};`
                + `width: ${comInfo.layout.width || '100%'};`
                + `height: ${comInfo.layout.height || '100%'};`
                + `opacity: ${comInfo.layout.opacity || 1};`
                + `display: ${comInfo.layout.display || 'none'};`
                + `z-index: ${comInfo.layout.zIndex || 1};`
                + `transform: ${comInfo.layout.transform || 'none'};`
                + `transform-origin: ${comInfo.layout.transformOrigin || 'center center'};`
                + 'vertical-align: middle;'
                + `${comInfo.layout.style || ''}`;
              comInfo.dom.setAttribute('style', strStyle);
              // 延迟更新组件状态，因为updateStatus内部会去获取DOM节点状态，需要留出时间等待DOM节点更新
              requestAnimationFrame(() => {
                comInfo.updateStatus();
              });
              this._info('_updateAllComponents@update', `${comInfo.fullName()} -> ${strStyle} done`);
              hasSomethingChanged = true;
            }
            comInfo.update = false;
          }
          if (remove || create || update) {
            if (TSession.instance.isIOS8910()) {
              setTimeout(() => {
                // ios 9，添加dom到文档不回同步触发connectedcallback，导致getVueInstance函数注入延后无法调用
                comInfo.resolve(true);
              }, 10);
            } else {
              comInfo.resolve(true);
            }
          }
        } while (false);
        if (window.performance.now() - startTime >= 10) {  // 确保10ms内执行完，避免阻塞UI更新
          if (i < keys.length - 1) {
            setTimeout(this._updateAllComponents.bind(this), 0);
          }
          break;
        }
      }
      if (hasNewComponent) {
        TMain._touchScreenAdjust();
      }
      if (hasSomethingChanged) {
        // 当组件发生布局更新时，更新可拖动区域并重新布局组件，避免组件在其它组件布局变化后超出可拖动区域限制
        this._componentsMap.forEach((comInfo) => {
          comInfo.updateDraggableLayout();
        });
      }
    });
  }
  /**
   * 查询课堂详情
   */
  public getClassInfo(): TClassInfo {
    return TSession.instance.getClassInfo();
  }
  public silenceAll(silence: boolean): Promise<void> {}
  ....
  // 所有业务侧的功能，包括发送请求、上下课、举手等等功能的入口，都是这里实现。
}

```