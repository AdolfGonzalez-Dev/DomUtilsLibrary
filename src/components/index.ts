/**
 * Components Module
 * Accessible UI components (Modal, Tabs, Tooltip)
 *
 * @module components
 * @example
 * import { Modal, Tabs, Tooltip } from 'domutils/components';
 *
 * const modal = new Modal('#my-modal');
 * const tabs = new Tabs('#my-tabs');
 * const tooltip = new Tooltip('#button', 'Help text');
 */

// Components
import ModalComponent from "./modal";
import TabsComponent from "./tabs";
import TooltipComponent from "./tooltip";

export { Modal, default as ModalComponent } from "./modal";
export { Tabs, default as TabsComponent } from "./tabs";
export { Tooltip, default as TooltipComponent } from "./tooltip";

// Types
export type { ModalOptions } from "./modal";
export type { TabsOptions } from "./tabs";
export type { TooltipOptions } from "./tooltip";

// Default export
export default {
    Modal: ModalComponent,
    Tabs: TabsComponent,
    Tooltip: TooltipComponent
};
