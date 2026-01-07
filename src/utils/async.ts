/**
 * Async Utilities
 * Promise and async operation helpers
 *
 * @module utils/async
 * @example
 * import { defer, nextFrame, wait, requestIdle } from 'domutils/utils';
 *
 * await defer(() => heavyOperation());
 * await nextFrame();
 * await wait(1000);
 */

// ============================================================================
// DEFER
// ============================================================================

/**
 * Defer execution to next microtask
 *
 * @example
 * await defer(() => {
 *   console.log('Deferred execution');
 * });
 */
export function defer<T>(fn?: () => T | Promise<T>): Promise<T | void> {
    if (typeof fn !== "function") {
        return Promise.resolve();
    }

    return Promise.resolve().then(() => {
        try {
            return fn();
        } catch (err) {
            setTimeout(() => {
                throw err;
            });
            throw err;
        }
    });
}

// ============================================================================
// FRAME UTILITIES
// ============================================================================

/**
 * Wait for next animation frame
 *
 * @example
 * await nextFrame();
 * // DOM is now updated
 */
export function nextFrame(): Promise<number> {
    return new Promise(resolve => requestAnimationFrame(resolve));
}

/**
 * Wait for specified number of frames
 *
 * @example
 * await waitFrames(3);
 * // 3 frames have passed
 */
export function waitFrames(count: number): Promise<void> {
    return new Promise(async resolve => {
        for (let i = 0; i < count; i++) {
            await nextFrame();
        }
        resolve();
    });
}

// ============================================================================
// WAIT / DELAY
// ============================================================================

/**
 * Wait for specified milliseconds
 *
 * @example
 * await wait(1000);
 * console.log('1 second later');
 */
export function wait(ms: number = 0): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// REQUEST IDLE
// ============================================================================

/**
 * Request idle callback with fallback
 *
 * @example
 * const cancel = requestIdle((deadline) => {
 *   while (deadline.timeRemaining() > 0) {
 *     // Do work
 *   }
 * });
 */
export function requestIdle(
    fn: (deadline: IdleDeadline) => void,
    timeout: number = 200
): () => void {
    if (typeof window.requestIdleCallback === "function") {
        const id = window.requestIdleCallback(fn, { timeout });
        return () => window.cancelIdleCallback(id);
    } else {
        let cancelled = false;
        const id = setTimeout(() => {
            if (!cancelled) {
                fn({
                    didTimeout: true,
                    timeRemaining: () => 0
                } as IdleDeadline);
            }
        }, 0);

        return () => {
            cancelled = true;
            clearTimeout(id);
        };
    }
}

// ============================================================================
// BATCH / QUEUE
// ============================================================================

/**
 * Batch multiple operations into single frame
 *
 * @example
 * const batcher = createBatcher((items) => {
 *   console.log('Batched:', items);
 * });
 *
 * batcher.add(1);
 * batcher.add(2);
 * batcher.add(3);
 * // Next frame: logs "Batched: [1, 2, 3]"
 */
export function createBatcher<T>(
    fn: (items: T[]) => void,
    options: { maxSize?: number; maxWait?: number } = {}
): {
    add: (item: T) => void;
    flush: () => void;
    clear: () => void;
} {
    const { maxSize = Infinity, maxWait = 0 } = options;
    let items: T[] = [];
    let frameId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    function flush(): void {
        if (items.length === 0) return;

        if (frameId !== null) {
            cancelAnimationFrame(frameId);
            frameId = null;
        }

        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }

        const batch = items;
        items = [];
        fn(batch);
    }

    function add(item: T): void {
        items.push(item);

        if (items.length >= maxSize) {
            flush();
            return;
        }

        if (frameId === null) {
            frameId = requestAnimationFrame(flush);
        }

        if (maxWait > 0 && timeoutId === null) {
            timeoutId = setTimeout(flush, maxWait);
        }
    }

    function clear(): void {
        items = [];
        if (frameId !== null) {
            cancelAnimationFrame(frameId);
            frameId = null;
        }
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    }

    return { add, flush, clear };
}

// ============================================================================
// PARALLEL / SERIAL
// ============================================================================

/**
 * Run promises in parallel with concurrency limit
 *
 * @example
 * const urls = ['url1', 'url2', 'url3', ...];
 * const results = await parallel(
 *   urls.map(url => () => fetch(url)),
 *   { concurrency: 3 }
 * );
 */
