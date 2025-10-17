import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import { defineConfig, splitVendorChunkPlugin } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    svgr(),
    splitVendorChunkPlugin(),
    nodePolyfills({
      globals: {
        Buffer: true,
        process: true,
      },
      include: ["events"],
    }),
  ],
  // server: {
  //   port: 3000,
  //   allowedHosts: ['dodo-regular-alpaca.ngrok-free.app']
  // },
  build: {
    chunkSizeWarningLimit: 400,
    cssMinify: true,
    sourcemap: false,
    
    minify: "esbuild",
    outDir: "build",
  },
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
});
