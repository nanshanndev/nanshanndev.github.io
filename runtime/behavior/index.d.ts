/** Behavior 内部基础入口。业务实例按使用关系共享、自动释放。 */
export { createBehaviorInstance } from './instance.js';
export { createBehaviorRegistry } from './registry.js';
export type { BehaviorRegistry } from './registry.js';
export type { Behavior, BehaviorContext, BehaviorEnvironment, BehaviorInstance, BehaviorLease, BehaviorResult, ResourceContext, RouteContext, } from './types.js';
