/**
 * DOM query helpers.
 * Utilities for selecting and finding DOM elements with type safety.
 *
 * @module dom/query
 * @example
 * import { query, queryAll } from 'domutils/dom/query';
 *
 * const btn = query('.button');
 * const btns = queryAll('.button');
 */

/**
 * Query for a single element.
 * @param selector - CSS selector string
 * @param root - Element or Document to search in (default: document)
 * @returns The first matching element or null
 *
 * @example
 * const btn = query('.button');
 * const btn2 = query('.button', container);
 */
export function query(
  selector: string,
  root: Document | Element = document
): Element | null {
  try {
    return root.querySelector(selector);
  } catch {
    console.warn(`Invalid selector: "${selector}"`);
    return null;
  }
}

/**
 * Query for all matching elements.
 * @param selector - CSS selector string
 * @param root - Element or Document to search in (default: document)
 * @returns Array of matching elements
 *
 * @example
 * const btns = queryAll('.button');
 * const items = queryAll('.item', container);
 */
export function queryAll(
  selector: string,
  root: Document | Element = document
): Element[] {
  try {
    return Array.from(root.querySelectorAll(selector));
  } catch {
    console.warn(`Invalid selector: "${selector}"`);
    return [];
  }
}

/**
 * Alias for query() - shorter name.
 * @param selector - CSS selector string
 * @param root - Element or Document to search in
 * @returns The first matching element or null
 *
 * @example
 * const btn = q('.button');
 */
export function q(
  selector: string,
  root?: Document | Element
): Element | null {
  return query(selector, root);
}

/**
 * Alias for queryAll() - shorter name.
 * @param selector - CSS selector string
 * @param root - Element or Document to search in
 * @returns Array of matching elements
 *
 * @example
 * const btns = qa('.button');
 */
export function qa(
  selector: string,
  root?: Document | Element
): Element[] {
  return queryAll(selector, root);
}

/**
 * Query for a single element starting from a parent element.
 * @param parent - The parent element to search in
 * @param selector - CSS selector string
 * @returns The first matching element or null
 *
 * @example
 * const child = queryFrom(container, '.button');
 */
export function queryFrom(parent: Element, selector: string): Element | null {
  return query(selector, parent);
}

/**
 * Query for all elements starting from a parent element.
 * @param parent - The parent element to search in
 * @param selector - CSS selector string
 * @returns Array of matching elements
 *
 * @example
 * const children = queryAllFrom(container, '.button');
 */
export function queryAllFrom(parent: Element, selector: string): Element[] {
  return queryAll(selector, parent);
}

/**
 * Find the first element matching a predicate function.
 * @param selector - CSS selector to get candidate elements
 * @param predicate - Function to test each element
 * @param root - Element or Document to search in
 * @returns The first element matching the predicate or null
 *
 * @example
 * const visibleBtn = findElement('.button', el => el.offsetHeight > 0);
 */
export function findElement(
  selector: string,
  predicate: (el: Element) => boolean,
  root?: Document | Element
): Element | null {
  const elements = queryAll(selector, root);
  return elements.find(predicate) || null;
}

/**
 * Find all elements matching a predicate function.
 * @param selector - CSS selector to get candidate elements
 * @param predicate - Function to test each element
 * @param root - Element or Document to search in
 * @returns Array of elements matching the predicate
 *
 * @example
 * const visibleBtns = findElements('.button', el => el.offsetHeight > 0);
 */
export function findElements(
  selector: string,
  predicate: (el: Element) => boolean,
  root?: Document | Element
): Element[] {
  const elements = queryAll(selector, root);
  return elements.filter(predicate);
}

/**
 * Get the first element with a specific tag name.
 * @param tagName - HTML tag name (case-insensitive)
 * @param root - Element or Document to search in
 * @returns The first matching element or null
 *
 * @example
 * const button = queryByTag('button');
 */
export function queryByTag(
  tagName: string,
  root: Document | Element = document
): Element | null {
  return query(tagName, root);
}

/**
 * Get all elements with a specific tag name.
 * @param tagName - HTML tag name (case-insensitive)
 * @param root - Element or Document to search in
 * @returns Array of matching elements
 *
 * @example
 * const buttons = queryAllByTag('button');
 */
export function queryAllByTag(
  tagName: string,
  root: Document | Element = document
): Element[] {
  return queryAll(tagName, root);
}

/**
 * Get the first element with a specific class.
 * @param className - Class name (without dot)
 * @param root - Element or Document to search in
 * @returns The first matching element or null
 *
 * @example
 * const active = queryByClass('active');
 */
