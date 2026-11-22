/** 运行时内部的环境传递与资源协议；不同于注入 Behavior 函数的公开 ctx。 */
import type { BehaviorLease, RouteContext } from '../behavior/types.js';
import type { RouteGroup } from '../router/group.js';
import type { TemplateBindingsContext } from '../template/view.js';
/** 父模板或路由持有的子资源句柄，区分停止绑定与完整释放两个阶段。 */
export interface ManagedResource {
    /** 先停止输入和视图更新，避免销毁中的状态变化继续驱动待退出内容。 */
    stopBindings(): void;
    /** 释放该资源拥有的实例、监听器与加载任务；具体实现负责幂等清理。 */
    dispose(): void;
}
/** 在内容接入前显式传递，不从 DOM 祖先反查行为或路由所有者。 */
export interface ContentContext extends TemplateBindingsContext {
    /** 当前声明所在资源的 URL，用于解析嵌套模板的相对地址。 */
    readonly baseURL: string;
    /** 当前模板加载链，包含重定向来源，用于阻止循环包含。 */
    readonly ancestors: readonly string[];
    /** 所属逻辑路由的响应式值；普通组件嵌套不创建新的路由层级。 */
    readonly route?: RouteContext;
    /** 取得具名业务的持有句柄，由实际消费它的绑定或 Behavior 负责释放。 */
    readonly acquireBehavior: (name: string) => BehaviorLease;
    /** 收集同一逻辑层级的路由候选，并等待异步模板完成候选登记。 */
    readonly group: RouteGroup;
}
