/**
 * Content manipulation helpers.
 * Utilities for managing element content (HTML, text, children manipulation).
 *
 * @module content
 * @example
 * import { setHTML, getText, append, highlight } from 'domutils/content';
 *
 * setHTML(el, '<p>Hello</p>');
 * const text = getText(el);
 * append(el, '<span>World</span>');
 * highlight(el, 'search term');
 */

// ============================================================================
// CORE CONTENT GETTERS & SETTERS
// ============================================================================

/**
 * Set element's inner HTML.
 *
 * @param el - The element
 * @param html - HTML string to set
 * @param options - Options
 *
 * @example
 * setHTML(el, '<p>Hello</p>');
 *
 * // With sanitization (provide your own sanitizer like DOMPurify)
 * setHTML(el, userInput, { sanitize: DOMPurify.sanitize });
 */
export function setHTML(
  el: Element,
  html: string,
  options?: { sanitize?: (html: string) => string }
): void {
  const sanitized = options?.sanitize ? options.sanitize(html) : html;
  el.innerHTML = sanitized;
}

/**
 * Get element's inner HTML.
 *
 * @param el - The element
 * @returns The inner HTML string
 *
 * @example
 * const html = getHTML(el);
 */
export function getHTML(el: Element): string {
  return el.innerHTML;
}

/**
 * Get or set HTML (convenience overload).
 *
 * @param el - The element
 * @param value - HTML to set (optional)
 * @returns HTML string if getter, void if setter
 *
 * @example
 * const html = html(el);           // Get
 * html(el, '<p>Hello</p>');        // Set
 */
export function html(el: Element, value?: string): string | void {
  if (value !== undefined) {
    setHTML(el, value);
  } else {
    return getHTML(el);
  }
}

/**
 * Set element's text content.
 *
 * @param el - The element
 * @param text - Text to set
 *
 * @example
 * setText(el, 'Hello World');
 */
export function setText(el: Element, text: string): void {
  el.textContent = text;
}

/**
 * Get element's text content.
 *
 * @param el - The element
 * @param options - Options
 * @returns The text content
 *
 * @example
 * const text = getText(el);
 * const trimmed = getText(el, { trim: true });
 */
export function getText(el: Element, options?: { trim?: boolean }): string {
  const text = el.textContent || '';
  return options?.trim ? text.trim() : text;
}

/**
 * Get or set text (convenience overload).
 *
 * @param el - The element
 * @param value - Text to set (optional)
 * @returns Text string if getter, void if setter
 *
 * @example
 * const text = text(el);      // Get
 * text(el, 'Hello');          // Set
 */
export function text(el: Element, value?: string): string | void {
  if (value !== undefined) {
    setText(el, value);
  } else {
    return getText(el);
  }
}

/**
 * Get element's outer HTML.
 *
 * @param el - The element
 * @returns The outer HTML string
 *
 * @example
 * const html = getOuterHTML(el);
 */
export function getOuterHTML(el: Element): string {
  return el.outerHTML;
}

/**
 * Set element's outer HTML.
 *
 * @param el - The element
 * @param html - HTML to set
 * @param options - Options
 *
 * @example
 * setOuterHTML(el, '<div class="new">Content</div>');
 */
export function setOuterHTML(
  el: Element,
  html: string,
  options?: { sanitize?: (html: string) => string }
): void {
  const sanitized = options?.sanitize ? options.sanitize(html) : html;
  el.outerHTML = sanitized;
}

/**
 * Get or set form element value.
 *
 * @param el - The form element (input, textarea, select)
 * @param value - Value to set (optional)
 * @returns The value if getter, void if setter
 *
 * @example
 * const val = value(input);
 * value(input, 'new value');
 */
export function value(
  el: Element,
  newValue?: string | number | string[]
): string | string[] | void {
  const input = el as any;

  if (newValue !== undefined) {
    input.value = newValue;
    return;
  }

  return input.value || '';
}

// ============================================================================
// CONTENT MANIPULATION
// ============================================================================

/**
 * Clear all content from an element.
 *
 * @param el - The element
 *
 * @example
 * empty(el); // Removes all children
 */
export function empty(el: Element): void {
  el.innerHTML = '';
}

