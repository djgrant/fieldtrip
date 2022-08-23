import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    target: "es2022",
    outDir: "../../dist/apps/client",
  },
  define: {
    DEV: process.env.DEV,
    REACT_APP_SERVER_URL: process.env.REACT_APP_SERVER_URL,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "~": "/src",
    },
  },
});
