/**
 * Core event listener management.
 * Provides addEventListener/removeEventListener wrappers with cleanup support.
 *
 * @module events/listener
 * @example
 * import { on, off, once } from 'domutils/events/listener';
 *
 * const handler = () => console.log('clicked');
 * on(btn, 'click', handler);
 * off(btn, 'click', handler);
 */

import type { EventHandler } from '../dom/types';

/**
 * Internal registry of event listeners for cleanup.
 * Maps element -> event -> Set of handlers
 */
const listenerRegistry = new WeakMap<
  Element,
  Map<string, Set<{ original: EventHandler; wrapped: EventHandler; options?: AddEventListenerOptions }>>
>();

/**
 * Get or create registry for an element.
 */
function getRegistry(el: Element) {
  if (!listenerRegistry.has(el)) {
    listenerRegistry.set(el, new Map());
  }
  return listenerRegistry.get(el)!;
}

/**
 * Add an event listener to an element.
 * Returns an unsubscribe function.
 *
 * @param el - The target element
 * @param event - Event name (e.g., 'click', 'keydown')
 * @param handler - Event handler function
 * @param options - addEventListener options
 * @returns Unsubscribe function
 *
 * @example
 * const unsubscribe = on(btn, 'click', () => console.log('clicked'));
 * unsubscribe(); // Remove listener
 */
export function on<K extends keyof HTMLElementEventMap>(
  el: Element,
  event: K,
  handler: (ev: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions
): () => void;

export function on(
  el: Element,
  event: string,
  handler: EventHandler,
  options?: AddEventListenerOptions
): () => void;

export function on(
  el: Element,
  event: string,
  handler: EventHandler,
  options?: AddEventListenerOptions
): () => void {
  if (!handler) {
    return () => {};
  }

  el.addEventListener(event, handler as EventListener, options);

  // Track listener for cleanup
  const registry = getRegistry(el);
  if (!registry.has(event)) {
    registry.set(event, new Set());
  }
  registry.get(event)!.add({
    original: handler,
    wrapped: handler as EventHandler,
    options,
  });

  // Return unsubscribe function
  return () => off(el, event, handler);
}

/**
 * Remove an event listener from an element.
 * Can remove specific handler or all handlers for an event.
 *
 * @param el - The target element
 * @param event - Event name (leave undefined to remove all)
 * @param handler - Specific handler to remove (leave undefined to remove all handlers for event)
 *
 * @example
 * off(btn, 'click', handler); // Remove specific handler
 * off(btn, 'click');          // Remove all click handlers
 * off(btn);                   // Remove all listeners
 */
export function off(
  el: Element,
  event?: string,
  handler?: EventHandler
): void {
  const registry = getRegistry(el);

  if (!event) {
    // Remove all listeners from element
    registry.forEach((handlers, eventName) => {
      handlers.forEach(({ wrapped, options }) => {
        el.removeEventListener(eventName, wrapped as EventListener, options);
      });
    });
    registry.clear();
    return;
  }

  if (!registry.has(event)) {
    return;
  }

  const handlers = registry.get(event)!;

  if (!handler) {
    // Remove all handlers for this event
    handlers.forEach(({ wrapped, options }) => {
      el.removeEventListener(event, wrapped as EventListener, options);
    });
    handlers.clear();
    return;
  }

  // Remove specific handler
  let found: { original: EventHandler; wrapped: EventHandler; options?: AddEventListenerOptions } | undefined;
  for (const record of handlers) {
    if (record.original === handler) {
      found = record;
      break;
    }
  }

  if (found) {
    el.removeEventListener(event, found.wrapped as EventListener, found.options);
    handlers.delete(found);
  }
}

/**
 * Add a one-time event listener.
 * Automatically removes itself after first invocation.
 *
 * @param el - The target element
 * @param event - Event name
 * @param handler - Event handler
 * @param options - addEventListener options
 * @returns Unsubscribe function
 *
 * @example
 * once(btn, 'click', () => console.log('Clicked once!'));
 */
export function once<K extends keyof HTMLElementEventMap>(
  el: Element,
  event: K,
  handler: (ev: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions
): () => void;

export function once(
  el: Element,
  event: string,
  handler: EventHandler,
  options?: AddEventListenerOptions
): () => void;

export function once(
  el: Element,
  event: string,
  handler: EventHandler,
  options?: AddEventListenerOptions
): () => void {
  const wrappedHandler: EventHandler = (e: Event) => {
    handler(e);
    off(el, event, wrappedHandler);
  };

  return on(el, event, wrappedHandler, options);
}

/**
 * Add multiple event listeners at once.
 *
 * @param el - The target element
 * @param events - Object with event names as keys and handlers as values
 * @param options - addEventListener options
 * @returns Function to remove all listeners
 *
 * @example
 * const unsubscribe = onMultiple(el, {
 *   'click': () => console.log('click'),
 *   'focus': () => console.log('focus'),
 *   'blur': () => console.log('blur')
 * });
 */
export function onMultiple(
  el: Element,
  events: Record<string, EventHandler>,
  options?: AddEventListenerOptions
): () => void {
  const unsubscribers: Array<() => void> = [];

  Object.entries(events).forEach(([event, handler]) => {
    unsubscribers.push(on(el, event, handler, options));
  });

  return () => unsubscribers.forEach(unsub => unsub());
}

/**
 * Check if an element has a listener for an event.
 *
 * @param el - The target element
 * @param event - Event name
 * @returns True if element has at least one listener for this event
 *
 * @example
 * if (hasListener(btn, 'click')) { // has click handler }
 */
export function hasListener(el: Element, event: string): boolean {
  const registry = getRegistry(el);
  return registry.has(event) && registry.get(event)!.size > 0;
}

/**
 * Get count of listeners for an event.
 *
 * @param el - The target element
 * @param event - Event name
 * @returns Number of listeners
 *
 * @example
 * const count = getListenerCount(btn, 'click');
 */
export function getListenerCount(el: Element, event: string): number {
  const registry = getRegistry(el);
  return registry.has(event) ? registry.get(event)!.size : 0;
}
