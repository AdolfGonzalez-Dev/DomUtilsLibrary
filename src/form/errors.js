/**
 * Form Error Classes
 * @module form/errors
 */

/**
 * Base error class for DOMUtils
 */
export class DOMUtilsError extends Error {
  constructor(message, code = 'GENERIC') {
    super(message);
    this.name = 'DOMUtilsError';
    this.code = code;
  }
}

/**
 * Validation error for forms
 */
export class ValidationError extends DOMUtilsError {
  constructor(message, field = null, value = null) {
    super(message, 'VALIDATION');
    this.field = field;
    this.value = value;
  }
}

/**
 * Field not found error
 */
export class FieldNotFoundError extends DOMUtilsError {
  constructor(fieldName) {
    super(`Field "${fieldName}" not found`, 'FIELD_NOT_FOUND');
    this.fieldName = fieldName;
  }
}

export default {
  DOMUtilsError,
  ValidationError,
  FieldNotFoundError
};