# DOMUtils Library v0.3.0

> Lightweight DOM utility library with reactive signals, form validation, and accessible components.

[![Tests](https://img.shields.io/badge/tests-166%20passed-brightgreen)]()
[![npm version](https://badge.fury.io/js/domutils-library.svg)](https://www.npmjs.com/package/domutils-library)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![ESM Only](https://img.shields.io/badge/ESM-only-orange)]()

## ✨ Features

- 🔄 **Reactive Signals** - Fine-grained reactivity with automatic dependency tracking
- 📋 **Form Validation** - Complete form system with 15+ built-in validators
- 🎯 **DOM Utilities** - Modern selectors (qs, qsAll) + element manipulation
- ♿ **Accessible** - WCAG compliant Modal, Tabs, Tooltip components
- 🖱️ **Gestures** - Drag, swipe, and pointer event handling
- 👁️ **Observers** - IntersectionObserver, ResizeObserver, MutationObserver helpers
- 📡 **AJAX** - Modern fetch-based HTTP requests
- 💾 **Storage** - LocalStorage/SessionStorage utilities
- 📦 **Small** - ~10KB minified (ESM only, tree-shakeable)
- 🎨 **Modern** - ES modules, TypeScript support, zero dependencies

## 📦 Installation
```bash
npm install domutils-library
```

## 🚀 Quick Start

### Selectors (Modern API)
```javascript
import { qs, qsAll, $ } from 'domutils-library';

// Modern selectors
qs('.button');        // querySelector
qsAll('.item');       // querySelectorAll

// Factory pattern
$('.button').on('click', () => {
  console.log('Clicked!');
});
```

### Reactive Signals
```javascript
import { createSignal, createEffect } from 'domutils-library/reactive';

const [count, setCount] = createSignal(0);

createEffect(() => {
  console.log('Count changed:', count());
});

setCount(5);  // Logs: "Count changed: 5"
```

### Form Validation (NEW in v0.3.0)
```javascript
import { createForm, required, email, minLength } from 'domutils-library/form';

const form = createForm({
  fields: {
    email: {
      type: 'email',
      label: 'Email',
      validators: [required(), email()]
    },
    password: {
      type: 'password',
      label: 'Password',
      validators: [required(), minLength(8)]
    }
  },
  
  async onSubmit(values) {
    console.log('Form data:', values);
    // await api.login(values);
  }
});

form.render('#my-form');
```

## 📚 Documentation

### Form Validation

#### Basic Form
```javascript
import { createForm, required, email } from 'domutils-library/form';

const form = createForm({
  fields: {
    name: {
      label: 'Full Name',
      validators: [required('Name is required')]
    },
    email: {
      type: 'email',
      label: 'Email Address',
      validators: [
        required('Email is required'),
        email('Invalid email format')
      ]
    }
  },
  
  async onSubmit(values, form) {
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      
      if (response.ok) {
        form.reset();
        console.log('Success!');
      }
    } catch (err) {
      console.error('Error:', err.message);
    }
  },
  
  onError(errors) {
    console.error('Validation errors:', errors);
  }
});

form.render('#form-container');
```

#### Form with Transformers
```javascript
import { createForm, required, minLength } from 'domutils-library/form';
import { trim, uppercase, lowercase } from 'domutils-library/form';

const form = createForm({
  fields: {
    username: {
      transformers: [trim(), lowercase()],
      validators: [required(), minLength(3)]
    },
    firstName: {
      transformers: [trim(), capitalize()],
      validators: [required()]
    }
  },
  onSubmit: (values) => console.log(values)
});

form.render('#form');
```

#### Advanced: Async Validation
```javascript
import { createForm, required, asyncValidator } from 'domutils-library/form';

const checkEmail = asyncValidator(
  async (email) => {
    const res = await fetch(`/api/check-email?email=${email}`);
    const { available } = await res.json();
    return available ? null : 'Email already taken';
  }
);

const form = createForm({
  fields: {
    email: {
      type: 'email',
      validators: [required(), email(), checkEmail],
      debounceAsync: 800  // Wait 800ms before validating
    }
  },
  onSubmit: (values) => console.log(values)
});

form.render('#form');
```

#### Custom Validators
```javascript
import { createForm, custom, match } from 'domutils-library/form';

const form = createForm({
  fields: {
    password: {
      type: 'password',
      validators: [required(), minLength(8)]
    },
    confirmPassword: {
      type: 'password',
      validators: [
        required(),
        match('password', 'Passwords do not match')
      ]
    },
    terms: {
      type: 'checkbox',
      validators: [
        custom(v => v === true, 'You must accept the terms')
      ]
    }
  },
  onSubmit: (values) => console.log(values)
});

form.render('#form');
```

### Available Validators
```javascript
import {
  required,          // Field has a value
  email,             // Valid email format
  minLength,         // Minimum string length
  maxLength,         // Maximum string length
  minValue,          // Minimum numeric value
  maxValue,          // Maximum numeric value
  pattern,           // Regex pattern matching
  url,               // Valid URL
  number,            // Valid number
  integer,           // Valid integer
  phone,             // Valid phone (basic)
  custom,            // Custom validation function
  asyncValidator,    // Async validation
  compose,           // Combine multiple validators
  when,              // Conditional validation
  match              // Match another field
} from 'domutils-library/form';
```

### Available Transformers
```javascript
import {
  trim,              // Remove whitespace
  uppercase,         // Convert to uppercase
  lowercase,         // Convert to lowercase
  capitalize,        // Capitalize first letter
  parseNumber,       // Parse as number
  parseInt,          // Parse as integer
  parseBoolean,      // Parse as boolean
  alphanumericOnly,  // Remove non-alphanumeric chars
  digitsOnly         // Remove non-numeric chars
} from 'domutils-library/form';
```

### Hook Style API
```javascript
import { useForm, useField, required, email } from 'domutils-library/form';

// Form hook
const form = useForm({
  initialValues: { email: '', password: '' },
  fields: {
    email: { validators: [required(), email()] },
    password: { validators: [required()] }
  },
  onSubmit: (values) => console.log(values)
});

// Access form state
console.log(form.values);     // { email: '', password: '' }
console.log(form.errors);     // { email: 'Required', ... }
console.log(form.isDirty);    // boolean
console.log(form.isValid);    // boolean
console.log(form.isSubmitting); // boolean

// Form methods
form.setValues({ email: 'test@example.com' });
form.validate();
form.submit();
form.reset();

// Field hook
const email = useField({
  name: 'email',
  validators: [required(), email()]
});

console.log(email.value);        // Current value
console.log(email.error);        // Error message
console.log(email.isDirty);      // Changed?
console.log(email.isTouched);    // Focused?

email.setValue('test@example.com');
email.validate();
email.reset();
email.focus();
```

## Reactive Signals

### createSignal
```javascript
import { createSignal, createEffect } from 'domutils-library/reactive';

const [count, setCount] = createSignal(0);

// Get value
console.log(count());

// Set value
setCount(5);

// Update function
setCount(v => v + 1);

// Subscribe to changes
const unsubscribe = count.subscribe(() => {
  console.log('Count changed to:', count());
});

// Unsubscribe
unsubscribe();
```

### createEffect
```javascript
import { createSignal, createEffect } from 'domutils-library/reactive';

const [name, setName] = createSignal('John');

// Auto-runs when dependencies change
createEffect(() => {
  document.title = `Hello, ${name()}`;
});

setName('Jane');  // Title updates automatically
```

### createComputed
```javascript
import { createSignal, createComputed } from 'domutils-library/reactive';

const [items, setItems] = createSignal([1, 2, 3, 4, 5]);
const [filter, setFilter] = createSignal(2);

// Cached computed value
const filtered = createComputed(() => {
  return items().filter(x => x > filter());
});

console.log(filtered());  // [3, 4, 5]
```

### $state
```javascript
import { $state, createEffect } from 'domutils-library/reactive';

const user = $state({
  name: 'John',
  email: 'john@example.com'
});

createEffect(() => {
  console.log('User name:', user.name);
});

user.name = 'Jane';  // Effect re-runs automatically
```

## Components

### Modal
```javascript
import { Modal } from 'domutils-library';

const modal = new Modal('#my-modal', {
  closeOnOverlay: true,
  closeOnEsc: true,
  onShow: () => console.log('Opened'),
  onHide: () => console.log('Closed')
});

modal.show();
modal.hide();
modal.toggle();
modal.destroy();
```

### Tabs
```javascript
import { Tabs } from 'domutils-library';

const tabs = new Tabs('#my-tabs', {
  tabSelector: '[data-tab]',
  panelSelector: '[data-panel]',
  activeClass: 'active',
  useHash: true
});

tabs.select('tab-2');
tabs.destroy();
```

### Tooltip
```javascript
import { Tooltip } from 'domutils-library';

const tooltip = new Tooltip('#button', 'Help text', {
  placement: 'top',
  offset: 8
});

tooltip.show();
tooltip.hide();
tooltip.destroy();
```

## Events & DOM

### Modern Selectors
```javascript
import { qs, qsAll, $, q, qa } from 'domutils-library';

// Modern aliases (recommended)
qs('.button');        // Single element
qsAll('.item');       // All elements

// Legacy aliases (still supported)
q('.button');
qa('.item');

// Factory pattern
$('.button').on('click', handler);
$('.item').addClass('active');
```

### Event Handling
```javascript
import { $ } from 'domutils-library';

// Direct listener
$('.btn').on('click', (e) => {
  console.log('Clicked!');
});

// Delegation
$('.container').on('click', '.item', (e, item) => {
  console.log('Item clicked:', item);
});

// Once
$('.btn').once('click', handler);

// Remove listener
$('.btn').off('click', handler);
```

### DOM Manipulation
```javascript
import { qs } from 'domutils-library';
import { append, before, after, css, position } from 'domutils-library';

const el = qs('.element');

// Append/prepend
append(el, '<p>New content</p>');

// Insert before/after
before(el, '<div>Before</div>');
after(el, '<div>After</div>');

// Styles
css(el, { color: 'red', display: 'block' });
css(el, 'color', 'blue');

// Position
position(el);  // { left, top, width, height }
offset(el);    // Document position
```

## Storage Utilities
```javascript
import { 
  getStorage, 
  setStorage, 
  removeStorage,
  clearStorage,
  hasStorage,
  getAllStorage
} from 'domutils-library';

// Set/Get (with JSON serialization)
setStorage('user', { name: 'John', age: 30 });
const user = getStorage('user');  // { name: 'John', age: 30 }

// Check existence
hasStorage('user');  // true

// Remove
removeStorage('user');

// Get all
const all = getAllStorage();

// Clear all
clearStorage();

// With expiration
setStorageWithExpiration('temp', { data: 'value' }, 3600000);  // 1 hour
```

## Examples

See the `/examples` folder for complete working examples:

- `01-login.html` - Login form with validation
- `02-register.html` - Registration with async validation
- `03-contact.html` - Contact form with textarea

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ All |
| Firefox | ✅ All |
| Safari | ✅ All |
| Edge | ✅ All |
| IE 11 | ⚠️ Partial (needs polyfills) |

## Bundle Size

| Module | Size |
|--------|------|
| index.esm.js | 15KB |
| form.esm.js | 20KB |
| validators.esm.js | 8KB |
| reactive.esm.js | 3KB |
| **Total (minified)** | **~10KB** |

## TypeScript Support

Full TypeScript definitions included:
```typescript
import { createForm, required, email } from 'domutils-library/form';
import type { Form, Field, FormConfig } from 'domutils-library/form';

const config: FormConfig = {
  fields: {
    email: {
      validators: [required(), email()]
    }
  },
  onSubmit: async (values: Record<string, any>) => {
    // ...
  }
};

const form: Form = createForm(config);
```

## 🎯 API Reference

### Form Module
```javascript
// Create form
createForm(config)          // Returns Form instance
useForm(config)             // Hook style API

// Validators (40+ tests)
required(), email(), minLength(), maxLength(), minValue(), maxValue(),
pattern(), url(), number(), integer(), phone(), custom(), asyncValidator(),
compose(), when(), match()

// Transformers
trim(), uppercase(), lowercase(), capitalize(), parseNumber(), parseInt(),
parseBoolean(), alphanumericOnly(), digitsOnly()

// Classes
class Form
class Field
```

### Reactive Module
```javascript
createSignal(initial)       // Returns [getter, setter, subscribe]
createEffect(fn)            // Auto-run function
createComputed(fn)          // Cached computed value
$state(initial)             // Reactive object
```

### DOM Module
```javascript
// Selectors
qs(selector), qsAll(selector)
q(selector), qa(selector)
find(), findAll(), create()

// Events
$(), on(), off(), once(), delegate()

// DOM helpers
append(), prepend(), before(), after()
css(), position(), offset(), clone()
```

## 📝 Changelog

### v0.3.0 (Current)

- ✨ Complete form validation system
- ✨ 15+ built-in validators
- ✨ 10+ value transformers
- ✨ Async validation support
- ✨ Hook-style API (useForm, useField)
- ✨ Modern selectors (qs, qsAll)
- ✨ 40+ form tests
- 📊 166 total tests passing

### v0.2.0

- 🔧 TSUP build optimization
- 📦 Multiple entry points
- 🎯 Tree-shaking support

### v0.1.0

- 🎉 Initial release
- ✨ Reactive signals
- ✨ Accessible components
- ✨ Event handling
- ✨ Storage utilities

## License

MIT © 2025 [AdolfDigitalDeveloper](LICENSE)

## Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

---

**Made with ❤️ for modern web development**