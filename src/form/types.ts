/**
 * Form System Type Definitions
 * Complete type safety for form validation and management
 */

// ============================================================================
// VALIDATOR TYPES
// ============================================================================

/**
 * Validation result: null = valid, string = error message
 */
export type ValidationResult = string | null;

/**
 * Async validation result
 */
export type AsyncValidationResult = Promise<ValidationResult>;

/**
 * Validator function (can be sync or async)
 */
export type ValidatorFn = (
    value: any,
    formValues?: Record<string, any>
) => ValidationResult | AsyncValidationResult;

/**
 * Validator options
 */
export interface ValidatorOptions {
    message?: string;
}

// ============================================================================
// TRANSFORMER TYPES
// ============================================================================

/**
 * Value transformer function
 */
export type TransformerFn = (value: any) => any;

// ============================================================================
// FIELD TYPES
// ============================================================================

/**
 * Base field configuration
 */
export interface BaseFieldConfig {
    /** Field name/key */
    name?: string;

    /** Input type */
    type?: string;

    /** Initial value */
    value?: any;

    /** Validation functions */
    validators?: ValidatorFn[];

    /** Value transformers */
    transformers?: TransformerFn[];

    /** Debounce delay for validation (ms) */
    debounce?: number;

    /** Debounce delay for async validation (ms) */
    debounceAsync?: number;

    /** Field label */
    label?: string;

    /** Placeholder text */
    placeholder?: string;

    /** Is field required */
    required?: boolean;

    /** Is field disabled */
    disabled?: boolean;

    /** CSS class name */
    className?: string;

    /** Textarea rows */
    rows?: number;
}

/**
 * Field configuration (can be object or function returning object)
 */
export type FieldConfig = BaseFieldConfig | (() => BaseFieldConfig);

/**
 * Field state
 */
export interface FieldState {
    /** Current value */
    value: any;

    /** Current error message */
    error: string | null;

    /** Has value been changed */
    isDirty: boolean;

    /** Has field been focused/blurred */
    isTouched: boolean;

    /** Is field valid */
    isValid: boolean;

    /** Is validation running */
    isValidating: boolean;
}

// ============================================================================
// FORM TYPES
// ============================================================================

/**
 * Form configuration
 */
export interface FormConfig {
    /** Field definitions */
    fields: Record<string, FieldConfig>;

    /** Submit handler - can return void or boolean to control submission result */
    onSubmit?: (
        values: Record<string, any>,
        form?: any
    ) => void | boolean | Promise<void | boolean>;

    /** Change handler */
    onChange?: (values: Record<string, any>) => void;

    /** Error handler */
    onError?: (errors: Record<string, string> | Error) => void;

    /** Initial values */
    initialValues?: Record<string, any>;

    /** Validate on every change */
    validateOnChange?: boolean;

    /** Validate on blur */
    validateOnBlur?: boolean;

    /** Form CSS class */
    className?: string;
}

/**
 * Form state
 */
export interface FormState {
    /** All field values */
    values: Record<string, any>;

    /** Is form dirty (any field changed) */
    isDirty: boolean;

    /** Is form submitting */
    isSubmitting: boolean;

    /** Submit attempt count */
    submitCount: number;
}

/**
 * Form errors
 */
export type FormErrors = Record<string, string>;

/**
 * Form touched fields
 */
export type FormTouched = Record<string, boolean>;

// ============================================================================
// HOOK TYPES
// ============================================================================

/**
 * useForm return type
 */
export interface UseFormReturn {
    /** Current values */
    values: Record<string, any>;

    /** Current errors */
    errors: FormErrors;

    /** Touched fields */
    touched: FormTouched;

    /** Is form dirty */
    isDirty: boolean;

    /** Is form valid */
    isValid: boolean;

    /** Is form submitting */
    isSubmitting: boolean;

    /** Is any field validating */
    isValidating: boolean;

    /** Get single field value */
    getFieldValue(name: string): any;

    /** Set single field value */
    setFieldValue(name: string, value: any): void;

    /** Set multiple values */
    setValues(values: Record<string, any>): void;

    /** Reset single field */
    resetField(name: string): void;

    /** Reset entire form */
    reset(): void;

    /** Validate all fields */
    validate(): Promise<boolean>;

    /** Validate single field */
    validateField(name: string): Promise<boolean>;

    /** Submit form */
    submit(e?: Event): Promise<boolean>;

    /** Access to form instance */
    form: any;

    /** Get field instance */
    getField(name: string): any;
}

/**
 * useField return type
 */
export interface UseFieldReturn {
    /** Current value */
    value: any;

    /** Current error */
    error: string | null;

    /** Is field dirty */
    isDirty: boolean;

    /** Is field touched */
    isTouched: boolean;

    /** Is field valid */
    isValid: boolean;

    /** Is field validating */
    isValidating: boolean;

    /** Set value */
    setValue(value: any): void;

    /** Get value */
    getValue(): any;

    /** Validate field */
    validate(): Promise<boolean>;

    /** Reset field */
    reset(): void;

    /** Set error manually */
    setError(error: string | null): void;

    /** Handle change event */
    handleChange(e: Event): void;

    /** Handle blur event */
    handleBlur(): void;

    /** Handle focus event */
    handleFocus(): void;

    /** Focus field */
    focus(): void;

    /** Blur field */
    blur(): void;

    /** Access to field instance */
    field: any;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

/**
 * Base error class
 */
export interface DOMUtilsErrorInterface extends Error {
    code: string;
}

/**
 * Validation error
 */
export interface ValidationErrorInterface extends DOMUtilsErrorInterface {
    field: string | null;
    value: any;
}

/**
 * Field not found error
 */
export interface FieldNotFoundErrorInterface extends DOMUtilsErrorInterface {
    fieldName: string;
}
