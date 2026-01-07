/**
 * Form Validators
 * Type-safe validation functions for form fields
 *
 * @module form/validators
 * @example
 * import { required, email, minLength } from 'domutils/form';
 *
 * const validators = [
 *   required('Email is required'),
 *   email('Invalid email format'),
 *   minLength(5, 'Too short')
 * ];
 */

import type {
    ValidatorFn,
    ValidationResult,
    AsyncValidationResult
} from "./types";

// ============================================================================
// BASIC VALIDATORS
// ============================================================================

/**
 * Validate that field has a value
 */
export function required(
    message: string = "This field is required"
): ValidatorFn {
    return (value: any): ValidationResult => {
        if (!value && value !== 0 && value !== false) {
            return message;
        }
        return null;
    };
}

/**
 * Validate email format
 */
export function email(message: string = "Invalid email address"): ValidatorFn {
    return (value: any): ValidationResult => {
        if (!value) return null;
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(String(value))) return message;
        return null;
    };
}

/**
 * Validate minimum string length
 */
export function minLength(min: number, message?: string): ValidatorFn {
    const msg = message || `Minimum ${min} characters required`;
    return (value: any): ValidationResult => {
        if (!value) return null;
        if (String(value).length < min) return msg;
        return null;
    };
}

/**
 * Validate maximum string length
 */
export function maxLength(max: number, message?: string): ValidatorFn {
    const msg = message || `Maximum ${max} characters allowed`;
    return (value: any): ValidationResult => {
        if (!value) return null;
        if (String(value).length > max) return msg;
        return null;
    };
}

/**
 * Validate minimum numeric value
 */
export function minValue(min: number, message?: string): ValidatorFn {
    const msg = message || `Minimum value is ${min}`;
    return (value: any): ValidationResult => {
        if (value === null || value === undefined || value === "") return null;
        if (Number(value) < min) return msg;
        return null;
    };
}

/**
 * Validate maximum numeric value
 */
export function maxValue(max: number, message?: string): ValidatorFn {
    const msg = message || `Maximum value is ${max}`;
    return (value: any): ValidationResult => {
        if (value === null || value === undefined || value === "") return null;
        if (Number(value) > max) return msg;
        return null;
    };
}

/**
 * Validate against regex pattern
 */
export function pattern(
    regex: RegExp,
    message: string = "Invalid format"
): ValidatorFn {
    return (value: any): ValidationResult => {
        if (!value) return null;
        if (!regex.test(String(value))) return message;
        return null;
    };
}

// ============================================================================
// ADVANCED VALIDATORS
// ============================================================================

/**
 * URL validator
 */
export function url(message: string = "Invalid URL"): ValidatorFn {
    return (value: any): ValidationResult => {
        if (!value) return null;
        try {
            new URL(value);
            return null;
        } catch {
            return message;
        }
    };
}

/**
 * Number validator
 */
export function number(message: string = "Must be a number"): ValidatorFn {
    return (value: any): ValidationResult => {
        if (!value && value !== 0) return null;
        if (isNaN(Number(value))) return message;
        return null;
    };
}

/**
 * Integer validator
 */
export function integer(message: string = "Must be an integer"): ValidatorFn {
    return (value: any): ValidationResult => {
        if (!value && value !== 0) return null;
        if (!Number.isInteger(Number(value))) return message;
        return null;
    };
}

/**
 * Phone number validator (basic)
 */
export function phone(message: string = "Invalid phone number"): ValidatorFn {
    return (value: any): ValidationResult => {
        if (!value) return null;
        const digits = String(value).replace(/\D/g, "");
        if (digits.length < 10) return message;
        return null;
    };
}

// ============================================================================
// COMPOSITE VALIDATORS
// ============================================================================

/**
 * Compose multiple validators
 */
export function compose(...validators: ValidatorFn[]): ValidatorFn {
    return async (
        value: any,
        formValues?: Record<string, any>
    ): Promise<ValidationResult> => {
        for (const validator of validators) {
            const error = await Promise.resolve(validator(value, formValues));
            if (error) return error;
        }
        return null;
    };
}

/**
 * Custom validator with function
 */
export function custom(
    fn: (value: any) => boolean | string | null,
    message: string = "Validation failed"
): ValidatorFn {
    return (value: any): ValidationResult => {
        try {
            const result = fn(value);
            if (result === false) return message;
            if (typeof result === "string") return result;
            return null;
        } catch (err) {
            return message;
        }
    };
}

/**
 * Async validator (for server-side validation)
 */
export function asyncValidator(
    fn: (value: any) => Promise<boolean | string | null>,
    message: string = "Validation failed"
): ValidatorFn {
    return async (value: any): Promise<ValidationResult> => {
        try {
            const result = await fn(value);
            if (result === false) return message;
            if (typeof result === "string") return result;
            return null;
        } catch (err) {
            console.error("Async validator error:", err);
            return message;
        }
    };
}

