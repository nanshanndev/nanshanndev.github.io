import type { Behavior } from '../behavior/types.js';
/** 只登记业务定义；实例由模板绑定或 Behavior 首次消费时按名称取得。 */
export declare function registerBehavior(name: string, behavior: Behavior): void;
/** 组件宿主元素的公开类型；输入与组件公开动作通过该元素的普通成员访问。 */
export interface TemplateElement extends HTMLElement {
    readonly ready: Promise<void>;
}
/** 浏览器入口自动调用；Node 中导入状态和类型不会创建 DOM。 */
export declare function installRuntime(): void;
/** 同源 History 导航；具体页面激活与保留规则由 RouteGroup 处理。 */
export declare function navigate(url: string | URL, options?: {
    replace?: boolean;
}): void;
/** 准备 HTML 定义并注册标准自定义元素；完成不代表任何具体宿主已经加载。 */
export declare function createComponent(name: string, templateURL: string | URL): Promise<void>;
