import { defineConfig } from "tsup";

export default defineConfig({
    // Entry points principales
    entry: {
        index: "src/index.ts",
        dom: "src/dom/index.ts",
        events: "src/events/index.ts",
        traverse: "src/traverse/index.ts",
        content: "src/content/index.ts",
        create: "src/create/index.ts",
        form: "src/form/index.ts",
        reactive: "src/reactive/signals.ts",
        gestures: "src/gestures/index.ts",
        observers: "src/observers/index.ts",
        storage: "src/utils/storage.ts",
        utils: "src/utils/utils.ts",
        ajax: "src/ajax/index.ts",
        animations: "src/animations/index.ts",
        components: "src/components/index.ts"
    },

    // Output
    outDir: "dist",
    format: ["esm"],

    // Build options
    clean: true,
    dts: false, // Disable DTS generation in tsup, use tsc instead
    sourcemap: true,
    minify: false,

    // ES target
    target: "es2020",

    // Tree shaking
    splitting: false,
    bundle: false,
    treeshake: true,

    // Global name for UMD (si se necesita)
    globalName: "DOMUtils",

    // External dependencies (ninguna por ahora)
    external: [],

    // No incluir node_modules
    noExternal: [],

    // Skip node resolution
    skipNodeModulesBundle: true,

    // Platform
    platform: "browser",

    // Optimize for memory usage
    esbuildOptions(options) {
        options.logLevel = "error";
    }
});
