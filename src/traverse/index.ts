/**
 * DOM traversal helpers.
 * Utilities for navigating the DOM tree (parent, children, siblings, ancestors).
 *
 * @module traverse
 * @example
 * import { parent, children, siblings } from 'domutils/traverse';
 *
 * const parentEl = parent(el);
 * const kids = children(el);
 * const sibs = siblings(el);
 */

/**
 * Get the parent element.
 *
 * @param el - The element
 * @param selector - Optional CSS selector to match ancestor
 * @returns The parent element or null
 *
 * @example
 * const p = parent(el);              // Immediate parent
 * const container = parent(el, '.container'); // First ancestor matching selector
 */
export function parent(el: Element, selector?: string): Element | null {
  if (!selector) {
    return el.parentElement;
  }
  return el.closest(selector);
}

/**
 * Get all ancestors of an element.
 *
 * @param el - The element
 * @param selector - Optional CSS selector to filter ancestors
 * @returns Array of ancestor elements
 *
 * @example
 * const ancestors = ancestors(el);           // All ancestors
 * const parents = ancestors(el, '.parent');  // Only matching ancestors
 */
export function ancestors(el: Element, selector?: string): Element[] {
  const result: Element[] = [];
  let current = el.parentElement;

  while (current) {
    if (!selector || current.matches(selector)) {
      result.push(current);
    }
    current = current.parentElement;
  }

  return result;
}

/**
 * Get all child elements.
 *
 * @param el - The parent element
 * @param selector - Optional CSS selector to filter children
 * @returns Array of child elements
 *
 * @example
 * const all = children(el);        // All direct children
 * const divs = children(el, 'div'); // Only div children
 */
export function children(el: Element, selector?: string): Element[] {
  const result = Array.from(el.children);

  if (!selector) {
    return result;
  }

  return result.filter(child => child.matches(selector));
}

/**
 * Get the first child element.
 *
 * @param el - The parent element
 * @param selector - Optional CSS selector to filter
 * @returns The first child element or null
 *
 * @example
 * const first = firstChild(el);        // First child
 * const firstDiv = firstChild(el, 'div'); // First div child
 */
export function firstChild(el: Element, selector?: string): Element | null {
  if (!selector) {
    return el.firstElementChild;
  }

  for (const child of el.children) {
    if (child.matches(selector)) {
      return child;
    }
  }
  return null;
}

/**
 * Get the last child element.
 *
 * @param el - The parent element
 * @param selector - Optional CSS selector to filter
 * @returns The last child element or null
 *
 * @example
 * const last = lastChild(el);        // Last child
 * const lastDiv = lastChild(el, 'div'); // Last div child
 */
export function lastChild(el: Element, selector?: string): Element | null {
  const kids = children(el, selector);
  return kids[kids.length - 1] || null;
}

/**
 * Get the nth child element.
 *
 * @param el - The parent element
 * @param index - Index of child (0-based)
 * @param selector - Optional CSS selector to filter
 * @returns The nth child or null
 *
 * @example
 * const second = nthChild(el, 1);        // Second child
 * const thirdDiv = nthChild(el, 2, 'div'); // Third div child
 */
export function nthChild(el: Element, index: number, selector?: string): Element | null {
  const kids = children(el, selector);
  return kids[index] || null;
}

/**
 * Get all descendant elements.
 *
 * @param el - The parent element
 * @param selector - Optional CSS selector to filter descendants
 * @returns Array of descendant elements
 *
 * @example
 * const all = descendants(el);        // All descendants
 * const divs = descendants(el, 'div'); // Only div descendants
 */
export function descendants(el: Element, selector?: string): Element[] {
  if (!selector) {
    return Array.from(el.querySelectorAll('*'));
  }
  return Array.from(el.querySelectorAll(selector));
}

/**
 * Get the next sibling element.
 *
 * @param el - The element
 * @param selector - Optional CSS selector to match
 * @returns The next sibling or null
 *
 * @example
 * const next = nextSibling(el);        // Next element
 * const nextBtn = nextSibling(el, '.button'); // Next matching element
 */
export function nextSibling(el: Element, selector?: string): Element | null {
  let sibling = el.nextElementSibling;

  while (sibling) {
    if (!selector || sibling.matches(selector)) {
      return sibling;
    }
    sibling = sibling.nextElementSibling;
  }

  return null;
}

/**
 * Get the previous sibling element.
 *
 * @param el - The element
 * @param selector - Optional CSS selector to match
 * @returns The previous sibling or null
 *
 * @example
 * const prev = prevSibling(el);        // Previous element
 * const prevBtn = prevSibling(el, '.button'); // Previous matching element
 */
