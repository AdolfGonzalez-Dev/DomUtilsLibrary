/**
 * Modal Component
 * Accessible modal/dialog with focus trap and keyboard navigation
 *
 * @module components/modal
 * @example
 * import { Modal } from 'domutils/components';
 *
 * const modal = new Modal('#my-modal', {
 *   closeOnOverlay: true,
 *   closeOnEsc: true,
 *   onShow: () => console.log('opened')
 * });
 *
 * modal.show();
 */

// ============================================================================
// TYPES
// ============================================================================

export interface ModalOptions {
    overlaySelector?: string;
    closeSelector?: string;
    openClass?: string;
    closeOnOverlay?: boolean;
    closeOnEsc?: boolean;
    onShow?: (el: Element) => void;
    onHide?: (el: Element) => void;
    focusFirst?: boolean;
}

interface EventListener {
    el: Element | Window;
    type: string;
    fn: EventListenerOrEventListenerObject;
}

// ============================================================================
// MODAL CLASS
// ============================================================================

export class Modal {
    public el: Element | null;
    public overlay: Element | null;
    public readonly opts: Required<ModalOptions>;

    private _listeners: EventListener[] = [];
    private _isOpen: boolean = false;
    private _previousActiveElement: Element | null = null;
    private _backgroundHiddenNodes: Array<{
        node: Element;
        prev: string | null;
    }> = [];
    private _overlayCreated: boolean = false;

    private _onOverlayClick: (e: Event) => void;
    private _onCloseClick: (e: Event) => void;
    private _onWindowKeyDown: (e: Event) => void;
    private _onTrapKeyDown: (e: Event) => void;
    private _delegateClose: (e: Event) => void;

    constructor(
        selectorOrElement: string | Element,
        options: ModalOptions = {}
    ) {
        this.el =
            typeof selectorOrElement === "string"
                ? document.querySelector(selectorOrElement)
                : selectorOrElement;

        if (!this.el) {
            throw new Error("Modal: target element not found");
        }

        this.opts = {
            overlaySelector: ".modal-overlay",
            closeSelector: "[data-modal-close]",
            openClass: "open",
            closeOnOverlay: true,
            closeOnEsc: true,
            onShow: null as any,
            onHide: null as any,
            focusFirst: true,
            ...options
        };

        // Find or create overlay
        this.overlay = this.el.querySelector(this.opts.overlaySelector);
        if (!this.overlay) {
            this.overlay = document.createElement("div");
            this.overlay.className = this.opts.overlaySelector.replace(
                /^\./,
                ""
            );
            this.el.insertBefore(this.overlay, this.el.firstChild);
            this._overlayCreated = true;
        }

        // Bind methods
        this._onOverlayClick = e => {
            if (this.opts.closeOnOverlay) this.hide();
        };
        this._onCloseClick = e => {
            this.hide();
        };
        this._onWindowKeyDown = e => {
            if (this.opts.closeOnEsc && (e as KeyboardEvent).key === "Escape") {
                this.hide();
            }
        };
        this._onTrapKeyDown = this._trapKeyDown.bind(this);
        this._delegateClose = e => {
            const target = e.target as Element;
            const closeBtn = target.closest
                ? target.closest(this.opts.closeSelector)
                : null;
            if (closeBtn && this.el!.contains(closeBtn)) {
                e.preventDefault();
                this.hide();
            }
        };

        this._init();
    }

    private _init(): void {
        try {
            this.overlay!.addEventListener("click", this._onOverlayClick);
            this._listeners.push({
                el: this.overlay!,
                type: "click",
                fn: this._onOverlayClick
            });
        } catch (_) {}

        this.el!.addEventListener("click", this._delegateClose);
        this._listeners.push({
            el: this.el!,
            type: "click",
            fn: this._delegateClose
        });

        if (!this.el!.hasAttribute("role")) {
            this.el!.setAttribute("role", "dialog");
        }
        if (!this.el!.hasAttribute("aria-modal")) {
            this.el!.setAttribute("aria-modal", "false");
        }
        if (!this.el!.hasAttribute("tabindex")) {
            this.el!.setAttribute("tabindex", "-1");
        }
    }

    private _getFocusableElements(): Element[] {
        if (!this.el) return [];

        const selectors = [
            "a[href]",
            "area[href]",
            'input:not([disabled]):not([type="hidden"])',
            "select:not([disabled])",
            "textarea:not([disabled])",
            "button:not([disabled])",
            "iframe",
            "object",
            "embed",
            '[tabindex]:not([tabindex="-1"])',
            "[contenteditable]"
        ];

        const candidates = Array.from(
            this.el.querySelectorAll(selectors.join(","))
        );

        if (candidates.length === 0) return [];

        return candidates.filter(el => {
            try {
                return (
                    el.getBoundingClientRect().height > 0 ||
                    el.getBoundingClientRect().width > 0
                );
            } catch (_) {
                return false;
            }
        });
    }

