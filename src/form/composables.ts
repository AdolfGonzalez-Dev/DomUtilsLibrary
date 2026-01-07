/**
 * Form Composables - Hook style API
 * React-like hooks for form management
 *
 * @module form/composables
 * @example
 * import { useForm, useField } from 'domutils/form';
 *
 * const form = useForm({
 *   initialValues: { email: '', password: '' },
 *   fields: {
 *     email: { validators: [required(), email()] },
 *     password: { validators: [required()] }
 *   },
 *   onSubmit: (values) => console.log(values)
 * });
 */

import { Field } from "./field";
import { Form } from "./form";
import type {
    FormConfig,
    FieldConfig,
    UseFormReturn,
    UseFieldReturn,
    FormErrors,
    FormTouched
} from "./types.js";

// ============================================================================
// USE FORM HOOK
// ============================================================================

/**
 * useForm - Hook style form management
 *
 * @param config - Form configuration
 * @returns Form API object
 *
 * @example
 * const form = useForm({
 *   initialValues: { email: '', password: '' },
 *   fields: {
 *     email: { validators: [required(), email()] },
 *     password: { validators: [required(), minLength(8)] }
 *   },
 *   onSubmit: async (values) => {
 *     await api.login(values);
 *   }
 * });
 *
 * // Access state
 * console.log(form.values);     // { email: '', password: '' }
 * console.log(form.errors);     // { email: 'Required', ... }
 * console.log(form.isDirty);    // boolean
 * console.log(form.isValid);    // boolean
 *
 * // Methods
 * form.setValues({ email: 'test@example.com' });
 * form.validate();
 * form.submit();
 * form.reset();
 */
export function useForm(config: FormConfig): UseFormReturn {
    const form = new Form(config);

    return {
        // ========== State ==========
        get values() {
            return form.getValues();
        },

        get errors(): FormErrors {
            return form.getErrors();
        },

        get touched(): FormTouched {
            return form.getTouched();
        },

        get isDirty(): boolean {
            return form.isDirty;
        },

        get isValid(): boolean {
            return form.isValid;
        },

        get isSubmitting(): boolean {
            return form.isSubmitting;
        },

        get isValidating(): boolean {
            return form.isValidating;
        },

        // ========== Methods ==========
        getFieldValue(name: string): any {
            return form.getField(name)?.value;
        },

        setFieldValue(name: string, value: any): void {
            form.setValue(name, value);
        },

        setValues(values: Record<string, any>): void {
            form.setValues(values);
        },

        resetField(name: string): void {
            form.getField(name)?.reset();
        },

        reset(): void {
            form.reset();
        },

        validate(): Promise<boolean> {
            return form.validate();
        },

        validateField(name: string): Promise<boolean> {
            return form.validateField(name);
        },

        submit(e?: Event): Promise<boolean> {
            return form.submit(e);
        },

        // ========== Direct access ==========
        form,

        getField(name: string): Field | null {
            return form.getField(name);
        }
    };
}

// ============================================================================
// USE FIELD HOOK
// ============================================================================

/**
 * useField - Hook style field management
 *
 * @param config - Field configuration
 * @returns Field API object
 *
 * @example
 * const email = useField({
 *   name: 'email',
 *   validators: [required(), email()],
 *   transformers: [trim(), lowercase()]
 * });
 *
 * // Access state
 * console.log(email.value);        // Current value
 * console.log(email.error);        // Error message
 * console.log(email.isDirty);      // Changed?
 * console.log(email.isTouched);    // Focused?
 *
 * // Methods
 * email.setValue('test@example.com');
 * email.validate();
 * email.reset();
 * email.focus();
 */
export function useField(config: FieldConfig): UseFieldReturn {
    const field = new Field(config);

    return {
        // ========== State ==========
        get value(): any {
            return field.value;
        },

        get error(): string | null {
            return field.errorMessage;
        },

        get isDirty(): boolean {
            return field.isDirty;
        },

        get isTouched(): boolean {
            return field.isTouched;
        },

        get isValid(): boolean {
            return field.isValid;
        },

        get isValidating(): boolean {
            return field.isValidating;
        },

        // ========== Methods ==========
        setValue(value: any): void {
            field.setValue(value);
        },

        getValue(): any {
            return field.getValue();
        },

        validate(): Promise<boolean> {
            return field.validate();
        },

        reset(): void {
            field.reset();
        },

        setError(error: string | null): void {
            field.setError(error);
        },

        handleChange(e: Event): void {
            field.handleChange(e);
        },

        handleBlur(): void {
            field.handleBlur();
        },

        handleFocus(): void {
            field.handleFocus();
        },

        focus(): void {
            field.focus();
        },

        blur(): void {
            field.blur();
        },

        // ========== Direct access ==========
        field
    };
}

// ============================================================================
// USE FORM FIELD HOOK
// ============================================================================

/**
 * useFormField - Hook for managing a field within a form context
 *
 * @param form - Form instance
 * @param fieldName - Field name
 * @returns Field API object
 *
 * @example
 * const form = useForm({ ... });
 * const email = useFormField(form.form, 'email');
 *
 * email.setValue('test@example.com');
 * await email.validate();
 */
export function useFormField(
    form: Form,
    fieldName: string
): UseFieldReturn | null {
    const field = form.getField(fieldName);

    if (!field) {
        console.warn(`Field "${fieldName}" not found in form`);
        return null;
    }

    return {
        get value() {
            return field.value;
        },

        get error() {
            return field.errorMessage;
        },

        get isDirty() {
            return field.isDirty;
        },

        get isTouched() {
            return field.isTouched;
        },

        get isValid() {
            return field.isValid;
        },

        get isValidating() {
            return field.isValidating;
        },

        setValue(value: any) {
            field.setValue(value);
        },

        getValue() {
            return field.getValue();
        },

        validate() {
            return field.validate();
        },

        reset() {
            field.reset();
        },

        setError(error: string | null) {
            field.setError(error);
        },

        handleChange(e: Event) {
            field.handleChange(e);
        },

        handleBlur() {
            field.handleBlur();
        },

        handleFocus() {
            field.handleFocus();
        },

        focus() {
            field.focus();
        },

        blur() {
            field.blur();
        },

        field
    };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    useForm,
    useField,
    useFormField
};
