/**
 * Reactive Signals System
 * Fine-grained reactivity with automatic dependency tracking
 *
 * @module reactive/signals
 * @example
 * import { createSignal, createEffect, createComputed, $state } from 'domutils/reactive';
 *
 * const [count, setCount] = createSignal(0);
 * createEffect(() => console.log('Count:', count()));
 */

// ============================================================================
// TYPES
// ============================================================================

/**
 * Signal tuple: [getter, setter, subscribe]
 */
export type Signal<T> = readonly [
    get: () => T,
    set: (value: T | ((prev: T) => T)) => T,
    subscribe: (fn: () => void) => () => void
];

/**
 * Effect cleanup function
 */
export type EffectCleanup = () => void;

/**
 * Effect function that may return cleanup
 */
export type EffectFn = () => void | EffectCleanup;

/**
 * Computed getter function
 */
export type ComputedGetter<T> = () => T;

/**
 * State change listener
 */
export type StateChangeListener = (
    key: string,
    oldVal: any,
    newVal: any
) => void;

/**
 * Reactive state proxy with utility methods
 */
export interface StateProxy<T extends object> {
    subscribe(fn: StateChangeListener): () => void;
    inspect(): T;
}

/**
 * Internal signal key for dependency tracking
 */
interface SignalKey {
    __subs: Set<() => void>;
}

// ============================================================================
// INTERNAL STATE
// ============================================================================

const EFFECT_STACK: Array<() => void> = [];
const EFFECT_DEPS = new WeakMap<() => void, Set<SignalKey>>();

/**
 * Track dependency between effect runner and signal
 */
function trackDependency(runner: () => void, signalKey: SignalKey): void {
    if (!runner || !signalKey) return;

    if (!signalKey.__subs) {
        signalKey.__subs = new Set();
    }

    signalKey.__subs.add(runner);

    let deps = EFFECT_DEPS.get(runner);
    if (!deps) {
        deps = new Set();
        EFFECT_DEPS.set(runner, deps);
    }
    deps.add(signalKey);
}

// ============================================================================
// CREATE SIGNAL
// ============================================================================

/**
 * Create a reactive signal
 *
 * @param initial - Initial value
 * @returns Tuple of [getter, setter, subscribe]
 *
 * @example
 * const [count, setCount] = createSignal(0);
 *
 * // Get value
 * console.log(count()); // 0
 *
 * // Set value
 * setCount(5);
 *
 * // Update with function
 * setCount(v => v + 1);
 *
 * // Subscribe to changes
 * const unsub = count.subscribe(() => {
 *   console.log('Changed to:', count());
 * });
 */
export function createSignal<T>(initial: T): Signal<T> {
    let value = initial;
    const subs = new Set<() => void>();

    function get(): T {
        const active = EFFECT_STACK[EFFECT_STACK.length - 1];
        if (active) {
            trackDependency(active, get as any);
        }
        return value;
    }

    // Attach __subs for tracking
    (get as any).__subs = subs;

    function set(newVal: T | ((prev: T) => T)): T {
        const old = value;

        if (typeof newVal === "function") {
            value = (newVal as (prev: T) => T)(value);
        } else {
            value = newVal;
        }

        if (old === value) return value;

        // Notify subscribers
        const arr = Array.from(subs);
        arr.forEach(fn => {
            try {
                fn();
            } catch (err) {
                setTimeout(() => {
                    throw err;
                });
            }
        });

        return value;
    }

    function subscribe(fn: () => void): () => void {
        if (typeof fn !== "function") return () => {};
        subs.add(fn);
        return () => subs.delete(fn);
    }

    return [get, set, subscribe] as const;
}

// ============================================================================
// CREATE EFFECT
// ============================================================================

/**
 * Create an effect that automatically tracks dependencies
 *
 * @param fn - Effect function (may return cleanup)
 * @returns Disposer function
 *
 * @example
 * const [count, setCount] = createSignal(0);
 *
 * const dispose = createEffect(() => {
 *   console.log('Count is:', count());
 *
 *   // Optional cleanup
 *   return () => console.log('Cleanup');
 * });
 *
 * setCount(5); // Logs: "Cleanup", "Count is: 5"
 * dispose(); // Stop effect
 */
export function createEffect(fn: EffectFn): () => void {
    if (typeof fn !== "function") {
        throw new Error("createEffect: fn must be a function");
    }

    let cleanup: EffectCleanup | null = null;

    const runner = (): void => {
        // Remove previous subscriptions
        const prevDeps = EFFECT_DEPS.get(runner);
        if (prevDeps) {
            prevDeps.forEach(sigKey => {
                try {
                    sigKey.__subs?.delete(runner);
                } catch (_) {}
            });
            EFFECT_DEPS.delete(runner);
        }

        // Execute previous cleanup
        try {
            if (typeof cleanup === "function") cleanup();
        } catch (err) {
            console.error(err);
        }
        cleanup = null;

        // Run effect and collect dependencies
        EFFECT_STACK.push(runner);
        try {
            const maybeCleanup = fn();
            if (typeof maybeCleanup === "function") {
                cleanup = maybeCleanup;
            }
        } catch (err) {
            console.error("createEffect error", err);
        } finally {
            EFFECT_STACK.pop();
        }
    };

    // Initial run
    runner();

    // Return disposer
    return (): void => {
        const deps = EFFECT_DEPS.get(runner);
        if (deps) {
            deps.forEach(sigKey => {
                try {
                    sigKey.__subs?.delete(runner);
                } catch (_) {}
            });
            EFFECT_DEPS.delete(runner);
        }

        try {
            if (typeof cleanup === "function") cleanup();
        } catch (err) {
            console.error(err);
        }
        cleanup = null;
    };
}