export async function parallel<T>(
    fns: Array<() => Promise<T>>,
    options: { concurrency?: number } = {}
): Promise<T[]> {
    const { concurrency = Infinity } = options;
    const results: T[] = [];
    const executing: Promise<void>[] = [];

    for (const [index, fn] of fns.entries()) {
        const promise = Promise.resolve().then(async () => {
            results[index] = await fn();
        });

        executing.push(promise);

        if (executing.length >= concurrency) {
            await Promise.race(executing);
            executing.splice(
                executing.findIndex(p => p === promise),
                1
            );
        }
    }

    await Promise.all(executing);
    return results;
}

/**
 * Run promises in series (one after another)
 *
 * @example
 * const results = await series([
 *   () => fetch('url1'),
 *   () => fetch('url2'),
 *   () => fetch('url3')
 * ]);
 */
export async function series<T>(fns: Array<() => Promise<T>>): Promise<T[]> {
    const results: T[] = [];

    for (const fn of fns) {
        results.push(await fn());
    }

    return results;
}

// ============================================================================
// RACE & TIMEOUT
// ============================================================================

/**
 * Race with timeout
 *
 * @example
 * try {
 *   const data = await raceTimeout(
 *     fetch('/api/data'),
 *     5000,
 *     'Request timeout'
 *   );
 * } catch (err) {
 *   console.log('Timed out');
 * }
 */
export function raceTimeout<T>(
    promise: Promise<T>,
    ms: number,
    message: string = "Operation timed out"
): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(message)), ms)
        )
    ]);
}

// ============================================================================
// POLL
// ============================================================================

/**
 * Poll function until condition is met
 *
 * @example
 * const element = await poll(
 *   () => document.querySelector('.dynamic'),
 *   { interval: 100, timeout: 5000 }
 * );
 */
export async function poll<T>(
    fn: () => T | Promise<T>,
    options: {
        interval?: number;
        timeout?: number;
        validate?: (result: T) => boolean;
    } = {}
): Promise<T> {
    const {
        interval = 100,
        timeout = 5000,
        validate = result => !!result
    } = options;

    const startTime = Date.now();

    while (true) {
        const result = await fn();

        if (validate(result)) {
            return result;
        }

        if (Date.now() - startTime >= timeout) {
            throw new Error("Poll timeout");
        }

        await wait(interval);
    }
}

// ============================================================================
// RETRY
// ============================================================================

/**
 * Retry async operation with backoff
 *
 * @example
 * const data = await retry(
 *   () => fetch('/api/data'),
 *   { retries: 3, delay: 1000, backoff: 2 }
 * );
 */
export async function retry<T>(
    fn: () => Promise<T>,
    options: {
        retries?: number;
        delay?: number;
        backoff?: number;
        onRetry?: (error: Error, attempt: number) => void;
    } = {}
): Promise<T> {
    const {
        retries = 3,
        delay: initialDelay = 1000,
        backoff = 2,
        onRetry
    } = options;

    let lastError: Error;

    for (let i = 0; i <= retries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;

            if (i < retries) {
                const delayMs = initialDelay * Math.pow(backoff, i);
                onRetry?.(lastError, i + 1);
                await wait(delayMs);
            }
        }
    }

    throw lastError!;
}

// ============================================================================
// MEMOIZE ASYNC
// ============================================================================

/**
 * Memoize async function
 *
 * @example
 * const fetchUser = memoizeAsync(async (id) => {
 *   return await fetch(`/api/users/${id}`);
 * });
 *
 * const user1 = await fetchUser(1); // Fetches
 * const user2 = await fetchUser(1); // Returns cached
 */
export function memoizeAsync<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    options: {
        ttl?: number;
        maxSize?: number;
        keyFn?: (...args: Parameters<T>) => string;
    } = {}
): T {
    const {
        ttl,
        maxSize = 100,
        keyFn = (...args) => JSON.stringify(args)
    } = options;
    const cache = new Map<string, { value: any; expires?: number }>();

    return (async (...args: Parameters<T>) => {
        const key = keyFn(...args);
        const cached = cache.get(key);

        if (cached) {
            if (!cached.expires || Date.now() < cached.expires) {
                return cached.value;
            }
            cache.delete(key);
        }

        const value = await fn(...args);

        if (cache.size >= maxSize) {
            const firstKey = cache.keys().next().value;
            if (firstKey !== undefined) {
                cache.delete(firstKey);
            }
        }

        cache.set(key, {
            value,
            expires: ttl ? Date.now() + ttl : undefined
        });

        return value;
    }) as T;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    defer,
    nextFrame,
    waitFrames,
    wait,
    requestIdle,
    createBatcher,
    parallel,
    series,
    raceTimeout,
    poll,
    retry,
    memoizeAsync
};
