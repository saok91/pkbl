import path from "node:path";
import { defineConfig } from "vitest/config";

process.env.SKIP_ENV_VALIDATION ??= "true";
process.env.DATABASE_URL ??=
  "postgresql://postgres:password@localhost:5432/pkbl_test";

export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(import.meta.dirname, "./src"),
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
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
