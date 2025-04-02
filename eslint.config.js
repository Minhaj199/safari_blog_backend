import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      parser: tseslint.parser, // Add TypeScript parser
      globals: globals.node, // Use Node.js globals instead of browser
    },
    plugins: {
      js,
      "@typescript-eslint": tseslint.plugin, 
    },
    rules: {
      ...js.configs.recommended.rules, 
      ...tseslint.configs.recommended.rules, 
      "@typescript-eslint/no-unused-vars": "warn", 
      "no-console": "warn",
    },
  },
]);
