import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
    setupFiles: ["./testcontainers-setup.ts"],
    testTimeout: 60000, // 1 min timeout
  },
});