/**
 * Append content to an element.
 *
 * @param el - The target element
 * @param content - Content to append (string, Element, or array)
 * @param options - Options
 * @returns The target element (for chaining)
 *
 * @example
 * append(el, '<span>New</span>');
 * append(el, document.createElement('p'));
 * append(el, [el1, el2, el3]);
 * append(el, userInput, { sanitize: DOMPurify.sanitize });
 */
export function append(
  el: Element,
  content: string | Element | Element[],
  options?: { sanitize?: (html: string) => string }
): Element {
  if (typeof content === 'string') {
    const html = options?.sanitize ? options.sanitize(content) : content;
    el.insertAdjacentHTML('beforeend', html);
  } else if (Array.isArray(content)) {
    content.forEach(item => el.appendChild(item));
  } else {
    el.appendChild(content);
  }
  return el;
}

/**
 * Prepend content to an element.
 *
 * @param el - The target element
 * @param content - Content to prepend
 * @param options - Options
 * @returns The target element (for chaining)
 *
 * @example
 * prepend(el, '<span>First</span>');
 * prepend(el, document.createElement('p'));
 * prepend(el, [el1, el2, el3]);
 */
export function prepend(
  el: Element,
  content: string | Element | Element[],
  options?: { sanitize?: (html: string) => string }
): Element {
  if (typeof content === 'string') {
    const html = options?.sanitize ? options.sanitize(content) : content;
    el.insertAdjacentHTML('afterbegin', html);
  } else if (Array.isArray(content)) {
    for (let i = content.length - 1; i >= 0; i--) {
      el.insertBefore(content[i], el.firstChild);
    }
  } else {
    el.insertBefore(content, el.firstChild);
  }
  return el;
}

/**
 * Insert content before an element.
 *
 * @param el - The target element (before which to insert)
 * @param content - Content to insert
 * @param options - Options
 * @returns The target element (for chaining)
 *
 * @example
 * before(el, '<span>Before</span>');
 * before(el, document.createElement('p'));
 * before(el, [el1, el2, el3]);
 */
export function before(
  el: Element,
  content: string | Element | Element[],
  options?: { sanitize?: (html: string) => string }
): Element {
  if (!el.parentElement) return el;

  if (typeof content === 'string') {
    const html = options?.sanitize ? options.sanitize(content) : content;
    el.insertAdjacentHTML('beforebegin', html);
  } else if (Array.isArray(content)) {
    content.forEach(item => el.parentElement!.insertBefore(item, el));
  } else {
    el.parentElement.insertBefore(content, el);
  }
  return el;
}

/**
 * Insert content after an element.
 *
 * @param el - The target element (after which to insert)
 * @param content - Content to insert
 * @param options - Options
 * @returns The target element (for chaining)
 *
 * @example
 * after(el, '<span>After</span>');
 * after(el, document.createElement('p'));
 * after(el, [el1, el2, el3]);
 */
export function after(
  el: Element,
  content: string | Element | Element[],
  options?: { sanitize?: (html: string) => string }
): Element {
  if (!el.parentElement) return el;

  if (typeof content === 'string') {
    const html = options?.sanitize ? options.sanitize(content) : content;
    el.insertAdjacentHTML('afterend', html);
  } else if (Array.isArray(content)) {
    let sibling = el;
    content.forEach(item => {
      el.parentElement!.insertBefore(item, sibling.nextSibling);
      sibling = item;
    });
  } else {
    el.parentElement.insertBefore(content, el.nextSibling);
  }
  return el;
}

/**
 * Replace an element with new content.
 *
 * @param el - The element to replace
 * @param content - Content to replace with
 * @param options - Options
 *
 * @example
 * replace(el, '<div class="new">New</div>');
 * replace(el, document.createElement('p'));
 * replace(el, [el1, el2]);
 */
export function replace(
  el: Element,
  content: string | Element | Element[],
  options?: { sanitize?: (html: string) => string }
): void {
  if (!el.parentElement) return;

  if (typeof content === 'string') {
    const html = options?.sanitize ? options.sanitize(content) : content;
    el.outerHTML = html;
  } else if (Array.isArray(content)) {
    content.forEach(item => el.parentElement!.insertBefore(item, el));
    el.remove();
  } else {
    el.parentElement.replaceChild(content, el);
  }
}

/**
 * Remove an element from the DOM.
 *
 * @param el - The element to remove
 *
 * @example
 * remove(el);
 */
