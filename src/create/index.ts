/**
 * Element creation helpers.
 * Utilities for creating DOM elements with attributes, styles, and content.
 *
 * @module create
 * @example
 * import { createElement, createSVG, createButton } from 'domutils/create';
 *
 * const div = createElement('div', { class: 'container' }, 'Hello');
 * const btn = createButton('Click me', { class: 'btn-primary' });
 * const svg = createSVG('circle', { cx: 50, cy: 50, r: 40 });
 */

/**
 * Namespace URI for SVG elements.
 */
const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Options for creating elements.
 */
export interface CreateElementOptions {
  [key: string]: string | boolean | number | null | undefined;
}

/**
 * Style properties for elements.
 */
export interface StyleProperties {
  [key: string]: string | number;
}

// ============================================================================
// CORE CREATION FUNCTIONS
// ============================================================================

/**
 * Create an HTML element with attributes, styles, and content.
 *
 * @param tag - HTML tag name
 * @param attrs - Attributes (class, id, data-*, etc.)
 * @param content - Content (string, Element, or array of Elements)
 * @param styles - CSS styles object (optional)
 * @returns The created element
 *
 * @example
 * // Basic
 * const div = createElement('div');
 *
 * // With attributes
 * const btn = createElement('button', { class: 'btn', type: 'submit' });
 *
 * // With content
 * const p = createElement('p', { class: 'text' }, 'Hello World');
 *
 * // With styles
 * const box = createElement('div', { class: 'box' }, null, {
 *   width: 100,
 *   padding: 20,
 *   backgroundColor: 'blue'
 * });
 *
 * // With element children
 * const container = createElement('div', { class: 'container' }, [
 *   createElement('p', {}, 'Paragraph 1'),
 *   createElement('p', {}, 'Paragraph 2')
 * ]);
 */
export function createElement(
  tag: string,
  attrs?: CreateElementOptions,
  content?: string | Element | Element[] | null,
  styles?: StyleProperties
): HTMLElement {
  const el = document.createElement(tag);

  // Set attributes
  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      if (value === null || value === undefined || value === false) {
        return;
      }
      if (value === true) {
        el.setAttribute(key, '');
      } else {
        el.setAttribute(key, String(value));
      }
    });
  }

  // Set styles
  if (styles) {
    Object.entries(styles).forEach(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      const cssValue = typeof value === 'number' && !isUnitlessProperty(key)
        ? `${value}px`
        : String(value);
      el.style.setProperty(cssKey, cssValue);
    });
  }

  // Set content
  if (content !== null && content !== undefined) {
    if (typeof content === 'string') {
      el.textContent = content;
    } else if (Array.isArray(content)) {
      content.forEach(item => el.appendChild(item));
    } else {
      el.appendChild(content);
    }
  }

  return el;
}

/**
 * Alias for createElement with shorter name.
 */
export function create(
  tag: string,
  attrs?: CreateElementOptions,
  content?: string | Element | Element[] | null,
  styles?: StyleProperties
): HTMLElement {
  return createElement(tag, attrs, content, styles);
}

/**
 * Create an SVG element.
 *
 * @param tag - SVG tag name (circle, rect, path, etc.)
 * @param attrs - SVG attributes (cx, cy, r, x, y, width, height, etc.)
 * @returns The created SVG element
 *
 * @example
 * const circle = createSVG('circle', {
 *   cx: 50,
 *   cy: 50,
 *   r: 40,
 *   fill: 'blue'
 * });
 *
 * const rect = createSVG('rect', {
 *   x: 10,
 *   y: 10,
 *   width: 100,
 *   height: 100,
 *   fill: 'red'
 * });
 */
export function createSVG(
  tag: string,
  attrs?: Record<string, string | number>
): SVGElement {
  const el = document.createElementNS(SVG_NS, tag);

  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        el.setAttribute(key, String(value));
      }
    });
  }

  return el;
}

/**
 * Create an SVG container with viewBox.
 *
 * @param width - SVG width
 * @param height - SVG height
 * @param children - SVG elements to add
 * @returns The SVG container
 *
 * @example
 * const circle = createSVG('circle', { cx: 100, cy: 100, r: 50 });
 * const svg = createSVGContainer(200, 200, [circle]);
 */
export function createSVGContainer(
  width: number,
  height: number,
  children?: SVGElement[]
): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg') as SVGSVGElement;
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));

  if (children) {
    children.forEach(child => svg.appendChild(child));
  }

  return svg;
}

