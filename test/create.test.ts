/**
 * Tests for element creation utilities
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  createElement,
  create,
  createSVG,
  createSVGContainer,
  createText,
  createComment,
  createFragment,
  createFromHTML,
  createElements,
  createButton,
  createInput,
  createLabel,
  createSelect,
  createTextarea,
  createForm,
  createList,
  createTable,
  createCard,
  createModal,
  createBadge,
  createSpinner,
  createGrid,
  createIcon,
  createNav,
  createContainer,
} from '../src/create';

describe('Create - Core Functions', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('createElement()', () => {
    it('should create basic element', () => {
      const div = createElement('div');
      expect(div.tagName).toBe('DIV');
    });

    it('should create element with attributes', () => {
      const div = createElement('div', {
        class: 'container',
        id: 'main',
        'data-test': 'value'
      });

      expect(div.className).toBe('container');
      expect(div.id).toBe('main');
      expect(div.getAttribute('data-test')).toBe('value');
    });

    it('should create element with text content', () => {
      const p = createElement('p', {}, 'Hello World');
      expect(p.textContent).toBe('Hello World');
    });

    it('should create element with element child', () => {
      const span = createElement('span', {}, 'Child');
      const div = createElement('div', {}, span);

      expect(div.children.length).toBe(1);
      expect(div.children[0].tagName).toBe('SPAN');
      expect(div.textContent).toBe('Child');
    });

    it('should create element with multiple children', () => {
      const child1 = createElement('p', {}, 'One');
      const child2 = createElement('p', {}, 'Two');
      const div = createElement('div', {}, [child1, child2]);

      expect(div.children.length).toBe(2);
      expect(div.children[0].textContent).toBe('One');
      expect(div.children[1].textContent).toBe('Two');
    });

    it('should create element with styles', () => {
      const div = createElement('div', {}, null, {
        width: 100,
        padding: 20,
        backgroundColor: 'blue'
      });

      expect(div.style.width).toBe('100px');
      expect(div.style.padding).toBe('20px');
      expect(div.style.backgroundColor).toBe('blue');
    });

    it('should handle unitless CSS properties', () => {
      const div = createElement('div', {}, null, {
        opacity: 0.5,
        zIndex: 10,
        flexGrow: 1
      });

      expect(div.style.opacity).toBe('0.5');
      expect(div.style.zIndex).toBe('10');
      expect(div.style.flexGrow).toBe('1');
    });

    it('should handle boolean attributes', () => {
      const input = createElement('input', {
        disabled: true,
        required: true,
        hidden: false
      });

      expect(input.hasAttribute('disabled')).toBe(true);
      expect(input.hasAttribute('required')).toBe(true);
      expect(input.hasAttribute('hidden')).toBe(false);
    });

    it('should handle null/undefined values', () => {
      const div = createElement('div', {
        id: 'test',
        class: null,
        title: undefined
      });

      expect(div.id).toBe('test');
      expect(div.hasAttribute('class')).toBe(false);
      expect(div.hasAttribute('title')).toBe(false);
    });

    it('should convert camelCase to kebab-case for styles', () => {
      const div = createElement('div', {}, null, {
        borderTopWidth: 2,
        marginLeft: 10
      });

      expect(div.style.borderTopWidth).toBe('2px');
      expect(div.style.marginLeft).toBe('10px');
    });
  });

  describe('create() - alias', () => {
    it('should work as alias for createElement', () => {
      const div = create('div', { class: 'test' }, 'Content');
      expect(div.className).toBe('test');
      expect(div.textContent).toBe('Content');
    });
  });

  describe('createSVG()', () => {
    it('should create SVG element', () => {
      const circle = createSVG('circle', {
        cx: 50,
        cy: 50,
        r: 40
      });

      expect(circle.tagName).toBe('circle');
      expect(circle.getAttribute('cx')).toBe('50');
      expect(circle.getAttribute('cy')).toBe('50');
      expect(circle.getAttribute('r')).toBe('40');
    });

    it('should create SVG with string attributes', () => {
      const rect = createSVG('rect', {
        x: 10,
        y: 20,
        width: 100,
        height: 50,
        fill: 'red'
      });

      expect(rect.getAttribute('fill')).toBe('red');
      expect(rect.getAttribute('width')).toBe('100');
    });

    it('should handle null/undefined attributes', () => {
      const line = createSVG('line', {
        x1: 0,
        y1: null,
        x2: undefined
      });

      expect(line.hasAttribute('x1')).toBe(true);
      expect(line.hasAttribute('y1')).toBe(false);
      expect(line.hasAttribute('x2')).toBe(false);
    });
  });

  describe('createSVGContainer()', () => {
    it('should create SVG container with viewBox', () => {
      const svg = createSVGContainer(200, 200);

      expect(svg.tagName).toBe('svg');
      expect(svg.getAttribute('viewBox')).toBe('0 0 200 200');
      expect(svg.getAttribute('width')).toBe('200');
      expect(svg.getAttribute('height')).toBe('200');
    });

    it('should add children to SVG container', () => {
      const circle = createSVG('circle', { cx: 50, cy: 50, r: 40 });
      const rect = createSVG('rect', { x: 10, y: 10, width: 50, height: 50 });
      const svg = createSVGContainer(200, 200, [circle, rect]);

      expect(svg.children.length).toBe(2);
      expect(svg.children[0].tagName).toBe('circle');
      expect(svg.children[1].tagName).toBe('rect');
    });
  });

  describe('createText()', () => {
    it('should create text node', () => {
      const text = createText('Hello World');

      expect(text.nodeType).toBe(Node.TEXT_NODE);
      expect(text.textContent).toBe('Hello World');
    });
  });

  describe('createComment()', () => {
    it('should create comment node', () => {
      const comment = createComment('TODO: fix this');

      expect(comment.nodeType).toBe(Node.COMMENT_NODE);
      expect(comment.textContent).toBe('TODO: fix this');
    });
  });

  describe('createFragment()', () => {
    it('should create empty fragment', () => {
      const frag = createFragment();

      expect(frag.nodeType).toBe(Node.DOCUMENT_FRAGMENT_NODE);
      expect(frag.childNodes.length).toBe(0);
    });

    it('should create fragment with elements', () => {
      const p1 = createElement('p', {}, 'One');
      const p2 = createElement('p', {}, 'Two');
      const frag = createFragment([p1, p2]);

      expect(frag.childNodes.length).toBe(2);

      container.appendChild(frag);
      expect(container.children.length).toBe(2);
    });
  });

  describe('createFromHTML()', () => {
    it('should create elements from HTML string', () => {
      const elements = createFromHTML('<p>Hello</p><p>World</p>');

      expect(elements.length).toBe(2);
      expect(elements[0].tagName).toBe('P');
      expect(elements[0].textContent).toBe('Hello');
      expect(elements[1].textContent).toBe('World');
    });

    it('should handle complex HTML', () => {
      const elements = createFromHTML(`
        <div class="card">
          <h2>Title</h2>
          <p>Content</p>
        </div>
      `);

      expect(elements.length).toBe(1);
      expect(elements[0].className).toBe('card');
      expect(elements[0].children.length).toBe(2);
    });

    it('should sanitize when option provided', () => {
      const sanitize = (html: string) => html.replace(/<script>/g, '');
      const elements = createFromHTML(
        '<p>Safe</p><script>alert("xss")</script>',
        { sanitize }
      );

      container.appendChild(elements[0]);
      expect(container.innerHTML).not.toContain('<script>');
    });
  });

  describe('createElements()', () => {
    it('should create multiple elements', () => {
      const items = createElements('li', 5, { class: 'item' });

      expect(items.length).toBe(5);
      items.forEach(item => {
        expect(item.tagName).toBe('LI');
        expect(item.className).toBe('item');
      });
    });

    it('should create elements with function callback', () => {
      const items = createElements('div', 3, (i) => ({
        class: 'box',
        id: `box-${i}`
      }));

      expect(items.length).toBe(3);
      expect(items[0].id).toBe('box-0');
      expect(items[1].id).toBe('box-1');
      expect(items[2].id).toBe('box-2');
    });
  });
});

describe('Create - Form Elements', () => {
  describe('createButton()', () => {
    it('should create button with label', () => {
      const btn = createButton('Click me');

      expect(btn.tagName).toBe('BUTTON');
      expect(btn.textContent).toBe('Click me');
    });

    it('should create button with attributes', () => {
      const btn = createButton('Submit', {
        type: 'submit',
        class: 'btn-primary',
        id: 'submit-btn'
      });

      expect(btn.type).toBe('submit');
      expect(btn.className).toBe('btn-primary');
      expect(btn.id).toBe('submit-btn');
    });
  });

  describe('createInput()', () => {
    it('should create text input by default', () => {
      const input = createInput();

      expect(input.tagName).toBe('INPUT');
      expect(input.type).toBe('text');
    });

    it('should create input with type', () => {
      const email = createInput('email');
      expect(email.type).toBe('email');

      const checkbox = createInput('checkbox');
      expect(checkbox.type).toBe('checkbox');
    });

    it('should create input with attributes', () => {
      const input = createInput('text', {
        placeholder: 'Enter name',
        required: true,
        maxlength: 50
      });

      expect(input.placeholder).toBe('Enter name');
      expect(input.required).toBe(true);
      expect(input.maxLength).toBe(50);
    });

    it('should handle boolean attributes', () => {
      const input = createInput('checkbox', {
        checked: true,
        disabled: false
      });

      expect(input.hasAttribute('checked')).toBe(true);
      expect(input.hasAttribute('disabled')).toBe(false);
    });
  });

  describe('createLabel()', () => {
    it('should create label with text', () => {
      const label = createLabel('Email');

      expect(label.tagName).toBe('LABEL');
      expect(label.textContent).toBe('Email');
    });

    it('should create label with for attribute', () => {
      const label = createLabel('Email', 'email-input');

      expect(label.getAttribute('for')).toBe('email-input');
      expect(label.textContent).toBe('Email');
    });

    it('should create label with additional attributes', () => {
      const label = createLabel('Name', 'name-input', { class: 'form-label' });

      expect(label.className).toBe('form-label');
      expect(label.getAttribute('for')).toBe('name-input');
    });
  });

  describe('createSelect()', () => {
    it('should create select from array of strings', () => {
      const select = createSelect(['Red', 'Green', 'Blue']);

      expect(select.tagName).toBe('SELECT');
      expect(select.options.length).toBe(3);
      expect(select.options[0].value).toBe('Red');
      expect(select.options[0].textContent).toBe('Red');
    });

    it('should create select from array of objects', () => {
      const select = createSelect([
        { value: 'us', label: 'United States' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'ca', label: 'Canada' }
      ]);

      expect(select.options.length).toBe(3);
      expect(select.options[0].value).toBe('us');
      expect(select.options[0].textContent).toBe('United States');
    });

    it('should create select from record', () => {
      const select = createSelect({
        'red': 'Red Color',
        'blue': 'Blue Color',
        'green': 'Green Color'
      });

      expect(select.options.length).toBe(3);
      expect(select.options[0].value).toBe('red');
      expect(select.options[0].textContent).toBe('Red Color');
    });

    it('should set selected value', () => {
      const select = createSelect(['Red', 'Green', 'Blue'], 'Green');

      expect(select.value).toBe('Green');
      expect(select.options[1].selected).toBe(true);
    });

    it('should handle attributes', () => {
      const select = createSelect(['A', 'B'], undefined, {
        class: 'form-select',
        id: 'my-select'
      });

      expect(select.className).toBe('form-select');
      expect(select.id).toBe('my-select');
    });
  });

  describe('createTextarea()', () => {
    it('should create textarea', () => {
      const textarea = createTextarea();

      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('should create textarea with attributes', () => {
      const textarea = createTextarea({
        placeholder: 'Enter text',
        rows: 5,
        cols: 40
      });

      expect(textarea.placeholder).toBe('Enter text');
      expect(textarea.rows).toBe(5);
      expect(textarea.cols).toBe(40);
    });

    it('should create textarea with content', () => {
      const textarea = createTextarea({}, 'Initial text');

      expect(textarea.textContent).toBe('Initial text');
    });
  });

  describe('createForm()', () => {
    it('should create empty form', () => {
      const form = createForm();

      expect(form.tagName).toBe('FORM');
      expect(form.children.length).toBe(0);
    });

    it('should create form with attributes', () => {
      const form = createForm({
        action: '/submit',
        method: 'post',
        class: 'my-form'
      });

      expect(form.action).toContain('/submit');
      expect(form.method).toBe('post');
      expect(form.className).toBe('my-form');
    });

    it('should create form with fields', () => {
      const fields = [
        createInput('text', { name: 'name' }),
        createInput('email', { name: 'email' }),
        createButton('Submit', { type: 'submit' })
      ];

      const form = createForm({ class: 'contact-form' }, fields);

      expect(form.children.length).toBe(3);
      expect(form.children[0].tagName).toBe('INPUT');
      expect(form.children[2].tagName).toBe('BUTTON');
    });
  });
});

describe('Create - Lists & Tables', () => {
  describe('createList()', () => {
    it('should create unordered list by default', () => {
      const list = createList(['Item 1', 'Item 2', 'Item 3']);

      expect(list.tagName).toBe('UL');
      expect(list.children.length).toBe(3);
      expect(list.children[0].textContent).toBe('Item 1');
    });

    it('should create ordered list', () => {
      const list = createList(['First', 'Second'], { ordered: true });

      expect(list.tagName).toBe('OL');
      expect(list.children.length).toBe(2);
    });

    it('should create list with custom class', () => {
      const list = createList(['A', 'B'], { className: 'custom-list' });

      expect(list.className).toBe('custom-list');
    });

    it('should create list with element children', () => {
      const item1 = createElement('strong', {}, 'Bold item');
      const item2 = createElement('em', {}, 'Italic item');
      const list = createList([item1, item2]);

      expect(list.children[0].querySelector('strong')).toBeTruthy();
      expect(list.children[1].querySelector('em')).toBeTruthy();
    });
  });

  describe('createTable()', () => {
    it('should create simple table', () => {
      const table = createTable([
        ['A', 'B'],
        ['C', 'D']
      ]);

      expect(table.tagName).toBe('TABLE');
      expect(table.rows.length).toBe(2);
      expect(table.rows[0].cells.length).toBe(2);
    });

    it('should create table with header', () => {
      const table = createTable(
        [
          ['Name', 'Age'],
          ['John', 30],
          ['Jane', 28]
        ],
        { hasHeader: true }
      );

      expect(table.rows.length).toBe(3);
      expect(table.rows[0].cells[0].tagName).toBe('TH');
      expect(table.rows[1].cells[0].tagName).toBe('TD');
    });

    it('should add CSS classes', () => {
      const table = createTable(
        [['A', 'B']],
        {
          className: 'data-table',
          bordered: true,
          striped: true
        }
      );

      expect(table.className).toContain('table');
      expect(table.className).toContain('data-table');
      expect(table.className).toContain('table-bordered');
      expect(table.className).toContain('table-striped');
    });

    it('should handle element content', () => {
      const btn = createButton('Action');
      const table = createTable([[btn]]);

      expect(table.rows[0].cells[0].querySelector('button')).toBeTruthy();
    });

    it('should handle number values', () => {
      const table = createTable([
        ['Name', 'Age'],
        ['John', 30]
      ]);

      expect(table.rows[1].cells[1].textContent).toBe('30');
    });
  });
});

describe('Create - UI Components', () => {
  describe('createCard()', () => {
    it('should create card with title and body', () => {
      const card = createCard({
        title: 'Card Title',
        body: 'Card content'
      });

      expect(card.className).toContain('card');
      expect(card.querySelector('.card-header')?.textContent).toBe('Card Title');
      expect(card.querySelector('.card-body')?.textContent).toBe('Card content');
    });

    it('should create card with custom header element', () => {
      const header = createElement('h3', {}, 'Custom Header');
      const card = createCard({
        header,
        body: 'Content'
      });

      expect(card.querySelector('.card-header h3')).toBeTruthy();
    });

    it('should create card with footer', () => {
      const card = createCard({
        title: 'Title',
        body: 'Body',
        footer: 'Footer text'
      });

      expect(card.querySelector('.card-footer')?.textContent).toBe('Footer text');
    });

    it('should add custom class', () => {
      const card = createCard({
        title: 'Title',
        body: 'Body',
        className: 'custom-card'
      });

      expect(card.className).toContain('card');
      expect(card.className).toContain('custom-card');
    });

    it('should handle element body and footer', () => {
      const body = createElement('div', {}, 'Custom body');
      const footer = createElement('button', {}, 'Action');
      const card = createCard({ title: 'Title', body, footer });

      expect(card.querySelector('.card-body div')).toBeTruthy();
      expect(card.querySelector('.card-footer button')).toBeTruthy();
    });
  });

  describe('createModal()', () => {
    it('should create modal with title and body', () => {
      const modal = createModal({
        title: 'Confirm',
        body: 'Are you sure?'
      });

      expect(modal.className).toContain('modal');
      expect(modal.getAttribute('role')).toBe('dialog');
      expect(modal.getAttribute('aria-modal')).toBe('true');
      expect(modal.querySelector('.modal-header h2')?.textContent).toBe('Confirm');
      expect(modal.querySelector('.modal-body')?.textContent).toBe('Are you sure?');
    });

    it('should create modal with close button', () => {
      const modal = createModal({
        title: 'Title',
        body: 'Body',
        closeBtn: true
      });

      expect(modal.querySelector('.modal-close')).toBeTruthy();
    });

    it('should create modal with overlay', () => {
      const modal = createModal({ title: 'Title', body: 'Body' });

      expect(modal.querySelector('.modal-overlay')).toBeTruthy();
    });

    it('should create modal with footer', () => {
      const modal = createModal({
        title: 'Title',
        body: 'Body',
        footer: 'Footer'
      });

      expect(modal.querySelector('.modal-footer')?.textContent).toBe('Footer');
    });

    it('should handle element content', () => {
      const body = createElement('div', {}, 'Custom body');
      const footer = createButton('OK');
      const modal = createModal({ title: 'Title', body, footer });

      expect(modal.querySelector('.modal-body div')).toBeTruthy();
      expect(modal.querySelector('.modal-footer button')).toBeTruthy();
    });
  });

  describe('createBadge()', () => {
    it('should create badge with default class', () => {
      const badge = createBadge('New');

      expect(badge.tagName).toBe('SPAN');
      expect(badge.className).toBe('badge');
      expect(badge.textContent).toBe('New');
    });

    it('should create badge with custom class', () => {
      const badge = createBadge('Premium', 'badge-gold');

      expect(badge.className).toBe('badge-gold');
      expect(badge.textContent).toBe('Premium');
    });
  });

  describe('createSpinner()', () => {
    it('should create spinner with default size', () => {
      const spinner = createSpinner();

      expect(spinner.className).toContain('spinner');
      expect(spinner.className).toContain('spinner-medium');
      expect(spinner.children.length).toBe(4);
    });

    it('should create spinner with custom size', () => {
      const small = createSpinner('small');
      const large = createSpinner('large');

      expect(small.className).toContain('spinner-small');
      expect(large.className).toContain('spinner-large');
    });

    it('should have spinner bars', () => {
      const spinner = createSpinner();
      const bars = Array.from(spinner.children);

      expect(bars.length).toBe(4);
      bars.forEach(bar => {
        expect(bar.className).toBe('spinner-bar');
      });
    });
  });

  describe('createGrid()', () => {
    it('should create grid with items', () => {
      const grid = createGrid(['Item 1', 'Item 2', 'Item 3'], 3);

      expect(grid.className).toContain('grid');
      expect(grid.children.length).toBe(3);
      expect(grid.style.gridTemplateColumns).toBe('repeat(3, 1fr)');
    });

    it('should handle element children', () => {
      const el1 = createElement('div', {}, 'One');
      const el2 = createElement('div', {}, 'Two');
      const grid = createGrid([el1, el2], 2);

      expect(grid.children.length).toBe(2);
      expect(grid.children[0].querySelector('div')).toBeTruthy();
    });

    it('should apply custom class and gap', () => {
      const grid = createGrid(['A', 'B'], 2, {
        className: 'custom-grid',
        gap: 20
      });

      expect(grid.className).toContain('custom-grid');
      expect(grid.style.gap).toBe('20px');
    });

    it('should default to 1 column', () => {
      const grid = createGrid(['A', 'B', 'C']);

      expect(grid.style.gridTemplateColumns).toBe('repeat(1, 1fr)');
    });
  });

  describe('createIcon()', () => {
    it('should create icon with default library', () => {
      const icon = createIcon('star');

      expect(icon.tagName).toBe('I');
      expect(icon.className).toContain('fa');
      expect(icon.className).toContain('fa-star');
    });

    it('should create icon with custom library', () => {
      const icon = createIcon('favorite', 'material');

      expect(icon.className).toContain('material');
      expect(icon.className).toContain('material-favorite');
    });
  });

  describe('createNav()', () => {
    it('should create navigation', () => {
      const nav = createNav([
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' }
      ]);

      expect(nav.tagName).toBe('NAV');
      expect(nav.className).toContain('nav');
      expect(nav.querySelectorAll('li').length).toBe(2);
    });

    it('should mark active item', () => {
      const nav = createNav([
        { label: 'Home', href: '/', active: true },
        { label: 'About', href: '/about' }
      ]);

      const items = nav.querySelectorAll('li');
      expect(items[0].className).toContain('active');
      expect(items[1].className).not.toContain('active');
    });

    it('should handle onClick', () => {
      let clicked = false;
      const nav = createNav([
        {
          label: 'Action',
          href: '#',
          onClick: () => { clicked = true; }
        }
      ]);

      const link = nav.querySelector('a');
      link?.click();

      expect(clicked).toBe(true);
    });

    it('should apply custom class', () => {
      const nav = createNav(
        [{ label: 'Home', href: '/' }],
        { className: 'main-nav' }
      );

      expect(nav.className).toContain('main-nav');
    });
  });

  describe('createContainer()', () => {
    it('should create empty container', () => {
      const container = createContainer();

      expect(container.tagName).toBe('DIV');
      expect(container.children.length).toBe(0);
    });

    it('should create container with children', () => {
      const child1 = createElement('p', {}, 'One');
      const child2 = createElement('p', {}, 'Two');
      const container = createContainer([child1, child2]);

      expect(container.children.length).toBe(2);
    });

    it('should create container with attributes', () => {
      const container = createContainer([], {
        class: 'wrapper',
        id: 'main'
      });

      expect(container.className).toBe('wrapper');
      expect(container.id).toBe('main');
    });
  });
});

describe('Create - Edge Cases', () => {
  it('should handle empty attributes', () => {
    const div = createElement('div', {});
    expect(div.tagName).toBe('DIV');
  });

  it('should handle empty styles', () => {
    const div = createElement('div', {}, null, {});
    expect(div.tagName).toBe('DIV');
  });

  it('should handle null content', () => {
    const div = createElement('div', {}, null);
    expect(div.textContent).toBe('');
  });

  it('should handle empty array content', () => {
    const div = createElement('div', {}, []);
    expect(div.children.length).toBe(0);
  });

  it('should convert number attributes to strings', () => {
    const input = createElement('input', {
      maxlength: 100,
      tabindex: 1
    });

    expect(input.getAttribute('maxlength')).toBe('100');
    expect(input.getAttribute('tabindex')).toBe('1');
  });

  it('should handle data attributes', () => {
    const div = createElement('div', {
      'data-id': '123',
      'data-name': 'test'
    });

    expect(div.getAttribute('data-id')).toBe('123');
    expect(div.getAttribute('data-name')).toBe('test');
  });

  it('should handle aria attributes', () => {
    const button = createButton('Close', {
      'aria-label': 'Close dialog',
      'aria-hidden': false
    });

    expect(button.getAttribute('aria-label')).toBe('Close dialog');
    expect(button.hasAttribute('aria-hidden')).toBe(false);
  });
});