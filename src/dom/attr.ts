/**
 * DOM attribute helpers.
 * Thin wrappers over Element.getAttribute/setAttribute for consistency and discoverability.
 *
 * @module dom/attr
 * @example
 * import { setAttribute, getAttribute, hasAttribute } from 'domutils/dom/attr';
 *
 * const btn = document.querySelector('.button');
 * setAttribute(btn, 'data-action', 'save');
 * getAttribute(btn, 'data-action'); // 'save'
 */

/**
 * Check if an element has an attribute.
 * @param el - The element
 * @param name - The attribute name
 * @returns True if the attribute exists
 */
export function hasAttribute(el: Element, name: string): boolean {
  return el.hasAttribute(name);
}

/**
 * Get an attribute value from an element.
 * @param el - The element
 * @param name - The attribute name
 * @returns The attribute value or null if not present
 */
export function getAttribute(el: Element, name: string): string | null {
  return el.getAttribute(name);
}

/**
 * Set an attribute on an element.
 * @param el - The element
 * @param name - The attribute name
 * @param value - The attribute value (string, boolean, or null to remove)
 *
 * @example
 * setAttribute(btn, 'data-action', 'save');
 * setAttribute(btn, 'disabled', true); // Sets as empty string
 * setAttribute(btn, 'aria-label', null); // Removes attribute
 */
export function setAttribute(
  el: Element,
  name: string,
  value: string | boolean | null
): void {
  if (value === null || value === false) {
    el.removeAttribute(name);
  } else if (value === true) {
    el.setAttribute(name, '');
  } else {
    el.setAttribute(name, String(value));
  }
}

/**
 * Remove an attribute from an element.
 * @param el - The element
 * @param name - The attribute name
 */
export function removeAttribute(el: Element, name: string): void {
  el.removeAttribute(name);
}

/**
 * Set multiple attributes at once.
 * @param el - The element
 * @param attrs - Object of attribute names and values
 *
 * @example
 * setAttributes(btn, {
 *   'data-action': 'save',
 *   'aria-label': 'Save changes',
 *   'disabled': false // Won't set disabled
 * });
 */
export function setAttributes(
  el: Element,
  attrs: Record<string, string | boolean | null>
): void {
  Object.entries(attrs).forEach(([name, value]) => {
    setAttribute(el, name, value);
  });
}

/**
 * Get multiple attributes at once.
 * @param el - The element
 * @param names - Array of attribute names
 * @returns Object with attribute names as keys
 *
 * @example
 * getAttributes(btn, ['data-action', 'aria-label']);
 * // { 'data-action': 'save', 'aria-label': 'Save changes' }
 */
export function getAttributes(
  el: Element,
  names: string[]
): Record<string, string | null> {
  return Object.fromEntries(
    names.map(name => [name, getAttribute(el, name)])
  );
}

/**
 * Get all attributes on an element.
 * @param el - The element
 * @returns Object with all attributes
 *
 * @example
 * getAllAttributes(btn);
 * // { 'class': 'btn', 'data-action': 'save', ... }
 */
export function getAllAttributes(el: Element): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const attr of el.attributes) {
    attrs[attr.name] = attr.value;
  }
  return attrs;
}

/**
 * Toggle an attribute's presence on an element.
 * @param el - The element
 * @param name - The attribute name
 * @param force - Optional. Force add or remove
 * @returns The new state (true = attribute present)
 *
 * @example
 * toggleAttribute(btn, 'disabled');
 * toggleAttribute(btn, 'aria-expanded', true); // Always add
 */
export function toggleAttribute(
  el: Element,
  name: string,
  force?: boolean
): boolean {
  if (force === true) {
    setAttribute(el, name, true);
    return true;
  }
  if (force === false) {
    removeAttribute(el, name);
    return false;
  }

  const has = hasAttribute(el, name);
  if (has) {
    removeAttribute(el, name);
  } else {
    setAttribute(el, name, true);
  }
  return !has;
}

/**
 * Get an attribute that starts with a prefix and parse as data.
 * Common for data-* attributes.
 *
 * @param el - The element
 * @param prefix - The prefix (e.g., 'data-')
 * @returns Object of matched attributes
 *
 * @example
 * getPrefixedAttributes(btn, 'data-');
 * // { 'action': 'save', 'id': '123' } (from data-action, data-id)
 */
export function getPrefixedAttributes(
  el: Element,
  prefix: string
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const attr of el.attributes) {
    if (attr.name.startsWith(prefix)) {
      const key = attr.name.slice(prefix.length);
      result[key] = attr.value;
    }
  }
  return result;
}

/**
 * Set ARIA (accessibility) attributes.
 * @param el - The element
 * @param attrs - Object of ARIA attributes (without 'aria-' prefix)
 *
 * @example
 * setAriaAttributes(btn, {
 *   'label': 'Save changes',
 *   'pressed': true,
 *   'expanded': false
 * });
 */
export function setAriaAttributes(
  el: Element,
  attrs: Record<string, string | boolean | null>
): void {
  Object.entries(attrs).forEach(([name, value]) => {
    setAttribute(el, `aria-${name}`, value);
  });
}

/**
 * Get ARIA attributes as an object.
 * @param el - The element
 * @returns Object of ARIA attributes (without 'aria-' prefix)
 *
 * @example
 * getAriaAttributes(btn);
 * // { 'label': 'Save', 'pressed': 'true' }
 */
export function getAriaAttributes(el: Element): Record<string, string> {
  return getPrefixedAttributes(el, 'aria-');
}

/**
 * Set data attributes.
 * @param el - The element
 * @param data - Object of data attributes (without 'data-' prefix)
 *
 * @example
 * setDataAttributes(btn, {
 *   'action': 'save',
 *   'id': '123'
 * });
 * // Sets data-action="save" data-id="123"
 */
export function setDataAttributes(
  el: HTMLElement,
  data: Record<string, string | number | boolean>
): void {
  Object.entries(data).forEach(([key, value]) => {
    el.dataset[key] = String(value);
  });
}

/**
 * Get data attributes as an object.
 * @param el - The element
 * @returns Object of data attributes (without 'data-' prefix)
 *
 * @example
 * getDataAttributes(btn);
 * // { 'action': 'save', 'id': '123' }
 */
export function getDataAttributes(el: HTMLElement): Record<string, string> {
  return { ...el.dataset } as Record<string, string>;
}
