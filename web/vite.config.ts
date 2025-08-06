import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import { raw } from "vite-plugin-raw";

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
    raw({
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
