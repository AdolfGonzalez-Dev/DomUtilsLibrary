import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as className from '../src/dom/class';
import * as attr from '../src/dom/attr';
import * as style from '../src/dom/style';
import * as query from '../src/dom/query';

describe('DOM Module - Class', () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
  });

  it('should add class', () => {
    className.addClass(el, 'active');
    expect(className.hasClass(el, 'active')).toBe(true);
  });

  it('should remove class', () => {
    className.addClass(el, 'active');
    className.removeClass(el, 'active');
    expect(className.hasClass(el, 'active')).toBe(false);
  });

  it('should toggle class', () => {
    const result1 = className.toggleClass(el, 'active');
    expect(result1).toBe(true);
    expect(className.hasClass(el, 'active')).toBe(true);

    const result2 = className.toggleClass(el, 'active');
    expect(result2).toBe(false);
    expect(className.hasClass(el, 'active')).toBe(false);
  });

  it('should add multiple classes', () => {
    className.addClass(el, ['active', 'focused']);
    expect(className.hasClass(el, 'active')).toBe(true);
    expect(className.hasClass(el, 'focused')).toBe(true);
  });
});

describe('DOM Module - Attr', () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('should set and get attribute', () => {
    attr.setAttribute(el, 'data-action', 'save');
    expect(attr.getAttribute(el, 'data-action')).toBe('save');
  });

  it('should check if has attribute', () => {
    attr.setAttribute(el, 'disabled', true);
    expect(attr.hasAttribute(el, 'disabled')).toBe(true);
  });

  it('should remove attribute', () => {
    attr.setAttribute(el, 'data-action', 'save');
    attr.removeAttribute(el, 'data-action');
    expect(attr.hasAttribute(el, 'data-action')).toBe(false);
  });

  it('should handle boolean attributes', () => {
    attr.setAttribute(el, 'disabled', true);
    expect(el.getAttribute('disabled')).toBe('');

    attr.setAttribute(el, 'disabled', false);
    expect(el.hasAttribute('disabled')).toBe(false);
  });
});

describe('DOM Module - Style', () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
  });

  it('should set style', () => {
    style.setStyle(el, { color: 'red', padding: 20 });
    expect(el.style.color).toBe('red');
    expect(el.style.padding).toBe('20px');
  });

  it('should get style', () => {
    el.style.color = 'blue';
    expect(style.getStyle(el, 'color')).toBe('blue');
  });

  it('should hide and show', () => {
    style.hide(el);
    expect(el.style.display).toBe('none');

    style.show(el);
    expect(el.style.display).not.toBe('none');
  });
});

describe('DOM Module - Query', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="container">
        <button class="btn" data-action="save">Save</button>
        <button class="btn" data-action="cancel">Cancel</button>
        <span class="text">Hello</span>
      </div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should query single element', () => {
    const el = query.query('.btn');
    expect(el).not.toBeNull();
    expect(el?.textContent).toBe('Save');
  });

  it('should query all elements', () => {
    const els = query.queryAll('.btn');
    expect(els).toHaveLength(2);
  });

  it('should query by id', () => {
    const el = query.queryById('container');
    expect(el?.id).toBe('container');
  });

  it('should query by class', () => {
    const els = query.queryAllByClass('btn');
    expect(els).toHaveLength(2);
  });

  it('should query by data attribute', () => {
    const els = query.queryByData('action');
    expect(els).toHaveLength(2);
  });

  it('should query by data value', () => {
    const els = query.queryByDataValue('action', 'save');
    expect(els).toHaveLength(1);
    expect(els[0].textContent).toBe('Save');
  });

  it('should get children', () => {
    const container = query.queryById('container');
    const children = query.getChildren(container!);
    expect(children).toHaveLength(3);
  });

  it('should get siblings', () => {
    const btn = query.query('.btn');
    const siblings = query.getSiblings(btn!);
    expect(siblings.length).toBeGreaterThan(0);
  });
});