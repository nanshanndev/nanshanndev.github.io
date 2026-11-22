/** 值绑定只解析路径；事件中的 JavaScript 由独立模块处理。 */
export interface ValuePath {
    readonly root: 'local' | 'business' | 'properties' | 'attributes' | 'alias';
    readonly name?: string;
    readonly path: readonly string[];
}
export interface HandlerPath {
    readonly name: string;
    readonly behavior?: string;
}
export declare const unsafeNames: Set<string>;
/** 直接动作路径不需要生成模块，其余 handler 表达式交给原生 ESM。 */
export declare function parseHandlerPath(expression: string): HandlerPath | undefined;
export declare function validateAlias(name: string): void;
export declare function parseValuePath(expression: string, aliases?: ReadonlySet<string>): ValuePath;
export declare function readOwnPath(root: unknown, path: readonly string[]): unknown;
/** 每次回写重新取得父对象，避免列表替换或父字段替换后写入旧引用。 */
export declare function writeOwnPath(root: unknown, path: readonly string[], value: unknown): void;
export interface ForeachDeclaration {
    readonly alias: string;
    readonly source: ValuePath;
    readonly key: ValuePath;
    readonly index?: string;
}
export declare function parseForeach(expression: string, key: string | null, index: string | null, aliases?: ReadonlySet<string>): ForeachDeclaration;
