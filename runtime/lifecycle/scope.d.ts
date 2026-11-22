/** 同步资源释放函数；异步取消需由资源自身提供同步取消入口。 */
export type Cleanup = () => void;
/** 框架内部资源所有权边界，尚不从 nanshann 或 nanshann/lifecycle 导出。 */
export interface Scope {
    /** 登记清理，返回幂等的提前释放函数；销毁后登记立即执行。 */
    add(cleanup: Cleanup): Cleanup;
    /** 按登记顺序的逆序清理；重复调用安全，所有清理完成后再抛出异常。 */
    dispose(): void;
}
/**
 * 内部生命周期基础，不推断订阅所有者或监听 DOM，不维护隐式全局作用域。
 * Behavior 与 Template 绑定登记实例资源、订阅及事件监听清理。
 * 返回的 release 提前执行时会从作用域移除自己，并清除对原清理函数的引用。
 */
export declare function createScope(): Scope;
