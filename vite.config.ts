import { defineConfig } from "vite";
import { miaodaDevPlugin } from "miaoda-sc-plugin";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
// Resolve to the package root directory (not index.js) so that sub-path imports
// like `react/jsx-runtime` and `react-dom/client` continue to resolve correctly
// while still forcing every importer to share the exact same React instance.
const reactRoot    = path.dirname(require.resolve("react/package.json"));
const reactDomRoot = path.dirname(require.resolve("react-dom/package.json"));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    miaodaDevPlugin(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Pin every `import … from 'react'` / `import … from 'react-dom'` to the
      // same physical package so no second React instance can sneak in via deps.
      "react":     reactRoot,
      "react-dom": reactDomRoot,
    },
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
});
