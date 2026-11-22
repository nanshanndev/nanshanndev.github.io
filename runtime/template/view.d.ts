import type { Behavior, BehaviorLease, BehaviorResult, RouteContext } from '../behavior/types.js';
import type { Readable } from '../state/signal.js';
import type { InlineBehaviorDeclaration, ParsedTemplateFragment } from './fragment.js';
import type { HandlerFactory } from './handlers.js';
import type { TemplatePlan } from './plan.js';
import type { ComponentFields, InputReferences } from '../component/fields.js';
export interface TemplateBindingsContext {
    readonly variables?: ReadonlyMap<string, Readable<unknown>>;
    readonly properties?: InputReferences;
    readonly attributes?: InputReferences;
}
export interface TemplateViewContext extends TemplateBindingsContext {
    readonly local?: BehaviorResult;
    readonly acquireBehavior?: (name: string) => BehaviorLease;
    readonly route?: RouteContext;
}
export interface ChildViewResources {
    stopBindings(): void;
    dispose(): void;
}
export interface TemplateViewOptions {
    readonly signal?: AbortSignal;
    readonly onError: (error: unknown) => void;
    readonly onElement?: (element: Element, local: BehaviorResult | undefined, context: TemplateBindingsContext) => ChildViewResources | void;
}
export interface PreparedTemplateView extends ChildViewResources {
    readonly content: DocumentFragment;
    /** 组件 Behavior 返回的动作；宿主控制器将其发布为组件公开动作。 */
    readonly actions: BehaviorResult['actions'] | undefined;
    mount(root: ShadowRoot): void;
}
/** 只读定义可被多个实例复用；不持有实例 DOM、状态或资源作用域。 */
export interface PreparedTemplateDefinition {
    readonly sourceURL: string;
    readonly plan: TemplatePlan;
    readonly behavior?: InlineBehaviorDeclaration;
    readonly factory?: Behavior;
    readonly handlerFactory: HandlerFactory;
    readonly fields: ComponentFields;
}
export declare function prepareTemplateDefinition(parsed: ParsedTemplateFragment, aliases?: ReadonlySet<string>, signal?: AbortSignal): Promise<PreparedTemplateDefinition>;
/** 每次实例化都创建新的根片段；并发消费者绝不共享可变 DocumentFragment。 */
export declare function instantiateTemplate(definition: PreparedTemplateDefinition, context: TemplateViewContext, options: TemplateViewOptions): PreparedTemplateView;
/** Low-level view helper; component hosts use shared definitions and isolated contexts. */
export declare function prepareTemplateView(parsed: ParsedTemplateFragment, context: TemplateViewContext, options: TemplateViewOptions): Promise<PreparedTemplateView>;
