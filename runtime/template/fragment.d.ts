/** 组件模板顶层唯一的本地模块声明。 */
export interface InlineBehaviorDeclaration {
    readonly source: string;
    readonly sourceURL: string;
}
export interface ParsedTemplateFragment {
    readonly content: DocumentFragment;
    readonly sourceURL: string;
    readonly behavior?: InlineBehaviorDeclaration;
}
/** 惰性解析并先校验全部声明；模块导入和 Behavior 调用发生在此步骤之后。 */
export declare function parseTemplateFragment(html: string, sourceURL: string): ParsedTemplateFragment;