    private _trapKeyDown(e: Event): void {
        const keyEvent = e as KeyboardEvent;
        if (keyEvent.key !== "Tab") return;

        const focusable = this._getFocusableElements();
        if (focusable.length === 0) {
            e.preventDefault();
            try {
                (this.el as HTMLElement).focus();
            } catch (_) {}
            return;
        }

        const first = focusable[0] as HTMLElement;
        const last = focusable[focusable.length - 1] as HTMLElement;
        const active = document.activeElement;

        if (keyEvent.shiftKey) {
            if (active === first || active === this.el) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (active === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }

    private _hideBackground(): void {
        const bodyChildren = Array.from(document.body.children || []);
        this._backgroundHiddenNodes = [];

        bodyChildren.forEach(node => {
            if (node === this.el || node.contains(this.el!)) return;
            try {
                const prev = node.getAttribute("aria-hidden");
                this._backgroundHiddenNodes.push({ node, prev });
                node.setAttribute("aria-hidden", "true");
            } catch (_) {}
        });
    }

    private _restoreBackground(): void {
        this._backgroundHiddenNodes.forEach(({ node, prev }) => {
            try {
                if (prev === null) {
                    node.removeAttribute("aria-hidden");
                } else {
                    node.setAttribute("aria-hidden", prev);
                }
            } catch (_) {}
        });
        this._backgroundHiddenNodes = [];
    }

    public show(): this {
        if (this._isOpen) return this;

        try {
            this._previousActiveElement = document.activeElement;
        } catch (_) {
            this._previousActiveElement = null;
        }

        this.el!.classList.add(this.opts.openClass);
        this.el!.setAttribute("aria-modal", "true");
        this._isOpen = true;

        this._hideBackground();

        this.el!.addEventListener("keydown", this._onTrapKeyDown);
        this._listeners.push({
            el: this.el!,
            type: "keydown",
            fn: this._onTrapKeyDown
        });

        if (this.opts.closeOnEsc) {
            window.addEventListener("keydown", this._onWindowKeyDown);
            this._listeners.push({
                el: window,
                type: "keydown",
                fn: this._onWindowKeyDown
            });
        }

        if (this.opts.focusFirst) {
            setTimeout(() => {
                try {
                    const focusable = this._getFocusableElements();
                    if (focusable.length) {
                        (focusable[0] as HTMLElement).focus();
                    } else {
                        (this.el as HTMLElement).focus();
                    }
                } catch (_) {
                    try {
                        (this.el as HTMLElement).focus();
                    } catch (_) {}
                }
            }, 100);
        }

        try {
            this.opts.onShow?.(this.el!);
        } catch (err) {
            console.error(err);
        }

        return this;
    }

    public hide(): this {
        if (!this._isOpen) return this;

        this.el!.classList.remove(this.opts.openClass);
        this.el!.setAttribute("aria-modal", "false");
        this._isOpen = false;

        try {
            this.el!.removeEventListener("keydown", this._onTrapKeyDown);
        } catch (_) {}
        try {
            window.removeEventListener("keydown", this._onWindowKeyDown);
        } catch (_) {}

        this._restoreBackground();

        // Restore focus
        const prev = this._previousActiveElement;
        if (prev && typeof (prev as HTMLElement).focus === "function") {
            setTimeout(() => {
                try {
                    (prev as HTMLElement).focus();
                } catch (_) {}
            }, 100);
        }

        try {
            this.opts.onHide?.(this.el!);
        } catch (err) {
            console.error(err);
        }

        // Cleanup listener entries
        this._listeners = this._listeners.filter(
            l =>
                !(l.el === window && l.type === "keydown") &&
                !(l.el === this.el && l.type === "keydown")
        );

        return this;
    }

    public toggle(): this {
        return this._isOpen ? this.hide() : this.show();
    }

    public destroy(): void {
        this._listeners.forEach(({ el, type, fn }) => {
            try {
                el.removeEventListener(type, fn);
            } catch (_) {}
        });
        this._listeners = [];

        this._restoreBackground();

        try {
            if (
                this._previousActiveElement &&
                typeof (this._previousActiveElement as HTMLElement).focus ===
                    "function"
            ) {
                (this._previousActiveElement as HTMLElement).focus();
            }
        } catch (_) {}

        if (
            this._overlayCreated &&
            this.overlay &&
            this.overlay.parentNode === this.el &&
            this.el
        ) {
            this.el.removeChild(this.overlay);
        }

        this.el = null;
        this.overlay = null;
        this._previousActiveElement = null;
    }
}

export default Modal;