export function queryByClass(
  className: string,
  root: Document | Element = document
): Element | null {
  return query(`.${className}`, root);
}

/**
 * Get all elements with a specific class.
 * @param className - Class name (without dot)
 * @param root - Element or Document to search in
 * @returns Array of matching elements
 *
 * @example
 * const items = queryAllByClass('item');
 */
export function queryAllByClass(
  className: string,
  root: Document | Element = document
): Element[] {
  return queryAll(`.${className}`, root);
}

/**
 * Get the first element with a specific ID.
 * @param id - Element ID (without hash)
 * @param root - Element or Document to search in
 * @returns The matching element or null
 *
 * @example
 * const header = queryById('header');
 */
export function queryById(
  id: string,
  root: Document | Element = document
): Element | null {
  return query(`#${id}`, root);
}

/**
 * Get all elements with a specific data attribute.
 * @param attrName - Data attribute name (with or without 'data-' prefix)
 * @param root - Element or Document to search in
 * @returns Array of matching elements
 *
 * @example
 * const tracked = queryByData('track');
 * // Finds: [data-track], [data-track="..."]
 */
export function queryByData(
  attrName: string,
  root: Document | Element = document
): Element[] {
  const attr = attrName.startsWith('data-') ? attrName : `data-${attrName}`;
  return queryAll(`[${attr}]`, root);
}

/**
 * Get all elements with a specific data attribute value.
 * @param attrName - Data attribute name
 * @param value - Attribute value to match
 * @param root - Element or Document to search in
 * @returns Array of matching elements
 *
 * @example
 * const saved = queryByData('action', 'save');
 * // Finds: [data-action="save"]
 */
export function queryByDataValue(
  attrName: string,
  value: string,
  root: Document | Element = document
): Element[] {
  const attr = attrName.startsWith('data-') ? attrName : `data-${attrName}`;
  return queryAll(`[${attr}="${value}"]`, root);
}

/**
 * Get all child elements of a parent element.
 * @param parent - The parent element
 * @param selector - Optional CSS selector to filter children
 * @returns Array of child elements
 *
 * @example
 * const children = getChildren(parent);
 * const items = getChildren(parent, '.item');
 */
export function getChildren(parent: Element, selector?: string): Element[] {
  if (selector) {
    return queryAll(selector, parent);
  }
  return Array.from(parent.children);
}

/**
 * Get the first child element.
 * @param parent - The parent element
 * @param selector - Optional CSS selector to filter
 * @returns The first child element or null
 *
 * @example
 * const first = getFirstChild(parent);
 */
export function getFirstChild(parent: Element, selector?: string): Element | null {
  if (selector) {
    return query(selector, parent);
  }
  return parent.firstElementChild;
}

/**
 * Get the last child element.
 * @param parent - The parent element
 * @param selector - Optional CSS selector to filter
 * @returns The last child element or null
 *
 * @example
 * const last = getLastChild(parent);
 */
export function getLastChild(parent: Element, selector?: string): Element | null {
  const children = getChildren(parent, selector);
  return children[children.length - 1] || null;
}

/**
 * Get the parent element.
 * @param el - The element
 * @param selector - Optional selector to match ancestor
 * @returns The parent element or null
 *
 * @example
 * const parent = getParent(el);
 * const container = getParent(el, '.container');
 */
export function getParent(el: Element, selector?: string): Element | null {
  if (!selector) {
    return el.parentElement;
  }
  return el.closest(selector);
}

/**
 * Get next sibling element.
 * @param el - The element
 * @param selector - Optional CSS selector to filter
 * @returns The next sibling or null
 *
 * @example
 * const next = getNextSibling(el);
 * const nextBtn = getNextSibling(el, '.button');
 */
export function getNextSibling(el: Element, selector?: string): Element | null {
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
 * Get previous sibling element.
 * @param el - The element
 * @param selector - Optional CSS selector to filter
 * @returns The previous sibling or null
 *
 * @example
 * const prev = getPreviousSibling(el);
 * const prevBtn = getPreviousSibling(el, '.button');
 */
export function getPreviousSibling(el: Element, selector?: string): Element | null {
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
 * Get all sibling elements.
 * @param el - The element
 * @param selector - Optional CSS selector to filter
 * @returns Array of sibling elements
 *
 * @example
 * const siblings = getSiblings(el);
 */
export function getSiblings(el: Element, selector?: string): Element[] {
  const parent = el.parentElement;
  if (!parent) return [];
  const siblings = Array.from(parent.children).filter(child => child !== el);
  return selector ? siblings.filter(sibling => sibling.matches(selector)) : siblings;
}
