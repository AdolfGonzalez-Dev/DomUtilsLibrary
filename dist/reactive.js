const EFFECT_STACK = [];
const EFFECT_DEPS = /* @__PURE__ */ new WeakMap();
function _trackDependency(runner, signalKey) {
  if (!runner || !signalKey) return;
  if (!signalKey.__subs) signalKey.__subs = /* @__PURE__ */ new Set();
  if (!signalKey.__subs.has(runner)) {
    signalKey.__subs.add(runner);
  }
  let deps = EFFECT_DEPS.get(runner);
  if (!deps) {
    deps = /* @__PURE__ */ new Set();
    EFFECT_DEPS.set(runner, deps);
  }
  deps.add(signalKey);
}
function createSignal(initial) {
  let value = initial;
  const subs = /* @__PURE__ */ new Set();
  function get() {
    const active = EFFECT_STACK[EFFECT_STACK.length - 1];
    if (active) {
      _trackDependency(active, get);
    }
    return value;
  }
  get.__subs = subs;
  function set(newVal) {
    const old = value;
    if (typeof newVal === "function") {
      value = newVal(value);
    } else {
      value = newVal;
    }
    if (old === value) return value;
    const arr = Array.from(subs);
    arr.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        setTimeout(() => {
          throw err;
        });
      }
    });
    return value;
  }
  function subscribe(fn) {
    if (typeof fn !== "function") return () => {
    };
    subs.add(fn);
    return () => subs.delete(fn);
  }
  return [get, set, subscribe];
}
function createEffect(fn) {
  if (typeof fn !== "function") throw new Error("createEffect: fn must be a function");
  let cleanup = null;
  const runner = () => {
    const prevDeps = EFFECT_DEPS.get(runner);
    if (prevDeps) {
      prevDeps.forEach((sigKey) => {
        try {
          sigKey.__subs && sigKey.__subs.delete(runner);
        } catch (_) {
        }
      });
      EFFECT_DEPS.delete(runner);
    }
    try {
      if (typeof cleanup === "function") cleanup();
    } catch (err) {
      console.error(err);
    }
    cleanup = null;
    EFFECT_STACK.push(runner);
    try {
      const maybeCleanup = fn();
      if (typeof maybeCleanup === "function") cleanup = maybeCleanup;
    } catch (err) {
      console.error("createEffect error", err);
    } finally {
      EFFECT_STACK.pop();
    }
  };
  runner();
  return () => {
    const deps = EFFECT_DEPS.get(runner);
    if (deps) {
      deps.forEach((sigKey) => {
        try {
          sigKey.__subs && sigKey.__subs.delete(runner);
        } catch (_) {
        }
      });
      EFFECT_DEPS.delete(runner);
    }
    try {
      if (typeof cleanup === "function") cleanup();
    } catch (err) {
      console.error(err);
    }
    cleanup = null;
  };
}
function createComputed(fn) {
  if (typeof fn !== "function") throw new Error("createComputed: fn must be a function");
  let cached;
  let dirty = true;
  let cleanup = null;
  const recompute = () => {
    const prevDeps = EFFECT_DEPS.get(recompute);
    if (prevDeps) {
      prevDeps.forEach((sigKey) => {
        try {
          sigKey.__subs && sigKey.__subs.delete(recompute);
        } catch (_) {
        }
      });
      EFFECT_DEPS.delete(recompute);
    }
    try {
      if (typeof cleanup === "function") cleanup();
    } catch (_) {
    }
    cleanup = null;
    EFFECT_STACK.push(recompute);
    try {
      const result = fn();
      if (typeof result === "function") {
        cleanup = result;
      } else {
        cached = result;
      }
      dirty = false;
    } catch (err) {
      console.error("createComputed error", err);
    } finally {
      EFFECT_STACK.pop();
    }
  };
  recompute();
  return () => {
    if (dirty) recompute();
    return cached;
  };
}
const STATE_PROP_SIGNALS = /* @__PURE__ */ new WeakMap();
function _ensurePropSignalFor(target, prop) {
  let map = STATE_PROP_SIGNALS.get(target);
  if (!map) {
    map = /* @__PURE__ */ new Map();
    STATE_PROP_SIGNALS.set(target, map);
  }
  let sig = map.get(prop);
  if (!sig) {
    sig = { __subs: /* @__PURE__ */ new Set() };
    map.set(prop, sig);
  }
  return sig;
}
function $state(initial = {}) {
  const globalSubs = /* @__PURE__ */ new Set();
  const notifyGlobal = (key, oldVal, newVal) => {
    globalSubs.forEach((fn) => {
      try {
        fn(key, oldVal, newVal);
      } catch (err) {
        console.error(err);
      }
    });
  };
  const handler = {
    get(target, prop, receiver) {
      if (prop === "__isState") return true;
      if (prop === "subscribe") return (fn) => {
        globalSubs.add(fn);
        return () => globalSubs.delete(fn);
      };
      if (prop === "inspect") return () => Object.assign({}, target);
      const active = EFFECT_STACK[EFFECT_STACK.length - 1];
      if (active && typeof prop === "string") {
        const sig = _ensurePropSignalFor(target, prop);
        _trackDependency(active, sig);
      }
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
      const old = target[prop];
      if (old === value) {
        target[prop] = value;
        return true;
      }
      const result = Reflect.set(target, prop, value, receiver);
      const map = STATE_PROP_SIGNALS.get(target);
      if (map) {
        const sig = map.get(prop);
        if (sig && sig.__subs) {
          Array.from(sig.__subs).forEach((runner) => {
            try {
              runner();
            } catch (err) {
              setTimeout(() => {
                throw err;
              });
            }
          });
        }
      }
      notifyGlobal(prop, old, value);
      return result;
    },
    deleteProperty(target, prop) {
      const old = target[prop];
      const existed = prop in target;
      const result = Reflect.deleteProperty(target, prop);
      if (existed) {
        const map = STATE_PROP_SIGNALS.get(target);
        if (map) {
          const sig = map.get(prop);
          if (sig && sig.__subs) {
            Array.from(sig.__subs).forEach((runner) => {
              try {
                runner();
              } catch (err) {
                setTimeout(() => {
                  throw err;
                });
              }
            });
          }
          map.delete(prop);
        }
        notifyGlobal(prop, old, void 0);
      }
      return result;
    }
  };
  return new Proxy(Object.assign({}, initial), handler);
}
var signals_default = {
  createSignal,
  createEffect,
  createComputed,
  $state
};

export { $state, createComputed, createEffect, createSignal, signals_default as default };
//# sourceMappingURL=reactive.js.map
//# sourceMappingURL=reactive.js.map