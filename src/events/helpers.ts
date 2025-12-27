/**
 * Event helper utilities.
 * Utilities for common event handling patterns.
 *
 * @module events/helpers
 * @example
 * import { prevent, stop, handle } from 'domutils/events/helpers';
 *
 * on(el, 'click', prevent());
 * on(el, 'click', handle(callback));
 */

import type { EventHandler } from '../dom/types';
import { on } from './listener';

/**
 * Create a handler that prevents default action.
 *
 * @param handler - Optional additional handler to call
 * @returns Event handler
 *
 * @example
 * on(form, 'submit', prevent());
 * on(link, 'click', prevent((e) => console.log('prevented')));
 */
export function prevent(handler?: EventHandler): EventHandler {
  return (e: Event) => {
    e.preventDefault();
    handler?.(e);
  };
}

/**
 * Create a handler that stops propagation.
 *
 * @param handler - Optional additional handler to call
 * @returns Event handler
 *
 * @example
 * on(el, 'click', stop());
 * on(el, 'click', stop((e) => console.log('stopped')));
 */
export function stop(handler?: EventHandler): EventHandler {
  return (e: Event) => {
    e.stopPropagation();
    handler?.(e);
  };
}

/**
 * Create a handler that stops immediate propagation.
 *
 * @param handler - Optional additional handler to call
 * @returns Event handler
 *
 * @example
 * on(el, 'click', stopImmediate());
 */
export function stopImmediate(handler?: EventHandler): EventHandler {
  return (e: Event) => {
    e.stopImmediatePropagation();
    handler?.(e);
  };
}

/**
 * Create a handler that both prevents default and stops propagation.
 * Equivalent to: prevent() + stop()
 *
 * @param handler - Optional additional handler to call
 * @returns Event handler
 *
 * @example
 * on(link, 'click', handle());
 * on(form, 'submit', handle((e) => console.log('handled')));
 */
export function handle(handler?: EventHandler): EventHandler {
  return (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    handler?.(e);
  };
}

/**
 * Attach a handler with prevent/stop built-in.
 * Shorthand for: on(el, event, prevent(stop(handler)))
 *
 * @param el - Target element
 * @param event - Event name
 * @param handler - Event handler
 * @param options - addEventListener options
 * @returns Unsubscribe function
 *
 * @example
 * onHandle(form, 'submit', (e) => {
 *   // e.preventDefault() and e.stopPropagation() already called
 *   console.log('Form submitted');
 * });
 */
export function onHandle(
  el: Element,
  event: string,
  handler: EventHandler,
  options?: AddEventListenerOptions
): () => void {
  return on(el, event, handle(handler), options);
}

/**
 * Create a debounced event handler.
 * Handler is called only after event stops firing for a delay.
 *
 * @param handler - Event handler
 * @param delay - Delay in milliseconds
 * @returns Debounced event handler
 *
 * @example
 * on(input, 'input', debounce((e) => {
 *   console.log('User stopped typing');
 * }, 300));
 */
export function debounce(handler: EventHandler, delay: number = 300): EventHandler {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (e: Event) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      handler(e);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Create a throttled event handler.
 * Handler is called at most once per delay period.
 *
 * @param handler - Event handler
 * @param delay - Delay in milliseconds
 * @returns Throttled event handler
 *
 * @example
 * on(window, 'scroll', throttle((e) => {
 *   console.log('Scroll position:', window.scrollY);
 * }, 100));
 */
export function throttle(handler: EventHandler, delay: number = 300): EventHandler {
  let lastCallTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (e: Event) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;

    if (timeSinceLastCall >= delay) {
      handler(e);
      lastCallTime = now;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handler(e);
        lastCallTime = Date.now();
      }, delay - timeSinceLastCall);
    }
  };
}

/**
 * Create an event handler that only fires for a specific key.
 *
 * @param key - Key name (e.g., 'Enter', 'Escape', 'ArrowUp')
 * @param handler - Event handler
 * @returns Keyboard event handler
 *
 * @example
 * on(input, 'keydown', onKey('Enter', (e) => {
 *   console.log('Enter pressed');
 * }));
 */
