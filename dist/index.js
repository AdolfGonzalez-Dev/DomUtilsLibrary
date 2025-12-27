import * as DOMCore from './core/dom.js';
import * as EventsCore from './core/events.js';
import * as DomExt from './core/dom-helpers-extended.js';
import * as EventsExt from './core/event-helpers.js';
import * as ModalModule from './modules/modal.js';
import * as TooltipModule from './modules/tooltip.js';
import * as TabsModule from './modules/tabs.js';
import * as AjaxModule from './modules/ajax.js';
import * as AnimModule from './animations/animate.js';
import * as Reactive from './reactive/signals.js';
import * as Gestures from './gestures/index.js';
import * as Observers from './observers/index.js';
import * as Utils from './utils/utils.js';
import * as Sugar from './utils/sugar.js';
import * as Storage from './utils/storage.js';
import DOMUtilsCore from './core/wrapper.js';

const DOMUtilsRoot = {
  ...DOMCore,
  ...EventsCore,
  dom: { ...DomExt },
  events: { ...EventsExt },
  Modal: ModalModule.Modal,
  Tooltip: TooltipModule.Tooltip,
  Tabs: TabsModule.Tabs,
  ajax: { ...AjaxModule },
  anim: { ...AnimModule },
  reactive: { ...Reactive }
};
function DOMUtilsLibrary(selectorOrNode) {
  return new DOMUtilsCore(selectorOrNode);
}
DOMUtilsLibrary.gestures = Gestures;
DOMUtilsLibrary.observers = Observers;
DOMUtilsLibrary.ajax = AjaxModule;
DOMUtilsLibrary.utils = { ...Utils, ...Sugar };
DOMUtilsLibrary.storage = Storage;
DOMUtilsLibrary.version = "0.3.0";
const $ = DOMUtilsLibrary;
const DomUtilsLibrary = DOMUtilsRoot;

export { $, DOMUtilsLibrary, DOMUtilsRoot as DOMUtilsLibraryRoot,  };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map