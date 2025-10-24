import path from "path" // <-- THÊM DÒNG NÀY
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: { // <-- THÊM TOÀN BỘ KHỐI NÀY
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})