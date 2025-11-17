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
  // Update this to match your GitHub repository name
  // If your repo is 'my-wishlist', change to '/my-wishlist/'
  base: process.env.NODE_ENV === 'production' ? '/holiday-wishlist/' : '/',
})