/**
 * Swipe Gesture Detection
 *
 * @module gestures/swipe
 */

import { getPoint, type Point } from "./touch";

// ============================================================================
// TYPES
// ============================================================================

export interface SwipeInfo {
    direction: "up" | "down" | "left" | "right";
    distance: number;
    deltaX: number;
    deltaY: number;
    duration: number;
    start: Point;
    end: Point;
    originalEvent: Event;
}

export interface SwipeOptions {
    threshold?: number;
    maxTime?: number;
    allowedAngle?: number;
}

export type SwipeCallback = (info: SwipeInfo) => void;

// ============================================================================
// ON SWIPE
// ============================================================================

export function onSwipe(
    element: Element,
    callback: SwipeCallback,
    options: SwipeOptions = {}
): () => void {
    const { threshold = 40, maxTime = 500, allowedAngle = 30 } = options;

    let start: { t: number; p: Point } | null = null;

    function down(e: Event): void {
        start = {
            t: Date.now(),
            p: getPoint(e as any)
        };
    }

    function up(e: Event): void {
        if (!start) return;

        const end = {
            t: Date.now(),
            p: getPoint(e as any)
        };

        const dt = end.t - start.t;
        const dx = end.p.x - start.p.x;
        const dy = end.p.y - start.p.y;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);

        if (dt > maxTime) {
            start = null;
            return;
        }

        if (Math.max(absX, absY) < threshold) {
            start = null;
            return;
        }

        const angle = Math.abs((Math.atan2(dy, dx) * 180) / Math.PI);
        let direction: SwipeInfo["direction"];

        if (absX >= absY && angle < 90 - allowedAngle) {
            direction = dx > 0 ? "right" : "left";
        } else if (absY > absX && angle > 90 + allowedAngle) {
            direction = dy > 0 ? "down" : "up";
        } else {
            direction =
                absX > absY
                    ? dx > 0
                        ? "right"
                        : "left"
                    : dy > 0
                    ? "down"
                    : "up";
        }

        callback({
            direction,
            distance: Math.max(absX, absY),
            deltaX: dx,
            deltaY: dy,
            duration: dt,
            start: start.p,
            end: end.p,
            originalEvent: e
        });

        start = null;
    }

    element.addEventListener("touchstart", down, { passive: true });
    element.addEventListener("touchend", up);
    element.addEventListener("mousedown", down);
    element.addEventListener("mouseup", up);

    return function off(): void {
        element.removeEventListener("touchstart", down);
        element.removeEventListener("touchend", up);
        element.removeEventListener("mousedown", down);
        element.removeEventListener("mouseup", up);
    };
}

export default onSwipe;