// ============================================================================
// CREATE COMPUTED
// ============================================================================

/**
 * Create a computed value that caches until dependencies change
 *
 * @param fn - Compute function
 * @returns Getter for computed value
 *
 * @example
 * const [items, setItems] = createSignal([1, 2, 3, 4, 5]);
 * const [filter, setFilter] = createSignal(2);
 *
 * const filtered = createComputed(() => {
 *   return items().filter(x => x > filter());
 * });
 *
 * console.log(filtered()); // [3, 4, 5]
 * setFilter(3);
 * console.log(filtered()); // [4, 5]
 */
export function createComputed<T>(fn: () => T): ComputedGetter<T> {
    if (typeof fn !== "function") {
        throw new Error("createComputed: fn must be a function");
    }

    let cached: T;
    let dirty = true;
    let cleanup: EffectCleanup | null = null;

    const recompute = (): void => {
        // Remove prev deps
        const prevDeps = EFFECT_DEPS.get(recompute);
        if (prevDeps) {
            prevDeps.forEach(sigKey => {
                try {
                    sigKey.__subs?.delete(recompute);
                } catch (_) {}
            });
            EFFECT_DEPS.delete(recompute);
        }

        try {
            if (typeof cleanup === "function") cleanup();
        } catch (_) {}
        cleanup = null;

        EFFECT_STACK.push(recompute);
        try {
            const result = fn();
            if (typeof result === "function") {
                cleanup = result as any;
            } else {
                cached = result;
            }
            dirty = false;
        } catch (err) {
            console.error("createComputed error", err);
        } finally {
            EFFECT_STACK.pop();
        }
    };

    // Initial compute
    recompute();

    // Getter
    return (): T => {
        if (dirty) recompute();
        return cached;
    };
}

// ============================================================================
// $STATE - REACTIVE OBJECT
// ============================================================================

const STATE_PROP_SIGNALS = new WeakMap<
    object,
    Map<string | symbol, SignalKey>
>();

function ensurePropSignalFor(target: object, prop: string | symbol): SignalKey {
    let map = STATE_PROP_SIGNALS.get(target);
    if (!map) {
        map = new Map();
        STATE_PROP_SIGNALS.set(target, map);
    }

    let sig = map.get(prop);
    if (!sig) {
        sig = { __subs: new Set() };
        map.set(prop, sig);
    }

    return sig;
}

/**
 * Create a reactive state object
 *
 * @param initial - Initial state object
 * @returns Reactive proxy with subscribe and inspect methods
 *
 * @example
 * const user = $state({
 *   name: 'John',
 *   email: 'john@example.com'
 * });
 *
 * createEffect(() => {
 *   console.log('User name:', user.name);
 * });
 *
 * user.name = 'Jane'; // Effect re-runs
 *
 * // Subscribe to all changes
 * user.subscribe((key, oldVal, newVal) => {
 *   console.log(`${key} changed: ${oldVal} -> ${newVal}`);
 * });
 */
export function $state<T extends object>(initial: T): T & StateProxy<T> {
    const globalSubs = new Set<StateChangeListener>();

    const notifyGlobal = (key: string, oldVal: any, newVal: any): void => {
        globalSubs.forEach(fn => {
            try {
                fn(key, oldVal, newVal);
            } catch (err) {
                console.error(err);
            }
        });
    };

    const handler: ProxyHandler<T> = {
        get(target, prop, receiver) {
            if (prop === "__isState") return true;
            if (prop === "subscribe") {
                return (fn: StateChangeListener) => {
                    globalSubs.add(fn);
                    return () => globalSubs.delete(fn);
                };
            }
            if (prop === "inspect") {
                return () => Object.assign({}, target);
            }

            // Track dependency
            const active = EFFECT_STACK[EFFECT_STACK.length - 1];
            if (active && typeof prop === "string") {
                const sig = ensurePropSignalFor(target, prop);
                trackDependency(active, sig);
            }

            return Reflect.get(target, prop, receiver);
        },

        set(target, prop, value, receiver) {
            const old = (target as any)[prop];
            if (old === value) {
                (target as any)[prop] = value;
                return true;
            }

            const result = Reflect.set(target, prop, value, receiver);

            // Notify property-specific subscribers
            const map = STATE_PROP_SIGNALS.get(target);
            if (map) {
                const sig = map.get(prop);
                if (sig?.__subs) {
                    Array.from(sig.__subs).forEach(runner => {
                        try {
                            runner();
                        } catch (err) {
                            setTimeout(() => {
                                throw err;
                            });
                        }
                    });
                }
            }

            // Notify global subscribers
            notifyGlobal(prop as string, old, value);

            return result;
        },

        deleteProperty(target, prop) {
            const old = (target as any)[prop];
            const existed = prop in target;
            const result = Reflect.deleteProperty(target, prop);

            if (existed) {
                // Notify property-specific subscribers
                const map = STATE_PROP_SIGNALS.get(target);
                if (map) {
                    const sig = map.get(prop);
                    if (sig?.__subs) {
                        Array.from(sig.__subs).forEach(runner => {
                            try {
                                runner();
                            } catch (err) {
                                setTimeout(() => {
                                    throw err;
                                });
                            }
                        });
                    }
                    map.delete(prop);
                }

                // Global subscribers
                notifyGlobal(prop as string, old, undefined);
            }

            return result;
        }
    };

    return new Proxy(Object.assign({}, initial), handler) as T & StateProxy<T>;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    createSignal,
    createEffect,
    createComputed,
    $state
};
