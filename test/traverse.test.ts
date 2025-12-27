import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { on, off, once, trigger, waitFor, delegate } from '../src/events';

describe('Events Module', () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement('button');
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
  });

  it('should attach listener', () => {
    let called = false;
    on(el, 'click', () => { called = true; });
    
    el.click();
    expect(called).toBe(true);
  });

  it('should remove listener', () => {
    let called = false;
    const handler = () => { called = true; };
    const unsub = on(el, 'click', handler);
    
    unsub();
    el.click();
    expect(called).toBe(false);
  });

  it('should handle once', () => {
    let count = 0;
    once(el, 'click', () => { count++; });
    
    el.click();
    el.click();
    el.click();
    
    expect(count).toBe(1);
  });

  it('should trigger custom event', () => {
    let data;
    on(el, 'custom', (e: CustomEvent) => {
      data = e.detail;
    });
    
    trigger(el, 'custom', { detail: { test: true } });
    expect(data).toEqual({ test: true });
  });

  it('should wait for event', async () => {
    setTimeout(() => el.click(), 100);
    const event = await waitFor(el, 'click');
    expect(event).toBeDefined();
  });

  it('should delegate events', () => {
    const child = document.createElement('button');
    child.className = 'child';
    el.appendChild(child);

    let clicked = false;
    delegate(el, '.child', 'click', () => {
      clicked = true;
    });

    child.click();
    expect(clicked).toBe(true);
  });
});