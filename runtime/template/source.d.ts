export interface TemplateSourceOptions {
    readonly baseURL: string;
    readonly ancestors?: readonly string[];
    readonly signal?: AbortSignal;
}
export interface TemplateSource {
    readonly url: string;
    readonly requestedURL: string;
    readonly html: string;
    /** 包含本次请求与重定向最终地址，供子片段检测别名循环。 */
    readonly ancestors: readonly string[];
}
interface SourceLocation {
    readonly src: string;
    readonly baseURL?: string;
    readonly requestedURL?: string;
    readonly finalURL?: string;
    readonly ancestors: readonly string[];
}
/** 保留声明位置、已知加载链以及原始异常；取消原因也保持原值。 */
export declare class TemplateSourceError extends Error implements SourceLocation {
    readonly src: string;
    readonly baseURL?: string;
    readonly requestedURL?: string;
    readonly finalURL?: string;
    readonly ancestors: readonly string[];
    constructor(location: SourceLocation, cause: unknown);
}
/** 原生浏览器资源加载基础；无缓存，不解析 HTML、不初始化任何行为。 */
export declare function loadTemplateSource(src: string, options: TemplateSourceOptions): Promise<TemplateSource>;
export {};