/**
 * Conditional validator - validate only if condition is met
 */
export function when(
    condition: (formValues: Record<string, any>) => boolean,
    validator: ValidatorFn
): ValidatorFn {
    return (
        value: any,
        formValues?: Record<string, any>
    ): ValidationResult | AsyncValidationResult => {
        if (formValues && condition(formValues)) {
            return validator(value, formValues);
        }
        return null;
    };
}

/**
 * Field match validator - check if value matches another field
 */
export function match(fieldName: string, message?: string): ValidatorFn {
    const msg = message || "Fields do not match";
    return (value: any, formValues?: Record<string, any>): ValidationResult => {
        if (formValues && formValues[fieldName] !== value) {
            return msg;
        }
        return null;
    };
}

// ============================================================================
// RANGE VALIDATORS
// ============================================================================

/**
 * Validate value is within range (inclusive)
 */
export function range(min: number, max: number, message?: string): ValidatorFn {
    const msg = message || `Value must be between ${min} and ${max}`;
    return (value: any): ValidationResult => {
        if (value === null || value === undefined || value === "") return null;
        const num = Number(value);
        if (num < min || num > max) return msg;
        return null;
    };
}

/**
 * Validate string length is within range
 */
export function lengthRange(
    min: number,
    max: number,
    message?: string
): ValidatorFn {
    const msg =
        message || `Length must be between ${min} and ${max} characters`;
    return (value: any): ValidationResult => {
        if (!value) return null;
        const len = String(value).length;
        if (len < min || len > max) return msg;
        return null;
    };
}

// ============================================================================
// SPECIAL VALIDATORS
// ============================================================================

/**
 * Validate value is one of allowed values
 */
export function oneOf(allowed: any[], message?: string): ValidatorFn {
    const msg = message || `Value must be one of: ${allowed.join(", ")}`;
    return (value: any): ValidationResult => {
        if (!value) return null;
        if (!allowed.includes(value)) return msg;
        return null;
    };
}

/**
 * Validate value is NOT one of disallowed values
 */
export function notOneOf(disallowed: any[], message?: string): ValidatorFn {
    const msg = message || `Value cannot be one of: ${disallowed.join(", ")}`;
    return (value: any): ValidationResult => {
        if (!value) return null;
        if (disallowed.includes(value)) return msg;
        return null;
    };
}

/**
 * Validate array/string contains specific value
 */
export function contains(searchValue: any, message?: string): ValidatorFn {
    const msg = message || `Must contain: ${searchValue}`;
    return (value: any): ValidationResult => {
        if (!value) return null;
        if (Array.isArray(value)) {
            if (!value.includes(searchValue)) return msg;
        } else if (typeof value === "string") {
            if (!value.includes(String(searchValue))) return msg;
        }
        return null;
    };
}

/**
 * Validate value matches another field (equality check)
 */
export function equals(compareValue: any, message?: string): ValidatorFn {
    const msg = message || "Values do not match";
    return (value: any): ValidationResult => {
        if (value !== compareValue) return msg;
        return null;
    };
}

/**
 * Validate value does NOT match another value
 */
export function notEquals(compareValue: any, message?: string): ValidatorFn {
    const msg = message || "Values must be different";
    return (value: any): ValidationResult => {
        if (value === compareValue) return msg;
        return null;
    };
}

// ============================================================================
// DATE VALIDATORS
// ============================================================================

/**
 * Validate date is after minimum date
 */
export function minDate(minDate: Date | string, message?: string): ValidatorFn {
    const min = new Date(minDate);
    const msg = message || `Date must be after ${min.toLocaleDateString()}`;

    return (value: any): ValidationResult => {
        if (!value) return null;
        const date = new Date(value);
        if (isNaN(date.getTime())) return "Invalid date";
        if (date < min) return msg;
        return null;
    };
}

/**
 * Validate date is before maximum date
 */
export function maxDate(maxDate: Date | string, message?: string): ValidatorFn {
    const max = new Date(maxDate);
    const msg = message || `Date must be before ${max.toLocaleDateString()}`;

    return (value: any): ValidationResult => {
        if (!value) return null;
        const date = new Date(value);
        if (isNaN(date.getTime())) return "Invalid date";
        if (date > max) return msg;
        return null;
    };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    required,
    email,
    minLength,
    maxLength,
    minValue,
    maxValue,
    pattern,
    url,
    number,
    integer,
    phone,
    compose,
    custom,
    asyncValidator,
    when,
    match,
    range,
    lengthRange,
    oneOf,
    notOneOf,
    contains,
    equals,
    notEquals,
    minDate,
    maxDate
};
