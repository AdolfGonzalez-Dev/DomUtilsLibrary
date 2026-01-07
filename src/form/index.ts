/**
 * Form Module
 * Complete form validation and management system
 *
 * @module form
 * @example
 * import { createForm, required, email, trim } from 'domutils/form';
 *
 * const form = createForm({
 *   fields: {
 *     email: {
 *       type: 'email',
 *       validators: [required(), email()],
 *       transformers: [trim(), lowercase()]
 *     }
 *   },
 *   onSubmit: async (values) => {
 *     await api.submit(values);
 *   }
 * });
 */

// ============================================================================
// CORE CLASSES
// ============================================================================

export { Field, default as FieldClass } from "./field";
export { Form, createForm, default as FormClass } from "./form";

// ============================================================================
// HOOKS / COMPOSABLES
// ============================================================================

export { useForm, useField, useFormField } from "./composables";

// ============================================================================
// VALIDATORS
// ============================================================================

export {
    // Basic validators
    required,
    email,
    minLength,
    maxLength,
    minValue,
    maxValue,
    pattern,

    // Advanced validators
    url,
    number,
    integer,
    phone,

    // Composite validators
    compose,
    custom,
    asyncValidator,
    when,
    match,

    // Range validators
    range,
    lengthRange,

    // Special validators
    oneOf,
    notOneOf,
    contains,
    equals,
    notEquals,

    // Date validators
    minDate,
    maxDate
} from "./validators";

// ============================================================================
// TRANSFORMERS
// ============================================================================

export {
    // String transformers
    trim,
    uppercase,
    lowercase,
    capitalize,
    capitalizeWords,

    // Number transformers
    parseNumber,
    parseInt,
    round,
    clamp,

    // Boolean transformers
    parseBoolean,

    // String cleaning
    alphanumericOnly,
    digitsOnly,
    removeWhitespace,
    removeSpecialChars,
    normalizeWhitespace,

    // Advanced transformers
    replace,
    truncate,
    padStart,
    padEnd,
    slugify,

    // Format transformers
    formatPhone,
    formatCurrency,
    formatDate,

    // Array transformers
    split,
    join,
    unique,
    sort,

    // Object transformers
    parseJSON,
    stringifyJSON,

    // Utilities
    custom as customTransformer,
    compose as composeTransformers
} from "./transformers";

// ============================================================================
// ERROR CLASSES
// ============================================================================

export {
    DOMUtilsError,
    ValidationError,
    FieldNotFoundError,
    FormError,
    SubmissionError,
    ConfigurationError
} from "./errors";

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type {
    // Core types
    ValidationResult,
    AsyncValidationResult,
    ValidatorFn,
    ValidatorOptions,
    TransformerFn,

    // Field types
    FieldConfig,
    FieldState,

    // Form types
    FormConfig,
    FormState,
    FormErrors,
    FormTouched,

    // Hook types
    UseFormReturn,
    UseFieldReturn
} from "./types";

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

import { createForm } from "./form";
export default createForm;