/**
 * Create a text node.
 *
 * @param text - Text content
 * @returns The text node
 *
 * @example
 * const node = createText('Hello');
 * el.appendChild(node);
 */
export function createText(text: string): Text {
  return document.createTextNode(text);
}

/**
 * Create a comment node.
 *
 * @param text - Comment text
 * @returns The comment node
 *
 * @example
 * const comment = createComment('TODO: fix this');
 * el.appendChild(comment);
 */
export function createComment(text: string): Comment {
  return document.createComment(text);
}

/**
 * Create a document fragment with elements.
 *
 * @param elements - Elements to add to fragment
 * @returns The document fragment
 *
 * @example
 * const frag = createFragment([
 *   createElement('p', {}, 'Paragraph 1'),
 *   createElement('p', {}, 'Paragraph 2')
 * ]);
 * container.appendChild(frag);
 */
export function createFragment(elements: Element[] = []): DocumentFragment {
  const frag = document.createDocumentFragment();
  elements.forEach(el => frag.appendChild(el));
  return frag;
}

/**
 * Create elements from HTML string.
 *
 * @param html - HTML string
 * @param options - Options
 * @returns Array of created elements
 *
 * @example
 * const elements = createFromHTML('<p>Hello</p><p>World</p>');
 * elements.forEach(el => container.appendChild(el));
 */
export function createFromHTML(
  html: string,
  options?: { sanitize?: (html: string) => string }
): Element[] {
  const sanitized = options?.sanitize ? options.sanitize(html) : html;
  const temp = document.createElement('div');
  temp.innerHTML = sanitized;
  return Array.from(temp.children);
}

/**
 * Create multiple elements.
 *
 * @param tag - Tag name for each element
 * @param count - Number of elements to create
 * @param attrs - Attributes for each element (can be function)
 * @returns Array of created elements
 *
 * @example
 * // Create 5 list items
 * const items = createElements('li', 5, { class: 'item' });
 *
 * // Create 3 divs with sequential IDs
 * const divs = createElements('div', 3, (i) => ({
 *   class: 'box',
 *   id: `box-${i}`
 * }));
 */
export function createElements(
  tag: string,
  count: number,
  attrs?: CreateElementOptions | ((index: number) => CreateElementOptions)
): HTMLElement[] {
  const elements: HTMLElement[] = [];

  for (let i = 0; i < count; i++) {
    const itemAttrs = typeof attrs === 'function' ? attrs(i) : attrs;
    elements.push(createElement(tag, itemAttrs));
  }

  return elements;
}

// ============================================================================
// FORM ELEMENTS
// ============================================================================

/**
 * Create a button element.
 *
 * @param label - Button label
 * @param attrs - Additional attributes
 * @returns The created button
 *
 * @example
 * const btn = createButton('Click me', { class: 'btn-primary' });
 * const submit = createButton('Submit', { type: 'submit', id: 'submit-btn' });
 */
export function createButton(
  label: string,
  attrs?: CreateElementOptions
): HTMLButtonElement {
  const btn = createElement('button', attrs, label) as HTMLButtonElement;
  return btn;
}

/**
 * Create an input element.
 *
 * @param type - Input type (default: 'text')
 * @param attrs - Additional attributes
 * @returns The created input
 *
 * @example
 * const text = createInput('text', { placeholder: 'Name' });
 * const checkbox = createInput('checkbox', { id: 'agree', checked: true });
 * const range = createInput('range', { min: 0, max: 100, value: 50 });
 */
export function createInput(
  type: string = 'text',
  attrs?: CreateElementOptions
): HTMLInputElement {
  return createElement('input', { type, ...attrs }) as HTMLInputElement;
}

/**
 * Create a label element.
 *
 * @param text - Label text
 * @param forId - ID of associated input (optional)
 * @param attrs - Additional attributes
 * @returns The created label
 *
 * @example
 * const label = createLabel('Email', 'email-input');
 * const label2 = createLabel('Name', null, { class: 'form-label' });
 */
export function createLabel(
  text: string,
  forId?: string,
  attrs?: CreateElementOptions
): HTMLLabelElement {
  const labelAttrs = forId ? { for: forId, ...attrs } : attrs;
  return createElement('label', labelAttrs, text) as HTMLLabelElement;
}

