```ts
import { TEventOptions } from '../base/tevent';
import { TSession } from './tsession';
import {
    TLoggerModule,
    TModule,
} from '../base/tmodule';
import {
    TLevel,
    TLogger,
} from './tlogger';

export type TStateUpdateListener = (stateValue: any, stateOldValue: any, reason?: string) => void;
export type TStateEqualFunc = (stateValue: any, stateExpectValue: any) => boolean;
export type TStateReportExecutor = (stateValue: any) => Promise<void>;
export interface TStateOptions extends TEventOptions {
    /**
     * 禁止在状态订阅时触发（如果触发，新老状态值一致）
     */
    noEmitWhileSubscribe?: boolean,
    /**
     * 禁止在状态注册时触发（如果触发，老状态为undefined）
     */
    noEmitWhileRegister?: boolean,
}

class TStateListenerStore {
    public listener: TStateUpdateListener = null;
    public options?: TStateOptions = null;

    constructor(listener: TStateUpdateListener, options?: TStateOptions) {
        this.listener = listener;
        this.options = options;
    }
}

class TStateInfo extends TLoggerModule {
    private static _retryIntervals = [0, 1000, 1000, 1000, 2000, 3500, 8500, 12500, 24000];
    private _desc = '';
    private _value: any = undefined;
    private _validCallers: string[] = [];
    private _listenerStores: TStateListenerStore[] = [];
    private _registered = false;
    private _executor: TStateReportExecutor = null;
    private _retryTimes = 0;
    private _reportValues: any[] = [];

    public register(desc: string, value: any, callers: string[]) {
        this._desc = desc;
        this._validCallers = callers;
        this.updateValue(value, 'register');
        this._registered = true;
    }

    // 检查是否已注册
    public checkRegister() {
        return this._registered;
    }

    // 检测是否有权限
    public checkAuth(caller: string) {
        return !(this._validCallers.length > 0 && !this._validCallers.includes(caller));
    }

    // 设置状态上报器
    public setReport(executor?: TStateReportExecutor): boolean {
        this._executor = executor;
        this._tryReport();
        return true;
    }

    // 更新状态
    public updateValue(value: any, reason?: string): boolean {
        if (value === this._value) {
            if (typeof value !== 'object') {  // 只有非值类型不比较内容，无条件更新
                return false;
            }
        }
        const oldValue = this._value;
        this._value = value;
        // 此处利用setTimeout异步执行，避免同步回调
        setTimeout(() => {
            this._tryReport(value);  // 尝试上报状态
            this._listenerStores.forEach((store) => {
                if (oldValue !== undefined
                    || !store.options
                    || !store.options.noEmitWhileRegister) {
                    store.listener(value, oldValue, reason);
                }
            });
        });
        return true;
    }

    public getDesc() {
        return this._desc;
    }

    // 获取状态
    public getValue() {
        return this._value;
    }

    // 添加监听
    public addListener(listener: TStateUpdateListener, options?: TStateOptions) {
        if (typeof listener !== 'function') {
            return false;
        }
        const store = new TStateListenerStore(listener, options);
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
    public removeListener(listener: TStateUpdateListener, options?: TStateOptions) {
        const lastLength = this._listenerStores.length;
        this._listenerStores = this._listenerStores.filter((store) => {
            if (store.listener === listener) {  // listener一样
                if (!store.options && !options) {  // 且options都未指定，移除
                    return false;
                }
                if (store.options && options) {  // options都指定了，比较值
                    return JSON.stringify(store.options) !== JSON.stringify(options);
                }
            }
            return true;
        });
        return this._listenerStores.length !== lastLength;
    }

    protected _getClassName() {
        return 'TState';
    }

    // 尝试做状态上报，传参表示往上报队列增加任务，不传参表示只尝试上报队列里的第一个任务
    private _tryReport(value?: any) {
        if (typeof value !== 'undefined') {
            if (this._reportValues.length > 0) {
                this._reportValues.splice(1);  // 删除多余的中间态
                this._reportValues.push(value);
                return;  // 等待第一个上报完成后来处理
            }
            this._reportValues.push(value);
        }
        if (this._executor && this._reportValues.length > 0) {  // 注册了上报器且存在待上报任务
            value = this._reportValues[0];
            const promise = this._executor(value);
            if (!(promise instanceof Promise)) {
                this._error('reportState', `${this.getDesc()} = ${value} executor return not promise`);
                return;
            }
            const scheduleReport = () => {
                let retryIntervalIndex = this._retryTimes;
                if (retryIntervalIndex >= TStateInfo._retryIntervals.length) {
                    retryIntervalIndex = TStateInfo._retryIntervals.length - 1;
                }
                const retryAfter = TStateInfo._retryIntervals[retryIntervalIndex];  // 计算下次重试延迟
                setTimeout(() => {  // 延迟重试
                    this._tryReport();
                }, retryAfter);
            };
            promise.then(() => {
                this._reportValues.shift();  // 移除当前上报任务
                this._retryTimes = 0;  // 重置重试次数
                scheduleReport();
                this._info('reportState', `${this.getDesc()} = ${value}`);
            }).catch((err) => {
                if (err && err.errorCode === 10622 && TSession.instance.isSupervisor()) {
                    return;
                }
                // 上报失败，但队列里已有新的任务，不再尝试本次上报任务
                if (this._reportValues.length > 1) {
                    this._reportValues.shift();  // 移除当前上报任务
                    this._retryTimes = 0;  // 重置重试次数
                } else {
                    this._retryTimes += 1;  // 重试次数+1
                }
                scheduleReport();
                this._error('reportState', `${this.getDesc()} = ${value} report failed: ${JSON.stringify(err)}`);
            });
        }
    }
}


export class TState extends TModule {
    private _state_map: Map<string, TStateInfo> = new Map();       // 状态表

    /**
     * 返回该类实例
     */
    public static get instance(): TState {
        return this.getInstance();
    }

    /**
     * 注册状态
     * @param name          状态名称
     * @param desc          状态说明，必须传入长度>=4的字符串
     * @param value         状态初始值
     * @param validCallers  状态可写者数组
     */
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
     * 启用或关闭状态上报
     * @param name          状态名称
     * @param executor      状态上报执行器，传空表示不上报
     */
    public setReport(name: string, executor?: TStateReportExecutor): boolean {
        const stateInfo = this._getStateInfo(name);
        if (!stateInfo.checkRegister()) {
            this._warn('setReport', `${name} not register`);
            return false;
        }
        this._info('setReport', `${stateInfo.getDesc()}: ${!!executor ? 'executor' : 'null'}`);
        return stateInfo.setReport(executor);
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
     * 读取状态
     * @param name          状态名称
     * @param defaultValue  默认返回值（组件未注册时返回）
     */
    public getState(name: string, defaultValue?: any) {
        const stateInfo = this._getStateInfo(name);
        if (!stateInfo.checkRegister()) {
            if (typeof defaultValue === 'undefined') {
                this._warn('getState', `${name} not register`);
            }
            return defaultValue;
        }
        return stateInfo.getValue();
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
     * 取消状态订阅
     * @param name      状态名称
     * @param listener  状态更新回调
     * @param options   状态监听选项
     */
    public unsubscribeState(name: string, listener: TStateUpdateListener, options?: TStateOptions) {
        return this._getStateInfo(name).removeListener(listener, options);
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

    // 获取类名
    protected _getClassName() {
        return 'TState';
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