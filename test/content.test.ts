/**
 * Tests for content manipulation utilities
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  setHTML,
  getHTML,
  html,
  setText,
  getText,
  text,
  getOuterHTML,
  setOuterHTML,
  value,
  empty,
  append,
  prepend,
  before,
  after,
  replace,
  remove,
  removeChildren,
  removeMultiple,
  detach,
  clone,
  wrap,
  unwrap,
  getTextNodes,
  replaceText,
  getComments,
  createTextNode,
  createFragment,
  containsText,
  countText,
  highlight,
  unhighlight,
  getVisibleText,
  getPlainText,
  stripHtml,
  escapeHtml,
  getContentSize,
  setTexts,
  setHTMLs,
  appendMultiple,
  isEmpty,
} from '../src/content';

describe('Content - Basic Getters/Setters', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('HTML operations', () => {
    it('should set and get HTML', () => {
      const el = document.createElement('div');
      setHTML(el, '<p>Hello</p>');
      expect(getHTML(el)).toBe('<p>Hello</p>');
    });

    it('should handle html() as getter and setter', () => {
      const el = document.createElement('div');
      html(el, '<span>World</span>');
      expect(html(el)).toBe('<span>World</span>');
    });

    it('should sanitize HTML when provided', () => {
      const el = document.createElement('div');
      const sanitize = (html: string) => html.replace(/<script>/g, '');
      setHTML(el, '<p>Safe</p><script>alert("xss")</script>', { sanitize });
      expect(getHTML(el)).not.toContain('<script>');
    });

    it('should get and set outer HTML', () => {
      const el = document.createElement('div');
      el.className = 'test';
      container.appendChild(el);
      
      expect(getOuterHTML(el)).toContain('class="test"');
      
      setOuterHTML(el, '<span class="new">Content</span>');
      expect(container.querySelector('.new')).toBeTruthy();
      expect(container.querySelector('.test')).toBeFalsy();
    });
  });

  describe('Text operations', () => {
    it('should set and get text', () => {
      const el = document.createElement('div');
      setText(el, 'Hello World');
      expect(getText(el)).toBe('Hello World');
    });

    it('should handle text() as getter and setter', () => {
      const el = document.createElement('div');
      text(el, 'Test');
      expect(text(el)).toBe('Test');
    });

    it('should trim text when option is provided', () => {
      const el = document.createElement('div');
      setText(el, '  Hello  ');
      expect(getText(el, { trim: true })).toBe('Hello');
      expect(getText(el, { trim: false })).toBe('  Hello  ');
    });

    it('should escape HTML in text content', () => {
      const el = document.createElement('div');
      setText(el, '<script>alert("xss")</script>');
      expect(el.innerHTML).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
    });
  });

  describe('Form value operations', () => {
    it('should get and set input value', () => {
      const input = document.createElement('input');
      value(input, 'test value');
      expect(value(input)).toBe('test value');
    });

    it('should handle number values', () => {
      const input = document.createElement('input');
      input.type = 'number';
      value(input, 42);
      expect(value(input)).toBe('42');
    });

    it('should handle textarea value', () => {
      const textarea = document.createElement('textarea');
      value(textarea, 'multi\nline\ntext');
      expect(value(textarea)).toBe('multi\nline\ntext');
    });
  });
});

describe('Content - Manipulation', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('empty()', () => {
    it('should remove all children', () => {
      container.innerHTML = '<p>One</p><p>Two</p>';
      empty(container);
      expect(container.innerHTML).toBe('');
      expect(container.children.length).toBe(0);
    });
  });

  describe('append()', () => {
    it('should append HTML string', () => {
      append(container, '<p>Hello</p>');
      expect(container.innerHTML).toBe('<p>Hello</p>');
    });

    it('should append element', () => {
      const p = document.createElement('p');
      p.textContent = 'World';
      append(container, p);
      expect(container.querySelector('p')?.textContent).toBe('World');
    });

    it('should append multiple elements', () => {
      const p1 = document.createElement('p');
      const p2 = document.createElement('p');
      p1.textContent = 'One';
      p2.textContent = 'Two';
      append(container, [p1, p2]);
      expect(container.children.length).toBe(2);
      expect(container.children[0].textContent).toBe('One');
      expect(container.children[1].textContent).toBe('Two');
    });

    it('should return element for chaining', () => {
      const result = append(container, '<p>Test</p>');
      expect(result).toBe(container);
    });
  });

  describe('prepend()', () => {
    it('should prepend HTML string', () => {
      container.innerHTML = '<p>Second</p>';
      prepend(container, '<p>First</p>');
      expect(container.children[0].textContent).toBe('First');
      expect(container.children[1].textContent).toBe('Second');
    });

    it('should prepend element', () => {
      container.innerHTML = '<p>Second</p>';
      const p = document.createElement('p');
      p.textContent = 'First';
      prepend(container, p);
      expect(container.children[0].textContent).toBe('First');
    });

    it('should prepend multiple elements in correct order', () => {
      const p1 = document.createElement('p');
      const p2 = document.createElement('p');
      p1.textContent = 'One';
      p2.textContent = 'Two';
      prepend(container, [p1, p2]);
      expect(container.children[0].textContent).toBe('One');
      expect(container.children[1].textContent).toBe('Two');
    });
  });

  describe('before()', () => {
    it('should insert HTML before element', () => {
      container.innerHTML = '<p id="target">Target</p>';
      const target = container.querySelector('#target')!;
      before(target, '<p>Before</p>');
      expect(container.children[0].textContent).toBe('Before');
      expect(container.children[1].textContent).toBe('Target');
    });

    it('should insert element before', () => {
      container.innerHTML = '<p id="target">Target</p>';
      const target = container.querySelector('#target')!;
      const p = document.createElement('p');
      p.textContent = 'Before';
      before(target, p);
      expect(container.children[0].textContent).toBe('Before');
    });

    it('should handle element without parent', () => {
      const orphan = document.createElement('div');
      const result = before(orphan, '<p>Test</p>');
      expect(result).toBe(orphan);
    });
  });

  describe('after()', () => {
    it('should insert HTML after element', () => {
      container.innerHTML = '<p id="target">Target</p>';
      const target = container.querySelector('#target')!;
      after(target, '<p>After</p>');
      expect(container.children[0].textContent).toBe('Target');
      expect(container.children[1].textContent).toBe('After');
    });

    it('should insert element after', () => {
      container.innerHTML = '<p id="target">Target</p>';
      const target = container.querySelector('#target')!;
      const p = document.createElement('p');
      p.textContent = 'After';
      after(target, p);
      expect(container.children[1].textContent).toBe('After');
    });

    it('should insert multiple elements in correct order', () => {
      container.innerHTML = '<p id="target">Target</p>';
      const target = container.querySelector('#target')!;
      const p1 = document.createElement('p');
      const p2 = document.createElement('p');
      p1.textContent = 'One';
      p2.textContent = 'Two';
      after(target, [p1, p2]);
      expect(container.children[1].textContent).toBe('One');
      expect(container.children[2].textContent).toBe('Two');
    });
  });

  describe('replace()', () => {
    it('should replace with HTML string', () => {
      container.innerHTML = '<p id="old">Old</p>';
      const old = container.querySelector('#old')!;
      replace(old, '<p id="new">New</p>');
      expect(container.querySelector('#new')?.textContent).toBe('New');
      expect(container.querySelector('#old')).toBeFalsy();
    });

    it('should replace with element', () => {
      container.innerHTML = '<p id="old">Old</p>';
      const old = container.querySelector('#old')!;
      const newEl = document.createElement('p');
      newEl.id = 'new';
      newEl.textContent = 'New';
      replace(old, newEl);
      expect(container.querySelector('#new')?.textContent).toBe('New');
      expect(container.querySelector('#old')).toBeFalsy();
    });

    it('should replace with multiple elements', () => {
      container.innerHTML = '<p id="old">Old</p>';
      const old = container.querySelector('#old')!;
      const p1 = document.createElement('p');
      const p2 = document.createElement('p');
      p1.textContent = 'One';
      p2.textContent = 'Two';
      replace(old, [p1, p2]);
      expect(container.children.length).toBe(2);
      expect(container.querySelector('#old')).toBeFalsy();
    });
  });

  describe('remove()', () => {
    it('should remove element', () => {
      container.innerHTML = '<p id="test">Test</p>';
      const el = container.querySelector('#test')!;
      remove(el);
      expect(container.querySelector('#test')).toBeFalsy();
    });
  });

  describe('removeChildren()', () => {
    it('should remove all children', () => {
      container.innerHTML = '<p>One</p><p>Two</p><p>Three</p>';
      removeChildren(container);
      expect(container.children.length).toBe(0);
    });
  });

  describe('removeMultiple()', () => {
    it('should remove multiple elements', () => {
      container.innerHTML = '<p class="remove">One</p><p>Keep</p><p class="remove">Two</p>';
      const toRemove = Array.from(container.querySelectorAll('.remove'));
      removeMultiple(toRemove);
      expect(container.querySelectorAll('.remove').length).toBe(0);
      expect(container.children.length).toBe(1);
    });
  });

  describe('detach()', () => {
    it('should remove element but return it', () => {
      container.innerHTML = '<p id="test">Test</p>';
      const el = container.querySelector('#test')!;
      const detached = detach(el);
      
      expect(container.querySelector('#test')).toBeFalsy();
      expect(detached.id).toBe('test');
      expect(detached.textContent).toBe('Test');
      
      // Can be re-attached
      container.appendChild(detached);
      expect(container.querySelector('#test')).toBeTruthy();
    });
  });
});

describe('Content - Cloning & Wrapping', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('clone()', () => {
    it('should clone element deeply', () => {
      const original = document.createElement('div');
      original.innerHTML = '<p>Child</p>';
      original.id = 'original';
      
      const cloned = clone(original);
      
      expect(cloned.innerHTML).toBe('<p>Child</p>');
      expect(cloned.id).toBe(''); // IDs removed by default
      expect(cloned).not.toBe(original);
    });

    it('should clone shallowly when specified', () => {
      const original = document.createElement('div');
      original.innerHTML = '<p>Child</p>';
      
      const cloned = clone(original, false);
      
      expect(cloned.children.length).toBe(0);
    });

    it('should preserve ID when option is set', () => {
      const original = document.createElement('div');
      original.id = 'test';
      
      const cloned = clone(original, true, { copyId: true });
      
      expect(cloned.id).toBe('test');
    });

    it('should remove nested IDs by default', () => {
      const original = document.createElement('div');
      original.innerHTML = '<p id="nested">Nested</p>';
      
      const cloned = clone(original);
      const nested = cloned.querySelector('p');
      
      expect(nested?.id).toBe('');
    });

    it('should copy dataset when option is set', () => {
      const original = document.createElement('div') as HTMLDivElement;
      original.dataset.test = 'value';
      
      const cloned = clone(original, true, { copyDataset: true }) as HTMLDivElement;
      
      expect(cloned.dataset.test).toBe('value');
    });
  });

  describe('wrap()', () => {
    it('should wrap with HTML string', () => {
      container.innerHTML = '<p id="target">Content</p>';
      const target = container.querySelector('#target')!;
      
      const wrapper = wrap(target, '<div class="wrapper"></div>');
      
      expect(wrapper.className).toBe('wrapper');
      expect(wrapper.querySelector('#target')).toBeTruthy();
      expect(container.querySelector('.wrapper')).toBeTruthy();
    });

    it('should wrap with element', () => {
      container.innerHTML = '<p id="target">Content</p>';
      const target = container.querySelector('#target')!;
      const wrapperEl = document.createElement('div');
      wrapperEl.className = 'wrapper';
      
      const wrapper = wrap(target, wrapperEl);
      
      expect(wrapper.className).toBe('wrapper');
      expect(wrapper.querySelector('#target')).toBeTruthy();
    });

    it('should throw if element has no parent', () => {
      const orphan = document.createElement('div');
      expect(() => wrap(orphan, '<div></div>')).toThrow();
    });

    it('should throw if wrapper HTML is invalid', () => {
      container.innerHTML = '<p id="target">Content</p>';
      const target = container.querySelector('#target')!;
      expect(() => wrap(target, '')).toThrow();
    });
  });

  describe('unwrap()', () => {
    it('should remove parent wrapper', () => {
      container.innerHTML = '<div class="wrapper"><p id="target">Content</p></div>';
      const target = container.querySelector('#target')!;
      
      unwrap(target);
      
      expect(container.querySelector('.wrapper')).toBeFalsy();
      expect(container.querySelector('#target')).toBeTruthy();
      expect(container.children[0].id).toBe('target');
    });

    it('should handle multiple children', () => {
      container.innerHTML = '<div class="wrapper"><p>One</p><p>Two</p></div>';
      const first = container.querySelector('p')!;
      
      unwrap(first);
      
      expect(container.querySelector('.wrapper')).toBeFalsy();
      expect(container.children.length).toBe(2);
    });

    it('should do nothing if no parent', () => {
      const orphan = document.createElement('div');
      expect(() => unwrap(orphan)).not.toThrow();
    });

    it('should do nothing if no grandparent', () => {
      const parent = document.createElement('div');
      const child = document.createElement('p');
      parent.appendChild(child);
      expect(() => unwrap(child)).not.toThrow();
    });
  });
});

describe('Content - Text Node Operations', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('getTextNodes()', () => {
    it('should get all text nodes', () => {
      container.innerHTML = '<p>Hello <span>World</span></p>';
      const textNodes = getTextNodes(container);
      
      expect(textNodes.length).toBe(2);
      expect(textNodes[0].textContent).toBe('Hello ');
      expect(textNodes[1].textContent).toBe('World');
    });

    it('should handle nested elements', () => {
      container.innerHTML = '<div>A<p>B<span>C</span>D</p>E</div>';
      const textNodes = getTextNodes(container);
      
      expect(textNodes.length).toBe(5);
    });
  });

  describe('replaceText()', () => {
    it('should replace text with string', () => {
      container.innerHTML = '<p>Hello World</p>';
      replaceText(container, 'World', 'Universe');
      
      expect(container.textContent).toBe('Hello Universe');
    });

    it('should replace text with regex', () => {
      container.innerHTML = '<p>Hello World, World!</p>';
      replaceText(container, /World/g, 'Universe');
      
      expect(container.textContent).toBe('Hello Universe, Universe!');
    });

    it('should preserve HTML structure', () => {
      container.innerHTML = '<p>Hello <strong>World</strong></p>';
      replaceText(container, 'World', 'Universe');
      
      expect(container.querySelector('strong')?.textContent).toBe('Universe');
    });

    it('should return element for chaining', () => {
      container.innerHTML = '<p>Test</p>';
      const result = replaceText(container, 'Test', 'New');
      expect(result).toBe(container);
    });
  });

  describe('getComments()', () => {
    it('should get all comment nodes', () => {
      container.innerHTML = '<!-- Comment 1 --><p>Text<!-- Comment 2 --></p>';
      const comments = getComments(container);
      
      expect(comments.length).toBe(2);
      expect(comments[0].textContent).toBe(' Comment 1 ');
      expect(comments[1].textContent).toBe(' Comment 2 ');
    });
  });

  describe('createTextNode()', () => {
    it('should create text node', () => {
      const node = createTextNode('Hello');
      
      expect(node.nodeType).toBe(Node.TEXT_NODE);
      expect(node.textContent).toBe('Hello');
    });
  });

  describe('createFragment()', () => {
    it('should create fragment from HTML', () => {
      const frag = createFragment('<p>One</p><p>Two</p>');
      
      expect(frag.childNodes.length).toBe(2);
      
      container.appendChild(frag);
      expect(container.children.length).toBe(2);
    });

    it('should sanitize when option provided', () => {
      const sanitize = (html: string) => html.replace(/<script>/g, '');
      const frag = createFragment('<p>Safe</p><script>bad</script>', { sanitize });
      
      container.appendChild(frag);
      expect(container.innerHTML).not.toContain('<script>');
    });
  });
});

describe('Content - Text Search & Highlighting', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('containsText()', () => {
    it('should find text case-insensitive by default', () => {
      container.textContent = 'Hello World';
      
      expect(containsText(container, 'hello')).toBe(true);
      expect(containsText(container, 'WORLD')).toBe(true);
      expect(containsText(container, 'missing')).toBe(false);
    });

    it('should find text case-sensitive when specified', () => {
      container.textContent = 'Hello World';
      
      expect(containsText(container, 'Hello', true)).toBe(true);
      expect(containsText(container, 'hello', true)).toBe(false);
    });
  });

  describe('countText()', () => {
    it('should count occurrences case-insensitive by default', () => {
      container.textContent = 'hello HELLO Hello';
      
      expect(countText(container, 'hello')).toBe(3);
    });

    it('should count case-sensitive when specified', () => {
      container.textContent = 'hello HELLO Hello';
      
      expect(countText(container, 'hello', true)).toBe(1);
      expect(countText(container, 'HELLO', true)).toBe(1);
    });
  });

  describe('highlight()', () => {
    it('should highlight text', () => {
      container.innerHTML = '<p>Find this word in text</p>';
      highlight(container, 'word');
      
      const mark = container.querySelector('mark');
      expect(mark).toBeTruthy();
      expect(mark?.textContent).toBe('word');
      expect(mark?.className).toBe('highlighted');
    });

    it('should use custom class name', () => {
      container.innerHTML = '<p>Find this</p>';
      highlight(container, 'this', 'custom-highlight');
      
      const mark = container.querySelector('mark');
      expect(mark?.className).toBe('custom-highlight');
    });

    it('should highlight case-insensitive by default', () => {
      container.innerHTML = '<p>Hello HELLO hello</p>';
      highlight(container, 'hello');
      
      const marks = container.querySelectorAll('mark');
      expect(marks.length).toBe(3);
    });

    it('should highlight case-sensitive when specified', () => {
      container.innerHTML = '<p>Hello HELLO hello</p>';
      highlight(container, 'hello', 'highlighted', true);
      
      const marks = container.querySelectorAll('mark');
      expect(marks.length).toBe(1);
    });

    it('should return element for chaining', () => {
      container.innerHTML = '<p>Test</p>';
      const result = highlight(container, 'Test');
      expect(result).toBe(container);
    });
  });

  describe('unhighlight()', () => {
    it('should remove all highlights', () => {
      container.innerHTML = '<p>Hello <mark>highlighted</mark> text</p>';
      unhighlight(container);
      
      expect(container.querySelector('mark')).toBeFalsy();
      expect(container.textContent).toBe('Hello highlighted text');
    });

    it('should handle multiple highlights', () => {
      container.innerHTML = '<p><mark>One</mark> <mark>Two</mark> <mark>Three</mark></p>';
      unhighlight(container);
      
      expect(container.querySelectorAll('mark').length).toBe(0);
      expect(container.textContent).toBe('One Two Three');
    });
  });
});

describe('Content - Advanced Text Operations', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('getVisibleText()', () => {
    it('should get only visible text', () => {
      container.innerHTML = `
        <p>Visible</p>
        <p style="display: none;">Hidden</p>
        <p style="visibility: hidden;">Also Hidden</p>
        <p style="opacity: 0;">Transparent</p>
      `;
      
      const visible = getVisibleText(container);
      expect(visible).toContain('Visible');
      expect(visible).not.toContain('Hidden');
      expect(visible).not.toContain('Also Hidden');
      expect(visible).not.toContain('Transparent');
    });
  });

  describe('getPlainText()', () => {
    it('should preserve line breaks', () => {
      container.innerHTML = '<p>Line 1</p><p>Line 2</p><div>Line 3</div>';
      const text = getPlainText(container);
      
      expect(text).toContain('\n');
      expect(text.split('\n').length).toBeGreaterThan(1);
    });

    it('should handle BR tags', () => {
      container.innerHTML = 'Line 1<br>Line 2';
      const text = getPlainText(container);
      
      expect(text).toContain('\n');
    });
  });

  describe('stripHtml()', () => {
    it('should remove all HTML tags', () => {
      const result = stripHtml('<p>Hello <strong>World</strong></p>');
      expect(result).toBe('Hello World');
    });

    it('should handle nested tags', () => {
      const result = stripHtml('<div><p><span>Text</span></p></div>');
      expect(result).toBe('Text');
    });
  });
  
  describe('escapeHtml()', () => {
    it('should escape special characters', () => {
      const result = escapeHtml('<p>Hello & "World"</p>');
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
      expect(result).toContain('&amp;');
      expect(result).toContain('&quot;');
    });
  });

  describe('getContentSize()', () => {
    it('should count characters and words', () => {
      container.textContent = 'Hello World Test';
      const size = getContentSize(container);
      
      expect(size.characters).toBe(16);
      expect(size.words).toBe(3);
    });

    it('should handle multiple spaces', () => {
      container.textContent = 'Hello    World';
      const size = getContentSize(container);
      
      expect(size.words).toBe(2);
    });

    it('should handle empty content', () => {
      container.textContent = '';
      const size = getContentSize(container);
      
      expect(size.characters).toBe(0);
      expect(size.words).toBe(0);
    });
  });
});

describe('Content - Batch Operations', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('setTexts()', () => {
    it('should set text for multiple elements', () => {
      container.innerHTML = '<p></p><p></p><p></p>';
      const elements = Array.from(container.children);
      
      setTexts(elements, ['One', 'Two', 'Three']);
      
      expect(elements[0].textContent).toBe('One');
      expect(elements[1].textContent).toBe('Two');
      expect(elements[2].textContent).toBe('Three');
    });

    it('should handle fewer texts than elements', () => {
      container.innerHTML = '<p></p><p></p><p></p>';
      const elements = Array.from(container.children);
      
      setTexts(elements, ['One']);
      
      expect(elements[0].textContent).toBe('One');
      expect(elements[1].textContent).toBe('');
    });
  });

  describe('setHTMLs()', () => {
    it('should set HTML for multiple elements', () => {
      container.innerHTML = '<div></div><div></div>';
      const elements = Array.from(container.children);
      
      setHTMLs(elements, ['<p>One</p>', '<p>Two</p>']);
      
      expect(elements[0].innerHTML).toBe('<p>One</p>');
      expect(elements[1].innerHTML).toBe('<p>Two</p>');
    });
  });

  describe('appendMultiple()', () => {
    it('should append to multiple elements', () => {
      container.innerHTML = '<div></div><div></div>';
      const elements = Array.from(container.children);
      
      appendMultiple(elements, '<span>Added</span>');
      
      expect(elements[0].querySelector('span')?.textContent).toBe('Added');
      expect(elements[1].querySelector('span')?.textContent).toBe('Added');
    });
  });
});

describe('Content - Utility Checks', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('isEmpty()', () => {
    it('should return true for empty element', () => {
      expect(isEmpty(container)).toBe(true);
    });

    it('should return false for element with text', () => {
      container.textContent = 'Text';
      expect(isEmpty(container)).toBe(false);
    });

    it('should return false for element with children', () => {
      container.innerHTML = '<p></p>';
      expect(isEmpty(container)).toBe(false);
    });

    it('should return true for element with only whitespace', () => {
      container.textContent = '   ';
      expect(isEmpty(container)).toBe(true);
    });
  });
});