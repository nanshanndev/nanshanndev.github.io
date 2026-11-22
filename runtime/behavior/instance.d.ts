import type { Behavior, BehaviorEnvironment, BehaviorInstance, BehaviorResult } from './types.js';
/** 调用普通行为函数并拥有它登记的资源；每次调用都创建独立作用域。 */
export declare function createBehaviorInstance<Result extends BehaviorResult>(behavior: Behavior<Result>, environment?: BehaviorEnvironment): BehaviorInstance<Result>;
