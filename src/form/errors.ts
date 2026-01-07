/**
 * Form Error Classes
 * Type-safe error classes for form validation and management
 *
 * @module form/errors
 * @example
 * import { ValidationError, FieldNotFoundError } from 'domutils/form';
 *
 * throw new ValidationError('Invalid email', 'email', 'invalid@');
 */

// ============================================================================
// BASE ERROR CLASS
// ============================================================================

/**
 * Base error class for DOMUtils
 */
export class DOMUtilsError extends Error {
    public readonly code: string;

    constructor(message: string, code: string = "GENERIC") {
        super(message);
        this.name = "DOMUtilsError";
        this.code = code;

        // Maintains proper stack trace for where error was thrown (V8 only)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DOMUtilsError);
        }
    }
}

// ============================================================================
// VALIDATION ERROR
// ============================================================================

/**
 * Validation error for forms
 */
export class ValidationError extends DOMUtilsError {
    public readonly field: string | null;
    public readonly value: any;

    constructor(
        message: string,
        field: string | null = null,
        value: any = null
    ) {
        super(message, "VALIDATION");
        this.name = "ValidationError";
        this.field = field;
        this.value = value;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ValidationError);
        }
    }
}

// ============================================================================
// FIELD NOT FOUND ERROR
// ============================================================================

/**
 * Field not found error
 */
export class FieldNotFoundError extends DOMUtilsError {
    public readonly fieldName: string;

    constructor(fieldName: string) {
        super(`Field "${fieldName}" not found`, "FIELD_NOT_FOUND");
        this.name = "FieldNotFoundError";
        this.fieldName = fieldName;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FieldNotFoundError);
        }
    }
}

// ============================================================================
// FORM ERROR
// ============================================================================

/**
 * General form error
 */
export class FormError extends DOMUtilsError {
    public readonly formName?: string;
    public readonly errors?: Record<string, string>;

    constructor(
        message: string,
        formName?: string,
        errors?: Record<string, string>
    ) {
        super(message, "FORM_ERROR");
        this.name = "FormError";
        this.formName = formName;
        this.errors = errors;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FormError);
        }
    }
}

// ============================================================================
// SUBMISSION ERROR
// ============================================================================

/**
 * Form submission error
 */
export class SubmissionError extends DOMUtilsError {
    public readonly originalError?: Error;
    public readonly response?: any;

    constructor(message: string, originalError?: Error, response?: any) {
        super(message, "SUBMISSION_ERROR");
        this.name = "SubmissionError";
        this.originalError = originalError;
        this.response = response;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, SubmissionError);
        }
    }
}

// ============================================================================
// CONFIGURATION ERROR
// ============================================================================

/**
 * Configuration error
 */
export class ConfigurationError extends DOMUtilsError {
    public readonly configKey?: string;

    constructor(message: string, configKey?: string) {
        super(message, "CONFIGURATION_ERROR");
        this.name = "ConfigurationError";
        this.configKey = configKey;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ConfigurationError);
        }
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    DOMUtilsError,
    ValidationError,
    FieldNotFoundError,
    FormError,
    SubmissionError,
    ConfigurationError
};