/**
 * Create a select element.
 *
 * @param options - Options (array of strings, objects, or record)
 * @param selectedValue - Initially selected value
 * @param attrs - Additional attributes
 * @returns The created select
 *
 * @example
 * // Array of strings
 * const select1 = createSelect(['Red', 'Green', 'Blue']);
 *
 * // Array of objects
 * const select2 = createSelect([
 *   { value: 'us', label: 'United States' },
 *   { value: 'uk', label: 'United Kingdom' }
 * ], 'us');
 *
 * // Record/object
 * const select3 = createSelect({
 *   'red': 'Red Color',
 *   'blue': 'Blue Color'
 * });
 */
export function createSelect(
  options: string[] | { value: string; label: string }[] | Record<string, string>,
  selectedValue?: string,
  attrs?: CreateElementOptions
): HTMLSelectElement {
  const select = createElement('select', attrs) as HTMLSelectElement;

  if (Array.isArray(options)) {
    options.forEach(opt => {
      const option = document.createElement('option');
      if (typeof opt === 'string') {
        option.value = opt;
        option.textContent = opt;
        if (opt === selectedValue) option.selected = true;
      } else {
        option.value = opt.value;
        option.textContent = opt.label;
        if (opt.value === selectedValue) option.selected = true;
      }
      select.appendChild(option);
    });
  } else {
    Object.entries(options).forEach(([value, label]) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      if (value === selectedValue) option.selected = true;
      select.appendChild(option);
    });
  }

  return select;
}

/**
 * Create a textarea element.
 *
 * @param attrs - Attributes
 * @param content - Initial content
 * @returns The created textarea
 *
 * @example
 * const textarea = createTextarea({ placeholder: 'Enter text', rows: 5 });
 * const textarea2 = createTextarea({ class: 'form-control' }, 'Initial text');
 */
export function createTextarea(
  attrs?: CreateElementOptions,
  content?: string
): HTMLTextAreaElement {
  const textarea = createElement('textarea', attrs) as HTMLTextAreaElement;
  if (content) {
    textarea.textContent = content;
  }
  return textarea;
}

/**
 * Create a form element.
 *
 * @param attrs - Form attributes
 * @param fields - Form fields (array of elements)
 * @returns The created form
 *
 * @example
 * const form = createForm(
 *   { class: 'my-form', id: 'contact' },
 *   [
 *     createInput('text', { name: 'name', placeholder: 'Name' }),
 *     createInput('email', { name: 'email', placeholder: 'Email' }),
 *     createButton('Submit', { type: 'submit' })
 *   ]
 * );
 */
export function createForm(
  attrs?: CreateElementOptions,
  fields?: Element[]
): HTMLFormElement {
  return createElement('form', attrs, fields || []) as HTMLFormElement;
}

// ============================================================================
// LISTS & TABLES
// ============================================================================

/**
 * Create a list (ul or ol).
 *
 * @param items - List items (strings or elements)
 * @param options - Options
 * @returns The created list
 *
 * @example
 * const list = createList(['Item 1', 'Item 2', 'Item 3']);
 * const ordered = createList(['First', 'Second'], { ordered: true });
 * const styled = createList(
 *   [createElement('strong', {}, 'Bold item')],
 *   { className: 'custom-list' }
 * );
 */
export function createList(
  items: (string | Element)[],
  options?: { ordered?: boolean; className?: string }
): HTMLUListElement | HTMLOListElement {
  const tag = options?.ordered ? 'ol' : 'ul';
  const list = createElement(tag, options?.className ? { class: options.className } : {});

  items.forEach(item => {
    const li = document.createElement('li');
    if (typeof item === 'string') {
      li.textContent = item;
    } else {
      li.appendChild(item);
    }
    list.appendChild(li);
  });

  return list as HTMLUListElement | HTMLOListElement;
}

/**
 * Create a table from data.
 *
 * @param data - 2D array of data
 * @param options - Options
 * @returns The created table
 *
 * @example
 * const table = createTable([
 *   ['Name', 'Age', 'City'],
 *   ['John', 30, 'NYC'],
 *   ['Jane', 28, 'LA']
 * ], { hasHeader: true });
 *
 * const table2 = createTable(
 *   [['A', 'B'], ['C', 'D']],
 *   { className: 'data-table', bordered: true }
 * );
 */
