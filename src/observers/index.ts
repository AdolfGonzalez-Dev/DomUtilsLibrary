/**
 * Observers Module
 * IntersectionObserver, ResizeObserver, MutationObserver helpers
 *
 * @module observers
 */

// ============================================================================
// TYPES
// ============================================================================

export interface ObserverHandle {
    observer: IntersectionObserver | ResizeObserver | MutationObserver;
    disconnect(): void;
    destroy(): void;
}

// ============================================================================
// INTERSECTION OBSERVER
// ============================================================================

export function onVisible(
    target: Element | string,
    callback: (
        entry: IntersectionObserverEntry,
        observer: IntersectionObserver
    ) => void,
    options: IntersectionObserverInit = {}
): ObserverHandle {
    const el =
        typeof target === "string" ? document.querySelector(target) : target;

    if (!el) {
        throw new Error("onVisible: target not found");
    }

    const obs = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                try {
                    callback(entry, observer);
                } catch (err) {
                    console.error(err);
                }
            }
        });
    }, options);

    obs.observe(el);

    return {
        observer: obs,
        disconnect: () => obs.unobserve(el),
        destroy: () => obs.disconnect()
    };
}

// ============================================================================
// RESIZE OBSERVER
// ============================================================================

export function onResize(
    target: Element | string,
    callback: (rect: DOMRect, entry: ResizeObserverEntry) => void,
    options: any = {}
): ObserverHandle {
    const el =
        typeof target === "string" ? document.querySelector(target) : target;

    if (!el) {
        throw new Error("onResize: target not found");
    }

    const ro = new ResizeObserver(entries => {
        entries.forEach(entry => {
            const rect = entry.contentRect || el.getBoundingClientRect();
            try {
                callback(rect, entry);
            } catch (err) {
                console.error(err);
            }
        });
    });

    ro.observe(el, options);

    return {
        observer: ro,
        disconnect: () => ro.unobserve(el),
        destroy: () => ro.disconnect()
    };
}

// ============================================================================
// MUTATION OBSERVER
// ============================================================================

export function onMutation(
    target: Element | string,
    callback: (mutations: MutationRecord[], observer: MutationObserver) => void,
    options: MutationObserverInit = {
        childList: true,
        subtree: true,
        attributes: false
    }
): ObserverHandle {
    const el =
        typeof target === "string" ? document.querySelector(target) : target;

    if (!el) {
        throw new Error("onMutation: target not found");
    }

    const mo = new MutationObserver((mutations, observer) => {
        try {
            callback(mutations, observer);
        } catch (err) {
            console.error(err);
        }
    });

    mo.observe(el, options);

    return {
        observer: mo,
        disconnect: () => mo.disconnect(),
        destroy: () => mo.disconnect()
    };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    onVisible,
    onResize,
    onMutation
};
