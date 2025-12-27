import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { 
  createForm,
  required,
  email,
  minLength,
  maxLength,
  pattern,
  custom,
  asyncValidator,
  compose,
  match,
  number,
  url
} from '../src/form/index.js';
import { 
  trim,
  uppercase,
  lowercase,
  capitalize,
  parseNumber,
  alphanumericOnly,
  digitsOnly
} from '../src/form/transformers.js';

// ============================================
// SUITE 1: Field básico
// ============================================

describe('Form - Field Basic', () => {
  let form;

  beforeEach(() => {
    form = createForm({
      fields: {
        username: {
          label: 'Username',
          validators: [required()]
        },
        email: {
          type: 'email',
          validators: [required(), email()]
        }
      },
      onSubmit: () => {}
    });
  });

  it('debe inicializar con valores vacíos', () => {
    expect(form.getValues()).toEqual({
      username: '',
      email: ''
    });
  });

  it('debe obtener un campo por nombre', () => {
    const field = form.getField('username');
    expect(field).toBeDefined();
    expect(field.name).toBe('username');
  });

  it('debe retornar null para campo no existente', () => {
    const field = form.getField('nonexistent');
    expect(field).toBeNull();
  });

  it('debe setear valor a un campo', () => {
    form.setValue('username', 'john_doe');
    expect(form.getValues().username).toBe('john_doe');
  });

  it('debe setear múltiples valores', () => {
    form.setValues({
      username: 'alice',
      email: 'alice@example.com'
    });

    expect(form.getValues()).toEqual({
      username: 'alice',
      email: 'alice@example.com'
    });
  });

  it('debe marcar campo como dirty al cambiar valor', () => {
    expect(form.getField('username').isDirty).toBe(false);
    form.setValue('username', 'test');
    expect(form.getField('username').isDirty).toBe(true);
  });

  it('debe marcar campo como touched al validar', async () => {
    const field = form.getField('username');
    expect(field.isTouched).toBe(false);
    
    field.setValue('test');
    field.handleBlur();
    
    expect(field.isTouched).toBe(true);
  });
});

// ============================================
// SUITE 2: Validadores
// ============================================

describe('Form - Validators', () => {
  let form;

  beforeEach(() => {
    form = createForm({
      fields: {
        email: { validators: [required(), email()] },
        password: { validators: [required(), minLength(8)] },
        username: { validators: [required(), minLength(3), maxLength(20)] },
        website: { validators: [url()] },
        age: { validators: [number()] }
      },
      onSubmit: () => {}
    });
  });

  it('debe validar required', async () => {
    const field = form.getField('email');
    field.setValue('');
    const valid = await field.validate();
    
    expect(valid).toBe(false);
    expect(field.errorMessage).toBeTruthy();
  });

  it('debe pasar required con valor', async () => {
    const field = form.getField('email');
    field.setValue('test@example.com');
    const valid = await field.validate();
    
    expect(valid).toBe(true);
    expect(field.errorMessage).toBeNull();
  });

  it('debe validar email formato', async () => {
    const field = form.getField('email');
    
    field.setValue('invalid');
    expect(await field.validate()).toBe(false);
    
    field.setValue('test@example.com');
    expect(await field.validate()).toBe(true);
  });

  it('debe validar minLength', async () => {
    const field = form.getField('password');
    
    field.setValue('short');
    expect(await field.validate()).toBe(false);
    
    field.setValue('longenough123');
    expect(await field.validate()).toBe(true);
  });

  it('debe validar maxLength', async () => {
    const field = form.getField('username');
    
    field.setValue('a'.repeat(25)); // > 20
    expect(await field.validate()).toBe(false);
    
    field.setValue('validusername');
    expect(await field.validate()).toBe(true);
  });

  it('debe validar URL', async () => {
    const field = form.getField('website');
    
    field.setValue('not a url');
    expect(await field.validate()).toBe(false);
    
    field.setValue('https://example.com');
    expect(await field.validate()).toBe(true);
  });

  it('debe validar número', async () => {
    const field = form.getField('age');
    
    field.setValue('not a number');
    expect(await field.validate()).toBe(false);
    
    field.setValue('25');
    expect(await field.validate()).toBe(true);
  });

  it('debe validar con pattern personalizado', async () => {
    form = createForm({
      fields: {
        phone: {
          validators: [pattern(/^\d{3}-\d{3}-\d{4}$/, 'Invalid phone')]
        }
      },
      onSubmit: () => {}
    });

    const field = form.getField('phone');
    
    field.setValue('123456789');
    expect(await field.validate()).toBe(false);
    
    field.setValue('123-456-7890');
    expect(await field.validate()).toBe(true);
  });

it('debe validar con custom validator', async () => {
  form = createForm({
    fields: {
      age: {
        validators: [
          required(),
          custom(v => {
            const num = Number(v);
            if (isNaN(num)) return 'Must be a number';
            if (num < 18 || num > 120) return 'Must be 18-120';
            return null;
          })
        ]
      }
    },
    onSubmit: () => {}
  });

  const field = form.getField('age');
  
  field.setValue('15');
  const invalid = await field.validate();
  expect(invalid).toBe(false);
  expect(field.errorMessage).toBe('Must be 18-120');
  
  field.setValue('25');
  const valid = await field.validate();
  expect(valid).toBe(true);
  expect(field.errorMessage).toBeNull();
});

  it('debe validar con compose', async () => {
    const validator = compose(
      required(),
      minLength(5),
      pattern(/[A-Z]/, 'Need uppercase')
    );

    form = createForm({
      fields: {
        password: { validators: [validator] }
      },
      onSubmit: () => {}
    });

    const field = form.getField('password');
    
    field.setValue('short');
    expect(await field.validate()).toBe(false);
    
    field.setValue('lowercase123');
    expect(await field.validate()).toBe(false);
    
    field.setValue('ValidPassword123');
    expect(await field.validate()).toBe(true);
  });

  it('debe validar match entre campos', async () => {
    form = createForm({
      fields: {
        password: { validators: [required()] },
        confirmPassword: { validators: [match('password')] }
      },
      onSubmit: () => {}
    });

    form.setValues({
      password: 'test123',
      confirmPassword: 'different'
    });

    expect(await form.getField('confirmPassword').validate()).toBe(false);

    form.setValue('confirmPassword', 'test123');
    expect(await form.getField('confirmPassword').validate()).toBe(true);
  });
});

