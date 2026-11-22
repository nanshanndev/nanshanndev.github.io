import type { Behavior, BehaviorLease } from './types.js';
export interface BehaviorRegistry {
    register(name: string, behavior: Behavior): void;
    acquire(name: string): BehaviorLease;
}
/**
 * 定义登记与实例寿命分离。并存使用者共享实例，最后一份引用释放时同步销毁。
 * 依赖关系也持有引用；同时检测初始化时及动作执行中建立的循环依赖。
 */
export declare function createBehaviorRegistry(): BehaviorRegistry;