export function createTable(
  data: (string | number | Element)[][],
  options?: {
    hasHeader?: boolean;
    className?: string;
    bordered?: boolean;
    striped?: boolean;
  }
): HTMLTableElement {
  const { hasHeader = false, className, bordered, striped } = options || {};

  const classNames = ['table'];
  if (className) classNames.push(className);
  if (bordered) classNames.push('table-bordered');
  if (striped) classNames.push('table-striped');

  const table = createElement('table', { class: classNames.join(' ') }) as HTMLTableElement;

  data.forEach((row, rowIndex) => {
    const tr = document.createElement('tr');
    const isHeaderRow = hasHeader && rowIndex === 0;

    row.forEach(cell => {
      const tag = isHeaderRow ? 'th' : 'td';
      const el = document.createElement(tag);

      if (typeof cell === 'string' || typeof cell === 'number') {
        el.textContent = String(cell);
      } else {
        el.appendChild(cell);
      }

      tr.appendChild(el);
    });

    table.appendChild(tr);
  });

  return table;
}

// ============================================================================
// UI COMPONENTS
// ============================================================================

/**
 * Create a card component.
 *
 * @param options - Card options
 * @returns The created card
 *
 * @example
 * const card = createCard({
 *   title: 'Card Title',
 *   body: 'Card content here',
 *   footer: 'Card footer'
 * });
 *
 * const card2 = createCard({
 *   header: createElement('h3', {}, 'Custom Header'),
 *   body: createElement('div', {}, 'Custom body'),
 *   className: 'custom-card'
 * });
 */
export function createCard(options: {
  title?: string;
  header?: Element;
  body?: string | Element;
  footer?: string | Element;
  className?: string;
}): HTMLElement {
  const classNames = ['card'];
  if (options.className) classNames.push(options.className);

  const card = createElement('div', { class: classNames.join(' ') });

  // Header
  if (options.header) {
    const header = createElement('div', { class: 'card-header' }, options.header);
    card.appendChild(header);
  } else if (options.title) {
    const header = createElement('div', { class: 'card-header' }, options.title);
    card.appendChild(header);
  }

  // Body
  if (options.body) {
    const body = createElement('div', { class: 'card-body' });
    if (typeof options.body === 'string') {
      body.textContent = options.body;
    } else {
      body.appendChild(options.body);
    }
    card.appendChild(body);
  }

  // Footer
  if (options.footer) {
    const footer = createElement('div', { class: 'card-footer' });
    if (typeof options.footer === 'string') {
      footer.textContent = options.footer;
    } else {
      footer.appendChild(options.footer);
    }
    card.appendChild(footer);
  }

  return card;
}

/**
 * Create a modal dialog.
 *
 * @param options - Modal options
 * @returns The created modal
 *
 * @example
 * const modal = createModal({
 *   title: 'Confirm',
 *   body: 'Are you sure?',
 *   closeBtn: true
 * });
 */
export function createModal(options: {
  title?: string;
  body?: string | Element;
  footer?: string | Element;
  closeBtn?: boolean;
  className?: string;
}): HTMLElement {
  const classNames = ['modal'];
  if (options.className) classNames.push(options.className);

  const modal = createElement('div', {
    class: classNames.join(' '),
    role: 'dialog',
    'aria-modal': 'true'
  });

  // Overlay
  const overlay = createElement('div', { class: 'modal-overlay' });
  modal.appendChild(overlay);

  // Content
  const content = createElement('div', { class: 'modal-content' });

  // Header
  if (options.title || options.closeBtn) {
    const header = createElement('div', { class: 'modal-header' });

    if (options.title) {
      const title = createElement('h2', {}, options.title);
      header.appendChild(title);
    }

    if (options.closeBtn) {
      const closeBtn = createButton('×', {
        class: 'modal-close',
        'aria-label': 'Close'
      });
      header.appendChild(closeBtn);
    }

    content.appendChild(header);
  }

  // Body
  if (options.body) {
    const body = createElement('div', { class: 'modal-body' });
    if (typeof options.body === 'string') {
      body.textContent = options.body;
    } else {
      body.appendChild(options.body);
    }
    content.appendChild(body);
  }

  // Footer
  if (options.footer) {
    const footer = createElement('div', { class: 'modal-footer' });
    if (typeof options.footer === 'string') {
      footer.textContent = options.footer;
    } else {
      footer.appendChild(options.footer);
    }
    content.appendChild(footer);
  }

  modal.appendChild(content);
  return modal;
}

/**
 * Create a badge/label element.
 *
 * @param text - Badge text
 * @param className - CSS class (default: 'badge')
 * @returns The created badge
 *
 * @example
 * const badge = createBadge('New', 'badge-primary');
 * const tag = createBadge('React', 'tag tag-blue');
 */
export function createBadge(text: string, className: string = 'badge'): HTMLElement {
  return createElement('span', { class: className }, text);
}