export function remove(el: Element): void {
  el.remove();
}

/**
 * Remove all children from an element.
 *
 * @param el - The element
 *
 * @example
 * removeChildren(el);
 */
export function removeChildren(el: Element): void {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

/**
 * Remove multiple elements at once.
 *
 * @param elements - Elements to remove
 *
 * @example
 * removeMultiple([el1, el2, el3]);
 */
export function removeMultiple(elements: Element[]): void {
  elements.forEach(el => el.remove());
}

/**
 * Detach an element (remove but keep in memory).
 *
 * @param el - The element
 * @returns The detached element
 *
 * @example
 * const detached = detach(el);
 * // el is removed from DOM but still in memory
 * // Can be re-inserted later with append()
 */
export function detach(el: Element): Element {
  el.remove();
  return el;
}

// ============================================================================
// CLONING & WRAPPING
// ============================================================================

/**
 * Clone an element.
 *
 * @param el - The element to clone
 * @param deep - Clone deeply (default: true)
 * @param options - Options
 * @returns The cloned element
 *
 * @example
 * const copy = clone(el);
 * const shallowClone = clone(el, false);
 * const noId = clone(el, true, { copyId: false });
 */
export function clone(
  el: Element,
  deep: boolean = true,
  options?: { copyId?: boolean; copyDataset?: boolean }
): Element {
  const cloned = el.cloneNode(deep) as Element;

  if (!options?.copyId) {
    cloned.removeAttribute('id');
    if (deep) {
      cloned.querySelectorAll('[id]').forEach(child => {
        child.removeAttribute('id');
      });
    }
  }

  if (options?.copyDataset && el instanceof HTMLElement && cloned instanceof HTMLElement) {
    Object.assign(cloned.dataset, el.dataset);
  }

  return cloned;
}

/**
 * Wrap an element with another element.
 *
 * @param el - The element to wrap
 * @param wrapper - The wrapper element or HTML string
 * @param options - Options
 * @returns The wrapper element
 *
 * @example
 * wrap(el, '<div class="wrapper"></div>');
 * wrap(el, document.createElement('div'));
 */
export function wrap(
  el: Element,
  wrapper: string | Element,
  options?: { sanitize?: (html: string) => string }
): Element {
  let wrapperEl: Element;

  if (typeof wrapper === 'string') {
    const html = options?.sanitize ? options.sanitize(wrapper) : wrapper;
    const temp = document.createElement('div');
    temp.innerHTML = html;
    wrapperEl = temp.firstElementChild as Element;
    if (!wrapperEl) {
      throw new Error('wrap: invalid wrapper HTML');
    }
  } else {
    wrapperEl = wrapper;
  }

  if (!el.parentElement) {
    throw new Error('wrap: element has no parent');
  }

  el.parentElement.insertBefore(wrapperEl, el);
  wrapperEl.appendChild(el);

  return wrapperEl;
}

/**
 * Unwrap an element (remove its parent wrapper).
 *
 * @param el - The element to unwrap
 *
 * @example
 * unwrap(el); // Removes el's parent, moving el up one level
 */
export function unwrap(el: Element): void {
  if (!el.parentElement) return;

  const parent = el.parentElement;
  const grandparent = parent.parentElement;

  if (!grandparent) return;

  while (parent.firstChild) {
    grandparent.insertBefore(parent.firstChild, parent);
  }

  parent.remove();
}

// ============================================================================
// TEXT NODE OPERATIONS
// ============================================================================

/**
 * Get all text nodes within an element.
 *
 * @param el - The element
 * @returns Array of text nodes
 *
 * @example
 * const nodes = getTextNodes(el);
 * nodes.forEach(node => console.log(node.textContent));
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

/**
 * Replace all text nodes matching a pattern.
 *
 * @param el - The element
 * @param pattern - String or RegExp pattern to match
 * @param replacement - Replacement text
 * @returns The element (for chaining)
 *
 * @example
 * replaceText(el, 'hello', 'hi');
 * replaceText(el, /hello/gi, 'hi');
 */
export function replaceText(
  el: Element,
  pattern: string | RegExp,
  replacement: string
): Element {
  const textNodes = getTextNodes(el);

  textNodes.forEach(node => {
    const text = node.textContent || '';
    const newText = text.replace(pattern, replacement);

    if (newText !== text) {
      node.textContent = newText;
    }
  });

  return el;
}

/**
 * Get all comment nodes within an element.
 *
 * @param el - The element
 * @returns Array of comment nodes
 *
 * @example
 * const comments = getComments(el);
 */
export function getComments(el: Element): Comment[] {
  const comments: Comment[] = [];

  const walk = (node: Node) => {
    if (node.nodeType === Node.COMMENT_NODE) {
      comments.push(node as Comment);
    }
    for (const child of node.childNodes) {
      walk(child);
    }
  };

  walk(el);
  return comments;
}

/**
 * Create a text node.
 *
 * @param text - Text content
 * @returns The text node
 *
 * @example
 * const node = createTextNode('Hello');
 * el.appendChild(node);
 */
export function createTextNode(text: string): Text {
  return document.createTextNode(text);
}

/**
 * Create a document fragment with content.
 *
 * @param html - HTML content
 * @param options - Options
 * @returns The document fragment
 *
 * @example
 * const frag = createFragment('<p>Hello</p><p>World</p>');
 * container.appendChild(frag);
 */
export function createFragment(
  html: string,
  options?: { sanitize?: (html: string) => string }
): DocumentFragment {
  const sanitized = options?.sanitize ? options.sanitize(html) : html;
  const temp = document.createElement('div');
  temp.innerHTML = sanitized;

  const frag = document.createDocumentFragment();
  while (temp.firstChild) {
    frag.appendChild(temp.firstChild);
  }
  return frag;
}

// ============================================================================
// TEXT SEARCH & HIGHLIGHTING
// ============================================================================

/**
 * Check if element contains specific text.
 *
 * @param el - The element
 * @param searchText - Text to search for
 * @param caseSensitive - Case sensitive search (default: false)
 * @returns True if text is found
 *
 * @example
 * if (containsText(el, 'hello')) { // has hello }
 * if (containsText(el, 'hello', true)) { // case sensitive }
 */
export function containsText(
  el: Element,
  searchText: string,
  caseSensitive: boolean = false
): boolean {
  const content = getText(el);
  const needle = caseSensitive ? searchText : searchText.toLowerCase();
  const haystack = caseSensitive ? content : content.toLowerCase();
  return haystack.includes(needle);
}

/**
 * Count occurrences of text in an element.
 *
 * @param el - The element
 * @param searchText - Text to count
 * @param caseSensitive - Case sensitive (default: false)
 * @returns Number of occurrences
 *
 * @example
 * const count = countText(el, 'hello');
 */
export function countText(
  el: Element,
  searchText: string,
  caseSensitive: boolean = false
): number {
  const content = getText(el);
  const flags = caseSensitive ? 'g' : 'gi';
  const regex = new RegExp(escapeRegExp(searchText), flags);
  const matches = content.match(regex);
  return matches ? matches.length : 0;
}

/**
 * Highlight text in an element.
 * Wraps matching text in <mark> tags.
 *
 * @param el - The element
 * @param searchText - Text to highlight
 * @param className - Class name for mark element (default: 'highlighted')
 * @param caseSensitive - Case sensitive matching (default: false)
 * @returns The element (for chaining)
 *
 * @example
 * highlight(el, 'important');
 * highlight(el, 'search-term', 'search-highlight');
 */
export function highlight(
  el: Element,
  searchText: string,
  className: string = 'highlighted',
  caseSensitive: boolean = false
): Element {
  const flags = caseSensitive ? 'g' : 'gi';
  const regex = new RegExp(`(${escapeRegExp(searchText)})`, flags);
  const content = el.innerHTML;
  const highlighted = content.replace(
    regex,
    `<mark class="${className}">$1</mark>`
  );
  el.innerHTML = highlighted;
  return el;
}

/**
 * Unhighlight all marked text in an element.
 *
 * @param el - The element
 * @returns The element (for chaining)
 *
 * @example
 * unhighlight(el);
 */
export function unhighlight(el: Element): Element {
  const marks = el.querySelectorAll('mark');
  marks.forEach(mark => {
    const text = mark.textContent || '';
    const textNode = document.createTextNode(text);
    mark.replaceWith(textNode);
  });
  return el;
}

// ============================================================================
// ADVANCED TEXT OPERATIONS
// ============================================================================

/**
 * Get the visible text (excluding hidden elements).
 *
 * @param el - The element
 * @returns Visible text content
 *
 * @example
 * const visible = getVisibleText(el);
 */
export function getVisibleText(el: Element): string {
  let text = '';

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const parent = node.parentElement;
      if (parent && isVisible(parent)) {
        text += node.textContent;
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      if (isVisible(element)) {
        for (const child of node.childNodes) {
          walk(child);
        }
      }
    }
  };

  walk(el);
  return text;
}

