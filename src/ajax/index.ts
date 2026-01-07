/**
 * AJAX Module
 * Modern fetch-based HTTP utilities
 *
 * @module ajax
 * @example
 * import { ajax, get, post, json } from 'domutils/ajax';
 *
 * const data = await json('/api/users');
 * await post('/api/save', { name: 'John' });
 */

// ============================================================================
// TYPES
// ============================================================================

export interface AjaxOptions {
    url: string;
    method?: string;
    data?: any;
    headers?: Record<string, string>;
    responseType?: "text" | "json" | "blob" | "arrayBuffer" | "formData";
    timeout?: number;
    credentials?: RequestCredentials;
}

export interface AjaxError extends Error {
    status?: number;
    response?: Response;
}

// ============================================================================
// AJAX
// ============================================================================

/**
 * Main AJAX function using fetch API
 *
 * @example
 * const data = await ajax({
 *   url: '/api/users',
 *   method: 'POST',
 *   data: { name: 'John' },
 *   responseType: 'json'
 * });
 */
export async function ajax<T = any>(options: AjaxOptions): Promise<T> {
    const {
        url,
        method = "GET",
        data = null,
        headers = {},
        responseType = "text",
        timeout = 0,
        credentials = "same-origin"
    } = options;

    if (!url) throw new Error("ajax: url is required");

    const fetchOptions: RequestInit = {
        method,
        headers: { ...(headers || {}) },
        credentials
    };

    // Body handling (skip body for GET/HEAD)
    const upperMethod = String(method || "GET").toUpperCase();
    if (data !== null && upperMethod !== "GET" && upperMethod !== "HEAD") {
        if (data instanceof FormData) {
            fetchOptions.body = data;
        } else if (
            typeof data === "object" &&
            !(data instanceof Blob) &&
            !(data instanceof ArrayBuffer)
        ) {
            fetchOptions.body = JSON.stringify(data);
            (fetchOptions.headers as Record<string, string>)["Content-Type"] =
                (fetchOptions.headers as Record<string, string>)[
                    "Content-Type"
                ] || "application/json";
        } else {
            fetchOptions.body = data;
        }
    }

    const controller = new AbortController();
    fetchOptions.signal = controller.signal;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    if (timeout > 0) {
        timeoutId = setTimeout(() => controller.abort(), timeout);
    }

    let res: Response;
    try {
        res = await fetch(url, fetchOptions);
    } catch (err: any) {
        if (err?.name === "AbortError") {
            throw new Error("ajax: request aborted (timeout or cancelled)");
        }
        throw err;
    } finally {
        if (timeoutId != null) clearTimeout(timeoutId);
    }

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        const msg = `HTTP Error ${res.status}${text ? `: ${text}` : ""}`;
        const err: AjaxError = new Error(msg);
        err.status = res.status;
        err.response = res;
        throw err;
    }

    const rt = String(responseType || "text").toLowerCase();
    switch (rt) {
        case "json":
            return res.json();
        case "blob":
            return res.blob() as any;
        case "formdata":
            return res.formData() as any;
        case "arraybuffer":
            return res.arrayBuffer() as any;
        default:
            return res.text() as any;
    }
}

// ============================================================================
// CONVENIENCE HELPERS
// ============================================================================

/**
 * GET request
 *
 * @example
 * const html = await get('/page.html');
 * const data = await get('/api/users', 'json');
 */
export const get = <T = any>(
    url: string,
    responseType: "text" | "json" = "text",
    opts: Partial<AjaxOptions> = {}
): Promise<T> => ajax({ ...opts, url, method: "GET", responseType });

/**
 * GET JSON request
 *
 * @example
 * const users = await json('/api/users');
 */
export const json = <T = any>(
    url: string,
    opts: Partial<AjaxOptions> = {}
): Promise<T> => ajax({ ...opts, url, method: "GET", responseType: "json" });

/**
 * POST request
 *
 * @example
 * await post('/api/save', { name: 'John' }, 'json');
 */
export const post = <T = any>(
    url: string,
    data: any = null,
    responseType: "text" | "json" = "text",
    opts: Partial<AjaxOptions> = {}
): Promise<T> => ajax({ ...opts, url, method: "POST", data, responseType });

/**
 * PUT request
 *
 * @example
 * await put('/api/users/1', { name: 'Jane' }, 'json');
 */
export const put = <T = any>(
    url: string,
    data: any = null,
    responseType: "text" | "json" = "text",
    opts: Partial<AjaxOptions> = {}
): Promise<T> => ajax({ ...opts, url, method: "PUT", data, responseType });

/**
 * DELETE request
 *
 * @example
 * await del('/api/users/1');
 */
export const del = <T = any>(
    url: string,
    responseType: "text" | "json" = "text",
    opts: Partial<AjaxOptions> = {}
): Promise<T> => ajax({ ...opts, url, method: "DELETE", responseType });

// ============================================================================
// LOAD & SCRIPT
// ============================================================================

/**
 * Load HTML into an element
 *
 * @example
 * await load('/partial.html', document.querySelector('#content'));
 */
export const load = async (
    url: string,
    element: Element,
    opts: Partial<AjaxOptions> = {}
): Promise<string> => {
    if (!element) throw new Error("ajax.load: element not provided");
    const html = await get<string>(url, "text", opts);
    element.innerHTML = html;
    return html;
};

/**
 * Load external script dynamically
 *
 * @example
 * await script('https://cdn.example.com/lib.js');
 */
export const script = (
    url: string,
    opts: { attrs?: Record<string, string> } = {}
): Promise<HTMLScriptElement> => {
    return new Promise((resolve, reject) => {
        if (!url) return reject(new Error("script: url required"));

        const s = document.createElement("script");
        s.src = url;
        s.async = true;

        const cleanup = () => {
            s.onload = s.onerror = null;
        };

        s.onload = () => {
            cleanup();
            resolve(s);
        };

        s.onerror = () => {
            cleanup();
            reject(new Error(`script load error: ${url}`));
        };

        if (opts.attrs && typeof opts.attrs === "object") {
            Object.entries(opts.attrs).forEach(([k, v]) =>
                s.setAttribute(k, v)
            );
        }

        document.head.appendChild(s);
    });
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
    ajax,
    get,
    json,
    post,
    put,
    del,
    load,
    script
};
