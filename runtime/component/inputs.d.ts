import type { ComponentFields, InputReferences } from './fields.js';
export declare function validateHostFields(definitions: ComponentFields): void;
/** Binding uses this protocol for both registered names and ns-include. */
export declare function writeComponentInput(element: Element, name: string, value: unknown): boolean;
export declare class ComponentInputs {
    private readonly element;
    private readonly report;
    properties: InputReferences;
    attributes: InputReferences;
    private fields?;
    private readonly pending;
    private observer?;
    private syncing;
    private readonly detached;
    constructor(element: HTMLElement, report: (error: unknown) => void);
    write(name: string, value: unknown): void;
    configure(definitions: ComponentFields): void;
    private set;
    private syncAttributes;
    stop(): void;
    dispose(): void;
}