/**
 * Get plain text with line breaks preserved.
 *
 * @param el - The element
 * @returns Text with preserved line breaks
 *
 * @example
 * const text = getPlainText(el);
 */
export function getPlainText(el: Element): string {
  let text = '';

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent;
    } else if (node.nodeName === 'BR') {
      text += '\n';
    } else if (node.nodeName === 'P' || node.nodeName === 'DIV') {
      for (const child of node.childNodes) {
        walk(child);
      }
      text += '\n';
    } else {
      for (const child of node.childNodes) {
        walk(child);
      }
    }
  };

  walk(el);
  return text.trim();
}

/**
 * Strip HTML tags from a string.
 *
 * @param html - HTML string
 * @returns Plain text without tags
 *
 * @example
 * stripHtml('<p>Hello <b>world</b></p>'); // 'Hello world'
 */
export function stripHtml(html: string): string {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || '';
}

/**
 * Escape HTML special characters.
 *
 * @param str - String to escape
 * @returns Escaped string
 *
 * @example
 * escapeHtml('<p>Hello</p>'); // '&lt;p&gt;Hello&lt;/p&gt;'
 */
export function escapeHtml(str: string): string {
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, (char) => escapeMap[char]);
}

/**
 * Get size of content (in characters and words).
 *
 * @param el - The element
 * @returns Object with character and word counts
 *
 * @example
 * const size = getContentSize(el);
 * console.log(size.characters, size.words);
 */
