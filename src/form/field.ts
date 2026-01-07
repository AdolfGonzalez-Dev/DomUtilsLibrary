/**
 * Form Field Class
 * Reactive field with validation and transformation
 *
 * @module form/Field
 * @example
 * import { Field } from 'domutils/form';
 *
 * const emailField = new Field({
 *   name: 'email',
 *   type: 'email',
 *   validators: [required(), email()],
 *   transformers: [trim(), lowercase()]
 * });
 */

import { createSignal, Signal } from "../reactive/signals.js";
import type {
    FieldConfig,
    BaseFieldConfig,
    ValidatorFn,
    TransformerFn,
    ValidationResult
} from "./types.js";

// ============================================================================
// FIELD CLASS
// ============================================================================

export class Field {
    // Config
    public readonly name: string;
    public readonly type: string;
    public readonly config: BaseFieldConfig;
    public readonly label: string;
    public readonly placeholder: string;
    public readonly isRequired: boolean;
    public readonly disabled: boolean;
    public readonly className: string;
    public readonly rows: number;
    public readonly debounce: number;
    public readonly debounceAsync: number;

    // Validators & Transformers
    public readonly validators: ValidatorFn[];
    public readonly transformers: TransformerFn[];

    // Reactive state (signals)
    private readonly _rawValue: () => any;
    private readonly _setRawValue: (value: any) => any;
    private readonly _error: () => string | null;
    private readonly _setError: (error: string | null) => string | null;
    private readonly _touched: () => boolean;
    private readonly _setTouched: (touched: boolean) => boolean;
    private readonly _dirty: () => boolean;
    private readonly _setDirty: (dirty: boolean) => boolean;
    private readonly _isValidating: () => boolean;
    private readonly _setValidating: (validating: boolean) => boolean;

    // Private
    private _debounceTimer: ReturnType<typeof setTimeout> | null = null;
    private _el: HTMLInputElement | HTMLTextAreaElement | null = null;
    private _wrapper: HTMLElement | null = null;
    private _getFormValues: () => Record<string, any> = () => ({});
    private _subscriptions: Array<() => void> = [];

    constructor(config: FieldConfig = {}) {
        // Normalize config if it's a function
        const normalizedConfig: BaseFieldConfig =
            typeof config === "function" ? config() : config;

        const {
            name = "",
            type = "text",
            value = "",
            validators = [],
            transformers = [],
            debounce = 300,
            debounceAsync = 500,
            label = "",
            placeholder = "",
            required: isRequired = false,
            disabled = false,
            className = "",
            rows = 3
        } = normalizedConfig;

        this.name = name;
        this.type = type;
        this.config = normalizedConfig;
        this.label = label || name;
        this.placeholder = placeholder;
        this.isRequired = isRequired;
        this.disabled = disabled;
        this.className = className;
        this.rows = rows;
        this.debounce = debounce;
        this.debounceAsync = debounceAsync;

        // Initialize validators & transformers
        this.validators = Array.isArray(validators)
            ? validators
            : [validators].filter(Boolean);
        this.transformers = Array.isArray(transformers)
            ? transformers
            : [transformers].filter(Boolean);

        // Initialize reactive signals
        const [rawValue, setRawValue] = createSignal(value);
        const [error, setError] = createSignal<string | null>(null);
        const [touched, setTouched] = createSignal(false);
        const [dirty, setDirty] = createSignal(false);
        const [isValidating, setValidating] = createSignal(false);

        this._rawValue = rawValue;
        this._setRawValue = setRawValue;
        this._error = error;
        this._setError = setError;
        this._touched = touched;
        this._setTouched = setTouched;
        this._dirty = dirty;
        this._setDirty = setDirty;
        this._isValidating = isValidating;
        this._setValidating = setValidating;
    }

    // ==================
    // GETTERS
    // ==================

    get value(): any {
        return this._rawValue();
    }

    get isDirty(): boolean {
        return this._dirty();
    }

    get isTouched(): boolean {
        return this._touched();
    }

    get errorMessage(): string | null {
        return this._error();
    }

    get isValid(): boolean {
        return !this._error();
    }

    get isValidating(): boolean {
        return this._isValidating();
    }

    // ==================
    // VALUE METHODS
    // ==================

    setValue(newValue: any): void {
        // Apply transformers
        let value = newValue;
        for (const transformer of this.transformers) {
            if (typeof transformer === "function") {
                value = transformer(value);
            }
        }

        this._setRawValue(value);
        this._setDirty(true);

        // Schedule debounced validation
        this._scheduleValidation();
    }

    getValue(): any {
        return this.value;
    }

    reset(initialValue: any = this.config.value || ""): void {
        this._setRawValue(initialValue);
        this._setError(null);
        this._setTouched(false);
        this._setDirty(false);
    }

