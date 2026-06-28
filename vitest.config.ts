import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

process.env.SKIP_ENV_VALIDATION ??= "true";
process.env.DATABASE_URL ??=
  "postgresql://postgres:password@localhost:5432/pkbl_test";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~": path.resolve(import.meta.dirname, "./src"),
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    environmentMatchGlobs: [["src/**/*.test.tsx", "jsdom"]],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    setupFiles: ["src/test/setup.ts"],
    env: {
      SKIP_ENV_VALIDATION: "true",
    },
    coverage: {
      provider: "v8",
      include: ["src/lib/**/*.ts"],
      exclude: ["src/lib/**/__tests__/**", "src/lib/**/*.test.ts"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
