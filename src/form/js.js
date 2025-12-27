/**
 * Form Class
 * Main form management with field handling and validation
 * @module form/Form
 */

import { $state } from '../reactive/signals.js';
import Field from './Field.js';

export class Form {
  /**
   * Create a new form
   * @param {Object} config - Form configuration
   */
  constructor(config = {}) {
    const {
      fields = {},
      onSubmit,
      onChange,
      onError,
      initialValues = {},
      validateOnChange = false,
      validateOnBlur = true,
      className = ''
    } = config;

    this.config = config;
    this.onSubmit = onSubmit;
    this.onChange = onChange;
    this.onError = onError;
    this.className = className;
    this.validateOnChange = validateOnChange;
    this.validateOnBlur = validateOnBlur;

    // Create field instances
    this.fields = {};
    Object.entries(fields).forEach(([name, fieldConfig]) => {
      const cfg = typeof fieldConfig === 'function' 
        ? fieldConfig() 
        : fieldConfig;
      
      this.fields[name] = new Field({
        name,
        value: initialValues[name] || cfg.value || '',
        ...cfg
      });

      // Link form values getter to field
      this.fields[name]._getFormValues = () => this.getValues();
    });

    // Form state
    this.state = $state({
      values: this._getInitialValues(),
      isDirty: false,
      isSubmitting: false,
      submitCount: 0
    });

    this._form = null;
    this._subscriptions = [];
  }

  // ==================
  // Getters
  // ==================

  getValues() {
    return Object.entries(this.fields).reduce((acc, [name, field]) => {
      acc[name] = field.value;
      return acc;
    }, {});
  }

  getErrors() {
    return Object.entries(this.fields).reduce((acc, [name, field]) => {
      if (field.errorMessage) {
        acc[name] = field.errorMessage;
      }
      return acc;
    }, {});
  }

  getTouched() {
    return Object.entries(this.fields).reduce((acc, [name, field]) => {
      if (field.isTouched) {
        acc[name] = true;
      }
      return acc;
    }, {});
  }

  get isDirty() {
    return Object.values(this.fields).some(f => f.isDirty);
  }

  get isSubmitting() {
    return this.state.isSubmitting;
  }

  get isValidating() {
    return Object.values(this.fields).some(f => f.isValidating);
  }

  get isValid() {
    return !Object.values(this.fields).some(f => f.errorMessage);
  }

  getField(name) {
    return this.fields[name] || null;
  }

  // ==================
  // Value Methods
  // ==================

  setValues(values) {
    Object.entries(values).forEach(([name, value]) => {
      if (this.fields[name]) {
        this.fields[name].setValue(value);
      }
    });
  }

  setValue(name, value) {
    if (this.fields[name]) {
      this.fields[name].setValue(value);
    } else {
      console.warn(`Field "${name}" not found in form`);
    }
  }

  reset(values) {
    Object.values(this.fields).forEach(field => {
      field.reset(values?.[field.name]);
    });
    this.state.isSubmitting = false;
    this.state.submitCount = 0;
  }

  // ==================
  // Validation
  // ==================

  async validate() {
    const promises = Object.values(this.fields).map(field => 
      field.validate()
    );

    const results = await Promise.all(promises);
    return results.every(r === true);
  }

  async validateField(name) {
    if (this.fields[name]) {
      return this.fields[name].validate();
    }
    console.warn(`Field "${name}" not found`);
    return false;
  }

  // ==================
  // Submit
  // ==================

  async submit(e) {
    if (e) e.preventDefault();

    const isValid = await this.validate();

    if (!isValid) {
      const errors = this.getErrors();
      this.onError?.(errors);
      return false;
    }

    this.state.isSubmitting = true;
    this.state.submitCount = (this.state.submitCount || 0) + 1;

    try {
      const values = this.getValues();
      const result = await this.onSubmit?.(values, this);
      return result !== false;
    } catch (err) {
      console.error('Form submission error:', err);
      this.onError?.(err);
      return false;
    } finally {
      this.state.isSubmitting = false;
    }
  }

  // ==================
  // Rendering
  // ==================

  render(parent) {
    const container = typeof parent === 'string'
      ? document.querySelector(parent)
      : parent;

    if (!container) {
      throw new Error('Form: parent container not found');
    }

    const form = document.createElement('form');
    form.className = `form ${this.className}`.trim();
    form.noValidate = true; // Disable HTML5 validation

    // Render all fields
    Object.values(this.fields).forEach(field => {
      field.render(form);
    });

    // Submit button
    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'form-actions';

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'form-submit-btn';
    submitBtn.textContent = 'Submit';
    submitBtn.id = 'form-submit-btn';

    buttonWrapper.appendChild(submitBtn);
    form.appendChild(buttonWrapper);

    // Handle submit
    form.addEventListener('submit', (e) => this.submit(e));

    container.appendChild(form);
    this._form = form;
    this._submitBtn = submitBtn;

    return form;
  }

  // ==================
  // Private Methods
  // ==================

  _getInitialValues() {
    return Object.entries(this.fields).reduce((acc, [name, field]) => {
      acc[name] = field.value;
      return acc;
    }, {});
  }

  // ==================
  // Cleanup
  // ==================

  destroy() {
    // Destroy all fields
    Object.values(this.fields).forEach(field => field.destroy());

    // Clean up subscriptions
    this._subscriptions.forEach(unsub => {
      if (typeof unsub === 'function') unsub();
    });
    this._subscriptions = [];

    // Clean up DOM
    this._form?.remove();
    this._form = null;
    this._submitBtn = null;
  }
}

/**
 * Factory function to create a form
 * @param {Object} config - Form configuration
 * @returns {Form} Form instance
 */
export function createForm(config) {
  return new Form(config);
}

export default Form;

---

## PASO 6: Crear Form - Composables

### 6.1 Crear `src/form/composables.js`
```javascript

```

### 6.2 Crear `src/form/index.js`
```javascript

```

---

## PASO 7: Actualizar Index Principal

### 7.1 Crear `src/form/index.d.ts` (TypeScript)
```typescript

```

---

## PASO 8: CSS Base (Opcional pero Recomendado)

### 8.1 Crear `src/form/form.css`
```css

```

---

## PRÓXIMOS PASOS

1. **Implementar en tu proyecto:**
   - Copiar todos estos archivos a `src/form/`
   - Actualizar `src/index.js`
   - Actualizar `package.json` con TSUP config

2. **Construir y probar:**
```bash
   npm run build
   npm run test
```

3. **Crear ejemplos:**
   - Login form
   - Registration form  
   - Dynamic form

4. **Tests:**
   - `test/form.test.js` (40+ test cases)