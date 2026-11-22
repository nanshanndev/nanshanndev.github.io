/**
 * 只重定位 srcset 候选的 URL，保留描述符和分隔符原文给浏览器判断。
 * token 边界遵循 WHATWG HTML 的 srcset splitting loop / descriptor tokenizer：
 * https://html.spec.whatwg.org/multipage/images.html#parse-a-srcset-attribute
 * 逗号可出现在 URL（包括 data:）内部，不能直接 split(',')。
 */
export declare function resolveSrcset(value: string, baseURL: string): string;
