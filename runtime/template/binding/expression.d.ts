export type TextSegment = {
    readonly kind: 'text';
    readonly value: string;
} | {
    readonly kind: 'binding';
    readonly path: string;
};
/** 一次性解析文本中的 {{ state.path }}；反斜杠转义起始双括号，不执行 JavaScript。 */
export declare function parseTextSegments(source: string): readonly TextSegment[];
