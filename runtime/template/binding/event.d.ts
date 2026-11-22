import type { Scope } from '../../lifecycle/scope.js';
export interface EventDeclaration {
    readonly name: string;
    readonly options: AddEventListenerOptions;
}
/** 点后仅接受原生监听选项；不把条件、参数或业务控制变成修饰符语言。 */
export declare function parseEventDeclaration(attribute: string): EventDeclaration;
/** 新事件协议：原生 Event、普通函数调用、不改变默认行为，始终观察返回任务。 */
export declare function bindHandler(element: Element, declaration: EventDeclaration, handler: (event: Event) => unknown, scope: Scope, onError: (error: unknown) => void): void;
