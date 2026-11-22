import type { ParsedTemplateFragment } from './fragment.js';
import type { HandlerSource } from './handlers.js';
import type { EventDeclaration } from './binding/event.js';
import type { ForeachDeclaration, HandlerPath, ValuePath } from './binding/path.js';
export interface EventPlan {
    readonly declaration: EventDeclaration;
    readonly handler?: HandlerPath;
    readonly factory?: number;
}
export interface ElementPlan {
    readonly kind: 'element' | 'fragment';
    readonly node: Element;
    readonly children: readonly NodePlan[];
    readonly bindings: readonly {
        name: string;
        path: ValuePath;
    }[];
    readonly bulk?: ValuePath;
    readonly model?: ValuePath;
    readonly html?: ValuePath;
    readonly events: readonly EventPlan[];
}
export type NodePlan = {
    readonly kind: 'literal';
    readonly node: Node;
} | {
    readonly kind: 'text';
    readonly path: ValuePath;
} | ElementPlan | {
    readonly kind: 'foreach';
    readonly declaration: ForeachDeclaration;
    readonly child: NodePlan;
} | {
    readonly kind: 'if';
    readonly branches: readonly {
        when?: ValuePath;
        child: NodePlan;
    }[];
};
export interface TemplatePlan {
    readonly children: readonly NodePlan[];
    readonly handlers: readonly HandlerSource[];
}
/** 结构和路径只准备一次。动态实例复用计划，实例化时才取得业务引用及创建本地状态。 */
export declare function planTemplate(parsed: ParsedTemplateFragment, inheritedAliases?: ReadonlySet<string>): TemplatePlan;
