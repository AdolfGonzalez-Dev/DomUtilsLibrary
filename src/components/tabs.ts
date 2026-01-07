/**
 * Tabs Component
 * Keyboard-accessible tabs with arrow navigation
 *
 * @module components/tabs
 * @example
 * import { Tabs } from 'domutils/components';
 *
 * const tabs = new Tabs('#my-tabs', {
 *   tabSelector: '[data-tab]',
 *   panelSelector: '[data-panel]',
 *   activeClass: 'active',
 *   useHash: true
 * });
 *
 * tabs.select('tab-2');
 */

// ============================================================================
// TYPES
// ============================================================================

export interface TabsOptions {
    tabSelector?: string;
    panelSelector?: string;
    activeClass?: string;
    initial?: string | null;
    useHash?: boolean;
}

// ============================================================================
// TABS CLASS
// ============================================================================

export class Tabs {
    public container: Element | null;
    public readonly opts: Required<TabsOptions>;

    private _tabs: Element[] = [];
    private _panels: Element[] = [];
    private _clickHandler: (e: Event) => void;
    private _keyHandler: (e: Event) => void;

    constructor(
        selectorOrElement: string | Element,
        options: TabsOptions = {}
    ) {
        this.container =
            typeof selectorOrElement === "string"
                ? document.querySelector(selectorOrElement)
                : selectorOrElement;

        if (!this.container) {
            throw new Error("Tabs: container not found");
        }

        this.opts = {
            tabSelector: "[data-tab]",
            panelSelector: "[data-panel]",
            activeClass: "active",
            initial: null,
            useHash: false,
            ...options
        };

        this._clickHandler = this._onTabClick.bind(this);
        this._keyHandler = this._onKeyDown.bind(this);

        this._init();
    }

    private _init(): void {
        this._tabs = Array.from(
            this.container!.querySelectorAll(this.opts.tabSelector)
        );
        this._panels = Array.from(
            this.container!.querySelectorAll(this.opts.panelSelector)
        );

        // Set ARIA attributes
        this._tabs.forEach(tab => tab.setAttribute("role", "tab"));
        this._panels.forEach(panel => panel.setAttribute("role", "tabpanel"));

        // Event listeners
        this.container!.addEventListener("click", this._clickHandler);
        this.container!.addEventListener("keydown", this._keyHandler);

        // Determine initial active tab
        let initial = this.opts.initial;
        if (!initial && this.opts.useHash && location.hash) {
            initial = location.hash.replace(/^#/, "");
        }
        if (!initial && this._tabs.length) {
            const firstTab = this._tabs[0] as HTMLElement;
            initial = firstTab.dataset.tab || null;
        }
        if (initial) {
            this.select(initial, { setFocus: false });
        }
    }

    private _onTabClick(e: Event): void {
        const target = e.target as Element;
        const tabEl = target.closest
            ? target.closest(this.opts.tabSelector)
            : null;

        if (!tabEl || !this.container!.contains(tabEl)) return;

        const id = (tabEl as HTMLElement).dataset.tab;
        if (!id) return;

        this.select(id, { setFocus: true });
    }

    private _onKeyDown(e: Event): void {
        const keyEvent = e as KeyboardEvent;
        const target = keyEvent.target as Element;
        const tabEl = target.closest
            ? target.closest(this.opts.tabSelector)
            : null;

        if (!tabEl || !this.container!.contains(tabEl)) return;

        const idx = this._tabs.indexOf(tabEl);
        if (idx < 0) return;

        switch (keyEvent.key) {
            case "ArrowRight":
            case "Right":
                e.preventDefault();
                this._focusTab((idx + 1) % this._tabs.length);
                break;
            case "ArrowLeft":
            case "Left":
                e.preventDefault();
                this._focusTab(
                    (idx - 1 + this._tabs.length) % this._tabs.length
                );
                break;
            case "Home":
                e.preventDefault();
                this._focusTab(0);
                break;
            case "End":
                e.preventDefault();
                this._focusTab(this._tabs.length - 1);
                break;
            case "Enter":
            case " ":
                e.preventDefault();
                const id = (tabEl as HTMLElement).dataset.tab;
                if (id) this.select(id);
                break;
            default:
                break;
        }
    }

    private _focusTab(index: number): void {
        const tab = this._tabs[index] as HTMLElement;
        if (!tab) return;
        tab.focus();
    }

    public select(id: string, opts: { setFocus?: boolean } = {}): void {
        const { setFocus = true } = opts;
        if (!id) return;

        // Update tabs
        this._tabs.forEach(t => {
            const tabId = (t as HTMLElement).dataset.tab;
            t.classList.toggle(this.opts.activeClass, tabId === id);
        });

        // Update panels
        this._panels.forEach(p => {
            const panelId = (p as HTMLElement).dataset.panel;
            p.classList.toggle(this.opts.activeClass, panelId === id);
        });

        // Update URL hash
        if (this.opts.useHash) {
            try {
                history.replaceState(null, "", `#${id}`);
            } catch (_) {}
        }

        // Focus active tab
        if (setFocus) {
            const activeTab = this._tabs.find(t => {
                return (t as HTMLElement).dataset.tab === id;
            }) as HTMLElement;

            if (activeTab) {
                activeTab.focus();
            }
        }
    }

    public destroy(): void {
        this.container!.removeEventListener("click", this._clickHandler);
        this.container!.removeEventListener("keydown", this._keyHandler);
        this._tabs = [];
        this._panels = [];
        this.container = null;
    }
}

export default Tabs;
