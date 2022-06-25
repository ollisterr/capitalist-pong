import { join } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: true,
  },
  resolve: {
    alias: {
      "@shared": join(__dirname, "../shared/"),
    },
  },
});
