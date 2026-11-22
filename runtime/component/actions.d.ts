import type { BehaviorResult } from '../behavior/types.js';
import type { ComponentFields } from './fields.js';
/** 将组件 Behavior 的动作发布到宿主元素；每个组件实例独立持有并清理方法包装。 */
export declare function prepareHostActions(host: HTMLElement, actions: BehaviorResult['actions'] | undefined, fields: ComponentFields, source: string): {
    dispose: () => void;
    install(): void;
};
