import type { ContentContext, ManagedResource } from '../runtime/context.js';
export interface RouteCandidate {
    readonly element: Element;
    readonly context: ContentContext;
    readonly activate: (context: ContentContext) => void;
    readonly content: ManagedResource;
}
/** 每个逻辑父路由拥有一组；普通 include 沿用本组，并为异步候选收集登记占用。 */
export declare class RouteGroup implements ManagedResource {
    readonly depth: number;
    private offset;
    private parentParams;
    private location;
    private report;
    private entries;
    private holds;
    private selected?;
    private disposed;
    private queued;
    constructor(depth: number, offset: number, parentParams: Readonly<Record<string, string>>, location: () => URL, report: (error: unknown) => void);
    hold(): {
        settle(): void;
        fail(): void;
        release(): void;
    };
    register(candidate: RouteCandidate): ManagedResource;
    schedule(): void;
    private choose;
    private reconcile;
    private clear;
    stopBindings(): void;
    dispose(): void;
}
