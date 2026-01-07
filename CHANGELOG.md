# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

-   Animated scrolling utilities
-   Form validation helpers
-   CSS variables integration
-   Web Components integration

---

## [0.1.0] - 2025-01-XX

### Added

#### Core Features

-   ✨ Complete DOM query utilities (`find`, `findAll`, `create`, `q`, `qa`)
-   ✨ Robust event management (`on`, `off`, `once`, `delegate`, `trigger`)
-   ✨ Fine-grained reactivity system with Signals
    -   `createSignal()` - Reactive values
    -   `createEffect()` - Auto-running effects
    -   `createComputed()` - Cached computed values
    -   `$state()` - Reactive objects
-   ✨ Gesture support
    -   `createDragController()` - Drag handling
    -   `onSwipe()` - Swipe detection
    -   Touch and pointer event helpers
-   ✨ Observer helpers
    -   `onVisible()` - IntersectionObserver wrapper
    -   `onResize()` - ResizeObserver wrapper
    -   `onMutation()` - MutationObserver wrapper
-   ✨ AJAX utilities
    -   `ajax()` - Fetch-based HTTP client
    -   Convenience helpers: `get()`, `post()`, `put()`, `del()`, `json()`
    -   `load()` - Load HTML into element
    -   `script()` - Dynamic script loading

#### Components

-   ✨ `Modal` - Accessible dialog with focus management
    -   WCAG compliant
    -   Automatic focus trap
    -   Keyboard navigation (Escape to close)
    -   Click outside to close
    -   Callbacks: `onShow`, `onHide`
-   ✨ `Tabs` - Keyboard-accessible tabs
    -   Arrow key navigation
    -   Home/End key support
    -   Optional URL hash sync
    -   Panel syncing
-   ✨ `Tooltip` - Smart-positioned tooltips
    -   Auto-positioning (top, bottom, left, right)
    -   Viewport boundary detection
    -   Hover and focus support

#### Developer Experience

-   📝 Complete TypeScript definitions (`.d.ts` files)
-   📚 Comprehensive JSDoc comments
-   🧪 87 unit tests (100% pass rate)
    -   Signals tests (26 tests)
    -   Events tests (17 tests)
    -   DOM tests (22 tests)
    -   Components tests (22 tests)
-   📦 Modern build system (esbuild)
    -   ESM output
    -   CommonJS output
    -   Minified bundles
    -   Source maps
-   🔄 CI/CD with GitHub Actions
    -   Automatic tests on push/PR
    -   Multi-Node version testing (16.x, 18.x, 20.x)
    -   Build verification
-   📖 Professional README with examples
-   📋 This changelog

#### Utilities & Helpers

-   Animation helpers (`animate`, `fadeIn`, `fadeOut`)
-   DOM helpers (`append`, `prepend`, `before`, `after`, `css`, `position`, `offset`, `clone`)
-   Attribute helpers (`getAttribute`, `setAttribute`, `toggleAttribute`, `removeAttribute`)
-   Time utilities (`debounce`, `throttle`)
-   Async utilities (`defer`, `nextFrame`, `wait`, `requestIdle`)
-   Math utilities (`clamp`, `lerp`)
-   Type checking utilities

### Browser Support

-   Chrome (all versions)
-   Firefox (all versions)
-   Safari (all versions)
-   Edge (all versions)
-   IE 11 (partial - use polyfills)

### Bundle Size

-   `index.esm.js` - 0.91KB (minified)
-   `reactive.esm.js` - 2.61KB (minified)
-   Total - ~10KB (minified)

### Documentation

-   ✅ API reference in README
-   ✅ Quick start guide
-   ✅ TypeScript support documented
-   ✅ Browser support matrix
-   ✅ Code examples for all features

---

## Project Status

-   **Status**: Stable Release
-   **Maintenance**: Active
-   **Next Major Version**: TBD (when breaking changes needed)

---

## Upgrade Guide

### From Early Development

This is the first official release. No upgrade path needed.

For future upgrades, see the [Migration Guide](docs/migration.md) (when available).

---

## Contributors

-   [@AdolfDigitalDev](https://github.com/AdolfDigitalDeveloper) - Creator and maintainer

---

## Related

-   [Semantic Versioning](https://semver.org/)
-   [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
-   [Conventional Commits](https://www.conventionalcommits.org/)
