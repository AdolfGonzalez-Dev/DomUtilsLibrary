// src/reactive/signals.d.ts
type Signal<T> = [
  get: () => T,
  set: (value: T | ((prev: T) => T)) => T,
  subscribe: (fn: () => void) => () => void
];

interface StateProxy {
  subscribe(fn: (key: string, oldVal: any, newVal: any) => void): () => void;
  inspect(): Record<string, any>;
}

declare function createSignal<T>(initial: T): Signal<T>;
declare function createEffect(fn: () => void | (() => void)): () => void;
declare function createComputed<T>(fn: () => T): () => T;
declare function $state<T extends object>(initial: T): T & StateProxy;

export { $state, type Signal, type StateProxy, createComputed, createEffect, createSignal };
