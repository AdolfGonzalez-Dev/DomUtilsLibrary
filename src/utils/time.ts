/**
 * Time Utilities
 * Debounce, throttle, and timing helpers
 *
 * @module utils/time
 * @example
 * import { debounce, throttle } from 'domutils/utils';
 *
 * const search = debounce((query) => api.search(query), 300);
 * const onScroll = throttle(() => updateUI(), 100);
 */

// ============================================================================
// TYPES
// ============================================================================

type AnyFunction = (...args: any[]) => any;
type DebounceOptions = {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
};

// ============================================================================
// DEBOUNCE
// ============================================================================

/**
 * Debounce function - delays execution until after wait time has elapsed
 *
 * @param fn - Function to debounce
 * @param wait - Wait time in milliseconds
 * @param options - Options (leading, trailing, maxWait)
 * @returns Debounced function
 *
 * @example
 * const search = debounce((query) => {
 *   api.search(query);
 * }, 300);
 *
 * input.addEventListener('input', (e) => search(e.target.value));
 */
export function debounce<T extends AnyFunction>(
    fn: T,
    wait: number = 100,
    options: DebounceOptions = {}
): T & { cancel: () => void; flush: () => void } {
    const { leading = false, trailing = true, maxWait } = options;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastCallTime: number = 0;
    let lastInvokeTime: number = 0;
    let lastArgs: any[] | null = null;
    let lastThis: any = null;
    let result: any;

    function invokeFunc(time: number): any {
        const args = lastArgs!;
        const thisArg = lastThis;

        lastArgs = null;
        lastThis = null;
        lastInvokeTime = time;
        result = fn.apply(thisArg, args);
        return result;
    }

    function leadingEdge(time: number): any {
        lastInvokeTime = time;
        timeoutId = setTimeout(timerExpired, wait);
        return leading ? invokeFunc(time) : result;
    }

    function remainingWait(time: number): number {
        const timeSinceLastCall = time - lastCallTime;
        const timeSinceLastInvoke = time - lastInvokeTime;
        const timeWaiting = wait - timeSinceLastCall;

        return maxWait !== undefined
            ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
            : timeWaiting;
    }

    function shouldInvoke(time: number): boolean {
        const timeSinceLastCall = time - lastCallTime;
        const timeSinceLastInvoke = time - lastInvokeTime;

        return (
            lastCallTime === 0 ||
            timeSinceLastCall >= wait ||
            timeSinceLastCall < 0 ||
            (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
        );
    }

    function timerExpired(): void {
        const time = Date.now();
        if (shouldInvoke(time)) {
            trailingEdge(time);
        } else {
            timeoutId = setTimeout(timerExpired, remainingWait(time));
        }
    }

    function trailingEdge(time: number): any {
        timeoutId = null;

        if (trailing && lastArgs) {
            return invokeFunc(time);
        }
        lastArgs = null;
        lastThis = null;
        return result;
    }

    function cancel(): void {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        lastInvokeTime = 0;
        lastArgs = null;
        lastCallTime = 0;
        lastThis = null;
        timeoutId = null;
    }

    function flush(): any {
        return timeoutId === null ? result : trailingEdge(Date.now());
    }

    function debounced(this: any, ...args: any[]): any {
        const time = Date.now();
        const isInvoking = shouldInvoke(time);

        lastArgs = args;
        lastThis = this;
        lastCallTime = time;

        if (isInvoking) {
            if (timeoutId === null) {
                return leadingEdge(lastCallTime);
            }
            if (maxWait !== undefined) {
                timeoutId = setTimeout(timerExpired, wait);
                return invokeFunc(lastCallTime);
            }
        }

        if (timeoutId === null) {
            timeoutId = setTimeout(timerExpired, wait);
        }

        return result;
    }

    debounced.cancel = cancel;
    debounced.flush = flush;

    return debounced as T & { cancel: () => void; flush: () => void };
}

// ============================================================================
// THROTTLE
// ============================================================================

/**
 * Throttle function - limits execution to once per wait period
 *
 * @param fn - Function to throttle
 * @param wait - Wait time in milliseconds
 * @param options - Options (leading, trailing)
 * @returns Throttled function
 *
 * @example
 * const onScroll = throttle(() => {
 *   updateScrollPosition();
 * }, 100);
 *
 * window.addEventListener('scroll', onScroll);
 */
export function throttle<T extends AnyFunction>(
    fn: T,
    wait: number = 100,
    options: { leading?: boolean; trailing?: boolean } = {}
): T & { cancel: () => void; flush: () => void } {
    const { leading = true, trailing = true } = options;

    return debounce(fn, wait, {
        leading,
        trailing,
        maxWait: wait
    });
}

// ============================================================================
// DELAY
// ============================================================================

/**
 * Delay execution by specified milliseconds
 *
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after delay
 *
 * @example
 * await delay(1000);
 * console.log('1 second later');
 */
export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Alias for delay
 */
export const wait = delay;

// ============================================================================
// TIMEOUT
// ============================================================================

/**
 * Run function with timeout
 *
 * @param fn - Function to run
 * @param ms - Timeout in milliseconds
 * @returns Promise that rejects if timeout
 *
 * @example
 * try {
 *   await timeout(fetchData(), 5000);
 * } catch {
 *   console.log('Timeout!');
 * }
 */
export function timeout<T>(
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
// INTERVAL
// ============================================================================

/**
 * Run function at interval with cleanup
 *
 * @param fn - Function to run
 * @param ms - Interval in milliseconds
 * @returns Cleanup function
 *
 * @example
 * const stop = interval(() => {
 *   console.log('Tick');
 * }, 1000);
 *
 * // Later: stop();
 */
export function interval(fn: () => void, ms: number): () => void {
    const id = setInterval(fn, ms);
    return () => clearInterval(id);
}

// ============================================================================
// RETRY
// ============================================================================

/**
 * Retry function with exponential backoff
 *
 * @param fn - Function to retry
 * @param options - Retry options
 * @returns Promise with result or final error
 *
 * @example
 * const data = await retry(
 *   () => fetch('/api/data'),
 *   { retries: 3, delay: 1000 }
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
                await delay(delayMs);
            }
        }
    }

    throw lastError!;
}

// ============================================================================
// MEASURE TIME
// ============================================================================

/**
 * Measure execution time of function
 *
 * @param fn - Function to measure
 * @returns Object with result and duration
 *
 * @example
 * const { result, duration } = await measureTime(async () => {
 *   return await fetchData();
 * });
 * console.log(`Took ${duration}ms`);
 */
export async function measureTime<T>(
    fn: () => T | Promise<T>
): Promise<{ result: T; duration: number }> {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;

    return { result, duration };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    debounce,
    throttle,
    delay,
    wait,
    timeout,
    interval,
    retry,
    measureTime
};