// ============================================
// SUITE 3: Transformadores
// ============================================

describe('Form - Transformers', () => {
  let form;

  beforeEach(() => {
    form = createForm({
      fields: {
        trimmed: { transformers: [trim()] },
        upper: { transformers: [uppercase()] },
        lower: { transformers: [lowercase()] },
        capitalized: { transformers: [capitalize()] },
        numeric: { transformers: [parseNumber()] },
        alphanumeric: { transformers: [alphanumericOnly()] },
        digitsOnly: { transformers: [digitsOnly()] }
      },
      onSubmit: () => {}
    });
  });

  it('debe aplicar trim', () => {
    form.setValue('trimmed', '  hello  ');
    expect(form.getField('trimmed').value).toBe('hello');
  });

  it('debe aplicar uppercase', () => {
    form.setValue('upper', 'hello');
    expect(form.getField('upper').value).toBe('HELLO');
  });

  it('debe aplicar lowercase', () => {
    form.setValue('lower', 'HELLO');
    expect(form.getField('lower').value).toBe('hello');
  });

  it('debe aplicar capitalize', () => {
    form.setValue('capitalized', 'hello world');
    expect(form.getField('capitalized').value).toBe('Hello world');
  });

  it('debe aplicar parseNumber', () => {
    form.setValue('numeric', '42');
    expect(form.getField('numeric').value).toBe(42);
  });

  it('debe remover caracteres no-alfanuméricos', () => {
    form.setValue('alphanumeric', 'hello@world!123');
    expect(form.getField('alphanumeric').value).toBe('helloworld123');
  });

  it('debe remover caracteres no-numéricos', () => {
    form.setValue('digitsOnly', 'abc123def456');
    expect(form.getField('digitsOnly').value).toBe('123456');
  });
});

// ============================================
// SUITE 4: Async Validators
// ============================================

describe('Form - Async Validators', () => {
  let form;

  beforeEach(() => {
    const checkEmailAvailable = asyncValidator(
      async (email) => {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 50));
        
        const takenEmails = ['test@example.com', 'admin@example.com'];
        if (takenEmails.includes(email)) {
          return 'Email already taken';
        }
        return true;
      }
    );

    form = createForm({
      fields: {
        email: {
          validators: [required(), email(), checkEmailAvailable]
        }
      },
      onSubmit: () => {}
    });
  });

  it('debe ejecutar async validator y pasar', async () => {
    form.setValue('email', 'available@example.com');
    const valid = await form.getField('email').validate();
    
    expect(valid).toBe(true);
  });

  it('debe ejecutar async validator y fallar', async () => {
    form.setValue('email', 'test@example.com');
    const valid = await form.getField('email').validate();
    
    expect(valid).toBe(false);
    expect(form.getField('email').errorMessage).toBe('Email already taken');
  });
});

// ============================================
// SUITE 5: Form completo
// ============================================

