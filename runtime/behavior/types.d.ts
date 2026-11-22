import type { Cleanup } from '../lifecycle/scope.js';
import type { Readable } from '../state/signal.js';
import type { FieldDefinitions, InputReferences, InputsOf } from '../component/fields.js';
/** 一次 Behavior 调用返回的状态与动作；与 context、宿主元素及内部实例句柄分别表示。 */
export interface BehaviorResult {
    state: object;
    /** 组件 Behavior 的 actions 同时成为宿主公开动作，业务 actions 不自动发布。 */
    actions: Record<string, (...args: never[]) => unknown>;
}
/** 与 Behavior 所有者共同退出的资源接口。 */
export interface ResourceContext {
    /** 登记同步清理；返回幂等的提前释放函数，销毁后登记立即执行。 */
    onDispose(cleanup: Cleanup): Cleanup;
    /** 订阅并托管释放；是否立即通知遵循 source 的订阅契约。 */
    subscribe<T>(source: Readable<T>, listener: (value: T) => void): Cleanup;
}
/** 一个使用者持有的业务引用；释放幂等，不转移实例所有权。 */
export interface BehaviorLease {
    readonly value: BehaviorResult;
    release(): void;
}
/** 保持引用稳定的响应式路由上下文；查询和 hash 更新不重建所在页面。 */
export interface RouteContext {
    readonly pathname: string;
    readonly params: Readonly<Record<string, string>>;
    readonly search: string;
    readonly hash: string;
}
/** 运行时注入环境；业务实例本身不继承 UI 的 route。 */
export interface BehaviorEnvironment {
    /** 由所属组件接收登记；共享业务没有 DOM 挂载入口。 */
    readonly onMount?: (callback: (host: HTMLElement) => void) => void;
    readonly properties?: InputReferences;
    readonly attributes?: InputReferences;
    readonly acquireBehavior?: (name: string) => BehaviorLease;
    readonly route?: RouteContext;
}
export interface BehaviorContext<Properties extends FieldDefinitions = FieldDefinitions, Attributes extends FieldDefinitions = FieldDefinitions> extends ResourceContext {
    /** 本地工厂同步登记回调；插入并绑定后以组件宿主元素调用，各执行至多一次。 */
    onMount(callback: (host: HTMLElement) => void): void;
    /** Current component input references. Shared business Behaviors receive empty collections. */
    readonly properties: InputsOf<Properties>;
    readonly attributes: InputsOf<Attributes>;
    readonly route: RouteContext | undefined;
    /** 每个实例对同名依赖持有一次引用，所有自身资源清理后再释放依赖。 */
    getBehavior<Result extends BehaviorResult = BehaviorResult>(name: string): Result;
}
/** 每次初始化调用一次，异步操作由 actions 承担。 */
export type Behavior<Result extends BehaviorResult = BehaviorResult> = ((context: BehaviorContext) => Result) & {
    properties?: FieldDefinitions;
    attributes?: FieldDefinitions;
};
/** 一个 Behavior 实例的内部管理句柄；每个组件实例至多拥有一个本地 Behavior 实例。 */
export interface BehaviorInstance<Result extends BehaviorResult = BehaviorResult> {
    readonly value: Result;
    readonly disposed: boolean;
    dispose(): void;
}
