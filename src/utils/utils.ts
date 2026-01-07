/**
 * Utils Module - Barrel Export
 * Complete utility functions collection
 *
 * @module utils
 * @example
 * import * as utils from 'domutils/utils';
 * import { debounce, clamp, isString } from 'domutils/utils';
 */

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * No-op function (does nothing)
 */
export function noop(): void {}

/**
 * Identity function (returns input)
 */
export function identity<T>(value: T): T {
    return value;
}

/**
 * Compose functions (right to left)
 *
 * @example
 * const addThenMultiply = compose(
 *   x => x * 2,
 *   x => x + 10
 * );
 * addThenMultiply(5); // (5 + 10) * 2 = 30
 */
export function compose<T>(...fns: Array<(x: T) => T>): (x: T) => T {
    return (x: T) => fns.reduceRight((v, f) => f(v), x);
}

/**
 * Pipe functions (left to right)
 *
 * @example
 * const addThenMultiply = pipe(
 *   x => x + 10,
 *   x => x * 2
 * );
 * addThenMultiply(5); // (5 + 10) * 2 = 30
 */
export function pipe<T>(...fns: Array<(x: T) => T>): (x: T) => T {
    return (x: T) => fns.reduce((v, f) => f(v), x);
}

/**
 * Memoize function (cache results)
 *
 * @example
 * const expensiveFn = memoize((n) => {
 *   // Heavy computation
 *   return n * 2;
 * });
 */
export function memoize<T extends (...args: any[]) => any>(
    fn: T,
    options: {
        maxSize?: number;
        keyFn?: (...args: Parameters<T>) => string;
    } = {}
): T {
    const { maxSize = 100, keyFn = (...args) => JSON.stringify(args) } =
        options;
    const cache = new Map<string, ReturnType<T>>();

    return ((...args: Parameters<T>) => {
        const key = keyFn(...args);

        if (cache.has(key)) {
            return cache.get(key);
        }

        const result = fn(...args);

        if (cache.size >= maxSize) {
            const firstKey = cache.keys().next().value;
            if (firstKey !== undefined) {
                cache.delete(firstKey);
            }
        }

        cache.set(key, result);
        return result;
    }) as T;
}

/**
 * Once - run function only once
 *
 * @example
 * const init = once(() => {
 *   console.log('Initialized');
 * });
 *
 * init(); // Logs "Initialized"
 * init(); // Does nothing
 */
export function once<T extends (...args: any[]) => any>(fn: T): T {
    let called = false;
    let result: ReturnType<T>;

    return ((...args: Parameters<T>) => {
        if (!called) {
            called = true;
            result = fn(...args);
        }
        return result;
    }) as T;
}

// ============================================================================
// RE-EXPORTS
// ============================================================================

export * from "./type";
export * from "./math";

// Export from time (includes debounce, throttle, delay, etc)
export {
    debounce,
    throttle,
    delay,
    timeout,
    interval,
    measureTime
} from "./time";

// Export from async
export {
    defer,
    nextFrame,
    waitFrames,
    requestIdle,
    createBatcher,
    parallel,
    series,
    raceTimeout,
    poll,
    memoizeAsync
} from "./async";

// Re-export retry and wait with aliases to avoid conflicts
export { retry as retryAsync, wait as waitAsync } from "./async";
export { retry as retryTime, wait as waitTime } from "./time";

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
    noop,
    identity,
    compose,
    pipe,
    memoize,
    once
};
