import js from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";

export default tseslint.config(
  { ignores: ["**/*.test.ts", "**/*.test.tsx", "scripts/**", "**/node_modules/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    plugins: { import: importPlugin },
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        console: "readonly",
        fetch: "readonly",
        btoa: "readonly",
        atob: "readonly",
        escape: "readonly",
        unescape: "readonly",
        NodeJS: "readonly",
      },
    },
    rules: {
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "never",
          alphabetize: { order: "asc", caseInsensitive: true },
          pathGroups: [
            { pattern: "react", group: "external", position: "before" },
            { pattern: "@/**", group: "internal" },
          ],
          pathGroupsExcludedImportTypes: ["react"],
        },
      ],
      "import/no-cycle": ["warn", { maxDepth: 2 }],
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  // Feature boundaries: reducers must not depend on UI layers
  {
    files: ["src/state/reducers/**/*.ts", "src/state/migrations/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "warn",
        {
          patterns: [
            { group: ["**/container/**", "**/container"], message: "Reducers/migrations should not import from container." },
            { group: ["**/components/**", "**/components"], message: "Reducers/migrations should not import from components." },
          ],
        },
      ],
    },
  },
);
