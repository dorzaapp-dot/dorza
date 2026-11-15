import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // tsconfig keeps JSX as "preserve" for Next; tests that render components need it compiled.
  oxc: { jsx: { runtime: "automatic" } },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)).replace(/\/$/, "") },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
