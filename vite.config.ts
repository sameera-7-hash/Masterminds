import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5174,
    strictPort: true,
    watch: {
      // red-team01/sentinelpay is a Python backend, not part of the app - its scripts
      // rewrite CSV logs on every request, which Vite otherwise can't HMR and falls
      // back to full page reload for, wiping in-progress UI state (e.g. Red Team ->
      // Blue Team sync results) seconds after they land.
      ignored: ["**/red-team01/**"],
    },
  },
})
