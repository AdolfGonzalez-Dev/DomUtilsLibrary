/**
 * DOM class helpers.
 * Thin wrappers over classList API for consistency, discoverability, and type safety.
 *
 * @module dom/class
 * @example
 * import { addClass, removeClass, hasClass } from 'domutils/dom/class';
 *
 * const btn = document.querySelector('.button');
 * addClass(btn, 'active');
 * hasClass(btn, 'active'); // true
 * removeClass(btn, 'active');
 */

/**
 * Check if an element has a class.
 * @param el - The element to check
 * @param className - The class name to check
 * @returns True if the element has the class
 */
export function hasClass(el: Element, className: string): boolean {
  return el.classList.contains(className);
}

/**
 * Add one or more classes to an element.
 * @param el - The element to add classes to
 * @param className - Single class name or array of class names
 *
 * @example
 * addClass(btn, 'active');
 * addClass(btn, ['active', 'focused']);
 */
export function addClass(el: Element, className: string | string[]): void {
  if (Array.isArray(className)) {
    el.classList.add(...className);
  } else {
    el.classList.add(className);
  }
}

/**
 * Remove one or more classes from an element.
 * @param el - The element to remove classes from
 * @param className - Single class name or array of class names
 *
 * @example
 * removeClass(btn, 'active');
 * removeClass(btn, ['active', 'focused']);
 */
export function removeClass(el: Element, className: string | string[]): void {
  if (Array.isArray(className)) {
    el.classList.remove(...className);
  } else {
    el.classList.remove(className);
  }
}

/**
 * Toggle one or more classes on an element.
 * @param el - The element to toggle classes on
 * @param className - Single class name or array of class names
 * @param force - Optional. If true, add the class; if false, remove it
 * @returns The new state (true = class added, false = class removed)
 *
 * @example
 * toggleClass(btn, 'active');
 * toggleClass(btn, 'active', true); // Always add
 * toggleClass(btn, ['active', 'focused']);
 */
export function toggleClass(
  el: Element,
  className: string | string[],
  force?: boolean
): boolean {
  if (Array.isArray(className)) {
    // For multiple classes, return state of first one
    return el.classList.toggle(className[0], force);
  }
  return el.classList.toggle(className, force);
}

/**
 * Remove all classes matching a predicate function.
 * @param el - The element to process
 * @param predicate - Function that returns true for classes to remove
 *
 * @example
 * // Remove all classes starting with 'btn-'
 * removeClassIf(el, name => name.startsWith('btn-'));
 */
export function removeClassIf(
  el: Element,
  predicate: (className: string) => boolean
): void {
  Array.from(el.classList)
    .filter(predicate)
    .forEach(className => el.classList.remove(className));
}

/**
 * Replace one class with another.
 * @param el - The element
 * @param oldClass - The class to remove
 * @param newClass - The class to add
 *
 * @example
 * replaceClass(btn, 'btn-primary', 'btn-secondary');
 */
export function replaceClass(el: Element, oldClass: string, newClass: string): void {
  el.classList.remove(oldClass);
  el.classList.add(newClass);
}

/**
 * Get all classes on an element as an array.
 * @param el - The element
 * @returns Array of class names
 *
 * @example
 * getClasses(el); // ['active', 'focused', 'btn']
 */
export function getClasses(el: Element): string[] {
  return Array.from(el.classList);
}

/**
 * Set all classes on an element (replaces existing).
 * @param el - The element
 * @param classNames - Array of class names to set
 *
 * @example
 * setClasses(el, ['active', 'focused']);
 */
export function setClasses(el: Element, classNames: string[]): void {
  el.className = classNames.join(' ');
}

/**
 * Clear all classes from an element.
 * @param el - The element
 *
 * @example
 * clearClasses(el);
 */
export function clearClasses(el: Element): void {
  el.className = '';
}

/**
 * Check if element has any of the given classes.
 * @param el - The element
 * @param classNames - Array of class names to check
 * @returns True if element has at least one of the classes
 *
 * @example
 * hasAnyClass(el, ['active', 'disabled']); // true if has either
 */
export function hasAnyClass(el: Element, classNames: string[]): boolean {
  return classNames.some(className => el.classList.contains(className));
}

/**
 * Check if element has all of the given classes.
 * @param el - The element
 * @param classNames - Array of class names to check
 * @returns True if element has all the classes
 *
 * @example
 * hasAllClasses(el, ['active', 'disabled']); // true if has both
 */
export function hasAllClasses(el: Element, classNames: string[]): boolean {
  return classNames.every(className => el.classList.contains(className));
}
