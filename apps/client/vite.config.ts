import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    target: "es2022",
  },
  define: {
    DEV: process.env.DEV,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "~": "/src",
    },
  },
});