describe('Form - Complete Form', () => {
  let form;
  let submitData;

  beforeEach(() => {
    submitData = null;
    form = createForm({
      fields: {
        firstName: { 
          validators: [required()] 
        },
        lastName: { 
          validators: [required()] 
        },
        email: { 
          validators: [required(), email()] 
        },
        password: { 
          validators: [required(), minLength(8)] 
        },
        confirmPassword: { 
          validators: [match('password')] 
        },
        terms: { 
          validators: [required()] 
        }
      },
      onSubmit: async (values) => {
        submitData = values;
      }
    });
  });

  it('debe validar form completo', async () => {
    form.setValues({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      terms: 'accepted'
    });

    const isValid = await form.validate();
    expect(isValid).toBe(true);
  });

  it('debe retornar errores para form inválido', async () => {
    form.setValues({
      firstName: '',
      email: 'invalid',
      password: 'short',
      confirmPassword: 'different'
    });

    await form.validate();
    const errors = form.getErrors();

    expect(Object.keys(errors).length).toBeGreaterThan(0);
    expect(errors.firstName).toBeTruthy();
    expect(errors.email).toBeTruthy();
  });

  it('debe submitir form válido', async () => {
    form.setValues({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      terms: 'accepted'
    });

    const isValid = await form.validate();
    expect(isValid).toBe(true);

    const result = await form.submit();

    expect(result).toBe(true);
    expect(submitData).toEqual({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      terms: 'accepted'
    });
  });

  it('debe no submitir form inválido', async () => {
    form.setValues({
      firstName: 'John',
      email: 'invalid-email'
    });

    const result = await form.submit();

    expect(result).toBe(false);
    expect(submitData).toBeNull();
  });

  it('debe resetear form', () => {
    form.setValues({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    });

    form.reset();

    expect(form.getValues()).toEqual({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: ''
    });
  });

  it('debe retornar isDirty correctamente', () => {
    expect(form.isDirty).toBe(false);
    
    form.setValue('firstName', 'John');
    expect(form.isDirty).toBe(true);
  });

it('debe retornar isValid correctamente', async () => {
  // Inicialmente sin errores = true (no hay errores aún)
  expect(form.isValid).toBe(true);

  // Validar con datos inválidos
  form.setValues({
    firstName: '',
    email: 'invalid'
  });

  await form.validate();
  expect(form.isValid).toBe(false);
  expect(form.getErrors().firstName).toBeTruthy();
  expect(form.getErrors().email).toBeTruthy();

  // Validar con datos válidos
  form.setValues({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    terms: 'accepted'
  });

  await form.validate();
  expect(form.isValid).toBe(true);
  expect(Object.keys(form.getErrors()).length).toBe(0);
});
});

// ============================================
// SUITE 6: Error Handling
// ============================================

describe('Form - Error Handling', () => {
  let form;
  let errors = null;

  beforeEach(() => {
    errors = null;
    form = createForm({
      fields: {
        email: { validators: [required(), email()] }
      },
      onError: (err) => {
        errors = err;
      },
      onSubmit: () => {}
    });
  });

  it('debe llamar onError cuando falla validación', async () => {
    form.setValue('email', 'invalid');
    await form.submit();

    expect(errors).toBeDefined();
    expect(errors.email).toBeTruthy();
  });

  it('debe retornar getErrors correctamente', async () => {
    form.setValues({
      email: ''
    });

    await form.validate();
    const errorObj = form.getErrors();

    expect(errorObj.email).toBeTruthy();
  });
});

// ============================================
// SUITE 7: Field Individual
// ============================================

describe('Form - Individual Field', () => {
  let form;

  beforeEach(() => {
    form = createForm({
      fields: {
        username: { 
          validators: [required(), minLength(3)],
          transformers: [trim(), lowercase()]
        }
      },
      onSubmit: () => {}
    });
  });

  it('debe resetear un field individual', () => {
    form.setValue('username', 'test');
    expect(form.getField('username').value).toBe('test');

    form.getField('username').reset();
    expect(form.getField('username').value).toBe('');
  });

  it('debe aplicar transformers en orden', () => {
    form.setValue('username', '  HELLO  ');
    
    const field = form.getField('username');
    expect(field.value).toBe('hello');
  });

  it('debe validar field individual', async () => {
    const field = form.getField('username');
    
    field.setValue('ab');
    expect(await field.validate()).toBe(false);
    
    field.setValue('abc');
    expect(await field.validate()).toBe(true);
  });

  it('debe setError manualmente', () => {
    const field = form.getField('username');
    field.setError('Custom error');

    expect(field.errorMessage).toBe('Custom error');
  });
});