export function prevSibling(el: Element, selector?: string): Element | null {
  let sibling = el.previousElementSibling;

  while (sibling) {
    if (!selector || sibling.matches(selector)) {
      return sibling;
    }
    sibling = sibling.previousElementSibling;
  }

  return null;
}

/**
 * Alias for prevSibling - shorter name.
 */
export function previousSibling(el: Element, selector?: string): Element | null {
  return prevSibling(el, selector);
}

/**
 * Get all sibling elements (excluding the element itself).
 *
 * @param el - The element
 * @param selector - Optional CSS selector to filter siblings
 * @returns Array of sibling elements
 *
 * @example
 * const sibs = siblings(el);         // All siblings
 * const sibBtns = siblings(el, '.button'); // Only button siblings
 */
export function siblings(el: Element, selector?: string): Element[] {
  const parent = el.parentElement;
  if (!parent) return [];

  const sibs = Array.from(parent.children).filter(child => child !== el);

  if (!selector) {
    return sibs;
  }

  return sibs.filter(sib => sib.matches(selector));
}

/**
 * Get all next siblings until condition is met.
 *
 * @param el - The element
 * @param predicate - Stop condition
 * @returns Array of elements until predicate returns true
 *
 * @example
 * // Get all siblings until a divider
 * const until = nextUntil(el, (e) => e.classList.contains('divider'));
 */
export function nextUntil(
  el: Element,
  predicate: (el: Element) => boolean
): Element[] {
  const result: Element[] = [];
  let current = el.nextElementSibling;

  while (current) {
    if (predicate(current)) break;
    result.push(current);
    current = current.nextElementSibling;
  }

  return result;
}

/**
 * Get all previous siblings until condition is met.
 *
 * @param el - The element
 * @param predicate - Stop condition
 * @returns Array of elements until predicate returns true
 *
 * @example
 * // Get all siblings until a divider
 * const until = prevUntil(el, (e) => e.classList.contains('divider'));
 */
export function prevUntil(
  el: Element,
  predicate: (el: Element) => boolean
): Element[] {
  const result: Element[] = [];
  let current = el.previousElementSibling;

  while (current) {
    if (predicate(current)) break;
    result.push(current);
    current = current.previousElementSibling;
  }

  return result;
}

/**
 * Alias for prevUntil - shorter name.
 */
export function previousUntil(
  el: Element,
  predicate: (el: Element) => boolean
): Element[] {
  return prevUntil(el, predicate);
}

/**
 * Get the closest ancestor matching selector.
 * Same as element.closest() but included for consistency.
 *
 * @param el - The element
 * @param selector - CSS selector
 * @returns The closest ancestor or null
 *
 * @example
 * const row = closest(el, 'tr');
 * const container = closest(el, '.container');
 */
export function closest(el: Element, selector: string): Element | null {
  try {
    return el.closest(selector);
  } catch {
    return null;
  }
}

/**
 * Check if an element is an ancestor of another element.
 *
 * @param ancestor - Potential ancestor
 * @param el - The element to check
 * @returns True if ancestor contains el
 *
 * @example
 * if (isAncestor(container, el)) {
 *   console.log('el is inside container');
 * }
 */
export function isAncestor(ancestor: Element, el: Element): boolean {
  return ancestor.contains(el);
}

/**
 * Check if an element is a descendant of another element.
 *
 * @param el - The element to check
 * @param ancestor - Potential ancestor
 * @returns True if el is inside ancestor
 *
 * @example
 * if (isDescendant(el, container)) {
 *   console.log('el is inside container');
 * }
 */
export function isDescendant(el: Element, ancestor: Element): boolean {
  return ancestor.contains(el);
}

/**
 * Check if elements are siblings.
 *
 * @param el1 - First element
 * @param el2 - Second element
 * @returns True if elements share same parent
 *
 * @example
 * if (areSiblings(el1, el2)) {
 *   console.log('Elements are siblings');
 * }
 */
export function areSiblings(el1: Element, el2: Element): boolean {
  return el1.parentElement === el2.parentElement && el1 !== el2;
}

/**
 * Get the root element (html).
 *
 * @param el - Any element
 * @returns The root html element
 *
 * @example
 * const root = getRoot(el);
 */
export function getRoot(el: Element): Element {
  let current = el;
  while (current.parentElement) {
    current = current.parentElement;
  }
  return current;
}

/**
 * Get the closest common ancestor of two elements.
 *
 * @param el1 - First element
 * @param el2 - Second element
 * @returns The common ancestor or null
 *
 * @example
 * const common = commonAncestor(el1, el2);
 */
 export function commonAncestor(el1: Element, el2: Element): Element | null {
  let current: Element | null = el1;

  while (current) {
    if (current.contains(el2)) {
      return current;
    }
    current = current.parentElement;
  }

  return null;
}
/**
 * Get all elements between two sibling elements.
 *
 * @param el1 - First element
 * @param el2 - Second element
 * @param inclusive - Include the boundary elements (default: false)
 * @returns Array of elements between
 *
 * @example
 * const between = elementsBetween(start, end);
 * const inclusive = elementsBetween(start, end, true);
 */
