/**
 * DOM module - Core DOM manipulation utilities.
 * 
 * Organized into focused modules:
 * - class: Class list helpers
 * - attr: Attribute helpers
 * - style: CSS style helpers
 * - query: Element selection helpers
 * 
 * @module dom
 * @example
 * // Import specific module
 * import { addClass } from 'domutils/dom/class';
 * 
 * // Import with namespace
 * import * as DOM from 'domutils/dom';
 * DOM.addClass(el, 'active');
 * 
 * // From root (after registering)
 * import { dom } from 'domutils';
 * dom.addClass(el, 'active');
 */

// Re-export all from submodules
export * from './class';
export * from './attr';
export * from './style';
export * from './query';
export * from './types';

// Namespace exports for convenience
export * as class from './class';
export * as attr from './attr';
export * as style from './style';
export * as query from './query';