export function getContentSize(el: Element): { characters: number; words: number } {
  const text = getText(el);
  const characters = text.length;
  const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;

  return { characters, words };
}

// ============================================================================
// BATCH OPERATIONS
// ============================================================================

/**
 * Set multiple text contents at once.
 *
 * @param elements - Elements to update
 * @param texts - Array of text values
 *
 * @example
 * setTexts([el1, el2], ['Hello', 'World']);
 */
export function setTexts(elements: Element[], texts: string[]): void {
  elements.forEach((el, i) => {
    if (i < texts.length) {
      setText(el, texts[i]);
    }
  });
}

/**
 * Set multiple HTML contents at once.
 *
 * @param elements - Elements to update
 * @param htmls - Array of HTML values
 * @param options - Options
 *
 * @example
 * setHTMLs([el1, el2], ['<p>Hello</p>', '<p>World</p>']);
 */
export function setHTMLs(
  elements: Element[],
  htmls: string[],
  options?: { sanitize?: (html: string) => string }
): void {
  elements.forEach((el, i) => {
    if (i < htmls.length) {
      setHTML(el, htmls[i], options);
    }
  });
}

/**
 * Append same content to multiple elements.
 *
 * @param elements - Elements to append to
 * @param content - Content to append
 * @param options - Options
 *
 * @example
 * appendMultiple([el1, el2], '<span>Added</span>');
 */
export function appendMultiple(
  elements: Element[],
  content: string | Element | Element[],
  options?: { sanitize?: (html: string) => string }
): void {
  elements.forEach(el => append(el, content, options));
}

// ============================================================================
// UTILITY CHECKS
// ============================================================================

/**
 * Check if element is empty (no text content, no children).
 *
 * @param el - The element
 * @returns True if element is empty
 *
 * @example
 * if (isEmpty(el)) { // no content }
 */
export function isEmpty(el: Element): boolean {
  // Check if has element children
  if (el.children.length > 0) return false;
  
  // Check if has meaningful text content (after trimming whitespace)
  const text = el.textContent?.trim() || '';
  return text.length === 0;
}

/**
 * Check if element is visible.
 */
function isVisible(el: Element): boolean {
  const style = window.getComputedStyle(el);
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0'
  );
}

/**
 * Escape special regex characters in a string.
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}