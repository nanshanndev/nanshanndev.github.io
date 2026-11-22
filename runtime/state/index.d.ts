/** 状态模块统一入口；内部依赖仍直接引用实现文件，避免循环导入。 */
export { Signal, batch } from './signal.js';
export type { Computed, Readable, State, Unsubscribe, Writable } from './signal.js';
export { createState } from './state.js';
