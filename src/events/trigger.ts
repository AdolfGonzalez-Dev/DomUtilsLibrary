/**
 * Custom event triggering and dispatching.
 * Utilities for creating and firing custom events.
 *
 * @module events/trigger
 * @example
 * import { trigger, emit } from 'domutils/events/trigger';
 *
 * trigger(el, 'custom-event', { detail: 'hello' });
 * emit(el, 'my-event', { data: 123 });
 */

/**
 * Custom event options.
 */
export interface CustomEventOptions<T = any> {
  /** Event detail data */
  detail?: T;
  /** Whether event should bubble up */
  bubbles?: boolean;
  /** Whether event can be cancelled */
  cancelable?: boolean;
  /** Whether event is composed */
  composed?: boolean;
}

/**
 * Trigger a custom event on an element.
 *
 * @param el - Target element
 * @param eventName - Event name
 * @param options - Event options and detail
 * @returns The dispatched event
 *
 * @example
 * const event = trigger(el, 'custom-event', {
 *   detail: { message: 'hello' },
 *   bubbles: true
 * });
 *
 * // Listen to it
 * on(el, 'custom-event', (e: CustomEvent) => {
 *   console.log(e.detail); // { message: 'hello' }
 * });
 */
export function trigger<T = any>(
  el: Element,
  eventName: string,
  options?: CustomEventOptions<T>
): CustomEvent<T> {
  const { detail, bubbles = true, cancelable = true, composed = false } =
    options || {};

  const event = new CustomEvent(eventName, {
    detail,
    bubbles,
    cancelable,
    composed,
  });

  el.dispatchEvent(event);
  return event;
}

/**
 * Alias for trigger() - shorter name.
 *
 * @param el - Target element
 * @param eventName - Event name
 * @param detail - Event detail data
 * @param options - Additional options
 * @returns The dispatched event
 *
 * @example
 * emit(el, 'user:login', { username: 'john' });
 */
export function emit<T = any>(
  el: Element,
  eventName: string,
  detail?: T,
  options?: Omit<CustomEventOptions, 'detail'>
): CustomEvent<T> {
  return trigger(el, eventName, { detail, ...options });
}

/**
 * Dispatch a native DOM event.
 *
 * @param el - Target element
 * @param eventType - Event type (e.g., 'click', 'change', 'submit')
 * @param options - Event options
 * @returns The dispatched event
 *
 * @example
 * // Simulate a click
 * dispatch(btn, 'click');
 *
 * // Simulate input change
 * dispatch(input, 'change', { bubbles: true });
 */
export function dispatch(
  el: Element,
  eventType: string,
  options?: EventInit
): Event {
  const event = new Event(eventType, {
    bubbles: true,
    cancelable: true,
    ...options,
  });

  el.dispatchEvent(event);
  return event;
}

/**
 * Dispatch a MouseEvent.
 *
 * @param el - Target element
 * @param eventType - Event type (e.g., 'click', 'mousedown', 'mouseover')
 * @param options - MouseEvent options
 * @returns The dispatched event
 *
 * @example
 * dispatchMouse(btn, 'click', {
 *   clientX: 100,
 *   clientY: 200,
 *   buttons: 1
 * });
 */
export function dispatchMouse(
  el: Element,
  eventType: string,
  options?: MouseEventInit
): MouseEvent {
  const event = new MouseEvent(eventType, {
    bubbles: true,
    cancelable: true,
    view: window,
    ...options,
  });

  el.dispatchEvent(event);
  return event;
}

/**
 * Dispatch a keyboard event.
 *
 * @param el - Target element
 * @param eventType - Event type (e.g., 'keydown', 'keyup', 'keypress')
 * @param options - KeyboardEvent options
 * @returns The dispatched event
 *
 * @example
 * dispatchKeyboard(input, 'keydown', {
 *   key: 'Enter',
 *   code: 'Enter',
 *   keyCode: 13
 * });
 */
export function dispatchKeyboard(
  el: Element,
  eventType: string,
  options?: KeyboardEventInit
): KeyboardEvent {
  const event = new KeyboardEvent(eventType, {
    bubbles: true,
    cancelable: true,
    view: window,
    ...options,
  });

  el.dispatchEvent(event);
  return event;
}

