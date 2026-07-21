import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target:       "http://localhost:4000",
        changeOrigin: true,
        secure:       false,
      },
    },
  },
  build: {
    // Raise the warning threshold slightly — we know about the size
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core — tiny, always needed
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom") || id.includes("node_modules/scheduler")) {
            return "vendor-react";
          }
          // simple-icons is huge (~2 MB unminified) — isolate it
          if (id.includes("@icons-pack/react-simple-icons") || id.includes("simple-icons")) {
            return "vendor-icons";
          }
          // lucide-react — tree-shakeable but still sizeable
          if (id.includes("lucide-react")) {
            return "vendor-lucide";
          }
          // any-ascii
          if (id.includes("any-ascii")) {
            return "vendor-any-ascii";
          }
        },
      },
    },
  },
});
