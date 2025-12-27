/**
 * Form Module Type Definitions
 */

import { Signal } from '../reactive/signals';

// ============= Field =============

export interface FieldConfig {
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

export class Field {
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

export interface FormConfig {
  fields: Record<string, FieldConfig>;
  onSubmit?: (values: Record<string, any>, form?: Form) => void | Promise<void>;
  onChange?: (values: Record<string, any>) => void;
  onError?: (errors: Record<string, string> | Error) => void;
  initialValues?: Record<string, any>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  className?: string;
}

export class Form {
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

export function createForm(config: FormConfig): Form;

// ============= Composables =============

export function useForm(config: FormConfig): {
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

export function useField(config: FieldConfig): {
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

export function required(message?: string): (value: any, formValues?: any) => string | null;
export function email(message?: string): (value: any, formValues?: any) => string | null;
export function minLength(min: number, message?: string): (value: any, formValues?: any) => string | null;
export function maxLength(max: number, message?: string): (value: any, formValues?: any) => string | null;
export function minValue(min: number, message?: string): (value: any, formValues?: any) => string | null;
export function maxValue(max: number, message?: string): (value: any, formValues?: any) => string | null;
export function pattern(regex: RegExp, message?: string): (value: any, formValues?: any) => string | null;
export function compose(...validators: Array<any>): (value: any, formValues?: any) => Promise<string | null>;
export function custom(fn: (value: any) => boolean | string, message?: string): (value: any, formValues?: any) => string | null;
export function asyncValidator(fn: (value: any) => Promise<boolean | string>, message?: string): (value: any, formValues?: any) => Promise<string | null>;
export function when(condition: (formValues: any) => boolean, validator: Function): (value: any, formValues?: any) => string | null;
export function match(fieldName: string, message?: string): (value: any, formValues?: any) => string | null;
export function url(message?: string): (value: any, formValues?: any) => string | null;
export function number(message?: string): (value: any, formValues?: any) => string | null;
export function integer(message?: string): (value: any, formValues?: any) => string | null;
export function phone(message?: string): (value: any, formValues?: any) => string | null;

// ============= Transformers =============

export function trim(): (value: any) => any;
export function uppercase(): (value: any) => any;
export function lowercase(): (value: any) => any;
export function capitalize(): (value: any) => any;
export function parseNumber(): (value: any) => any;
export function parseInt(): (value: any) => any;
export function parseBoolean(): (value: any) => any;
export function alphanumericOnly(): (value: any) => any;
export function digitsOnly(): (value: any) => any;
export function custom(fn: (value: any) => any): (value: any) => any;

// ============= Errors =============

export class DOMUtilsError extends Error {
  code: string;
  constructor(message: string, code?: string);
}

export class ValidationError extends DOMUtilsError {
  field: string | null;
  value: any;
  constructor(message: string, field?: string | null, value?: any);
}

export class FieldNotFoundError extends DOMUtilsError {
  fieldName: string;
  constructor(fieldName: string);
}