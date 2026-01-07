/**
 * Tooltip Component
 * Smart-positioned tooltips with accessibility
 *
 * @module components/tooltip
 * @example
 * import { Tooltip } from 'domutils/components';
 *
 * const tooltip = new Tooltip('#button', 'Help text', {
 *   placement: 'top',
 *   offset: 8
 * });
 *
 * tooltip.show();
 */

// ============================================================================
// TYPES
// ============================================================================

export interface TooltipOptions {
    placement?: "top" | "bottom" | "left" | "right";
    offset?: number;
    container?: Element | string | Document;
    tooltipClass?: string;
    visibleClass?: string;
}

// ============================================================================
// TOOLTIP CLASS
// ============================================================================

export class Tooltip {
    public target: Element | null;
    public text: string;
    public readonly opts: Required<TooltipOptions>;

    private _tooltipEl: HTMLElement | null = null;
    private _id: string = "";
    private _showHandler: (e: Event) => void;
    private _hideHandler: (e: Event) => void;
    private _focusHandler: (e: Event) => void;
    private _blurHandler: (e: Event) => void;

    constructor(
        target: string | Element,
        text: string,
        options: TooltipOptions = {}
    ) {
        this.target =
            typeof target === "string"
                ? document.querySelector(target)
                : target;

        if (!this.target) {
            throw new Error("Tooltip: target element not found");
        }

        this.text = text || "";
        this.opts = {
            placement: "top",
            offset: 8,
            container: document.body,
            tooltipClass: "tooltip",
            visibleClass: "visible",
            ...options
        };

        // Bind methods
        this._showHandler = this.show.bind(this);
        this._hideHandler = this.hide.bind(this);
        this._focusHandler = this.show.bind(this);
        this._blurHandler = this.hide.bind(this);

        this._init();
    }

    private _init(): void {
        this.target!.setAttribute("aria-describedby", this._getId());

        // Event listeners
        this.target!.addEventListener("mouseenter", this._showHandler);
        this.target!.addEventListener("mouseleave", this._hideHandler);
        this.target!.addEventListener("focus", this._focusHandler);
        this.target!.addEventListener("blur", this._blurHandler);
    }

    private _getId(): string {
        if (!this._id) {
            this._id = `tooltip-${Math.random().toString(36).slice(2, 9)}`;
        }
        return this._id;
    }

    private _createTooltip(): HTMLElement {
        if (this._tooltipEl) return this._tooltipEl;

        const el = document.createElement("div");
        el.className = this.opts.tooltipClass;
        el.id = this._getId();
        el.setAttribute("role", "tooltip");
        el.textContent = this.text;

        const container =
            typeof this.opts.container === "string"
                ? document.querySelector(this.opts.container) || document.body
                : this.opts.container === document
                ? document.body
                : this.opts.container;

        (container as HTMLElement).appendChild(el);
        this._tooltipEl = el;
        return el;
    }

    public show(): this {
        const el = this._createTooltip();
        el.classList.add(this.opts.visibleClass);

        // Positioning
        const rect = this.target!.getBoundingClientRect();
        const tipRect = el.getBoundingClientRect();
        const offset = this.opts.offset;

        let left = 0;
        let top = 0;
        const placement = this.opts.placement;

        if (placement === "top") {
            left = rect.left + (rect.width - tipRect.width) / 2;
            top = rect.top - tipRect.height - offset;
        } else if (placement === "bottom") {
            left = rect.left + (rect.width - tipRect.width) / 2;
            top = rect.bottom + offset;
        } else if (placement === "left") {
            left = rect.left - tipRect.width - offset;
            top = rect.top + (rect.height - tipRect.height) / 2;
        } else {
            // right
            left = rect.right + offset;
            top = rect.top + (rect.height - tipRect.height) / 2;
        }

        // Ensure inside viewport
        const vw = Math.max(
            document.documentElement.clientWidth,
            window.innerWidth || 0
        );
        const vh = Math.max(
            document.documentElement.clientHeight,
            window.innerHeight || 0
        );

        left = Math.max(4, Math.min(left, vw - tipRect.width - 4));
        top = Math.max(4, Math.min(top, vh - tipRect.height - 4));

        el.style.position = "fixed";
        el.style.left = `${Math.round(left)}px`;
        el.style.top = `${Math.round(top)}px`;
        el.setAttribute("data-visible", "true");

        return this;
    }

    public hide(): this {
        if (!this._tooltipEl) return this;

        this._tooltipEl.classList.remove(this.opts.visibleClass);
        this._tooltipEl.removeAttribute("data-visible");

        return this;
    }

    public destroy(): void {
        this.target!.removeEventListener("mouseenter", this._showHandler);
        this.target!.removeEventListener("mouseleave", this._hideHandler);
        this.target!.removeEventListener("focus", this._focusHandler);
        this.target!.removeEventListener("blur", this._blurHandler);
        this.target!.removeAttribute("aria-describedby");

        if (this._tooltipEl && this._tooltipEl.parentNode) {
            this._tooltipEl.parentNode.removeChild(this._tooltipEl);
        }

        this._tooltipEl = null;
        this.target = null;
    }
}

export default Tooltip;
