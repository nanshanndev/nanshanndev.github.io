/** 创建深层响应式普通对象或数组；不复制输入，不增加 get/set 等保留方法名。 */
export declare function createState<T extends object>(initialValue: T): T;
