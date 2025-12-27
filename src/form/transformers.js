/**
 * Form Value Transformers
 * Functions to preprocess/transform field values
 * @module form/transformers
 */

/**
 * Trim whitespace from start and end
 * @returns {Function} Transformer
 */
export function trim() {
  return (value) => {
    if (typeof value !== 'string') return value;
    return value.trim();
  };
}

/**
 * Convert to uppercase
 * @returns {Function} Transformer
 */
export function uppercase() {
  return (value) => {
    if (typeof value !== 'string') return value;
    return value.toUpperCase();
  };
}

/**
 * Convert to lowercase
 * @returns {Function} Transformer
 */
export function lowercase() {
  return (value) => {
    if (typeof value !== 'string') return value;
    return value.toLowerCase();
  };
}

/**
 * Capitalize first letter
 * @returns {Function} Transformer
 */
export function capitalize() {
  return (value) => {
    if (typeof value !== 'string') return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  };
}

/**
 * Parse as number
 * @returns {Function} Transformer
 */
export function parseNumber() {
  return (value) => {
    if (value === '' || value === null || value === undefined) return '';
    return Number(value) || 0;
  };
}

/**
 * Parse as integer
 * @returns {Function} Transformer
 */
export function parseInt() {
  return (value) => {
    if (value === '' || value === null || value === undefined) return '';
    return Math.floor(Number(value)) || 0;
  };
}

/**
 * Parse as boolean
 * @returns {Function} Transformer
 */
export function parseBoolean() {
  return (value) => {
    if (typeof value === 'boolean') return value;
    if (value === 'true' || value === '1' || value === 1) return true;
    if (value === 'false' || value === '0' || value === 0) return false;
    return Boolean(value);
  };
}

/**
 * Remove all non-alphanumeric characters
 * @returns {Function} Transformer
 */
export function alphanumericOnly() {
  return (value) => {
    if (typeof value !== 'string') return value;
    return value.replace(/[^a-zA-Z0-9]/g, '');
  };
}

/**
 * Remove all non-numeric characters
 * @returns {Function} Transformer
 */
export function digitsOnly() {
  return (value) => {
    if (typeof value !== 'string') return value;
    return value.replace(/\D/g, '');
  };
}

/**
 * Custom transformer
 * @param {Function} fn - Transform function
 * @returns {Function} Transformer
 */
export function custom(fn) {
  return fn;
}

export default {
  trim,
  uppercase,
  lowercase,
  capitalize,
  parseNumber,
  parseInt,
  parseBoolean,
  alphanumericOnly,
  digitsOnly,
  custom
};