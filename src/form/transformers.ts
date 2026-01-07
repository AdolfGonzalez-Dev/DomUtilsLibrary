/**
 * Form Value Transformers
 * Type-safe functions to preprocess/transform field values
 *
 * @module form/transformers
 * @example
 * import { trim, lowercase, parseNumber } from 'domutils/form';
 *
 * const transformers = [trim(), lowercase()];
 */

import type { TransformerFn } from "./types";

// ============================================================================
// STRING TRANSFORMERS
// ============================================================================

/**
 * Trim whitespace from start and end
 */
export function trim(): TransformerFn {
    return (value: any): any => {
        if (typeof value !== "string") return value;
        return value.trim();
    };
}

/**
 * Convert to uppercase
 */
export function uppercase(): TransformerFn {
    return (value: any): any => {
        if (typeof value !== "string") return value;
        return value.toUpperCase();
    };
}

/**
 * Convert to lowercase
 */
export function lowercase(): TransformerFn {
    return (value: any): any => {
        if (typeof value !== "string") return value;
        return value.toLowerCase();
    };
}

/**
 * Capitalize first letter
 */
export function capitalize(): TransformerFn {
    return (value: any): any => {
        if (typeof value !== "string") return value;
        if (value.length === 0) return value;
        return value.charAt(0).toUpperCase() + value.slice(1);
    };
}

/**
 * Capitalize first letter of each word
 */
