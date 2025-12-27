/**
 * DOM style helpers.
 * Utilities for managing inline CSS and computed styles.
 *
 * @module dom/style
 * @example
 * import { setStyle, getStyle, show, hide } from 'domutils/dom/style';
 *
 * const el = document.querySelector('.box');
 * setStyle(el, { color: 'red', padding: 20 });
 * getStyle(el, 'color'); // 'red'
 */

import type { CSSProperties } from './types';

/**
 * Set inline CSS styles on an element.
 * @param el - The element
 * @param styles - Object of CSS properties
 *
 * @example
 * setStyle(el, { color: 'red', display: 'block' });
 * setStyle(el, { padding: 20 }); // Automatically adds 'px'
 */
export function setStyle(
  el: HTMLElement,
  styles: Partial<CSSProperties>
): void {
  Object.entries(styles).forEach(([key, value]) => {
    const cssKey = kebabCase(key);
    const cssValue =
      typeof value === 'number' && !unitlessProperties.has(key)
        ? `${value}px`
        : String(value);
    el.style.setProperty(cssKey, cssValue);
  });
}

/**
 * Get an inline style property value.
 * @param el - The element
 * @param property - CSS property name (camelCase or kebab-case)
 * @returns The style value or empty string
 *
 * @example
 * getStyle(el, 'color'); // 'rgb(255, 0, 0)'
 * getStyle(el, 'padding'); // '20px'
 */
export function getStyle(el: HTMLElement, property: string): string {
  const cssKey = kebabCase(property);
  return el.style.getPropertyValue(cssKey);
}

/**
 * Get computed CSS style for a property (includes inherited styles).
 * @param el - The element
 * @param property - CSS property name
 * @returns The computed style value
 *
 * @example
 * getComputedStyle(el, 'color'); // Includes inherited styles
 */
export function getComputedStyle(el: Element, property: string): string {
  const cssKey = kebabCase(property);
  return window.getComputedStyle(el).getPropertyValue(cssKey);
}

/**
 * Get multiple computed styles.
 * @param el - The element
 * @param properties - Array of property names
 * @returns Object with property values
 *
 * @example
 * getComputedStyles(el, ['color', 'display', 'padding']);
 */
export function getComputedStyles(
  el: Element,
  properties: string[]
): Record<string, string> {
  const computed = window.getComputedStyle(el);
  return Object.fromEntries(
    properties.map(prop => [prop, computed.getPropertyValue(kebabCase(prop))])
  );
}

/**
 * Remove one or more inline styles.
 * @param el - The element
 * @param properties - CSS property name(s)
 *
 * @example
 * removeStyle(el, 'color');
 * removeStyle(el, ['color', 'padding']);
 */
export function removeStyle(el: HTMLElement, properties: string | string[]): void {
  const props = Array.isArray(properties) ? properties : [properties];
  props.forEach(prop => {
    el.style.removeProperty(kebabCase(prop));
  });
}

/**
 * Clear all inline styles.
 * @param el - The element
 *
 * @example
 * clearStyles(el);
 */
export function clearStyles(el: HTMLElement): void {
  el.style.cssText = '';
}

/**
 * Hide an element while preserving its original display value.
 * @param el - The element
 *
 * @example
 * hide(el); // Can later call show() to restore
 */
export function hide(el: HTMLElement): void {
  const display = getStyle(el, 'display');
  if (display && display !== 'none') {
    el.dataset.origDisplay = display;
  } else if (!el.dataset.origDisplay) {
    const computed = getComputedStyle(el, 'display');
    el.dataset.origDisplay = computed || 'block';
  }
  el.style.display = 'none';
}

/**
 * Show an element, restoring its original display value.
 * @param el - The element
 *
 * @example
 * show(el); // Restores display to value before hide()
 */
export function show(el: HTMLElement): void {
  const origDisplay = el.dataset.origDisplay;
  el.style.display = origDisplay || '';
  if (origDisplay) {
    delete el.dataset.origDisplay;
  }
}

/**
 * Toggle visibility of an element.
 * @param el - The element
 * @returns The new visibility state (true = visible)
 *
 * @example
 * const isVisible = toggle(el);
 */
export function toggle(el: HTMLElement): boolean {
  const isHidden = getStyle(el, 'display') === 'none' ||
                   getComputedStyle(el, 'display') === 'none';
  if (isHidden) {
    show(el);
  } else {
    hide(el);
  }
  return !isHidden;
}

/**
 * Check if an element is visible (display !== 'none').
 * @param el - The element
 * @returns True if element is visible
 *
 * @example
 * if (isVisible(el)) { // element is visible }
 */
export function isVisible(el: HTMLElement): boolean {
  return getComputedStyle(el, 'display') !== 'none' && el.offsetHeight > 0;
}

/**
 * Get CSS custom property (CSS variable) value.
 * @param el - The element
 * @param name - Variable name (with or without '--')
 * @returns The variable value or empty string
 *
 * @example
 * getCSSVariable(el, '--primary-color');
 * getCSSVariable(el, 'primary-color'); // Works too
 */
export function getCSSVariable(el: Element, name: string): string {
  const varName = name.startsWith('--') ? name : `--${name}`;
  return getComputedStyle(el, varName).trim();
}

/**
 * Set CSS custom property (CSS variable).
 * @param el - The element
 * @param name - Variable name (with or without '--')
 * @param value - Variable value
 *
 * @example
 * setCSSVariable(el, '--primary-color', '#ff0000');
 * setCSSVariable(el, 'primary-color', '#ff0000'); // Works too
 */
export function setCSSVariable(el: HTMLElement, name: string, value: string): void {
  const varName = name.startsWith('--') ? name : `--${name}`;
  el.style.setProperty(varName, value);
}

/**
 * Set CSS variables on an element.
 * @param el - The element
 * @param variables - Object of variable names and values
 *
 * @example
 * setCSSVariables(el, {
 *   'primary-color': '#ff0000',
 *   'secondary-color': '#00ff00'
 * });
 */
export function setCSSVariables(
  el: HTMLElement,
  variables: Record<string, string>
): void {
  Object.entries(variables).forEach(([name, value]) => {
    setCSSVariable(el, name, value);
  });
}

/**
 * Check if element matches a CSS media query.
 * @param el - The element
 * @param query - Media query string
 * @returns True if media query matches
 *
 * @example
 * if (matchesMedia(el, '(prefers-dark-mode)')) { // dark mode }
 */
export function matchesMedia(el: Element, query: string): boolean {
  return window.matchMedia(query).matches;
}

/**
 * Get element's opacity.
 * @param el - The element
 * @returns Opacity value (0-1)
 */
export function getOpacity(el: HTMLElement): number {
  return parseFloat(getComputedStyle(el, 'opacity')) || 1;
}

/**
 * Set element's opacity.
 * @param el - The element
 * @param value - Opacity value (0-1)
 *
 * @example
 * setOpacity(el, 0.5);
 */
export function setOpacity(el: HTMLElement, value: number): void {
  el.style.opacity = String(Math.max(0, Math.min(1, value)));
}

// Helper to convert camelCase to kebab-case
function kebabCase(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

// Properties that don't need 'px' unit
const unitlessProperties = new Set([
  'opacity',
  'zIndex',
  'fontWeight',
  'lineHeight',
  'order',
  'flex',
  'flexGrow',
  'flexShrink',
]);