    setError(error: string | null): void {
        this._setError(error);
    }

    // ==================
    // VALIDATION
    // ==================

    private _scheduleValidation(): void {
        if (this._debounceTimer) {
            clearTimeout(this._debounceTimer);
        }

        this._debounceTimer = setTimeout(() => {
            this.validate();
        }, this.debounce);
    }

    async validate(value: any = this.value): Promise<boolean> {
        if (!this.validators || this.validators.length === 0) {
            this._setError(null);
            return true;
        }

        this._setValidating(true);

        try {
            for (const validator of this.validators) {
                if (typeof validator !== "function") continue;

                const error = await Promise.resolve(
                    validator(value, this._getFormValues?.() || {})
                );

                if (error) {
                    this._setError(error);
                    return false;
                }
            }

            this._setError(null);
            return true;
        } catch (err) {
            console.error("Validation error:", err);
            this._setError("Validation error occurred");
            return false;
        } finally {
            this._setValidating(false);
        }
    }

    // ==================
    // EVENT HANDLERS
    // ==================

    handleChange(e: Event): void {
        const el = e.target as
            | HTMLInputElement
            | HTMLTextAreaElement
            | HTMLSelectElement;
        let value: any = el.value;

        // Handle different input types
        if ("type" in el) {
            if (el.type === "checkbox") {
                value = (el as HTMLInputElement).checked;
            } else if (el.type === "radio") {
                value = (el as HTMLInputElement).checked ? el.value : null;
            }
        }

        this.setValue(value);
    }

    handleBlur(): void {
        this._setTouched(true);
        this.validate();
    }

    handleFocus(): void {
        // Could add focused state if needed
    }

    // ==================
    // DOM METHODS
    // ==================

    render(parent: HTMLElement | string): HTMLElement {
        const container =
            typeof parent === "string"
                ? document.querySelector(parent)
                : parent;

        if (!container) {
            throw new Error(
                `Field: parent container not found for field "${this.name}"`
            );
        }

        const wrapper = document.createElement("div");
        wrapper.className = `field ${this.className || ""}`.trim();
        wrapper.setAttribute("data-field", this.name);

        // Label
        if (this.label) {
            const label = document.createElement("label");
            label.htmlFor = this.name;
            label.className = "field-label";
            label.textContent = this.label;

            if (this.isRequired) {
                const required = document.createElement("span");
                required.className = "field-required";
                required.textContent = " *";
                label.appendChild(required);
            }

            wrapper.appendChild(label);
        }

        // Input
        const input = this._createInput();
        wrapper.appendChild(input);

        // Error message
        const errorEl = document.createElement("div");
        errorEl.className = "field-error";
        errorEl.setAttribute("role", "alert");
        errorEl.style.display = "none";
        wrapper.appendChild(errorEl);

        // Subscribe to error changes
        const errorSignal = this._error as any;
        const errorUnsub = errorSignal.subscribe?.(() => {
            const msg = this._error();
            errorEl.textContent = msg || "";
            errorEl.style.display = msg ? "block" : "none";
            input.classList.toggle("field-error-input", !!msg);
        });

        if (errorUnsub) {
            this._subscriptions.push(errorUnsub);
        }

        container.appendChild(wrapper);
        this._el = input;
        this._wrapper = wrapper;
        return wrapper;
    }

    private _createInput(): HTMLInputElement | HTMLTextAreaElement {
        let input: HTMLInputElement | HTMLTextAreaElement;

        if (this.type === "textarea") {
            input = document.createElement("textarea");
            input.rows = this.rows;
            input.value = this.value;
        } else {
            input = document.createElement("input");
            input.type = this.type;
            input.value = this.value;
        }

        input.id = this.name;
        input.name = this.name;
        input.placeholder = this.placeholder;
        input.disabled = this.disabled;
        input.className = "field-input";

        if (this.isRequired) input.required = true;

        input.addEventListener("change", e => this.handleChange(e));
        input.addEventListener("input", e => this.handleChange(e));
        input.addEventListener("blur", () => this.handleBlur());
        input.addEventListener("focus", () => this.handleFocus());

        return input;
    }

    focus(): void {
        this._el?.focus();
    }

    blur(): void {
        this._el?.blur();
    }

    destroy(): void {
        // Clean up subscriptions
        this._subscriptions.forEach(unsub => {
            if (typeof unsub === "function") unsub();
        });
        this._subscriptions = [];

        // Clean up timers
        if (this._debounceTimer) {
            clearTimeout(this._debounceTimer);
        }

        // Clean up DOM
        this._el = null;
        this._wrapper?.remove();
        this._wrapper = null;
    }
}

export default Field;
