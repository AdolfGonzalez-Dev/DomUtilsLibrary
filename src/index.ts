/**
 * DOMUtils Library v0.5.0
 * Complete DOM manipulation and reactive utilities
 *
 * @packageDocumentation
 */

// ============================================================================
// 1. NAMESPACE EXPORTS (import * as domutils)
// ============================================================================

export * as dom from "./dom";
export * as events from "./events";
export * as traverse from "./traverse";
export * as content from "./content";
export * as create from "./create";
export * as reactive from "./reactive/signals";
export * as form from "./form";
export * as gestures from "./gestures";
export * as observers from "./observers";
export * as storage from "./utils/storage";
export * as utils from "./utils/utils";
export * as ajax from "./ajax";
export * as animations from "./animations";
export * as components from "./components";

// ============================================================================
// 2. NAMED EXPORTS (Tree Shaking)
// ============================================================================

// DOM
export * from "./dom/query";
export * from "./dom/class";
export * from "./dom/attr";
export * from "./dom/style";

// Events - Export with explicit aliases to avoid conflicts
export {
    on,
    off,
    once as onceListener,
    onMultiple,
    hasListener,
    getListenerCount
} from "./events/listener";

export {
    delegate,
    delegateMultiple,
    delegateWith,
    delegateExact,
    delegateAny,
    undelegate
} from "./events/delegate";

export {
    trigger,
    emit,
    dispatch,
    dispatchMouse,
    dispatchKeyboard,
    dispatchPointer,
    dispatchInput,
    createEventTrigger,
    waitFor,
    waitForAny,
    onceWithTimeout
} from "./events/trigger";

export {
    prevent,
    stop,
    stopImmediate,
    handle,
    onHandle,
    debounce as debounceEvent,
    throttle as throttleEvent,
    onKey,
    onKeys,
    withModifiers,
    onTarget,
    once as onceHelper,
    ignore,
    compose as composeHandlers,
    log as logEvent
} from "./events/helpers";

// Traverse - Export with explicit aliases
export {
    parent,
    ancestors,
    children,
    firstChild,
    lastChild,
    nthChild,
    descendants,
    nextSibling,
    prevSibling,
    previousSibling,
    siblings,
    nextUntil,
    prevUntil,
    previousUntil,
    closest,
    isAncestor,
    isDescendant,
    areSiblings,
    getRoot,
    commonAncestor,
    elementsBetween,
    walk,
    findInTree,
    findAllInTree,
    getDepth,
    countChildren,
    hasChildren,
    getTextNodes as getTextNodesTraverse
} from "./traverse";

// Content - Export with explicit aliases
export {
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
    replace as replaceContent,
    remove,
    removeChildren,
    removeMultiple,
    detach,
    clone,
    wrap,
    unwrap,
    getTextNodes as getTextNodesContent,
    replaceText,
    getComments,
    createTextNode,
    createFragment as createFragmentContent,
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
    isEmpty as isEmptyContent
} from "./content";

// Create - Export with explicit aliases
export {
    createElement,
    // Note: 'create' function is not exported to avoid conflict with 'create' namespace
    createSVG,
    createSVGContainer,
    createText,
    createComment,
    createFragment as createFragmentCreate,
    createFromHTML,
    createElements,
    createButton,
    createInput,
    createLabel,
    createSelect,
    createTextarea,
    createForm as createFormElement,
    createList,
    createTable,
    createCard,
    createModal as createModalElement,
    createBadge,
    createSpinner,
    createGrid,
    createIcon,
    createNav,
    createContainer
} from "./create";

// Reactive
export * from "./reactive/signals";

// Form - Export with explicit aliases for conflicting names
export {
    Field,
    FieldClass,
    Form,
    createForm,
    FormClass,
    useForm,
    useField,
    useFormField,
    required,
    email,
    minLength,
    maxLength,
    minValue,
    maxValue,
    pattern,
    url,
    number,
    integer,
    phone,
    compose as composeValidators,
    custom as customValidator,
    asyncValidator,
    when,
    match,
    range,
    lengthRange,
    oneOf,
    notOneOf,
    contains,
    equals,
    notEquals,
    minDate,
    maxDate,
    trim,
    uppercase,
    lowercase,
    capitalize,
    capitalizeWords,
    parseNumber,
    parseInt as parseIntTransformer,
    round,
    clamp as clampTransformer,
    parseBoolean,
    alphanumericOnly,
    digitsOnly,
    removeWhitespace,
    removeSpecialChars,
    normalizeWhitespace,
    replace as replaceTransformer,
    truncate,
    padStart,
    padEnd,
    slugify,
    formatPhone,
    formatCurrency,
    formatDate,
    split,
    join,
    unique,
    sort,
    parseJSON,
    stringifyJSON,
    customTransformer,
    composeTransformers,
    DOMUtilsError,
    ValidationError,
    FieldNotFoundError,
    FormError,
    SubmissionError,
    ConfigurationError
} from "./form";

