import type { Readable } from '../state/signal.js';
export interface FieldOptions {
    readonly reflect?: boolean;
}
declare const fieldBrand: unique symbol;
/** Shared input metadata. Signals are created separately for each component instance. */
export interface FieldDefinition<T = unknown> {
    readonly [fieldBrand]: true;
    readonly kind: 'property' | 'attribute';
    readonly defaultValue: T;
    readonly reflect: boolean;
}
export type FieldDefinitions = Readonly<Record<string, FieldDefinition>>;
export type InputReferences = Readonly<Record<string, Readable<unknown>>>;
export type InputsOf<Fields extends FieldDefinitions> = {
    readonly [Key in keyof Fields]: Readable<Fields[Key]['defaultValue']>;
};
export declare function property<T>(defaultValue: T, options?: FieldOptions): FieldDefinition<T>;
export declare function attribute(defaultValue: string, options?: FieldOptions): FieldDefinition<string>;
export declare function attribute(defaultValue: number, options?: FieldOptions): FieldDefinition<number>;
export declare function attribute(defaultValue: boolean, options?: FieldOptions): FieldDefinition<boolean>;
export declare function attribute(defaultValue: string | number | boolean, options?: FieldOptions): FieldDefinition<string | number | boolean>;
export interface ComponentFields {
    readonly properties: FieldDefinitions;
    readonly attributes: FieldDefinitions;
}
export declare const emptyFields: ComponentFields;
export declare const emptyInputs: InputReferences;
/** Snapshot metadata once, before any Behavior invocation. */
export declare function readComponentFields(behavior: {
    properties?: FieldDefinitions;
    attributes?: FieldDefinitions;
} | undefined): ComponentFields;
export declare function initialValue(definition: FieldDefinition): unknown;
export declare function parseAttribute(definition: FieldDefinition, value: string | null): unknown;
export declare function serializeAttribute(definition: FieldDefinition, value: unknown): string | null;
export {};
