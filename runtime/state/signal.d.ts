/**
 * nanshann 的 Signal 状态基础：参考 TC39 提案的语义子集，不是完整 polyfill。
 * 对照来源：https://github.com/tc39/proposal-signals （API sketch / How Signals work）
 *
 * 【已实现：提案核心 API 的基础部分】
 * - new Signal.State(initialValue)：创建独立源状态；get() 读取，set() 写入。
 * - new Signal.Computed(calculate)：get() 时惰性计算，自动追踪动态依赖并缓存结果。
 * - Signal.subtle.untrack(run)：关闭调用方的依赖收集，不关闭内部计算自身的收集。
 * - 默认 Object.is 判等、计算错误缓存与依赖变化后的重试、循环计算读取检测。
 *   State / Computed 的构造器仅实现上述基础部分，不支持提案的 options 参数。
 *
 * 【已实现：nanshann 扩展，不属于提案原生 API】
 * - State / Computed.peek()：不建立调用方依赖的读取。
 * - State.update(updater)：根据旧值更新；updater 的读取不加入调用方依赖。
 * - State / Computed.subscribe(listener)：立即回调当前值，后续同步通知；
 *   返回可重复调用的释放函数。它不是提案的 Watcher.notify。
 * - batch(run)：合并最外层同步批处理期间的通知；读取立即可见，异常不回滚，
 *   不跨 await。它从包入口单独导出，不是 Signal.batch()。
 * - Readable<T> / Writable<T> / Unsubscribe：框架使用的 TypeScript 能力接口。
 *
 * 【未实现：提案中的 API 与选项】
 * - Signal.subtle.Watcher：构造器、watch(...signals)、unwatch(...signals)、getPending()；
 *   包括 watch() 重新启用通知，以及 notify 期间禁止读取/写入 Signal 的规则。
 * - Signal.subtle.currentComputed()。
 * - Signal.subtle.introspectSources() / introspectSinks()。
 * - Signal.subtle.hasSources() / hasSinks()。
 * - Signal.subtle.watched / unwatched 两个 Symbol 及相应的生命周期回调。
 * - State / Computed 构造器的 SignalOptions：自定义 equals 及上述 Symbol 钩子。
 * - 计算回调及选项回调的提案 this 绑定约定；当前计算函数不应依赖 this。
 *
 * 【语义差异与实现边界】
 * - 本实现要求计算同步且无副作用，拒绝计算期间写状态或创建订阅；
 *   提案允许计算回调写入其他 Signal，因此这里是框架的更严格约束。
 * - subscribe 的消费者在完整失效传播后运行，可读取/写入状态；
 *   提案 Watcher.notify 只用于通知失效，不能直接作为这样的消费者执行。
 * - 当前采用全局修订号 + 依赖版本校验，不是提案算法的逐项复刻；
 *   尚未通过完整提案一致性测试，不保证替换官方 polyfill 后行为完全相同。
 * - 不安装 globalThis.Signal。对象/数组按引用更新，不做深层 Proxy 跟踪。
 * - effect、DOM 调度、异步状态、事务回滚和模块生命周期托管尚未提供；
 *   它们不是上述提案原生 API 中已经承诺、却遗漏的成员。
 *
 * 本文件对应包入口的 Signal、batch；深层状态 createState 另见 ./state.ts。
 * 完整公开导出清单见 src/index.ts，行为说明见 docs/reference/signal.md。
 */
export type Unsubscribe = () => void;
/** 框架类型：源状态与派生值都具备的读取、非追踪读取和订阅能力。 */
export interface Readable<T> {
    /** 提案核心能力：读取当前值，在计算函数中调用时记录依赖。 */
    get(): T;
    /** nanshann 扩展：读取当前值，但不成为外层计算的依赖。 */
    peek(): T;
    /** nanshann 扩展：立即回调当前值；返回可重复调用的取消订阅函数。 */
    subscribe(listener: (value: T) => void): Unsubscribe;
}
/** 框架类型：可写源状态；Computed 不提供这些写入能力。 */
export interface Writable<T> extends Readable<T> {
    /** 提案核心能力：同步写入，默认通过 Object.is 判断是否发生变化。 */
    set(value: T): void;
    /** nanshann 扩展：由旧值计算新值，计算完成后经 set() 写入。 */
    update(updater: (current: T) => T): void;
}
export declare function isTracking(): boolean;
export declare function assertWritable(): void;
/**
 * nanshann 扩展，非提案 API；从包入口单独导出。
 * 合并最外层同步批处理的订阅通知，返回回调结果。
 * 写入与读取立即生效；抛错仍会完成通知，不回滚，也不跨 await。
 */
export declare function batch<T>(run: () => T): T;
/**
 * 对应 Signal.subtle.untrack：回调中的读取不加入调用方的依赖。
 * 不解除“计算期间禁止写状态”的框架约束；滥用可能导致派生值保持旧值。
 */
export declare function untrack<T>(run: () => T): T;
/**
 * 对应提案 Signal.State 的基础子集；通过 new Signal.State(value) 使用。
 * 默认 Object.is 判等，对象和数组需更换引用才能触发更新。
 * 尚不支持构造器 options、自定义比较器及 watched/unwatched 回调。
 */
export declare class State<T> implements Writable<T> {
    #private;
    /** 已实现提案的初始值参数；第二个 options 参数未实现。 */
    constructor(initialValue: T);
    /** 已实现：读取当前值；被 Computed 读取时自动登记依赖。 */
    get(): T;
    /** nanshann 扩展：不登记调用方依赖的读取。 */
    peek(): T;
    /** 已实现：同步写入；本框架额外禁止在计算回调内调用。 */
    set(value: T): void;
    /** nanshann 扩展：函数式更新，updater 抛错时不执行本次 set。 */
    update(updater: (current: T) => T): void;
    /** nanshann 扩展：立即发送当前值，后续同步通知，返回释放函数。 */
    subscribe(listener: (value: T) => void): Unsubscribe;
}
/**
 * 对应提案 Signal.Computed 的基础子集；通过 new Signal.Computed(fn) 使用。
 * 已实现惰性缓存、动态依赖、错误缓存和循环读取检测；不提供 set()。
 * 回调必须同步且无副作用；尚未实现 options 和提案的回调 this 绑定。
 */
export declare class Computed<T> implements Readable<T> {
    #private;
    /** 已实现计算函数参数；options 与回调 this 指向公开实例的约定未实现。 */
    constructor(calculate: () => T);
    /** 已实现：按需校验依赖并重算，或返回缓存；计算错误原样重抛。 */
    get(): T;
    /** nanshann 扩展：仍可触发重算，但不会被外层计算记录为依赖。 */
    peek(): T;
    /** nanshann 扩展：观察派生值，最后一个订阅释放后恢复为惰性读取。 */
    subscribe(listener: (value: T) => void): Unsubscribe;
}
/**
 * 当前提案风格入口仅包含 State、Computed、subtle.untrack。
 * 缺失成员的完整清单见文件顶部；这里不放置空实现或未实现 API 的占位符。
 */
export declare const Signal: {
    State: typeof State;
    Computed: typeof Computed;
    subtle: {
        untrack: typeof untrack;
    };
};