// Gestures
export * from "./gestures";

// Observers
export * from "./observers";

// Storage
export * from "./utils/storage";

// Utils - Export with explicit aliases
export {
    debounce as debounceUtil,
    throttle as throttleUtil,
    memoize,
    pipe,
    compose as composeUtils,
    once as onceUtil,
    noop,
    identity
} from "./utils/utils";

// AJAX
export * from "./ajax";

// Animations
export * from "./animations";

// Components
export * from "./components";

// ============================================================================
// 3. TYPE EXPORTS
// ============================================================================

// DOM Types
export type { CSSProperties, EventHandler } from "./dom/types";

// Events Types
export type { DelegateConfig, DelegatedEventHandler } from "./events/delegate";
export type { CustomEventOptions } from "./events/trigger";

// Reactive Types
export type {
    Signal,
    EffectCleanup,
    EffectFn,
    ComputedGetter,
    StateChangeListener,
    StateProxy
} from "./reactive/signals";

// Form Types
export type {
    ValidationResult,
    AsyncValidationResult,
    ValidatorFn,
    ValidatorOptions,
    TransformerFn,
    FieldConfig,
    FieldState,
    FormConfig,
    FormState,
    FormErrors,
    FormTouched,
    UseFormReturn,
    UseFieldReturn
} from "./form/types";

// Gestures Types
export type {
    Point,
    DragInfo,
    DragOptions,
    DragController,
    SwipeInfo,
    SwipeOptions,
    SwipeCallback
} from "./gestures";

// Observers Types
export type { ObserverHandle } from "./observers";

// Storage Types
export type { StorageOptions, StorageSize } from "./utils/storage";

// AJAX Types
export type { AjaxOptions, AjaxError } from "./ajax";

// Animations Types
export type { AnimateOptions } from "./animations";

// Components Types
export type { ModalOptions, TabsOptions, TooltipOptions } from "./components";

// ============================================================================
// 4. METADATA
// ============================================================================

export const version = "0.5.0";

export const metadata = {
    name: "DOMUtils",
    version,
    author: "AdolfDigitalDeveloper",
    repository: "https://github.com/AdolfDigitalDeveloper/DomUtilsLibrary",
    license: "MIT"
} as const;

// ============================================================================
// 5. DEFAULT EXPORT
// ============================================================================

// Re-export namespace imports as default object
import * as domNamespace from "./dom";
import * as eventsNamespace from "./events";
import * as traverseNamespace from "./traverse";
import * as contentNamespace from "./content";
import * as createNamespace from "./create";
import * as reactiveNamespace from "./reactive/signals";
import * as formNamespace from "./form";
import * as gesturesNamespace from "./gestures";
import * as observersNamespace from "./observers";
import * as storageNamespace from "./utils/storage";
import * as utilsNamespace from "./utils/utils";
import * as ajaxNamespace from "./ajax";
import * as animationsNamespace from "./animations";
import * as componentsNamespace from "./components";

export default {
    dom: domNamespace,
    events: eventsNamespace,
    traverse: traverseNamespace,
    content: contentNamespace,
    create: createNamespace,
    reactive: reactiveNamespace,
    form: formNamespace,
    gestures: gesturesNamespace,
    observers: observersNamespace,
    storage: storageNamespace,
    utils: utilsNamespace,
    ajax: ajaxNamespace,
    animations: animationsNamespace,
    components: componentsNamespace,
    version: "0.5.0",
    metadata: {
        name: "DOMUtils",
        version: "0.5.0",
        author: "AdolfDigitalDeveloper",
        repository: "https://github.com/AdolfDigitalDeveloper/DomUtilsLibrary",
        license: "MIT"
    }
};
