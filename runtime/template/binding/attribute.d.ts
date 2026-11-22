import type { Scope } from '../../lifecycle/scope.js';
export interface ElementBindings {
    bind(name: string, read: () => unknown): void;
    bindMany(read: () => unknown): void;
    claim(name: string, owner: string): void;
}
/** 同一元素的绑定共享目标所有权；短写与对象形式使用同一写入协议。 */
export declare function createElementBindings(element: Element, sourceURL: string, scope: Scope, report: (error: unknown) => void): ElementBindings;
