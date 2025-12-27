/**
 * Event delegation helpers.
 * Efficiently handle events on multiple elements using a single listener.
 *
 * @module events/delegate
 * @example
 * import { delegate, delegateMultiple } from 'domutils/events/delegate';
 *
 * delegate(container, '.button', 'click', (e, el) => {
 *   console.log('Button clicked:', el);
 * });
 */

import type { EventHandler } from '../dom/types';
import { on, off } from './listener';

/**
 * Event delegation configuration.
 */
export interface DelegateConfig {
  /** Stop event propagation */
  stopPropagation?: boolean;
  /** Prevent default action */
  preventDefault?: boolean;
  /** Stop propagation and prevent default */
  stopImmediatePropagation?: boolean;
}

/**
 * Delegated event handler callback.
 */
export type DelegatedEventHandler<E extends Event = Event> = (
  event: E,
  delegateTarget: Element
) => void;

/**
 * Set up event delegation using a CSS selector.
 * Attach a listener to a parent element that matches child elements by selector.
 *
 * @param root - The parent/root element to attach listener to
 * @param selector - CSS selector for target elements
 * @param event - Event name
 * @param handler - Handler function
 * @param options - Configuration options
 * @returns Unsubscribe function
 *
 * @example
 * const unsubscribe = delegate(container, '.button', 'click', (e, btn) => {
 *   console.log('Button clicked:', btn);
 * });
 *
 * // With options
 * delegate(container, '.button', 'click', handler, {
 *   stopPropagation: true,
 *   preventDefault: true
 * });
 */
export function delegate(
  root: Element,
  selector: string,
  event: string,
  handler: DelegatedEventHandler,
  options?: DelegateConfig | AddEventListenerOptions
): () => void {
  const delegateConfig = options as DelegateConfig | undefined;
  const listenerOptions = (
    typeof options === 'object' && 'capture' in options
      ? options
      : undefined
  ) as AddEventListenerOptions | undefined;

  const wrappedHandler = (e: Event) => {
    const target = e.target as Element;

    // Walk up the DOM tree to find matching element
    let delegateTarget = target.closest(selector);

    // Ensure we stay within root
    if (delegateTarget && root.contains(delegateTarget)) {
      if (delegateConfig?.preventDefault) {
        e.preventDefault();
      }
      if (delegateConfig?.stopPropagation) {
        e.stopPropagation();
      }
      if (delegateConfig?.stopImmediatePropagation) {
        e.stopImmediatePropagation();
      }

      handler(e, delegateTarget);
    }
  };

  return on(root, event, wrappedHandler as EventHandler, listenerOptions);
}

/**
 * Set up multiple delegated event handlers at once.
 *
 * @param root - The parent/root element
 * @param handlers - Object mapping selectors to handler functions
 * @param event - Event name
 * @param options - Configuration options
 * @returns Unsubscribe function
 *
 * @example
 * const unsubscribe = delegateMultiple(container, {
 *   '.button': (e, btn) => console.log('Button:', btn),
 *   '.link': (e, link) => console.log('Link:', link),
 *   '[data-action]': (e, el) => console.log('Action:', el)
 * }, 'click');
 */
export function delegateMultiple(
  root: Element,
  handlers: Record<string, DelegatedEventHandler>,
  event: string,
  options?: DelegateConfig | AddEventListenerOptions
): () => void {
  const unsubscribers: Array<() => void> = [];

  Object.entries(handlers).forEach(([selector, handler]) => {
    unsubscribers.push(delegate(root, selector, event, handler, options));
  });

  return () => unsubscribers.forEach(unsub => unsub());
}

/**
 * Set up event delegation with pattern matching.
 * More flexible than selector-based delegation.
 *
 * @param root - The parent/root element
 * @param event - Event name
 * @param predicate - Function to test if element should handle event
 * @param handler - Handler function
 * @returns Unsubscribe function
 *
 * @example
 * delegateWith(container, 'click', (el) => {
 *   return el.classList.contains('clickable') && !el.disabled;
 * }, (e, el) => {
 *   console.log('Handled:', el);
 * });
 */
export function delegateWith(
  root: Element,
  event: string,
  predicate: (el: Element) => boolean,
  handler: DelegatedEventHandler,
  options?: AddEventListenerOptions
): () => void {
  const wrappedHandler = (e: Event) => {
    let target = e.target as Element;

    while (target && target !== root) {
      if (predicate(target)) {
        handler(e, target);
        break;
      }
      target = target.parentElement!;
    }
  };

  return on(root, event, wrappedHandler as EventHandler, options);
}

/**
 * Set up event delegation for a specific element.
 * Handler fires only when that exact element is clicked.
 *
 * @param element - The element to listen for
 * @param event - Event name
 * @param handler - Handler function
 * @returns Unsubscribe function
 *
 * @example
 * delegateExact(btn, 'click', (e) => {
 *   console.log('Exact button clicked');
 * });
 */
export function delegateExact(
  element: Element,
  event: string,
  handler: EventHandler,
  options?: AddEventListenerOptions
): () => void {
  return delegateWith(
    element.parentElement || document.body,
    event,
    (el) => el === element,
    handler as DelegatedEventHandler,
    options
  );
}

/**
 * Create a delegated event handler that matches multiple selectors.
 * Returns a single handler that can be attached and detached.
 *
 * @param root - The parent element
 * @param selectors - Array of CSS selectors to match
 * @param event - Event name
 * @param handler - Single handler for all matched elements
 * @returns Unsubscribe function
 *
 * @example
 * const unsub = delegateAny(
 *   container,
 *   ['.button', '.link', '[role="button"]'],
 *   'click',
 *   (e, el) => console.log('Element clicked:', el)
 * );
 */
export function delegateAny(
  root: Element,
  selectors: string[],
  event: string,
  handler: DelegatedEventHandler,
  options?: DelegateConfig | AddEventListenerOptions
): () => void {
  return delegateWith(
    root,
    event,
    (el) => selectors.some(selector => el.matches(selector)),
    handler,
    options as AddEventListenerOptions
  );
}

/**
 * Detach event delegation.
 * Note: Must provide same root and handler as original delegate() call.
 *
 * @param root - The parent element
 * @param event - Event name
 * @param handler - The original handler
 *
 * @example
 * const handler = (e, el) => { // ... };
 * const unsub = delegate(root, '.btn', 'click', handler);
 * undelegate(root, 'click', handler);
 */
export function undelegate(
  root: Element,
  event: string,
  handler?: EventHandler
): void {
  off(root, event, handler);
}
