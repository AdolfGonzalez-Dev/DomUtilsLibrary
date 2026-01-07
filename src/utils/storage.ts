/**
 * DOMUtils Storage Utilities
 * LocalStorage and SessionStorage helpers with JSON support
 *
 * @module utils/storage
 * @example
 * import { getStorage, setStorage, watchStorage } from 'domutils/storage';
 *
 * setStorage('user', { name: 'John', id: 1 });
 * const user = getStorage('user');
 *
 * watchStorage('user', (newUser, oldUser) => {
 *   console.log('User changed:', newUser);
 * });
 */

// ============================================================================
// TYPES
// ============================================================================

export interface StorageOptions {
    type?: "local" | "session";
    default?: any;
    prefix?: string;
}

export interface StorageSize {
    bytes: number;
    kilobytes: number;
    percentage: number;
    available: number;
}

type StorageType = "local" | "session";

// ============================================================================
// HELPERS
// ============================================================================

function getStorageInstance(type: StorageType): Storage {
    return type === "local" ? localStorage : sessionStorage;
}

// ============================================================================
// GET STORAGE
// ============================================================================

/**
 * Get value from storage with JSON parsing
 */
export function getStorage<T = any>(
    key: string,
    options: StorageOptions = {}
): T | null {
    const { type = "local", default: defaultValue = null } = options;

    if (!key) throw new Error("Storage key is required");

    try {
        const storage = getStorageInstance(type);
        const item = storage.getItem(key);

        if (item === null) return defaultValue as T | null;

        try {
            return JSON.parse(item) as T;
        } catch {
            // If JSON parse fails, return raw value
            return item as any;
        }
    } catch (err) {
        console.error(`Storage get error for key "${key}":`, err);
        return defaultValue as T | null;
    }
}

// ============================================================================
// SET STORAGE
// ============================================================================

/**
 * Set value in storage with JSON serialization
 */
export function setStorage(
    key: string,
    value: any,
    options: StorageOptions = {}
): boolean {
    const { type = "local" } = options;

    if (!key) throw new Error("Storage key is required");

    try {
        const storage = getStorageInstance(type);
        const serialized =
            typeof value === "string" ? value : JSON.stringify(value);
        storage.setItem(key, serialized);
        return true;
    } catch (err) {
        console.error(`Storage set error for key "${key}":`, err);
        return false;
    }
}

// ============================================================================
// REMOVE STORAGE
// ============================================================================

/**
 * Remove item from storage
 */
export function removeStorage(
    key: string,
    options: StorageOptions = {}
): boolean {
    const { type = "local" } = options;

    if (!key) throw new Error("Storage key is required");

    try {
        const storage = getStorageInstance(type);
        storage.removeItem(key);
        return true;
    } catch (err) {
        console.error(`Storage remove error for key "${key}":`, err);
        return false;
    }
}

// ============================================================================
// CLEAR STORAGE
// ============================================================================

/**
 * Clear all storage or by prefix
 */
export function clearStorage(options: StorageOptions = {}): boolean {
    const { type = "local", prefix = null } = options;

    try {
        const storage = getStorageInstance(type);

        if (prefix) {
            // Clear only keys with prefix
            const keys = Object.keys(storage);
            keys.forEach(key => {
                if (key.startsWith(prefix)) {
                    storage.removeItem(key);
                }
            });
        } else {
            // Clear all
            storage.clear();
        }

        return true;
    } catch (err) {
        console.error("Storage clear error:", err);
        return false;
    }
}

// ============================================================================
// HAS STORAGE
// ============================================================================

/**
 * Check if key exists in storage
 */
export function hasStorage(key: string, options: StorageOptions = {}): boolean {
    const { type = "local" } = options;

    if (!key) return false;

    try {
        const storage = getStorageInstance(type);
        return storage.getItem(key) !== null;
    } catch (err) {
        console.error(`Storage has error for key "${key}":`, err);
        return false;
    }
}

// ============================================================================
// GET ALL STORAGE
// ============================================================================

/**
 * Get all items from storage as object
 */
export function getAllStorage(
    options: StorageOptions = {}
): Record<string, any> {
    const { type = "local", prefix = null } = options;

    try {
        const storage = getStorageInstance(type);
        const result: Record<string, any> = {};

        for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            if (!key) continue;

            if (prefix && !key.startsWith(prefix)) continue;

            const item = storage.getItem(key);
            if (item === null) continue;

            try {
                result[key] = JSON.parse(item);
            } catch {
                result[key] = item;
            }
        }

        return result;
    } catch (err) {
        console.error("Storage getAll error:", err);
        return {};
    }
}

