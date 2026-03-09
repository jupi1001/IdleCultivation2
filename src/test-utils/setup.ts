/**
 * Vitest setup: jest-dom matchers and RTL cleanup.
 * Referenced in vite.config.ts test.setupFiles.
 */
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
