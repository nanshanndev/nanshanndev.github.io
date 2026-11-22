import type { PreparedTemplateDefinition } from '../template/view.js';
import type { TemplateSource } from '../template/source.js';
import type { ContentContext, ManagedResource } from './context.js';
/** 可跨宿主复用的定义；不包含任何宿主的 DOM、本地状态或订阅。 */
export interface ComponentTemplate {
    readonly source: TemplateSource;
    readonly definition: PreparedTemplateDefinition;
}
/** 成功定义持续缓存；未完成任务只在最后一个等待者退出时取消，失败可重试。 */
export declare function loadComponentTemplate(url: string, signal?: AbortSignal): Promise<ComponentTemplate>;
/** 组件内容控制器；管理一个宿主元素的当前组件实例，本身不是宿主元素或公开实例 API。
 * include、注册标签与已命中 route 共用此加载流程；路由匹配由外部决定。 */
export declare class ComponentController implements ManagedResource {
    readonly element: HTMLElement;
    private prepareChild;
    private report;
    /** 输入连接归宿主所有，定义缓存只保存字段描述。 */
    private readonly inputs;
    /** 组件内部 DOM 的浏览器边界；外层宿主元素为 element。 */
    get shadowRoot(): ShadowRoot;
    /** 仅代表当前宿主自身的加载与绑定，不等待所有后代或整个路由树。 */
    ready: Promise<void>;
    /** 同时用于取消加载与辨认当前加载轮次，阻止旧结果覆盖新内容。 */
    private abort?;
    private view?;
    private actions?;
    private releaseHold?;
    constructor(element: HTMLElement, prepareChild: (element: Element, context: ContentContext) => ManagedResource | void, report: (element: HTMLElement, error: unknown) => void);
    load(context: ContentContext, templateURL?: string): void;
    stopBindings(): void;
    dispose(): void;
}
