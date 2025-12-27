/**
 * Form Module Type Definitions
 */



// ============= Field =============

interface FieldConfig {
  name: string;
  type?: string;
  value?: any;
  validators?: Array<(value: any, formValues?: any) => string | null | Promise<string | null>>;
  transformers?: Array<(value: any) => any>;
  debounce?: number;
  debounceAsync?: number;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  rows?: number;
}

declare class Field {
  constructor(config: FieldConfig);
  
  // Getters
  get value(): any;
  get isDirty(): boolean;
  get isTouched(): boolean;
  get errorMessage(): string | null;
  get isValid(): boolean;
  get isValidating(): boolean;

  // Methods
  setValue(value: any): void;
  getValue(): any;
  reset(initialValue?: any): void;
  setError(error: string | null): void;
  validate(value?: any): Promise<boolean>;
  
  handleChange(e: Event): void;
  handleBlur(): void;
  handleFocus(): void;
  
  render(parent: HTMLElement | string): HTMLElement;
  focus(): void;
  blur(): void;
  destroy(): void;
}

// ============= Form =============

interface FormConfig {
  fields: Record<string, FieldConfig>;
  onSubmit?: (values: Record<string, any>, form?: Form) => void | Promise<void>;
  onChange?: (values: Record<string, any>) => void;
  onError?: (errors: Record<string, string> | Error) => void;
  initialValues?: Record<string, any>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  className?: string;
}

declare class Form {
  constructor(config: FormConfig);
  
  fields: Record<string, Field>;

  // Getters
  get isDirty(): boolean;
  get isSubmitting(): boolean;
  get isValidating(): boolean;
  get isValid(): boolean;

  // Methods
  getValues(): Record<string, any>;
  getErrors(): Record<string, string>;
  getTouched(): Record<string, boolean>;
  getField(name: string): Field | null;

  setValues(values: Record<string, any>): void;
  setValue(name: string, value: any): void;
  reset(values?: Record<string, any>): void;

  validate(): Promise<boolean>;
  validateField(name: string): Promise<boolean>;

  submit(e?: Event): Promise<boolean>;
  render(parent: HTMLElement | string): HTMLElement;
  destroy(): void;
}

declare function createForm(config: FormConfig): Form;

// ============= Composables =============

declare function useForm(config: FormConfig): {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
  isValidating: boolean;
  
  getFieldValue(name: string): any;
  setFieldValue(name: string, value: any): void;
  setValues(values: Record<string, any>): void;
  resetField(name: string): void;
  reset(): void;
  validate(): Promise<boolean>;
  validateField(name: string): Promise<boolean>;
  submit(e?: Event): Promise<boolean>;
  
  form: Form;
  getField(name: string): Field | null;
};

declare function useField(config: FieldConfig): {
  value: any;
  error: string | null;
  isDirty: boolean;
  isTouched: boolean;
  isValid: boolean;
  isValidating: boolean;
  
  setValue(value: any): void;
  getValue(): any;
  validate(): Promise<boolean>;
  reset(): void;
  setError(error: string | null): void;
  handleChange(e: Event): void;
  handleBlur(): void;
  handleFocus(): void;
  focus(): void;
  blur(): void;
  
  field: Field;
};

// ============= Validators =============

declare function required(message?: string): (value: any, formValues?: any) => string | null;
declare function email(message?: string): (value: any, formValues?: any) => string | null;
declare function minLength(min: number, message?: string): (value: any, formValues?: any) => string | null;
declare function maxLength(max: number, message?: string): (value: any, formValues?: any) => string | null;
declare function minValue(min: number, message?: string): (value: any, formValues?: any) => string | null;
declare function maxValue(max: number, message?: string): (value: any, formValues?: any) => string | null;
declare function pattern(regex: RegExp, message?: string): (value: any, formValues?: any) => string | null;
declare function compose(...validators: Array<any>): (value: any, formValues?: any) => Promise<string | null>;
declare function asyncValidator(fn: (value: any) => Promise<boolean | string>, message?: string): (value: any, formValues?: any) => Promise<string | null>;
declare function when(condition: (formValues: any) => boolean, validator: Function): (value: any, formValues?: any) => string | null;
declare function match(fieldName: string, message?: string): (value: any, formValues?: any) => string | null;
declare function url(message?: string): (value: any, formValues?: any) => string | null;
declare function number(message?: string): (value: any, formValues?: any) => string | null;
declare function integer(message?: string): (value: any, formValues?: any) => string | null;
declare function phone(message?: string): (value: any, formValues?: any) => string | null;

// ============= Transformers =============

declare function trim(): (value: any) => any;
declare function uppercase(): (value: any) => any;
declare function lowercase(): (value: any) => any;
declare function capitalize(): (value: any) => any;
declare function parseNumber(): (value: any) => any;
declare function parseInt(): (value: any) => any;
declare function parseBoolean(): (value: any) => any;
declare function alphanumericOnly(): (value: any) => any;
declare function digitsOnly(): (value: any) => any;
declare function custom(fn: (value: any) => boolean | string, message?: string): (value: any, formValues?: any) => string | null;
declare function custom(fn: (value: any) => any): (value: any) => any;

// ============= Errors =============

declare class DOMUtilsError extends Error {
  code: string;
  constructor(message: string, code?: string);
}

declare class ValidationError extends DOMUtilsError {
  field: string | null;
  value: any;
  constructor(message: string, field?: string | null, value?: any);
}

declare class FieldNotFoundError extends DOMUtilsError {
  fieldName: string;
  constructor(fieldName: string);
}

export { DOMUtilsError, Field, type FieldConfig, FieldNotFoundError, Form, type FormConfig, ValidationError, alphanumericOnly, asyncValidator, capitalize, compose, createForm, custom, digitsOnly, email, integer, lowercase, match, maxLength, maxValue, minLength, minValue, number, parseBoolean, parseInt, parseNumber, pattern, phone, required, trim, uppercase, url, useField, useForm, when };
