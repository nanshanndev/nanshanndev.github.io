import type { Behavior } from './types.js';
type ModuleFunction = (...args: never[]) => unknown;
/**
 * 浏览器原生内联模块载体。只提取默认导出，不执行 Behavior 初始化。
 * 不改写 import；导入说明符必须符合内联模块的原生解析约定。
 * 同来源、同文本共享模块定义及导入 Promise，模块顶层按定义求值。
 * 每次区域初始化仍调用返回函数；私有可变状态应在函数内部创建。
 */
export declare function loadInlineBehavior(source: string, sourceURL: string): Promise<Behavior>;
/** Behavior 与生成的事件工厂共享原生 Blob ESM 载体，不引入 eval 或应用构建步骤。 */
export declare function loadInlineFunction<Definition extends ModuleFunction>(source: string, sourceURL: string, kind?: string): Promise<Definition>;
export {};