/**
 * Create a loading spinner.
 *
 * @param size - Spinner size (small, medium, large)
 * @returns The created spinner
 *
 * @example
 * const spinner = createSpinner('medium');
 * container.appendChild(spinner);
 */
export function createSpinner(
  size: 'small' | 'medium' | 'large' = 'medium'
): HTMLElement {
  const spinner = createElement('div', { class: `spinner spinner-${size}` });

  // Add spinner bars (common pattern for spinners)
  for (let i = 0; i < 4; i++) {
    spinner.appendChild(createElement('div', { class: 'spinner-bar' }));
  }

  return spinner;
}

/**
 * Create a grid layout container.
 *
 * @param items - Items to place in grid (strings or elements)
 * @param cols - Number of columns (default: 1)
 * @param options - Additional options
 * @returns The created grid
 *
 * @example
 * const grid = createGrid(['Item 1', 'Item 2', 'Item 3'], 3);
 *
 * const grid2 = createGrid(
 *   [el1, el2, el3, el4],
 *   2,
 *   { className: 'custom-grid', gap: 20 }
 * );
 */
export function createGrid(
  items: (string | Element)[],
  cols: number = 1,
  options?: { className?: string; gap?: number }
): HTMLElement {
  const classNames = ['grid'];
  if (options?.className) classNames.push(options.className);

  const styles: StyleProperties = {
    gridTemplateColumns: `repeat(${cols}, 1fr)`
  };

  if (options?.gap !== undefined) {
    styles.gap = options.gap;
  }

  const grid = createElement('div', { class: classNames.join(' ') }, null, styles);

  items.forEach(item => {
    const cell = createElement('div', { class: 'grid-item' });
    if (typeof item === 'string') {
      cell.textContent = item;
    } else {
      cell.appendChild(item);
    }
    grid.appendChild(cell);
  });

  return grid;
}

/**
 * Create an icon element.
 * Supports Font Awesome, Material Icons, and other icon libraries.
 *
 * @param name - Icon name
 * @param library - Icon library prefix (default: 'fa' for Font Awesome)
 * @returns The created icon
 *
 * @example
 * const icon = createIcon('star', 'fa');           // Font Awesome
 * const icon2 = createIcon('favorite', 'material'); // Material Icons
 * const icon3 = createIcon('home', 'bi');          // Bootstrap Icons
 */
export function createIcon(name: string, library: string = 'fa'): HTMLElement {
  return createElement('i', { class: `${library} ${library}-${name}` });
}

/**
 * Create a navigation menu.
 *
 * @param items - Navigation items
 * @param options - Options
 * @returns The created nav
 *
 * @example
 * const nav = createNav([
 *   { label: 'Home', href: '/', active: true },
 *   { label: 'About', href: '/about' },
 *   { label: 'Contact', href: '/contact' }
 * ]);
 *
 * const nav2 = createNav(items, { className: 'main-nav' });
 */
export function createNav(
  items: Array<{
    label: string;
    href?: string;
    active?: boolean;
    onClick?: (e: Event) => void;
  }>,
  options?: { className?: string }
): HTMLElement {
  const classNames = ['nav'];
  if (options?.className) classNames.push(options.className);

  const nav = createElement('nav', { class: classNames.join(' ') });
  const ul = createElement('ul', { class: 'nav-list' });

  items.forEach(item => {
    const li = createElement('li', {
      class: item.active ? 'nav-item active' : 'nav-item'
    });

    const a = createElement('a', {
      class: 'nav-link',
      href: item.href || '#'
    }, item.label);

    if (item.onClick) {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        item.onClick!(e);
      });
    }

    li.appendChild(a);
    ul.appendChild(li);
  });

  nav.appendChild(ul);
  return nav;
}

/**
 * Create a container/wrapper element.
 *
 * @param children - Child elements
 * @param attrs - Attributes
 * @returns The created container
 *
 * @example
 * const container = createContainer([el1, el2, el3], {
 *   class: 'container',
 *   id: 'main'
 * });
 */
export function createContainer(
  children: Element[] = [],
  attrs?: CreateElementOptions
): HTMLElement {
  return createElement('div', attrs, children);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if CSS property is unitless (doesn't need 'px').
 */
function isUnitlessProperty(prop: string): boolean {
  const unitlessProps = new Set([
    'animationIterationCount',
    'columnCount',
    'fillOpacity',
    'flexGrow',
    'flexShrink',
    'fontWeight',
    'lineHeight',
    'opacity',
    'order',
    'orphans',
    'widows',
    'zIndex',
    'zoom'
  ]);

  return unitlessProps.has(prop);
}