/** 保护用户错误回调；包括回调自身的异步拒绝，不产生悬空 Promise。 */
export declare function createErrorReporter(onError?: (error: unknown) => void): (error: unknown) => void;
