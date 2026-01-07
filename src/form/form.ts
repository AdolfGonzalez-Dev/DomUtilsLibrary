/**
 * Form Class
 * Main form management with field handling and validation
 *
 * @module form/Form
 * @example
 * import { Form, createForm } from 'domutils/form';
 *
 * const form = createForm({
 *   fields: {
 *     email: { validators: [required(), email()] },
 *     password: { validators: [required(), minLength(8)] }
 *   },
 *   onSubmit: async (values) => {
 *     await api.login(values);
 *   }
 * });
 */

import { $state } from "../reactive/signals";
import { Field } from "./field";
import type {
    FormConfig,
    FieldConfig,
    FormState,
    FormErrors,
    FormTouched
} from "./types.js";

// ============================================================================
// FORM CLASS
// ============================================================================

export class Form {
    // Configuration
    public readonly config: FormConfig;
    public readonly fields: Record<string, Field>;
    public readonly className: string;
    public readonly validateOnChange: boolean;
    public readonly validateOnBlur: boolean;

    // Callbacks
    public readonly onSubmit?: (
        values: Record<string, any>,
        form?: Form
    ) => void | boolean | Promise<void | boolean>;
    public readonly onChange?: (values: Record<string, any>) => void;
    public readonly onError?: (errors: FormErrors | Error) => void;

    // State (reactive)
    public readonly state: FormState & {
        subscribe?: (
            fn: (key: string, oldVal: any, newVal: any) => void
        ) => () => void;
        inspect?: () => FormState;
    };

    // Private
    private _form: HTMLFormElement | null = null;
    private _submitBtn: HTMLButtonElement | null = null;
    private _subscriptions: Array<() => void> = [];

    constructor(config: FormConfig) {
        const {
            fields = {},
            onSubmit,
            onChange,
            onError,
            initialValues = {},
            validateOnChange = false,
            validateOnBlur = true,
            className = ""
        } = config;

        this.config = config;
        this.onSubmit = onSubmit;
        this.onChange = onChange;
        this.onError = onError;
        this.className = className;
        this.validateOnChange = validateOnChange;
        this.validateOnBlur = validateOnBlur;

        // Create field instances
        this.fields = {};
        Object.entries(fields).forEach(([name, fieldConfig]) => {
            const cfg =
                typeof fieldConfig === "function"
                    ? (fieldConfig as () => any)()
                    : fieldConfig;

            this.fields[name] = new Field({
                name,
                value: initialValues[name] ?? cfg.value ?? "",
                ...cfg
            });

            // Link form values getter to field
            (this.fields[name] as any)._getFormValues = () => this.getValues();
        });

        // Initialize reactive state
        this.state = $state<FormState>({
            values: this._getInitialValues(),
            isDirty: false,
            isSubmitting: false,
            submitCount: 0
        });
    }

    // ==================
    // GETTERS
    // ==================

    getValues(): Record<string, any> {
        return Object.entries(this.fields).reduce(
            (acc, [name, field]) => {
                acc[name] = field.value;
                return acc;
            },
            {} as Record<string, any>
        );
    }

    getErrors(): FormErrors {
        return Object.entries(this.fields).reduce((acc, [name, field]) => {
            if (field.errorMessage) {
                acc[name] = field.errorMessage;
            }
            return acc;
        }, {} as FormErrors);
    }

    getTouched(): FormTouched {
        return Object.entries(this.fields).reduce((acc, [name, field]) => {
            if (field.isTouched) {
                acc[name] = true;
            }
            return acc;
        }, {} as FormTouched);
    }

    get isDirty(): boolean {
        return Object.values(this.fields).some(f => f.isDirty);
    }

    get isSubmitting(): boolean {
        return this.state.isSubmitting;
    }

    get isValidating(): boolean {
        return Object.values(this.fields).some(f => f.isValidating);
    }

