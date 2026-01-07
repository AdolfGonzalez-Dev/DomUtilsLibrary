/**
 * Drag Controller
 * Complete drag and drop functionality
 *
 * @module gestures/drag
 * @example
 * import { createDragController } from 'domutils/gestures';
 *
 * const drag = createDragController('.draggable', {
 *   onStart: (info) => console.log('Drag started'),
 *   onMove: (info) => console.log('Dragging:', info.dx, info.dy),
 *   onEnd: (info) => console.log('Drag ended')
 * });
 */

import { getPoint, type Point } from "./touch";

// ============================================================================
// TYPES
// ============================================================================

export interface DragInfo {
    /** Target element */
    el: Element;
    /** Original event */
    originalEvent: Event;
    /** Delta X (change in X) */
    dx: number;
    /** Delta Y (change in Y) */
    dy: number;
    /** New X position */
    newX: number;
    /** New Y position */
    newY: number;
    /** Starting pointer position */
    startPointer?: Point;
    /** Starting element rect */
    startRect?: DOMRect;
}

export interface DragOptions {
    /** Constrain to axis ('x', 'y', or null for both) */
    axis?: "x" | "y" | null;
    /** Bounds constraint */
    bounds?: { min: number; max: number } | null;
    /** Use transform instead of position */
    useTransform?: boolean;
    /** Auto-enable on creation */
    auto?: boolean;
    /** Callback on drag start */
    onStart?: (info: DragInfo) => void;
    /** Callback on drag move */
    onMove?: (info: DragInfo) => void;
    /** Callback on drag end */
    onEnd?: (info: DragInfo) => void;
}

export interface DragController {
    /** Enable drag */
    enable(): DragController;
    /** Disable drag */
    disable(): DragController;
    /** Subscribe to events */
    on(
        event: "start" | "move" | "end",
        fn: (info: DragInfo) => void
    ): () => void;
    /** Destroy controller */
    destroy(): void;
}

type DragEventListener = (info: DragInfo) => void;

// ============================================================================
// CREATE DRAG CONTROLLER
// ============================================================================

/**
 * Create a drag controller for an element
 *
 * @param target - Target element or selector
 * @param options - Drag options
 * @returns Drag controller
 *
 * @example
 * const drag = createDragController('.draggable', {
 *   axis: 'x',
 *   useTransform: true,
 *   onMove: (info) => {
 *     console.log(`Dragged ${info.dx}px horizontally`);
 *   }
 * });
 *
 * // Later: drag.destroy();
 */
