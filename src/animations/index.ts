/**
 * Animations Module
 * Web Animations API helpers with CSS fallbacks
 *
 * @module animations
 * @example
 * import { animate, fadeIn, fadeOut } from 'domutils/animations';
 *
 * await fadeIn(element);
 * await animate(element, [{ opacity: 0 }, { opacity: 1 }], { duration: 500 });
 */

// ============================================================================
// TYPES
// ============================================================================

export interface AnimateOptions {
    duration?: number;
    easing?: string;
    fill?: FillMode;
    delay?: number;
    iterations?: number;
    direction?: PlaybackDirection;
}

// ============================================================================
// ANIMATE
// ============================================================================

/**
 * Animate an element using Web Animations API with CSS fallback
 *
 * @example
 * await animate(el, [
 *   { transform: 'translateX(0)' },
 *   { transform: 'translateX(100px)' }
 * ], { duration: 500 });
 */
export function animate(
    el: Element,
    keyframes: Keyframe[] | PropertyIndexedKeyframes,
    options: AnimateOptions = {}
): Promise<Animation | null> {
    if (!el) {
        return Promise.reject(new Error("animate: element required"));
    }

    const opts: KeyframeAnimationOptions = {
        duration: 300,
        easing: "ease",
        fill: "forwards",
        ...options
    };

    // Try Web Animations API first
    if ("animate" in el && typeof (el as any).animate === "function") {
        const anim = (el as any).animate(keyframes, opts);
        return new Promise((resolve, reject) => {
            anim.onfinish = () => resolve(anim);
            anim.oncancel = () => reject(new Error("animation cancelled"));
        });
    }

    // Fallback: simple transition using CSS
    return new Promise(resolve => {
        const style = (el as HTMLElement).style;
        const kf = keyframes as Keyframe[];
        const from = kf[0] || {};
        const to = kf[kf.length - 1] || {};

        // Apply initial state
        Object.entries(from).forEach(([k, v]) => {
            (style as any)[k] = v;
        });

        // Force reflow
        void (el as HTMLElement).offsetWidth;

        // Apply transition
        style.transition = `all ${opts.duration}ms ${opts.easing}`;

        // Apply final state
        Object.entries(to).forEach(([k, v]) => {
            (style as any)[k] = v;
        });

        const cleanup = () => {
            style.transition = "";
            resolve(null);
        };

        setTimeout(cleanup, (opts.duration as number) + 20);
    });
}

// ============================================================================
// FADE IN/OUT
// ============================================================================

/**
 * Fade in an element
 *
 * @example
 * await fadeIn(element, 300);
 */
export function fadeIn(el: Element, duration: number = 300): Promise<Element> {
    if (!el) return Promise.resolve(el);

    const htmlEl = el as HTMLElement;
    htmlEl.style.opacity = "0";
    htmlEl.style.display =
        htmlEl.dataset.origDisplay ||
        getComputedStyle(htmlEl).display ||
        "block";

    return animate(el, [{ opacity: 0 }, { opacity: 1 }], { duration }).then(
        () => {
            htmlEl.style.opacity = "";
            return el;
        }
    );
}

/**
 * Fade out an element
 *
 * @example
 * await fadeOut(element, 300);
 */
export function fadeOut(el: Element, duration: number = 300): Promise<Element> {
    if (!el) return Promise.resolve(el);

    const htmlEl = el as HTMLElement;

    // Store original display value
    if (!htmlEl.dataset.origDisplay) {
        const cs = getComputedStyle(htmlEl).display;
        htmlEl.dataset.origDisplay = cs === "none" ? "block" : cs;
    }

    return animate(el, [{ opacity: 1 }, { opacity: 0 }], { duration }).then(
        () => {
            htmlEl.style.opacity = "";
            htmlEl.style.display = "none";
            return el;
        }
    );
}

// ============================================================================
// SLIDE
// ============================================================================

/**
 * Slide down an element (show with slide animation)
 *
 * @example
 * await slideDown(element, 300);
 */
export function slideDown(
    el: Element,
    duration: number = 300
): Promise<Element> {
    if (!el) return Promise.resolve(el);

    const htmlEl = el as HTMLElement;
    htmlEl.style.overflow = "hidden";
    htmlEl.style.height = "0";
    htmlEl.style.display = "block";

    const height = htmlEl.scrollHeight;

    return animate(el, [{ height: "0px" }, { height: `${height}px` }], {
        duration
    }).then(() => {
        htmlEl.style.height = "";
        htmlEl.style.overflow = "";
        return el;
    });
}

/**
 * Slide up an element (hide with slide animation)
 *
 * @example
 * await slideUp(element, 300);
 */
export function slideUp(el: Element, duration: number = 300): Promise<Element> {
    if (!el) return Promise.resolve(el);

    const htmlEl = el as HTMLElement;
    const height = htmlEl.scrollHeight;

    htmlEl.style.overflow = "hidden";
    htmlEl.style.height = `${height}px`;

    return animate(el, [{ height: `${height}px` }, { height: "0px" }], {
        duration
    }).then(() => {
        htmlEl.style.display = "none";
        htmlEl.style.height = "";
        htmlEl.style.overflow = "";
        return el;
    });
}

/**
 * Slide toggle (slide up if visible, slide down if hidden)
 *
 * @example
 * await slideToggle(element);
 */
export function slideToggle(
    el: Element,
    duration: number = 300
): Promise<Element> {
    const htmlEl = el as HTMLElement;
    const isHidden = getComputedStyle(htmlEl).display === "none";

    return isHidden ? slideDown(el, duration) : slideUp(el, duration);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    animate,
    fadeIn,
    fadeOut,
    slideDown,
    slideUp,
    slideToggle
};