// ============================================================================
// WATCH STORAGE
// ============================================================================

/**
 * Watch storage for changes (internal changes, not cross-tab)
 */
export function watchStorage(
    key: string,
    callback: (newValue: any, oldValue: any) => void,
    options: StorageOptions = {}
): () => void {
    if (typeof callback !== "function") {
        throw new Error("Callback must be a function");
    }

    const { type = "local" } = options;
    let lastValue = getStorage(key, { type });

    // Check for changes periodically
    const interval = setInterval(() => {
        const newValue = getStorage(key, { type });
        if (newValue !== lastValue) {
            try {
                callback(newValue, lastValue);
            } catch (err) {
                console.error("Watch callback error:", err);
            }
            lastValue = newValue;
        }
    }, 100);

    // Return unwatch function
    return () => clearInterval(interval);
}

// ============================================================================
// ON STORAGE CHANGE
// ============================================================================

/**
 * Watch storage for cross-tab changes (uses storage event)
 */
export function onStorageChange(
    key: string | null,
    callback: (event: StorageEvent) => void,
    options: StorageOptions = {}
): () => void {
    if (typeof callback !== "function") {
        throw new Error("Callback must be a function");
    }

    const { type = "local" } = options;

    const handler = (e: StorageEvent) => {
        // Only trigger for correct storage type
        if (e.storageArea !== getStorageInstance(type)) {
            return;
        }

        // Trigger if key matches (or null means all)
        if (key === null || e.key === key) {
            try {
                callback(e);
            } catch (err) {
                console.error("Storage change callback error:", err);
            }
        }
    };

    window.addEventListener("storage", handler);

    // Return unwatch function
    return () => {
        window.removeEventListener("storage", handler);
    };
}

// ============================================================================
// STORAGE WITH EXPIRATION
// ============================================================================

interface StorageWithExpiration<T> {
    value: T;
    expiration: number;
}

/**
 * Set storage item with expiration
 */
export function setStorageWithExpiration(
    key: string,
    value: any,
    ttl: number,
    options: StorageOptions = {}
): boolean {
    const { type = "local" } = options;

    if (!key) throw new Error("Storage key is required");
    if (ttl <= 0) throw new Error("TTL must be greater than 0");

    try {
        const data: StorageWithExpiration<any> = {
            value,
            expiration: Date.now() + ttl
        };

        return setStorage(key, data, { type });
    } catch (err) {
        console.error(`Storage setWithExpiration error for key "${key}":`, err);
        return false;
    }
}

/**
 * Get storage item with expiration check
 */
export function getStorageWithExpiration<T = any>(
    key: string,
    options: StorageOptions = {}
): T | null {
    const { type = "local", default: defaultValue = null } = options;

    try {
        const data = getStorage<StorageWithExpiration<T>>(key, { type });

        if (!data || typeof data !== "object" || !("expiration" in data)) {
            return data as any; // Not an expiring item
        }

        if (Date.now() > data.expiration) {
            // Expired
            removeStorage(key, { type });
            return defaultValue as T | null;
        }

        // Not expired
        return data.value;
    } catch (err) {
        console.error(`Storage getWithExpiration error for key "${key}":`, err);
        return defaultValue as T | null;
    }
}

// ============================================================================
// GET STORAGE SIZE
// ============================================================================

/**
 * Get storage size (rough estimate)
 */
export function getStorageSize(options: StorageOptions = {}): StorageSize {
    const { type = "local" } = options;

    try {
        const storage = getStorageInstance(type);
        let bytes = 0;

        for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            if (!key) continue;

            const item = storage.getItem(key);
            if (item === null) continue;

            bytes += key.length + item.length;
        }

        const kilobytes = parseFloat((bytes / 1024).toFixed(2));
        const maxSize = 5120; // 5MB typical limit
        const percentage = parseFloat(
            ((bytes / (maxSize * 1024)) * 100).toFixed(2)
        );

        return {
            bytes,
            kilobytes,
            percentage,
            available: maxSize - kilobytes
        };
    } catch (err) {
        console.error("Storage size error:", err);
        return { bytes: 0, kilobytes: 0, percentage: 0, available: 0 };
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    getStorage,
    setStorage,
    removeStorage,
    clearStorage,
    hasStorage,
    getAllStorage,
    watchStorage,
    onStorageChange,
    setStorageWithExpiration,
    getStorageWithExpiration,
    getStorageSize
};
