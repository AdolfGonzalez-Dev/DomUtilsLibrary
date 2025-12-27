/**
 * DOMUtils Library v0.4.0
 * @packageDocumentation
 */

// 1. NAMESPACE EXPORTS (import * as domutils)
export * as dom from './dom';
export * as events from './events';
export * as traverse from './traverse';
export * as content from './content';
export * as create from './create';
export * as reactive from './reactive';
export * as form from './form';
export * as gestures from './gestures';
export * as observers from './observers';
export * as storage from './utils/storage';
export * as utils from './utils/utils';

// 2. NAMED EXPORTS (Tree Shaking)
export * from './dom/query';
export * from './dom/class';
export * from './dom/attr';
export * from './dom/style';
export * from './events/listener';
export * from './events/delegate';
export * from './events/trigger';
export * from './traverse';
export * from './content';
export * from './create';
export * from './reactive/signals';
export * from './form/Form';
export * from './observers';
export * from './gestures';
export * from './utils/storage';
export * from './utils/utils';

// 3. TYPE EXPORTS
export type { QuerySelector } from './dom/query';
export type { EventListenerOptions } from './events/listener';
export type { DelegateOptions } from './events/delegate';
export type { Signal, Effect, Computed } from './reactive/signals';
export type { FormConfig, FormField } from './form/Form';
export type { ObserverOptions } from './observers';
export type { GestureOptions } from './gestures';

// 4. METADATA
export const version = '0.4.0';
export const metadata = {
  name: 'DOMUtils',
  version,
  author: 'AdolfDigitalDeveloper',
  repository: 'github.com',
  license: 'MIT'
} as const;

// 5. DEFAULT EXPORT
import * as all from './index';
export default all;
