import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    target: "es2022",
    outDir: "../../dist/apps/client",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "~": "/src",
    },
  },
});