export function createDragController(
    target: Element | string,
    options: DragOptions = {}
): DragController {
    const listeners: Record<string, DragEventListener[]> = {
        start: [],
        move: [],
        end: []
    };

    const elOrNull =
        typeof target === "string" ? document.querySelector(target) : target;

    if (!elOrNull) {
        throw new Error("createDragController: target not found");
    }

    // TypeScript now knows el is not null
    const el: Element = elOrNull;

    const cfg: Required<Omit<DragOptions, "onStart" | "onMove" | "onEnd">> = {
        axis: options.axis ?? null,
        bounds: options.bounds ?? null,
        useTransform: options.useTransform ?? true,
        auto: options.auto ?? true
    };

    let active = false;
    let startPointer: Point | null = null;
    let startRect: DOMRect | null = null;
    let pointerId: number | null = null;

    // ==================
    // EMIT
    // ==================

    function emit(name: "start" | "move" | "end", payload: DragInfo): void {
        (listeners[name] || []).forEach(fn => {
            try {
                fn(payload);
            } catch (e) {
                console.error(e);
            }
        });

        // Call option callbacks
        const callbackKey = `on${
            name.charAt(0).toUpperCase() + name.slice(1)
        }` as "onStart" | "onMove" | "onEnd";

        if (typeof options[callbackKey] === "function") {
            try {
                options[callbackKey]!(payload);
            } catch (e) {
                console.error(e);
            }
        }
    }

    // ==================
    // EVENT HANDLERS
    // ==================

    function onDown(e: Event): void {
        const mouseEvent = e as MouseEvent;

        // Only accept left mouse button
        if (e.type === "mousedown" && mouseEvent.button !== 0) return;

        active = true;
        startPointer = getPoint(e as any);
        startRect = el.getBoundingClientRect();

        // Handle pointer capture
        const pointerEvent = e as PointerEvent;
        pointerId = pointerEvent.pointerId ?? null;

        if (pointerId != null && "setPointerCapture" in el) {
            try {
                (el as any).setPointerCapture(pointerId);
            } catch {}
        }

        emit("start", {
            el,
            originalEvent: e,
            dx: 0,
            dy: 0,
            newX: startRect.left,
            newY: startRect.top,
            startPointer,
            startRect
        });

        // Add global listeners
        window.addEventListener("pointermove", onMove as EventListener);
        window.addEventListener("pointerup", onUp as EventListener);
        window.addEventListener("mousemove", onMove as EventListener);
        window.addEventListener("mouseup", onUp as EventListener);

        // Prevent text selection
        document.body.style.userSelect = "none";
    }

    function onMove(e: Event): void {
        if (!active) return;

        // Filter pointer events
        const pointerEvent = e as PointerEvent;
        if (pointerId != null && pointerEvent.pointerId != null) {
            if (pointerEvent.pointerId !== pointerId) return;
        }

        const pt = getPoint(e as any);
        const dx = pt.x - startPointer!.x;
        const dy = pt.y - startPointer!.y;

        let newX = startRect!.left + dx;
        let newY = startRect!.top + dy;

        // Apply axis constraint
        if (cfg.axis === "x") newY = startRect!.top;
        if (cfg.axis === "y") newX = startRect!.left;

        // Apply bounds (if any)
        if (cfg.bounds) {
            if (cfg.axis === "x" || cfg.axis === null) {
                newX = Math.max(cfg.bounds.min, Math.min(cfg.bounds.max, newX));
            }
            if (cfg.axis === "y" || cfg.axis === null) {
                newY = Math.max(cfg.bounds.min, Math.min(cfg.bounds.max, newY));
            }
        }

        emit("move", {
            el,
            originalEvent: e,
            dx,
            dy,
            newX,
            newY,
            startPointer: startPointer!,
            startRect: startRect!
        });

        // Apply position
        if (cfg.useTransform) {
            const tx = newX - startRect!.left;
            const ty = newY - startRect!.top;
            (el as HTMLElement).style.transform = `translate(${tx}px, ${ty}px)`;
        } else {
            const htmlEl = el as HTMLElement;
            htmlEl.style.position = htmlEl.style.position || "absolute";
            htmlEl.style.left = `${newX}px`;
            htmlEl.style.top = `${newY}px`;
        }
    }

    function onUp(e: Event): void {
        if (!active) return;

        active = false;

        // Release pointer capture
        try {
            const pointerEvent = e as PointerEvent;
            if (
                "releasePointerCapture" in el &&
                pointerEvent.pointerId != null
            ) {
                (el as any).releasePointerCapture(pointerEvent.pointerId);
            }
        } catch {}

        // Remove global listeners
        window.removeEventListener("pointermove", onMove as EventListener);
        window.removeEventListener("pointerup", onUp as EventListener);
        window.removeEventListener("mousemove", onMove as EventListener);
        window.removeEventListener("mouseup", onUp as EventListener);

        // Restore text selection
        document.body.style.userSelect = "";

        emit("end", {
            el,
            originalEvent: e,
            dx: 0,
            dy: 0,
            newX: 0,
            newY: 0
        });
    }

    // ==================
    // CONTROLLER API
    // ==================

    function enable(): DragController {
        el.addEventListener("pointerdown", onDown as EventListener, {
            passive: true
        });
        el.addEventListener("mousedown", onDown as EventListener, {
            passive: true
        });
        return controller;
    }

    function disable(): DragController {
        el.removeEventListener("pointerdown", onDown as EventListener);
        el.removeEventListener("mousedown", onDown as EventListener);
        window.removeEventListener("pointermove", onMove as EventListener);
        window.removeEventListener("pointerup", onUp as EventListener);
        window.removeEventListener("mousemove", onMove as EventListener);
        window.removeEventListener("mouseup", onUp as EventListener);
        return controller;
    }

    function on(
        eventName: "start" | "move" | "end",
        fn: DragEventListener
    ): () => void {
        if (!listeners[eventName]) listeners[eventName] = [];
        listeners[eventName].push(fn);
        return () => {
            const idx = listeners[eventName].indexOf(fn);
            if (idx >= 0) listeners[eventName].splice(idx, 1);
        };
    }

    const controller: DragController = {
        enable,
        disable,
        on,
        destroy: disable
    };

    // Auto-enable if specified
    if (cfg.auto) enable();

    return controller;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default createDragController;
