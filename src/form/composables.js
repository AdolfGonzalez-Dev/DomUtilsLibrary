/**
 * Form Composables - Hook style API
 * @module form/composables
 */

import { createSignal, createEffect } from '../reactive/signals.js';
import Field from './Field.js';
import Form from './Form.js';

/**
 * useForm - Hook style form management
 * 
 * @example
 * const form = useForm({
 *   initialValues: { email: '', password: '' },
 *   fields: {
 *     email: { validators: [required(), email()] },
 *     password: { validators: [required(), minLength(8)] }
 *   },
 *   onSubmit: (values) => { ... }
 * });
 * 
 * @param {Object} config - Form config
 * @returns {Object} Form API
 */
export function useForm(config) {
  const form = new Form(config);

  return {
    // ========== State ==========
    get values() { return form.getValues(); },
    get errors() { return form.getErrors(); },
    get touched() { return form.getTouched(); },
    get isDirty() { return form.isDirty; },
    get isValid() { return form.isValid; },
    get isSubmitting() { return form.isSubmitting; },
    get isValidating() { return form.isValidating; },

    // ========== Methods ==========
    getFieldValue: (name) => form.getField(name)?.value,
    setFieldValue: (name, value) => form.setValue(name, value),
    setValues: (values) => form.setValues(values),
    resetField: (name) => form.getField(name)?.reset(),
    reset: () => form.reset(),
    validate: () => form.validate(),
    validateField: (name) => form.validateField(name),
    submit: (e) => form.submit(e),

    // ========== Direct access ==========
    form,
    getField: (name) => form.getField(name)
  };
}

/**
 * useField - Hook style field management
 * 
 * @example
 * const email = useField({
 *   name: 'email',
 *   validators: [required(), email()],
 *   transformers: [trim()]
 * });
 * 
 * @param {Object} config - Field config
 * @returns {Object} Field API
 */
export function useField(config) {
  const field = new Field(config);

  return {
    // ========== State ==========
    get value() { return field.value; },
    get error() { return field.errorMessage; },
    get isDirty() { return field.isDirty; },
    get isTouched() { return field.isTouched; },
    get isValid() { return field.isValid; },
    get isValidating() { return field.isValidating; },

    // ========== Methods ==========
    setValue: (value) => field.setValue(value),
    getValue: () => field.getValue(),
    validate: () => field.validate(),
    reset: () => field.reset(),
    setError: (error) => field.setError(error),
    handleChange: (e) => field.handleChange(e),
    handleBlur: () => field.handleBlur(),
    handleFocus: () => field.handleFocus(),
    focus: () => field.focus(),
    blur: () => field.blur(),

    // ========== Direct access ==========
    field
  };
}

export default {
  useForm,
  useField
};