/**
 * Dispatch a pointer event.
 *
 * @param el - Target element
 * @param eventType - Event type (e.g., 'pointerdown', 'pointerup', 'pointermove')
 * @param options - PointerEvent options
 * @returns The dispatched event
 *
 * @example
 * dispatchPointer(el, 'pointerdown', {
 *   pointerId: 1,
 *   clientX: 100,
 *   clientY: 200
 * });
 */
export function dispatchPointer(
  el: Element,
  eventType: string,
  options?: PointerEventInit
): PointerEvent {
  const event = new PointerEvent(eventType, {
    bubbles: true,
    cancelable: true,
    view: window,
    ...options,
  });

  el.dispatchEvent(event);
  return event;
}

/**
 * Dispatch an input event.
 * Useful for simulating user input on form elements.
 *
 * @param el - Target element (should be an input, select, or textarea)
 * @param value - New value
 * @param eventType - Event type (default: 'input')
 *
 * @example
 * dispatchInput(input, 'new value');
 *
 * // Or with specific event
 * dispatchInput(select, 'option2', 'change');
 */
export function dispatchInput(
  el: Element,
  value: string,
  eventType: string = 'input'
): Event {
  const input = el as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  input.value = value;

  const event = new Event(eventType, {
    bubbles: true,
    cancelable: true,
  });

  el.dispatchEvent(event);
  return event;
}

/**
 * Create a function that triggers an event when called.
 * Useful for creating event emitters or testing.
 *
 * @param el - Target element
 * @param eventName - Event name
 * @returns Function that triggers the event
 *
 * @example
 * const notifyChange = createEventTrigger(model, 'change');
 * notifyChange({ id: 1, name: 'updated' });
 */
export function createEventTrigger<T = any>(
  el: Element,
  eventName: string
): (detail?: T) => CustomEvent<T> {
  return (detail?: T) => trigger(el, eventName, { detail });
}

/**
 * Wait for an event to fire.
 * Returns a promise that resolves when event fires.
 *
 * @param el - Target element
 * @param eventName - Event name to wait for
 * @param options - Options
 * @returns Promise that resolves with the event
 *
 * @example
 * const event = await waitFor(btn, 'click');
 * console.log('Button was clicked!');
 *
 * // With timeout
 * try {
 *   const event = await waitFor(input, 'change', { timeout: 5000 });
 * } catch {
 *   console.log('Timeout waiting for change event');
 * }
 */
export function waitFor<T extends Event = Event>(
  el: Element,
  eventName: string,
  options?: { timeout?: number }
): Promise<T> {
  return new Promise((resolve, reject) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handler = (event: Event) => {
      if (timeoutId) clearTimeout(timeoutId);
      el.removeEventListener(eventName, handler as EventListener);
      resolve(event as T);
    };

    if (options?.timeout) {
      timeoutId = setTimeout(() => {
        el.removeEventListener(eventName, handler as EventListener);
        reject(new Error(`Timeout waiting for event: ${eventName}`));
      }, options.timeout);
    }

    el.addEventListener(eventName, handler as EventListener);
  });
}

/**
 * Wait for multiple events.
 * Resolves with first event that fires.
 *
 * @param el - Target element
 * @param eventNames - Event names to wait for
 * @param timeout - Optional timeout in milliseconds
 * @returns Promise that resolves with first event fired
 *
 * @example
 * const event = await waitForAny(input, ['blur', 'change']);
 * console.log('Either blur or change was triggered');
 */
export function waitForAny<T extends Event = Event>(
  el: Element,
  eventNames: string[],
  timeout?: number
): Promise<T> {
  return Promise.race(
    eventNames.map(eventName => waitFor<T>(el, eventName, { timeout }))
  );
}

/**
 * Create a once-only event listener that times out.
 *
 * @param el - Target element
 * @param eventName - Event name
 * @param timeout - Timeout in milliseconds
 * @returns Promise that resolves with event or rejects on timeout
 *
 * @example
 * try {
 *   const event = await onceWithTimeout(btn, 'click', 3000);
 *   console.log('Clicked within 3 seconds');
 * } catch {
 *   console.log('No click within 3 seconds');
 * }
 */
export function onceWithTimeout<T extends Event = Event>(
  el: Element,
  eventName: string,
  timeout: number = 5000
): Promise<T> {
  return waitFor<T>(el, eventName, { timeout });
}
