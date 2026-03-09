/**
 * Vitest setup: jest-dom matchers and RTL cleanup.
 * Referenced in vite.config.ts test.setupFiles.
 */
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});
