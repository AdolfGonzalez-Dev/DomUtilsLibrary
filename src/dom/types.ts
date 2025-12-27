/**
 * TypeScript types for DOM module.
 * Provides type definitions for CSS and DOM-related operations.
 */

/**
 * CSS Properties type for style operations.
 * Includes all common CSS properties in camelCase.
 */
export interface CSSProperties {
  // Layout
  display?: string;
  position?: string;
  width?: string | number;
  height?: string | number;
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;
  zIndex?: string | number;

  // Box Model
  margin?: string | number;
  marginTop?: string | number;
  marginRight?: string | number;
  marginBottom?: string | number;
  marginLeft?: string | number;
  padding?: string | number;
  paddingTop?: string | number;
  paddingRight?: string | number;
  paddingBottom?: string | number;
  paddingLeft?: string | number;
  border?: string;
  borderWidth?: string | number;
  borderStyle?: string;
  borderColor?: string;
  borderRadius?: string | number;

  // Flexbox
  flex?: string | number;
  flexDirection?: string;
  flexWrap?: string;
  flexGrow?: string | number;
  flexShrink?: string | number;
  flexBasis?: string | number;
  justifyContent?: string;
  alignItems?: string;
  alignContent?: string;
  gap?: string | number;

  // Grid
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridAutoColumns?: string;
  gridAutoRows?: string;
  gridGap?: string | number;
  gridColumnGap?: string | number;
  gridRowGap?: string | number;

  // Typography
  color?: string;
  fontSize?: string | number;
  fontWeight?: string | number;
  fontStyle?: string;
  fontFamily?: string;
  lineHeight?: string | number;
  letterSpacing?: string | number;
  textAlign?: string;
  textDecoration?: string;
  textTransform?: string;
  textOverflow?: string;
  whiteSpace?: string;

  // Background & Borders
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  opacity?: string | number;

  // Visual Effects
  boxShadow?: string;
  textShadow?: string;
  transform?: string;
  transition?: string;
  animation?: string;
  filter?: string;
  backdropFilter?: string;

  // Overflow & Visibility
  overflow?: string;
  overflowX?: string;
  overflowY?: string;
  visibility?: string;
  clip?: string;

  // Cursor & Pointer
  cursor?: string;
  pointerEvents?: string;
  userSelect?: string;

  // Other
  float?: string;
  clear?: string;
  minWidth?: string | number;
  maxWidth?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
  [key: string]: any;
}

/**
 * Event handler callback type.
 */
export type EventHandler<E extends Event = Event> = (event: E) => void;

/**
 * Element selector - can be string or Element instance.
 */
export type ElementSelector = string | Element | null;

/**
 * Collection of elements.
 */
export type ElementCollection = Element[] | NodeListOf<Element>;

/**
 * Generic callback for iteration.
 */
export type IteratorCallback<T> = (item: T, index: number, array: T[]) => void;

/**
 * Predicate function for filtering.
 */
export type PredicateFn<T> = (item: T, index?: number, array?: T[]) => boolean;

/**
 * Transform function for mapping.
 */
export type TransformFn<T, R> = (item: T, index?: number, array?: T[]) => R;
