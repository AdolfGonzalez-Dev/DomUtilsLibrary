// src/index.js (TEMPORAL)
// Entry point temporal durante migración

// DOM (nuevos)
export * from './dom/query.js';
export * from './dom/class.js';
export * from './dom/attr.js';
export * from './dom/style.js';

// Events (nuevos)
export * from './events/listener.js';
export * from './events/delegate.js';
export * from './events/trigger.js';
export * from './events/helpers.js';

// Traverse (nuevo)
export * from './traverse/index.js';

// Content (nuevo)
export * from './content/index.js';

// Create (nuevo)
export * from './create/index.js';

// Reactive (migrar después)
export * from './reactive/signals.js';

// Form (migrar después)
export * from './form/index.js';

// Components (migrar después)
export { Modal } from './modules/modal.js';
export { Tabs } from './modules/tabs.js';
export { Tooltip } from './modules/tooltip.js';

// Utils
export * from './utils/storage.js';
export * from './utils/utils.js';

// Gestures & Observers
export * from './gestures/index.js';
export * from './observers/index.js';

// Ajax
export * from './modules/ajax.js';

// Namespace exports
export * as dom from './dom/index.js';
export * as events from './events/index.js';
export * as traverse from './traverse/index.js';
export * as content from './content/index.js';
export * as create from './create/index.js';

// Metadata
export const version = '0.5.0';