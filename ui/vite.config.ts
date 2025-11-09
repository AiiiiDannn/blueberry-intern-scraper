// ui/vite.config.ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// Vite configuration
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  // this ensures /data/items.jsonl can be fetched from public/
  publicDir: "public",
})