    get isValid(): boolean {
        return !Object.values(this.fields).some(f => f.errorMessage);
    }

    getField(name: string): Field | null {
        return this.fields[name] || null;
    }

    // ==================
    // VALUE METHODS
    // ==================

    setValues(values: Record<string, any>): void {
        Object.entries(values).forEach(([name, value]) => {
            if (this.fields[name]) {
                this.fields[name].setValue(value);
            }
        });
    }

    setValue(name: string, value: any): void {
        if (this.fields[name]) {
            this.fields[name].setValue(value);
        } else {
            console.warn(`Field "${name}" not found in form`);
        }
    }

    reset(values?: Record<string, any>): void {
        Object.values(this.fields).forEach(field => {
            field.reset(values?.[field.name]);
        });
        this.state.isSubmitting = false;
        this.state.submitCount = 0;
    }

    // ==================
    // VALIDATION
    // ==================

    async validate(): Promise<boolean> {
        const promises = Object.values(this.fields).map(field =>
            field.validate()
        );

        const results = await Promise.all(promises);
        return results.every(r => r === true);
    }

    async validateField(name: string): Promise<boolean> {
        if (this.fields[name]) {
            return this.fields[name].validate();
        }
        console.warn(`Field "${name}" not found`);
        return false;
    }

    // ==================
    // SUBMIT
    // ==================

    async submit(e?: Event): Promise<boolean> {
        if (e) e.preventDefault();

        const isValid = await this.validate();

        if (!isValid) {
            const errors = this.getErrors();
            this.onError?.(errors);
            return false;
        }

        this.state.isSubmitting = true;
        this.state.submitCount = (this.state.submitCount || 0) + 1;

        try {
            const values = this.getValues();
            const result = await this.onSubmit?.(values, this);
            return result !== false;
        } catch (err) {
            console.error("Form submission error:", err);
            this.onError?.(err as Error);
            return false;
        } finally {
            this.state.isSubmitting = false;
        }
    }

    // ==================
    // RENDERING
    // ==================

    render(parent: HTMLElement | string): HTMLFormElement {
        const container =
            typeof parent === "string"
                ? document.querySelector(parent)
                : parent;

        if (!container) {
            throw new Error("Form: parent container not found");
        }

        const form = document.createElement("form");
        form.className = `form ${this.className}`.trim();
        form.noValidate = true; // Disable HTML5 validation

        // Render all fields
        Object.values(this.fields).forEach(field => {
            field.render(form);
        });

        // Submit button
        const buttonWrapper = document.createElement("div");
        buttonWrapper.className = "form-actions";

        const submitBtn = document.createElement("button");
        submitBtn.type = "submit";
        submitBtn.className = "form-submit-btn";
        submitBtn.textContent = "Submit";
        submitBtn.id = "form-submit-btn";

        buttonWrapper.appendChild(submitBtn);
        form.appendChild(buttonWrapper);

        // Handle submit
        form.addEventListener("submit", e => this.submit(e));

        container.appendChild(form);
        this._form = form;
        this._submitBtn = submitBtn;

        return form;
    }

    // ==================
    // PRIVATE METHODS
    // ==================

    private _getInitialValues(): Record<string, any> {
        return Object.entries(this.fields).reduce(
            (acc, [name, field]) => {
                acc[name] = field.value;
                return acc;
            },
            {} as Record<string, any>
        );
    }

    // ==================
    // CLEANUP
    // ==================

    destroy(): void {
        // Destroy all fields
        Object.values(this.fields).forEach(field => field.destroy());

        // Clean up subscriptions
        this._subscriptions.forEach(unsub => {
            if (typeof unsub === "function") unsub();
        });
        this._subscriptions = [];

        // Clean up DOM
        this._form?.remove();
        this._form = null;
        this._submitBtn = null;
    }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

/**
 * Factory function to create a form
 */
export function createForm(config: FormConfig): Form {
    return new Form(config);
}

export default Form;
