/**
 * Touch & Pointer Utilities
 * Helpers for touch and pointer events
 *
 * @module gestures/touch
 * @example
 * import { getPoint, getX, getY, addPointerDown } from 'domutils/gestures';
 *
 * element.addEventListener('touchstart', (e) => {
 *   const point = getPoint(e);
 *   console.log(point.x, point.y);
 * });
 */

// ============================================================================
// TYPES
// ============================================================================

export interface Point {
    x: number;
    y: number;
}

type PointerLikeEvent = MouseEvent | TouchEvent | PointerEvent;

// ============================================================================
// GET POINT
// ============================================================================

/**
 * Get x,y coordinates from mouse/touch/pointer event
 *
 * @param e - Event (mouse, touch, or pointer)
 * @returns Point with x and y coordinates
 *
 * @example
 * element.addEventListener('touchstart', (e) => {
 *   const point = getPoint(e);
 *   console.log(`Touch at ${point.x}, ${point.y}`);
 * });
 */
export function getPoint(e: PointerLikeEvent | null | undefined): Point {
    if (!e) return { x: 0, y: 0 };

    // Touch event
    if ("touches" in e && e.touches && e.touches[0]) {
        return {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    }

    // Changed touches (touchend)
    if ("changedTouches" in e && e.changedTouches && e.changedTouches[0]) {
        return {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY
        };
    }

    // Mouse/Pointer event
    if ("clientX" in e && "clientY" in e) {
        return {
            x: e.clientX ?? 0,
            y: e.clientY ?? 0
        };
    }

    return { x: 0, y: 0 };
}

/**
 * Get X coordinate from event
 *
 * @param e - Event
 * @returns X coordinate
 *
 * @example
 * const x = getX(event);
 */
export function getX(e: PointerLikeEvent | null | undefined): number {
    return getPoint(e).x;
}

/**
 * Get Y coordinate from event
 *
 * @param e - Event
 * @returns Y coordinate
 *
 * @example
 * const y = getY(event);
 */
export function getY(e: PointerLikeEvent | null | undefined): number {
    return getPoint(e).y;
}

// ============================================================================
// GET MULTIPLE POINTS
// ============================================================================

/**
 * Get all touch points from event
 *
 * @param e - Touch event
 * @returns Array of points
 *
 * @example
 * const points = getAllPoints(touchEvent);
 * console.log(`${points.length} fingers`);
 */
export function getAllPoints(e: TouchEvent): Point[] {
    if (!e.touches) return [];

    return Array.from(e.touches).map(touch => ({
        x: touch.clientX,
        y: touch.clientY
    }));
}

/**
 * Get distance between two touch points
 *
 * @param e - Touch event
 * @returns Distance or 0 if less than 2 touches
 *
 * @example
 * const distance = getTouchDistance(touchEvent);
 */
export function getTouchDistance(e: TouchEvent): number {
    if (!e.touches || e.touches.length < 2) return 0;

    const p1 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    const p2 = { x: e.touches[1].clientX, y: e.touches[1].clientY };

    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Get center point between two touches
 *
 * @param e - Touch event
 * @returns Center point or null if less than 2 touches
 *
 * @example
 * const center = getTouchCenter(touchEvent);
 */
export function getTouchCenter(e: TouchEvent): Point | null {
    if (!e.touches || e.touches.length < 2) return null;

    return {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2
    };
}

// ============================================================================
// ADD POINTER DOWN
// ============================================================================

/**
 * Add unified pointer down listener (handles mouse, touch, and pointer events)
 *
 * @param target - Target element
 * @param handler - Event handler
 * @param options - Event listener options
 * @returns Cleanup function
 *
 * @example
 * const cleanup = addPointerDown(element, (e) => {
 *   const point = getPoint(e);
 *   console.log('Pointer down at:', point);
 * });
 *
 * // Later: cleanup();
 */
export function addPointerDown(
    target: Element,
    handler: (e: PointerEvent | TouchEvent | MouseEvent) => void,
    options?: AddEventListenerOptions
): () => void {
    // Use PointerEvent if available (modern browsers)
    if (window.PointerEvent) {
        target.addEventListener(
            "pointerdown",
            handler as EventListener,
            options
        );
        return () =>
            target.removeEventListener(
                "pointerdown",
                handler as EventListener,
                options
            );
    }

    // Fallback to touch + mouse events
    target.addEventListener("touchstart", handler as EventListener, options);
    target.addEventListener("mousedown", handler as EventListener, options);

    return () => {
        target.removeEventListener(
            "touchstart",
            handler as EventListener,
            options
        );
        target.removeEventListener(
            "mousedown",
            handler as EventListener,
            options
        );
    };
}

/**
 * Add unified pointer move listener
 *
 * @param target - Target element
 * @param handler - Event handler
 * @param options - Event listener options
 * @returns Cleanup function
 */
export function addPointerMove(
    target: Element | Window | Document,
    handler: (e: PointerEvent | TouchEvent | MouseEvent) => void,
    options?: AddEventListenerOptions
): () => void {
    if (window.PointerEvent) {
        target.addEventListener(
            "pointermove",
            handler as EventListener,
            options
        );
        return () =>
            target.removeEventListener(
                "pointermove",
                handler as EventListener,
                options
            );
    }

    target.addEventListener("touchmove", handler as EventListener, options);
    target.addEventListener("mousemove", handler as EventListener, options);

    return () => {
        target.removeEventListener(
            "touchmove",
            handler as EventListener,
            options
        );
        target.removeEventListener(
            "mousemove",
            handler as EventListener,
            options
        );
    };
}

/**
 * Add unified pointer up listener
 *
 * @param target - Target element
 * @param handler - Event handler
 * @param options - Event listener options
 * @returns Cleanup function
 */
export function addPointerUp(
    target: Element | Window | Document,
    handler: (e: PointerEvent | TouchEvent | MouseEvent) => void,
    options?: AddEventListenerOptions
): () => void {
    if (window.PointerEvent) {
        target.addEventListener("pointerup", handler as EventListener, options);
        return () =>
            target.removeEventListener(
                "pointerup",
                handler as EventListener,
                options
            );
    }

    target.addEventListener("touchend", handler as EventListener, options);
    target.addEventListener("mouseup", handler as EventListener, options);

    return () => {
        target.removeEventListener(
            "touchend",
            handler as EventListener,
            options
        );
        target.removeEventListener(
            "mouseup",
            handler as EventListener,
            options
        );
    };
}

// ============================================================================
// FEATURE DETECTION
// ============================================================================

/**
 * Check if touch events are supported
 */
export function isTouchSupported(): boolean {
    return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0
    );
}

/**
 * Check if pointer events are supported
 */
export function isPointerSupported(): boolean {
    return !!window.PointerEvent;
}

/**
 * Check if device is likely a touch device
 */
export function isTouchDevice(): boolean {
    return isTouchSupported() && window.matchMedia("(pointer: coarse)").matches;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    getPoint,
    getX,
    getY,
    getAllPoints,
    getTouchDistance,
    getTouchCenter,
    addPointerDown,
    addPointerMove,
    addPointerUp,
    isTouchSupported,
    isPointerSupported,
    isTouchDevice
};
