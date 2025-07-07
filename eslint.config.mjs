// eslint.config.mjs
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier"; // <-- 1. Импортируем конфиг Prettier

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { js }, extends: ["js/recommended"] },
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    rules: {
      // --- ПРАВИЛА, КОТОРЫЕ ОСТАЮТСЯ В ESLINT (логика, а не стиль) ---
      "no-unused-vars": ["warn", {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: true
      }],
      "linebreak-style": "off",

      // Доп. правила для Google Style (не конфликтующие с Prettier)
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "block-like", next: "*" },
        { blankLine: "always", prev: "function", next: "*" }
      ],
    } 
  },
  // --- ПРАВИЛА ФОРМАТИРОВАНИЯ, КОТОРЫЕ МЫ УДАЛИЛИ ---
  // "max-len"
  // "brace-style"
  // "arrow-parens"
  // "indent"
  // "semi"
  // "quotes"
  // "quote-props"
  // "jsx-quotes"
  // "comma-dangle"
  // "object-curly-spacing"
  // "space-before-function-paren"

  // tseslint.configs.recommended,
  eslintConfigPrettier, // <-- 2. Добавляем конфиг Prettier. Он должен быть последним, чтобы переопределить все!
]);