/**
 * Form Validators
 * Pure functions that return null (valid) or error message (invalid)
 * @module form/validators
 */

// =====================
// Basic Validators
// =====================

/**
 * Validate that field has a value
 * @param {string} message - Error message
 * @returns {Function} Validator function
 */
export function required(message = 'This field is required') {
  return (value) => {
    if (!value && value !== 0 && value !== false) {
      return message;
    }
    return null;
  };
}

/**
 * Validate email format
 * @param {string} message - Error message
 * @returns {Function} Validator function
 */
export function email(message = 'Invalid email address') {
  return (value) => {
    if (!value) return null;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(value)) return message;
    return null;
  };
}

/**
 * Validate minimum string length
 * @param {number} min - Minimum length
 * @param {string} message - Error message
 * @returns {Function} Validator function
 */
export function minLength(min, message = `Minimum ${min} characters required`) {
  return (value) => {
    if (!value) return null;
    if (String(value).length < min) return message;
    return null;
  };
}

/**
 * Validate maximum string length
 * @param {number} max - Maximum length
 * @param {string} message - Error message
 * @returns {Function} Validator function
 */
export function maxLength(max, message = `Maximum ${max} characters allowed`) {
  return (value) => {
    if (!value) return null;
    if (String(value).length > max) return message;
    return null;
  };
}

/**
 * Validate minimum numeric value
 * @param {number} min - Minimum value
 * @param {string} message - Error message
 * @returns {Function} Validator function
 */
export function minValue(min, message = `Minimum value is ${min}`) {
  return (value) => {
    if (value === null || value === undefined || value === '') return null;
    if (Number(value) < min) return message;
    return null;
  };
}

/**
 * Validate maximum numeric value
 * @param {number} max - Maximum value
 * @param {string} message - Error message
 * @returns {Function} Validator function
 */
export function maxValue(max, message = `Maximum value is ${max}`) {
  return (value) => {
    if (value === null || value === undefined || value === '') return null;
    if (Number(value) > max) return message;
    return null;
  };
}

/**
 * Validate against regex pattern
 * @param {RegExp} regex - Pattern to match
 * @param {string} message - Error message
 * @returns {Function} Validator function
 */
export function pattern(regex, message = 'Invalid format') {
  return (value) => {
    if (!value) return null;
    if (!regex.test(String(value))) return message;
    return null;
  };
}

// =====================
// Composite Validators
// =====================

/**
 * Compose multiple validators
 * @param {...Function} validators - Validator functions
 * @returns {Function} Combined validator
 */
export function compose(...validators) {
  return async (value, formValues) => {
    for (const validator of validators) {
      const error = await Promise.resolve(validator(value, formValues));
      if (error) return error;
    }
    return null;
  };
}

/**
 * Custom validator with function
 * @param {Function} fn - Validation function
 * @param {string} message - Error message if fails
 * @returns {Function} Validator function
 */
export function custom(fn, message = 'Validation failed') {
  return (value) => {
    try {
      const result = fn(value);
      if (result === false) return message;
      if (typeof result === 'string') return result;
      return null;
    } catch (err) {
      return message;
    }
  };
}

/**
 * Async validator (for server-side validation)
 * @param {Function} fn - Async validation function
 * @param {string} message - Error message if fails
 * @returns {Function} Async validator
 */
export function asyncValidator(fn, message = 'Validation failed') {
  return async (value) => {
    try {
      const result = await fn(value);
      if (result === false) return message;
      if (typeof result === 'string') return result;
      return null;
    } catch (err) {
      console.error('Async validator error:', err);
      return message;
    }
  };
}

/**
 * Conditional validator - validate only if condition is met
 * @param {Function} condition - Should return true/false
 * @param {Function} validator - Validator to apply
 * @returns {Function} Conditional validator
 */
export function when(condition, validator) {
  return (value, formValues) => {
    if (condition(formValues)) {
      return validator(value, formValues);
    }
    return null;
  };
}

/**
 * Field match validator - check if value matches another field
 * @param {string} fieldName - Name of field to match
 * @param {string} message - Error message
 * @returns {Function} Match validator
 */
export function match(fieldName, message = 'Fields do not match') {
  return (value, formValues) => {
    if (formValues && formValues[fieldName] !== value) {
      return message;
    }
    return null;
  };
}

/**
 * URL validator
 * @param {string} message - Error message
 * @returns {Function} Validator function
 */
export function url(message = 'Invalid URL') {
  return (value) => {
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
 * @param {string} message - Error message
 * @returns {Function} Validator function
 */
export function number(message = 'Must be a number') {
  return (value) => {
    if (!value && value !== 0) return null;
    if (isNaN(Number(value))) return message;
    return null;
  };
}

/**
 * Integer validator
 * @param {string} message - Error message
 * @returns {Function} Validator function
 */
export function integer(message = 'Must be an integer') {
  return (value) => {
    if (!value && value !== 0) return null;
    if (!Number.isInteger(Number(value))) return message;
    return null;
  };
}

/**
 * Phone number validator (basic)
 * @param {string} message - Error message
 * @returns {Function} Validator function
 */
export function phone(message = 'Invalid phone number') {
  return (value) => {
    if (!value) return null;
    // Very basic: at least 10 digits
    const digits = value.replace(/\D/g, '');
    if (digits.length < 10) return message;
    return null;
  };
}

export default {
  required,
  email,
  minLength,
  maxLength,
  minValue,
  maxValue,
  pattern,
  compose,
  custom,
  asyncValidator,
  when,
  match,
  url,
  number,
  integer,
  phone
};