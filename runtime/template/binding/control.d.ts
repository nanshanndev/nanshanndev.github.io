import type { Scope } from '../../lifecycle/scope.js';
export interface ModelTarget {
    read(): unknown;
    write(value: unknown): void;
}
export interface ModelBinding {
    /** 控件接入实际树后关联原生 form；不建立公开的挂载生命周期 API。 */
    mount(): void;
}
/** ns-model 的原生控件协议。 */
export declare function bindModelTarget(element: Element, target: ModelTarget, scope: Scope, report: (error: unknown) => void, claim: (name: string) => void): ModelBinding;
