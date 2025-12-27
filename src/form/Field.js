/**
 * Form Field Class
 * Reactive field with validation
 * @module form/Field
 */

import { createSignal } from '../reactive/signals.js';

export class Field {
  /**
   * Create a new form field
   * @param {Object} config - Field configuration
   */
  constructor(config = {}) {
    const {
      name = '',
      type = 'text',
      value = '',
      validators = [],
      transformers = [],
      debounce = 300,
      debounceAsync = 500,
      label = '',
      placeholder = '',
      required: isRequired = false,
      disabled = false,
      className = '',
      rows = 3
    } = config;

    this.name = name;
    this.type = type;
    this.config = config;
    
    // Reactive state (using signals)
    const [rawValue, setRawValue] = createSignal(value);
    const [error, setError] = createSignal(null);
    const [touched, setTouched] = createSignal(false);
    const [dirty, setDirty] = createSignal(false);
    const [isValidating, setValidating] = createSignal(false);

    this._rawValue = rawValue;
    this._setRawValue = setRawValue;
    this._error = error;
    this._setError = setError;
    this._touched = touched;
    this._setTouched = setTouched;
    this._dirty = dirty;
    this._setDirty = setDirty;
    this._isValidating = isValidating;
    this._setValidating = setValidating;

    // Config
    this.validators = Array.isArray(validators) ? validators : [validators].filter(Boolean);
    this.transformers = Array.isArray(transformers) ? transformers : [transformers].filter(Boolean);
    this.debounce = debounce;
    this.debounceAsync = debounceAsync;
    this.label = label || name;
    this.placeholder = placeholder;
    this.isRequired = isRequired;
    this.disabled = disabled;
    this.className = className;
    this.rows = rows;

    // Private
    this._debounceTimer = null;
    this._el = null;
    this._getFormValues = () => ({});
    this._subscriptions = [];
  }

  // ==================
  // Getters
  // ==================

  get value() {
    return this._rawValue();
  }

  get isDirty() {
    return this._dirty();
  }

  get isTouched() {
    return this._touched();
  }

  get errorMessage() {
    return this._error();
  }

  get isValid() {
    return !this._error();
  }

  get isValidating() {
    return this._isValidating();
  }

  // ==================
  // Value Methods
  // ==================

  setValue(newValue) {
    // Apply transformers
    let value = newValue;
    for (const transformer of this.transformers) {
      if (typeof transformer === 'function') {
        value = transformer(value);
      }
    }

    this._setRawValue(value);
    this._setDirty(true);
    
    // Schedule debounced validation
    this._scheduleValidation();
  }

  getValue() {
    return this.value;
  }

  reset(initialValue = this.config.value || '') {
    this._setRawValue(initialValue);
    this._setError(null);
    this._setTouched(false);
    this._setDirty(false);
  }

  setError(error) {
    this._setError(error);
  }

  // ==================
  // Validation
  // ==================

  _scheduleValidation() {
    clearTimeout(this._debounceTimer);
    this._debounceTimer = setTimeout(() => {
      this.validate();
    }, this.debounce);
  }

  async validate(value = this.value) {
    if (!this.validators || this.validators.length === 0) {
      this._setError(null);
      return true;
    }

    this._setValidating(true);

    try {
      for (const validator of this.validators) {
        if (typeof validator !== 'function') continue;

        const error = await Promise.resolve(
          validator(value, this._getFormValues?.() || {})
        );
        
        if (error) {
          this._setError(error);
          return false;
        }
      }

      this._setError(null);
      return true;
    } catch (err) {
      console.error('Validation error:', err);
      this._setError('Validation error occurred');
      return false;
    } finally {
      this._setValidating(false);
    }
  }

  // ==================
  // Event Handlers
  // ==================

  handleChange(e) {
    const el = e.target;
    let value = el.value;

    // Handle different input types
    if (el.type === 'checkbox') {
      value = el.checked;
    } else if (el.type === 'radio') {
      value = el.checked ? el.value : null;
    } else if (el.tagName === 'SELECT') {
      value = el.value;
    } else if (el.tagName === 'TEXTAREA') {
      value = el.value;
    }

    this.setValue(value);
  }

  handleBlur() {
    this._setTouched(true);
    this.validate();
  }

  handleFocus() {
    // Could add focused state if needed
  }

  // ==================
  // DOM Methods
  // ==================

  render(parent) {
    const container = typeof parent === 'string' 
      ? document.querySelector(parent) 
      : parent;

    if (!container) {
      throw new Error(`Field: parent container not found for field "${this.name}"`);
    }

    const wrapper = document.createElement('div');
    wrapper.className = `field ${this.className || ''}`.trim();
    wrapper.setAttribute('data-field', this.name);

    // Label
    if (this.label) {
      const label = document.createElement('label');
      label.htmlFor = this.name;
      label.className = 'field-label';
      label.textContent = this.label;
      if (this.isRequired) {
        const required = document.createElement('span');
        required.className = 'field-required';
        required.textContent = ' *';
        label.appendChild(required);
      }
      wrapper.appendChild(label);
    }

    // Input
    const input = this._createInput();
    wrapper.appendChild(input);

    // Error message
    const errorEl = document.createElement('div');
    errorEl.className = 'field-error';
    errorEl.setAttribute('role', 'alert');
    errorEl.style.display = 'none';
    wrapper.appendChild(errorEl);

    // Subscribe to error changes
    const errorUnsub = this._error.subscribe?.(() => {
      const msg = this._error();
      errorEl.textContent = msg || '';
      errorEl.style.display = msg ? 'block' : 'none';
      input.classList.toggle('field-error-input', !!msg);
    });

    if (errorUnsub) {
      this._subscriptions.push(errorUnsub);
    }

    container.appendChild(wrapper);
    this._el = input;
    this._wrapper = wrapper;
    return wrapper;
  }

  _createInput() {
    let input;

    if (this.type === 'textarea') {
      input = document.createElement('textarea');
      input.rows = this.rows;
      input.value = this.value;
    } else {
      input = document.createElement('input');
      input.type = this.type;
      input.value = this.value;
    }

    input.id = this.name;
    input.name = this.name;
    input.placeholder = this.placeholder;
    input.disabled = this.disabled;
    input.className = 'field-input';

    if (this.isRequired) input.required = true;

    input.addEventListener('change', (e) => this.handleChange(e));
    input.addEventListener('input', (e) => this.handleChange(e));
    input.addEventListener('blur', () => this.handleBlur());
    input.addEventListener('focus', () => this.handleFocus());

    return input;
  }

  focus() {
    this._el?.focus();
  }

  blur() {
    this._el?.blur();
  }

  destroy() {
    // Clean up subscriptions
    this._subscriptions.forEach(unsub => {
      if (typeof unsub === 'function') unsub();
    });
    this._subscriptions = [];

    // Clean up timers
    clearTimeout(this._debounceTimer);

    // Clean up DOM
    this._el = null;
    this._wrapper?.remove();
    this._wrapper = null;
  }
}

export default Field;