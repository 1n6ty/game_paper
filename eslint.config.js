import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tsplugin from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: {
      react: { version: "18.3" },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      // Базовые правила ESLint + React
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react-hooks/rules-of-hooks": "error", // проверка правильного использования React Hooks
      "react-hooks/exhaustive-deps": "warn",   // проверка зависимостей эффекта

      "no-unused-vars": ["warn", {
        vars: "all",          // Проверять все переменные
        args: "after-used",   // Проверять аргументы после их использования
        ignoreRestSiblings: true  // Игнорировать неиспользуемые остаточные свойства (...rest)
      }],

      "max-len": [
        "error",
        {
          code: 200,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      "brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "arrow-parens": ["error", "as-needed"],
      indent: ["error", 2],
      semi: ["error", "always"],
      quotes: [
        "error",
        "double",
        {
          avoidEscape: true,
          allowTemplateLiterals: true,
        },
      ],
      "quote-props": ["error", "as-needed"],
      "jsx-quotes": ["error", "prefer-double"],
      "comma-dangle": ["error", "only-multiline"],
      "linebreak-style": "off",

      // Доп. правила для Google Style
      "object-curly-spacing": ["error", "always"],
      "space-before-function-paren": ["error", "never"],

      // Пустые строки после блоков (по вашему запросу)
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "block-like", next: "*" },
        { blankLine: "always", prev: "function", next: "*" }
      ],

      // Кастомные правила React (из вашего конфига)
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: parser,
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: process.cwd(),
        ecmaVersion: "latest",
        sourceType: "module"
      }
    },
    plugins: {
      "@typescript-eslint": tsplugin
    },
    rules: {
      ...tsplugin.configs.recommended.rules,

      // Заменители JS-правил от @typescript-eslint
      "no-unused-vars": "off",
      "@/no-unused-vars": ["warn", {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: true
      }],

      "brace-style": "off",
      "@/brace-style": ["error", "1tbs", { allowSingleLine: true }],

      quotes: "off",
      "@/quotes": ["error", "double", {
        avoidEscape: true,
        allowTemplateLiterals: true,
      }],

      semi: "off",
      // "@/semi": ["error", "always"],

      indent: "off",
      "@/indent": ["error", 2],

      "max-len": ["error", {
        code: 200,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      }],
      "arrow-parens": ["error", "as-needed"],
      "quote-props": ["error", "as-needed"],
      "jsx-quotes": ["error", "prefer-double"],
      "comma-dangle": ["error", "only-multiline"],
      "linebreak-style": "off",
      "object-curly-spacing": ["error", "always"],
      "space-before-function-paren": ["error", "never"],
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "block-like", next: "*" },
        { blankLine: "always", prev: "function", next: "*" },
      ],
    },
  },
];
