/** 浏览器加载即注册 ns-include / ns-route；Node 中导入不触碰 DOM。 */
export * from './state/index.js';
export { registerBehavior, navigate, createComponent } from './runtime/index.js';
export { property, attribute } from './component/fields.js';
export type { FieldOptions, FieldDefinition, FieldDefinitions, InputReferences, InputsOf } from './component/fields.js';
export type { TemplateElement } from './runtime/index.js';
export type { Behavior, BehaviorContext, BehaviorResult, ResourceContext, RouteContext } from './behavior/types.js';
