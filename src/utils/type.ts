/**
 * Type Checking Utilities
 * Runtime type checking helpers
 *
 * @module utils/type
 * @example
 * import { isString, isNode, isArray } from 'domutils/utils';
 *
 * if (isString(value)) { ... }
 * if (isNode(el)) { ... }
 */

// ============================================================================
// PRIMITIVE TYPES
// ============================================================================

/**
 * Check if value is a string
 */
export function isString(v: any): v is string {
    return typeof v === "string" || v instanceof String;
}

/**
 * Check if value is a number
 */
export function isNumber(v: any): v is number {
    return typeof v === "number" && !isNaN(v);
}

/**
 * Check if value is a boolean
 */
export function isBoolean(v: any): v is boolean {
    return typeof v === "boolean";
}

/**
 * Check if value is a function
 */
export function isFunction(v: any): v is Function {
    return typeof v === "function";
}

/**
 * Check if value is undefined
 */
export function isUndefined(v: any): v is undefined {
    return typeof v === "undefined";
}

/**
 * Check if value is null
 */
export function isNull(v: any): v is null {
    return v === null;
}

/**
 * Check if value is null or undefined
 */
export function isNullOrUndefined(v: any): v is null | undefined {
    return v === null || v === undefined;
}

/**
 * Check if value is a symbol
 */
export function isSymbol(v: any): v is symbol {
    return typeof v === "symbol";
}

// ============================================================================
// OBJECT TYPES
// ============================================================================

/**
 * Check if value is an object (not null, not array)
 */
export function isObject(v: any): v is object {
    return v !== null && typeof v === "object" && !Array.isArray(v);
}

/**
 * Check if value is a plain object
 */
export function isPlainObject(v: any): v is Record<string, any> {
    if (!isObject(v)) return false;
    const proto = Object.getPrototypeOf(v);
    return proto === null || proto === Object.prototype;
}

/**
 * Check if value is an array
 */
export function isArray(v: any): v is any[] {
    return Array.isArray(v);
}

/**
 * Check if value is a Date
 */
export function isDate(v: any): v is Date {
    return v instanceof Date;
}

/**
 * Check if value is a RegExp
 */
export function isRegExp(v: any): v is RegExp {
    return v instanceof RegExp;
}

/**
 * Check if value is an Error
 */
export function isError(v: any): v is Error {
    return v instanceof Error;
}

/**
 * Check if value is a Promise
 */
export function isPromise(v: any): v is Promise<any> {
    return (
        v instanceof Promise ||
        (v !== null && typeof v === "object" && typeof v.then === "function")
    );
}

/**
 * Check if value is a Map
 */
export function isMap(v: any): v is Map<any, any> {
    return v instanceof Map;
}

/**
 * Check if value is a Set
 */
export function isSet(v: any): v is Set<any> {
    return v instanceof Set;
}

/**
 * Check if value is a WeakMap
 */
export function isWeakMap(v: any): v is WeakMap<any, any> {
    return v instanceof WeakMap;
}

/**
 * Check if value is a WeakSet
 */
export function isWeakSet(v: any): v is WeakSet<any> {
    return v instanceof WeakSet;
}

// ============================================================================
// DOM TYPES
// ============================================================================

/**
 * Check if value is a DOM Node
 */
export function isNode(v: any): v is Node {
    return !!v && typeof v.nodeType === "number";
}

/**
 * Check if value is a DOM Element
 */
export function isElement(v: any): v is Element {
    return !!v && v.nodeType === Node.ELEMENT_NODE;
}

/**
 * Check if value is a NodeList
 */
export function isNodeList(v: any): v is NodeList {
    return typeof NodeList !== "undefined" && v instanceof NodeList;
}

/**
 * Check if value is an HTMLElement
 */
export function isHTMLElement(v: any): v is HTMLElement {
    return !!v && v instanceof HTMLElement;
}

/**
 * Check if value is a Window
 */