export function capitalizeWords(): TransformerFn {
    return (value: any): any => {
        if (typeof value !== "string") return value;
        return value
            .split(" ")
            .map(
                word =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ");
    };
}

// ============================================================================
// NUMBER TRANSFORMERS
// ============================================================================

/**
 * Parse as number
 */
export function parseNumber(): TransformerFn {
    return (value: any): any => {
        if (value === "" || value === null || value === undefined) return "";
        const num = Number(value);
        return isNaN(num) ? 0 : num;
    };
}

/**
 * Parse as integer
 */
export function parseInt(): TransformerFn {
    return (value: any): any => {
        if (value === "" || value === null || value === undefined) return "";
        const num = Math.floor(Number(value));
        return isNaN(num) ? 0 : num;
    };
}

/**
 * Round to decimal places
 */
export function round(decimals: number = 0): TransformerFn {
    return (value: any): any => {
        if (value === "" || value === null || value === undefined) return "";
        const num = Number(value);
        if (isNaN(num)) return 0;
        return Number(num.toFixed(decimals));
    };
}

/**
 * Clamp number between min and max
 */
export function clamp(min: number, max: number): TransformerFn {
    return (value: any): any => {
        const num = Number(value);
        if (isNaN(num)) return min;
        return Math.max(min, Math.min(max, num));
    };
}

// ============================================================================
// BOOLEAN TRANSFORMERS
// ============================================================================

/**
 * Parse as boolean
 */
export function parseBoolean(): TransformerFn {
    return (value: any): any => {
        if (typeof value === "boolean") return value;
        if (value === "true" || value === "1" || value === 1) return true;
        if (value === "false" || value === "0" || value === 0) return false;
        return Boolean(value);
    };
}

// ============================================================================
// STRING CLEANING TRANSFORMERS
// ============================================================================

/**
 * Remove all non-alphanumeric characters
 */
export function alphanumericOnly(): TransformerFn {
    return (value: any): any => {
        if (typeof value !== "string") return value;
        return value.replace(/[^a-zA-Z0-9]/g, "");
    };
}

/**
 * Remove all non-numeric characters
 */
export function digitsOnly(): TransformerFn {
    return (value: any): any => {
        if (typeof value !== "string") return value;
        return value.replace(/\D/g, "");
    };
}

/**
 * Remove all whitespace
 */
export function removeWhitespace(): TransformerFn {
    return (value: any): any => {
        if (typeof value !== "string") return value;
        return value.replace(/\s/g, "");
    };
}

/**
 * Remove special characters (keep letters, numbers, spaces)
 */
export function removeSpecialChars(): TransformerFn {
    return (value: any): any => {
        if (typeof value !== "string") return value;
        return value.replace(/[^a-zA-Z0-9\s]/g, "");
    };
}

/**
 * Normalize whitespace (collapse multiple spaces to one)
 */
export function normalizeWhitespace(): TransformerFn {
    return (value: any): any => {
        if (typeof value !== "string") return value;
        return value.replace(/\s+/g, " ").trim();
    };
}

// ============================================================================
// ADVANCED TRANSFORMERS
// ============================================================================

/**
 * Replace pattern with string
 */
export function replace(
    pattern: string | RegExp,
    replacement: string
): TransformerFn {
    return (value: any): any => {
        if (typeof value !== "string") return value;
        return value.replace(pattern, replacement);
    };
}

/**
 * Truncate string to max length
 */
export function truncate(
    maxLength: number,
    suffix: string = "..."
): TransformerFn {
    return (value: any): any => {
        if (typeof value !== "string") return value;
        if (value.length <= maxLength) return value;
        return value.substring(0, maxLength - suffix.length) + suffix;
    };
}

/**
 * Pad start with character
 */
export function padStart(length: number, char: string = " "): TransformerFn {
    return (value: any): any => {
        return String(value).padStart(length, char);
    };
}

/**
 * Pad end with character
 */
export function padEnd(length: number, char: string = " "): TransformerFn {
    return (value: any): any => {
        return String(value).padEnd(length, char);
    };
}

/**
 * Slugify string (convert to URL-friendly slug)
 */
export function slugify(): TransformerFn {
    return (value: any): any => {
        if (typeof value !== "string") return value;
        return value
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };
}

// ============================================================================
// FORMAT TRANSFORMERS
// ============================================================================

/**
 * Format as phone number (US format)
 */
export function formatPhone(): TransformerFn {
    return (value: any): any => {
        if (typeof value !== "string") return value;
        const digits = value.replace(/\D/g, "");

        if (digits.length === 0) return "";
        if (digits.length <= 3) return digits;
        if (digits.length <= 6)
            return `${digits.slice(0, 3)}-${digits.slice(3)}`;
        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(
            6,
            10
        )}`;
    };
}

/**
 * Format as currency
 */
export function formatCurrency(
    locale: string = "en-US",
    currency: string = "USD"
): TransformerFn {
    return (value: any): any => {
        const num = Number(value);
        if (isNaN(num)) return value;

        try {
            return new Intl.NumberFormat(locale, {
                style: "currency",
                currency
            }).format(num);
        } catch {
            return value;
        }
    };
}

/**
 * Format as date string
 */
export function formatDate(format: string = "yyyy-MM-dd"): TransformerFn {
    return (value: any): any => {
        if (!value) return "";

        const date = new Date(value);
        if (isNaN(date.getTime())) return value;

        // Simple format implementation
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return format
            .replace("yyyy", String(year))
            .replace("MM", month)
            .replace("dd", day);
    };
}

// ============================================================================
// ARRAY TRANSFORMERS
// ============================================================================

/**
 * Split string into array
 */
export function split(separator: string | RegExp = ","): TransformerFn {
    return (value: any): any => {
        if (typeof value !== "string") return value;
        return value
            .split(separator)
            .map(s => s.trim())
            .filter(Boolean);
    };
}

/**
 * Join array into string
 */
export function join(separator: string = ", "): TransformerFn {
    return (value: any): any => {
        if (!Array.isArray(value)) return value;
        return value.join(separator);
    };
}

/**
 * Remove duplicates from array
 */
export function unique(): TransformerFn {
    return (value: any): any => {
        if (!Array.isArray(value)) return value;
        return [...new Set(value)];
    };
}

/**
 * Sort array
 */
export function sort(compareFn?: (a: any, b: any) => number): TransformerFn {
    return (value: any): any => {
        if (!Array.isArray(value)) return value;
        return [...value].sort(compareFn);
    };
}

// ============================================================================
// OBJECT TRANSFORMERS
// ============================================================================

/**
 * Parse JSON string
 */
export function parseJSON(): TransformerFn {
    return (value: any): any => {
        if (typeof value !== "string") return value;
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    };
}

/**
 * Stringify to JSON
 */
export function stringifyJSON(space?: number): TransformerFn {
    return (value: any): any => {
        try {
            return JSON.stringify(value, null, space);
        } catch {
            return value;
        }
    };
}

// ============================================================================
// CUSTOM TRANSFORMER
// ============================================================================

/**
 * Custom transformer
 */
export function custom(fn: TransformerFn): TransformerFn {
    return fn;
}

// ============================================================================
// COMPOSE TRANSFORMERS
// ============================================================================

/**
 * Compose multiple transformers
 */
export function compose(...transformers: TransformerFn[]): TransformerFn {
    return (value: any): any => {
        return transformers.reduce(
            (acc, transformer) => transformer(acc),
            value
        );
    };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    trim,
    uppercase,
    lowercase,
    capitalize,
    capitalizeWords,
    parseNumber,
    parseInt,
    round,
    clamp,
    parseBoolean,
    alphanumericOnly,
    digitsOnly,
    removeWhitespace,
    removeSpecialChars,
    normalizeWhitespace,
    replace,
    truncate,
    padStart,
    padEnd,
    slugify,
    formatPhone,
    formatCurrency,
    formatDate,
    split,
    join,
    unique,
    sort,
    parseJSON,
    stringifyJSON,
    custom,
    compose
};
