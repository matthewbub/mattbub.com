import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
/**
 * Custom markdown raw content plugin
 * @param {{ fileRegex: RegExp }} options
 */
function markdownContentPlugin(options: { fileRegex: RegExp }) {
  return {
    name: "raw-markdown",
    transform(code: string, id: string) {
      if (options.fileRegex.test(id)) {
        const json = JSON.stringify(code)
          .replace(/\u2028/g, "\\u2028")
          .replace(/\u2029/g, "\\u2029");

        return {
          code: `export default ${json}`,
        };
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    mdx({
      remarkPlugins: [remarkGfm],
    }),
    markdownContentPlugin({
      fileRegex: /\.md$/,
    }),
    react(),
  ],
  server: {
    proxy: {
      "/api": "http://localhost:8090",
    },
  },
});