export function isWindow(v: any): v is Window {
    return (
        !!v && typeof v.document === "object" && typeof v.location === "object"
    );
}

/**
 * Check if value is a Document
 */
export function isDocument(v: any): v is Document {
    return !!v && v.nodeType === Node.DOCUMENT_NODE;
}

// ============================================================================
// SPECIAL TYPES
// ============================================================================

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmpty(v: any): boolean {
    if (isNullOrUndefined(v)) return true;
    if (isString(v) || isArray(v)) return v.length === 0;
    if (isObject(v)) return Object.keys(v).length === 0;
    return false;
}

/**
 * Check if value is numeric (number or numeric string)
 */
export function isNumeric(v: any): boolean {
    if (isNumber(v)) return true;
    if (isString(v)) return !isNaN(parseFloat(v)) && isFinite(v as any);
    return false;
}

/**
 * Check if value is an integer
 */
export function isInteger(v: any): v is number {
    return Number.isInteger(v);
}

/**
 * Check if value is NaN
 */
export function isNaN(v: any): boolean {
    return Number.isNaN(v);
}

/**
 * Check if value is finite
 */
export function isFinite(v: any): boolean {
    return Number.isFinite(v);
}

/**
 * Check if value is iterable
 */
export function isIterable(v: any): v is Iterable<any> {
    return (
        v !== null &&
        v !== undefined &&
        typeof v[Symbol.iterator] === "function"
    );
}

/**
 * Check if value is array-like (has length property)
 */
export function isArrayLike(v: any): boolean {
    return (
        v !== null &&
        v !== undefined &&
        typeof v.length === "number" &&
        v.length >= 0
    );
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard for non-null values
 */
export function isDefined<T>(v: T | null | undefined): v is T {
    return v !== null && v !== undefined;
}

/**
 * Type guard for truthy values
 */
export function isTruthy<T>(v: T | null | undefined | false | 0 | ""): v is T {
    return !!v;
}

/**
 * Type guard for falsy values
 */
export function isFalsy(v: any): v is null | undefined | false | 0 | "" {
    return !v;
}

// ============================================================================
// TYPE OF
// ============================================================================

/**
 * Get detailed type of value
 */
export function typeOf(v: any): string {
    if (v === null) return "null";
    if (v === undefined) return "undefined";
    if (isArray(v)) return "array";
    if (isDate(v)) return "date";
    if (isRegExp(v)) return "regexp";
    if (isError(v)) return "error";
    if (isPromise(v)) return "promise";
    if (isMap(v)) return "map";
    if (isSet(v)) return "set";
    if (isElement(v)) return "element";
    if (isNode(v)) return "node";
    if (isNodeList(v)) return "nodelist";
    return typeof v;
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Assert value is defined
 */
export function assertDefined<T>(
    v: T | null | undefined,
    message: string = "Value must be defined"
): asserts v is T {
    if (!isDefined(v)) {
        throw new Error(message);
    }
}

/**
 * Assert value is of type
 */
export function assertType<T>(
    v: any,
    type: string,
    message?: string
): asserts v is T {
    const actualType = typeOf(v);
    if (actualType !== type) {
        throw new TypeError(message || `Expected ${type}, got ${actualType}`);
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    // Primitives
    isString,
    isNumber,
    isBoolean,
    isFunction,
    isUndefined,
    isNull,
    isNullOrUndefined,
    isSymbol,

    // Objects
    isObject,
    isPlainObject,
    isArray,
    isDate,
    isRegExp,
    isError,
    isPromise,
    isMap,
    isSet,
    isWeakMap,
    isWeakSet,

    // DOM
    isNode,
    isElement,
    isNodeList,
    isHTMLElement,
    isWindow,
    isDocument,

    // Special
    isEmpty,
    isNumeric,
    isInteger,
    isNaN,
    isFinite,
    isIterable,
    isArrayLike,

    // Guards
    isDefined,
    isTruthy,
    isFalsy,

    // Utilities
    typeOf,
    assertDefined,
    assertType
};
