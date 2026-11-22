export interface HandlerSource {
    readonly expression: string;
    readonly aliases: readonly string[];
}
export interface HandlerEnvironment {
    readonly state: object | undefined;
    readonly actions: object | undefined;
    readonly context: object;
    readonly properties: object;
    readonly attributes: object;
    readonly readAlias: (name: string) => unknown;
}
export interface HandlerInstance {
    readonly handler: (event: Event) => unknown;
    readonly update: () => void;
}
export type HandlerFactory = (index: number, environment: HandlerEnvironment) => HandlerInstance;
/** 一份模板生成一个工厂模块；行实例只创建闭包，不创建逐行 Blob 或改写业务表达式。 */
export declare function loadHandlerFactory(sources: readonly HandlerSource[], sourceURL: string): Promise<HandlerFactory>;