export function onKey(key: string, handler: EventHandler): EventHandler {
  return (e: Event) => {
    const keyEvent = e as KeyboardEvent;
    if (keyEvent.key === key) {
      handler(e);
    }
  };
}

/**
 * Create an event handler that fires for multiple keys.
 *
 * @param keys - Array of key names
 * @param handler - Event handler
 * @returns Keyboard event handler
 *
 * @example
 * on(input, 'keydown', onKeys(['Enter', 'Tab'], (e) => {
 *   console.log('Enter or Tab pressed');
 * }));
 */
export function onKeys(keys: string[], handler: EventHandler): EventHandler {
  return (e: Event) => {
    const keyEvent = e as KeyboardEvent;
    if (keys.includes(keyEvent.key)) {
      handler(e);
    }
  };
}

/**
 * Create an event handler that checks for keyboard modifiers.
 *
 * @param handler - Event handler
 * @param modifiers - Modifiers to require (e.g., { ctrlKey: true })
 * @returns Event handler
 *
 * @example
 * on(window, 'keydown', withModifiers((e) => {
 *   console.log('Ctrl+S pressed');
 * }, { ctrlKey: true, key: 'S' }));
 */
export function withModifiers(
  handler: EventHandler,
  modifiers: Partial<KeyboardEvent>
): EventHandler {
  return (e: Event) => {
    const keyEvent = e as KeyboardEvent;
    const matches = Object.entries(modifiers).every(([key, value]) => {
      return (keyEvent as any)[key] === value;
    });

    if (matches) {
      handler(e);
    }
  };
}

/**
 * Create an event handler that only fires when target matches selector.
 *
 * @param selector - CSS selector
 * @param handler - Event handler
 * @returns Event handler
 *
 * @example
 * on(container, 'click', onTarget('.button', (e) => {
 *   console.log('Button clicked');
 * }));
 */
export function onTarget(selector: string, handler: EventHandler): EventHandler {
  return (e: Event) => {
    const target = e.target as Element;
    if (target?.matches?.(selector)) {
      handler(e);
    }
  };
}

/**
 * Create an event handler that only fires once.
 * Removes itself after first invocation.
 *
 * @param handler - Event handler
 * @returns Event handler
 *
 * @example
 * on(btn, 'click', once((e) => {
 *   console.log('Clicked once');
 * }));
 */
export function once(handler: EventHandler): EventHandler & { _once?: boolean } {
  let called = false;
  const wrapper = (e: Event) => {
    if (!called) {
      called = true;
      handler(e);
    }
  };
  wrapper._once = true;
  return wrapper;
}

/**
 * Create an event handler that ignores events for a specified duration.
 * Useful for preventing accidental double-clicks.
 *
 * @param handler - Event handler
 * @param duration - Duration in milliseconds
 * @returns Event handler
 *
 * @example
 * on(submitBtn, 'click', ignore((e) => {
 *   submit();
 * }, 1000)); // Allow only 1 submit per second
 */
export function ignore(handler: EventHandler, duration: number = 300): EventHandler {
  let lastCallTime = 0;

  return (e: Event) => {
    const now = Date.now();
    if (now - lastCallTime >= duration) {
      lastCallTime = now;
      handler(e);
    }
  };
}

/**
 * Compose multiple handlers into one.
 * Handlers are called in order.
 *
 * @param handlers - Array of event handlers
 * @returns Composed event handler
 *
 * @example
 * on(el, 'click', compose([
 *   prevent(),
 *   stop(),
 *   (e) => console.log('clicked')
 * ]));
 */
export function compose(...handlers: EventHandler[]): EventHandler {
  return (e: Event) => {
    handlers.forEach(handler => handler(e));
  };
}

/**
 * Create a handler that logs the event.
 * Useful for debugging.
 *
 * @param label - Optional label for the log
 * @param handler - Optional additional handler
 * @returns Event handler
 *
 * @example
 * on(el, 'click', log('Button clicked'));
 * on(el, 'click', log('Button:', (e) => console.log(e)));
 */
export function log(label: string = '', handler?: EventHandler): EventHandler {
  return (e: Event) => {
    console.log(label, e);
    handler?.(e);
  };
}