export function elementsBetween(
  el1: Element,
  el2: Element,
  inclusive: boolean = false
): Element[] {
  const result: Element[] = [];

  // Determine which element comes first
  const parent = el1.parentElement;
  if (!parent || !parent.contains(el2)) {
    return result;
  }

  let current = inclusive ? el1 : el1.nextElementSibling;
  const end = inclusive ? el2 : el2;

  while (current && current !== end) {
    result.push(current);
    current = current.nextElementSibling;
  }

  if (inclusive && current === end) {
    result.push(current);
  }

  return result;
}

/**
 * Walk the DOM tree with a callback function.
 * Depth-first traversal.
 *
 * @param el - The element to start from
 * @param callback - Function called for each element
 * @param options - Walk options
 *
 * @example
 * walk(root, (el) => {
 *   console.log(el.tagName);
 * });
 *
 * // Stop at certain elements
 * walk(root, (el) => {
 *   console.log(el.tagName);
 *   if (el.classList.contains('stop')) {
 *     return 'stop'; // Stop traversal
 *   }
 * });
 */
export function walk(
  el: Element,
  callback: (el: Element, depth: number) => void | 'stop',
  options?: { depth?: number }
): void {
  const depth = options?.depth ?? 0;

  const result = callback(el, depth);
  if (result === 'stop') return;

  for (const child of el.children) {
    walk(child, callback, { depth: depth + 1 });
  }
}

/**
 * Find first element in tree matching predicate.
 *
 * @param el - The element to start from
 * @param predicate - Test function
 * @returns First matching element or null
 *
 * @example
 * const found = findInTree(root, (el) => {
 *   return el.classList.contains('target');
 * });
 */
export function findInTree(
  el: Element,
  predicate: (el: Element, depth: number) => boolean,
  options?: { depth?: number }
): Element | null {
  const depth = options?.depth ?? 0;

  if (predicate(el, depth)) {
    return el;
  }

  for (const child of el.children) {
    const found = findInTree(child, predicate, { depth: depth + 1 });
    if (found) return found;
  }

  return null;
}

/**
 * Find all elements in tree matching predicate.
 *
 * @param el - The element to start from
 * @param predicate - Test function
 * @returns Array of matching elements
 *
 * @example
 * const found = findAllInTree(root, (el) => {
 *   return el.classList.contains('target');
 * });
 */
export function findAllInTree(
  el: Element,
  predicate: (el: Element, depth: number) => boolean,
  options?: { depth?: number }
): Element[] {
  const result: Element[] = [];
  const depth = options?.depth ?? 0;

  if (predicate(el, depth)) {
    result.push(el);
  }

  for (const child of el.children) {
    result.push(...findAllInTree(child, predicate, { depth: depth + 1 }));
  }

  return result;
}

/**
 * Get the depth of an element in the DOM tree.
 *
 * @param el - The element
 * @returns Number of ancestors (0 for html element)
 *
 * @example
 * const depth = getDepth(el); // 0 for html, 1 for body, etc.
 */
export function getDepth(el: Element): number {
  let depth = 0;
  let current = el.parentElement;

  while (current) {
    depth++;
    current = current.parentElement;
  }

  return depth;
}

/**
 * Count child elements.
 *
 * @param el - The element
 * @param selector - Optional selector to filter
 * @returns Number of children
 *
 * @example
 * const count = countChildren(ul);           // All children
 * const items = countChildren(ul, 'li');    // Only li elements
 */
export function countChildren(el: Element, selector?: string): number {
  return children(el, selector).length;
}

/**
 * Check if element has children.
 *
 * @param el - The element
 * @param selector - Optional selector
 * @returns True if has children
 *
 * @example
 * if (hasChildren(el)) { //has kids }
 * if (hasChildren(el, '.item')) { // has item children }
 */
export function hasChildren(el: Element, selector?: string): boolean {
  return countChildren(el, selector) > 0;
}

/**
 * Get all text nodes within an element.
 *
 * @param el - The element
 * @returns Array of text nodes
 *
 * @example
 * const textNodes = getTextNodes(el);
 */
export function getTextNodes(el: Element): Text[] {
  const textNodes: Text[] = [];

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      textNodes.push(node as Text);
    } else {
      for (const child of node.childNodes) {
        walk(child);
      }
    }
  };

  walk(el);
  return textNodes;
}
