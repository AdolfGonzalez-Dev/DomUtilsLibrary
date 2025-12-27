/**
 * Events module - Comprehensive event handling utilities.
 *
 * Organized into focused modules:
 * - listener: Core addEventListener/removeEventListener wrappers
 * - delegate: Event delegation with CSS selectors
 * - trigger: Custom event creation and dispatching
 * - helpers: Common event handling patterns
 *
 * @module events
 * @example
 * // Import specific functions
 * import { on, off, once } from 'domutils/events/listener';
 * import { delegate } from 'domutils/events/delegate';
 * import { trigger } from 'domutils/events/trigger';
 *
 * // Or with namespace
 * import * as events from 'domutils/events';
 * events.on(el, 'click', handler);
 *
 * // Or from root
 * import { events } from 'domutils';
 * events.on(el, 'click', handler);
 */

// Core listeners
export {
  on,
  off,
  once,
  onMultiple,
  hasListener,
  getListenerCount,
} from './listener';

// Event delegation
export {
  delegate,
  delegateMultiple,
  delegateWith,
  delegateExact,
  delegateAny,
  undelegate,
} from './delegate';

export type { DelegateConfig, DelegatedEventHandler } from './delegate';

// Custom events
export {
  trigger,
  emit,
  dispatch,
  dispatchMouse,
  dispatchKeyboard,
  dispatchPointer,
  dispatchInput,
  createEventTrigger,
  waitFor,
  waitForAny,
  onceWithTimeout,
} from './trigger';

export type { CustomEventOptions } from './trigger';

// Helpers
export {
  prevent,
  stop,
  stopImmediate,
  handle,
  onHandle,
  debounce,
  throttle,
  onKey,
  onKeys,
  withModifiers,
  onTarget,
  once as onceHelper,
  ignore,
  compose,
  log,
} from './helpers';

// Namespace exports for convenience
export * as listener from './listener';
export * as helpers from './helpers';
