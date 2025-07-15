import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import importPlugin from "eslint-plugin-import";

export default tseslint.config(
  {
    ignores: ["dist/", "node_modules/"],
  },
  js.configs.recommended,
  {
    extends: [...tseslint.configs.recommended],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: true,
      },
    },
    settings: {
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],

      "import/no-default-export": "error",
      "linebreak-style": "off",
      "padding-line-between-statements": [
        "warn",
        { blankLine: "always", prev: "*", next: "return" },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        {
          blankLine: "any",
          prev: ["const", "let", "var"],
          next: ["const", "let", "var"],
        },
        { blankLine: "always", prev: ["block-like"], next: "*" },
        { blankLine: "always", prev: ["function"], next: "*" },
      ],
    },
  },
  {
    files: ["eslint.config.mjs"],
    rules: {
      "import/no-default-export": "off",
    },
  },

  eslintConfigPrettier
);
