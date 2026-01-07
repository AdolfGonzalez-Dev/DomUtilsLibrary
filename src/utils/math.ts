/**
 * Math Utilities
 * Common math operations and helpers
 *
 * @module utils/math
 * @example
 * import { clamp, lerp, random } from 'domutils/utils';
 *
 * const value = clamp(150, 0, 100); // 100
 * const interpolated = lerp(0, 100, 0.5); // 50
 */

// ============================================================================
// BASIC OPERATIONS
// ============================================================================

/**
 * Clamp value between min and max
 *
 * @example
 * clamp(150, 0, 100); // 100
 * clamp(-10, 0, 100); // 0
 * clamp(50, 0, 100);  // 50
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation between a and b
 *
 * @example
 * lerp(0, 100, 0);    // 0
 * lerp(0, 100, 0.5);  // 50
 * lerp(0, 100, 1);    // 100
 */
export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

/**
 * Inverse lerp - get t value for a point between a and b
 *
 * @example
 * inverseLerp(0, 100, 50);  // 0.5
 * inverseLerp(0, 100, 25);  // 0.25
 */
export function inverseLerp(a: number, b: number, value: number): number {
    return (value - a) / (b - a);
}

/**
 * Map value from one range to another
 *
 * @example
 * map(50, 0, 100, 0, 1);     // 0.5
 * map(5, 0, 10, 0, 100);     // 50
 */
export function map(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
): number {
    return lerp(outMin, outMax, inverseLerp(inMin, inMax, value));
}

// ============================================================================
// ROUNDING
// ============================================================================

/**
 * Round to nearest multiple
 *
 * @example
 * roundTo(127, 10);  // 130
 * roundTo(123, 5);   // 125
 */
export function roundTo(value: number, multiple: number): number {
    return Math.round(value / multiple) * multiple;
}

/**
 * Floor to nearest multiple
 *
 * @example
 * floorTo(127, 10);  // 120
 * floorTo(123, 5);   // 120
 */
export function floorTo(value: number, multiple: number): number {
    return Math.floor(value / multiple) * multiple;
}

/**
 * Ceil to nearest multiple
 *
 * @example
 * ceilTo(121, 10);  // 130
 * ceilTo(121, 5);   // 125
 */
export function ceilTo(value: number, multiple: number): number {
    return Math.ceil(value / multiple) * multiple;
}

/**
 * Round to decimal places
 *
 * @example
 * precision(3.14159, 2);  // 3.14
 * precision(1.005, 2);    // 1.01
 */
export function precision(value: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
}

// ============================================================================
// RANDOM
// ============================================================================

/**
 * Random number between min and max (inclusive)
 *
 * @example
 * random(0, 10);      // Random between 0 and 10
 * random(5, 15);      // Random between 5 and 15
 */
export function random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

/**
 * Random integer between min and max (inclusive)
 *
 * @example
 * randomInt(1, 6);    // Dice roll
 * randomInt(0, 100);  // Random percentage
 */
export function randomInt(min: number, max: number): number {
    return Math.floor(random(min, max + 1));
}

/**
 * Random boolean with optional probability
 *
 * @example
 * randomBool();       // 50% chance
 * randomBool(0.75);   // 75% chance of true
 */
export function randomBool(probability: number = 0.5): boolean {
    return Math.random() < probability;
}

/**
 * Random item from array
 *
 * @example
 * randomItem([1, 2, 3, 4, 5]);
 * randomItem(['red', 'green', 'blue']);
 */
export function randomItem<T>(array: T[]): T {
    return array[randomInt(0, array.length - 1)];
}

// ============================================================================
// RANGE & COMPARISON
// ============================================================================

/**
 * Check if value is within range (inclusive)
 *
 * @example
 * inRange(5, 0, 10);   // true
 * inRange(-1, 0, 10);  // false
 */
export function inRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
}

/**
 * Get min value from numbers
 */
export function min(...values: number[]): number {
    return Math.min(...values);
}

/**
 * Get max value from numbers
 */
export function max(...values: number[]): number {
    return Math.max(...values);
}

// ============================================================================
// AVERAGE & SUM
// ============================================================================

/**
 * Calculate average of numbers
 *
 * @example
 * average(1, 2, 3, 4, 5);  // 3
 */
export function average(...values: number[]): number {
    return sum(...values) / values.length;
}

/**
 * Calculate sum of numbers
 *
 * @example
 * sum(1, 2, 3, 4, 5);  // 15
 */
export function sum(...values: number[]): number {
    return values.reduce((acc, v) => acc + v, 0);
}

/**
 * Calculate median of numbers
 *
 * @example
 * median(1, 2, 3, 4, 5);  // 3
 */
export function median(...values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[mid - 1] + sorted[mid]) / 2;
    }

    return sorted[mid];
}

// ============================================================================
// PERCENTAGE
// ============================================================================

/**
 * Calculate percentage
 *
 * @example
 * percentage(50, 200);  // 25
 * percentage(75, 100);  // 75
 */
export function percentage(value: number, total: number): number {
    return (value / total) * 100;
}

/**
 * Get value from percentage
 *
 * @example
 * fromPercentage(25, 200);  // 50
 * fromPercentage(75, 100);  // 75
 */
export function fromPercentage(percent: number, total: number): number {
    return (percent / 100) * total;
}

// ============================================================================
// DISTANCE
// ============================================================================

/**
 * Calculate distance between two points
 *
 * @example
 * distance(0, 0, 3, 4);  // 5
 */
export function distance(
    x1: number,
    y1: number,
    x2: number,
    y2: number
): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Calculate angle between two points (in radians)
 *
 * @example
 * angle(0, 0, 1, 1);  // π/4
 */
export function angle(x1: number, y1: number, x2: number, y2: number): number {
    return Math.atan2(y2 - y1, x2 - x1);
}

// ============================================================================
// CONVERSION
// ============================================================================

/**
 * Degrees to radians
 *
 * @example
 * toRadians(180);  // π
 * toRadians(90);   // π/2
 */
export function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * Radians to degrees
 *
 * @example
 * toDegrees(Math.PI);      // 180
 * toDegrees(Math.PI / 2);  // 90
 */
export function toDegrees(radians: number): number {
    return radians * (180 / Math.PI);
}

// ============================================================================
// SPECIAL
// ============================================================================

/**
 * Check if number is even
 */
export function isEven(value: number): boolean {
    return value % 2 === 0;
}

/**
 * Check if number is odd
 */
export function isOdd(value: number): boolean {
    return value % 2 !== 0;
}

/**
 * Sign of number (-1, 0, or 1)
 */
export function sign(value: number): number {
    return Math.sign(value);
}

/**
 * Absolute value
 */
export function abs(value: number): number {
    return Math.abs(value);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    // Basic
    clamp,
    lerp,
    inverseLerp,
    map,

    // Rounding
    roundTo,
    floorTo,
    ceilTo,
    precision,

    // Random
    random,
    randomInt,
    randomBool,
    randomItem,

    // Range
    inRange,
    min,
    max,

    // Statistics
    average,
    sum,
    median,

    // Percentage
    percentage,
    fromPercentage,

    // Geometry
    distance,
    angle,

    // Conversion
    toRadians,
    toDegrees,

    // Special
    isEven,
    isOdd,
    sign,
    abs
};
