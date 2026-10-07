import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      provider: "v8",
    },
    environment: "jsdom", // fake browser DOM for component tests
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") }, // matches your @/* alias
  },
});
