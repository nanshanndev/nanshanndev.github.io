export interface RouteDeclaration {
    readonly path?: string;
    readonly index: boolean;
    readonly src: string;
}
export type RoutePathSegment = {
    readonly kind: 'static';
    readonly value: string;
} | {
    readonly kind: 'parameter';
    readonly name: string;
};
export type ParsedRouteDeclaration = {
    readonly kind: 'index';
    readonly src: string;
} | {
    readonly kind: 'path';
    readonly src: string;
    readonly segments: readonly RoutePathSegment[];
};
export interface RoutePathMatch {
    readonly params: Readonly<Record<string, string>>;
    readonly consumed: number;
}
/** 校验单条声明；depth 来自逻辑路由关系，而不是 DOM 或 Template 的嵌套层数。 */
export declare function parseRouteDeclaration(declaration: RouteDeclaration, depth: number): ParsedRouteDeclaration;
/**
 * 匹配已拆分但未解码的 pathname 段，返回本条声明消费的前缀长度。
 * 每段只解码一次；编码的斜杠仍属于同一个段。index 由分组 fallback 逻辑处理。
 * 不足、空段、非法 URL 编码或静态段不符时返回 undefined，不负责同级选择。
 */
export declare function matchRoutePath(parsed: ParsedRouteDeclaration, pathSegments: readonly string[]): RoutePathMatch | undefined;
