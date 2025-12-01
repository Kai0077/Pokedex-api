import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends("eslint:recommended"),
  ...tseslint.configs.recommended,
  prettier,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.browser,
      },

      ecmaVersion: "latest",
    },

    // These are only some of the most useful ESLint rules
    rules: {
      semi: ["error", "always"], // Forces the use of a semicolon at the end of each statement
      strict: ["error", "global"], // Forces the use of 'use strict';
      "no-var": "error", // Prevents declaring variables with var
      "prefer-const": "error", // Forces variables whose value is not reassigned to be declared with const
      camelcase: "error", // Forces camelcase and prevents the use of the dash or underscore
      "no-unused-vars": "error", // Prevents the declaration of unused variables
      quotes: ["error", "double", { avoidEscape: true }], // Forces the use of double quotes for strings
      "no-array-constructor": "error", // Forces the declaration of arrays with bracket notation
      "no-new-object": "error", // Prevents the declaration of generic objects with new Object();
      eqeqeq: "error", // Forces the use of === over ==
      yoda: "error", // Expects variables to be compared with values, and not the other way around
      "no-unneeded-ternary": "error", // Prevents the ternary operator from redundantly assigning true and false
      "no-nested-ternary": "error", // Prevents nesting ternary operator expressions
      "no-dupe-keys": "error", // Prevents the use of duplicate keys in object literals
      "space-infix-ops": "error", // Forces spaces around operators
      "no-console": "warn", // Prevents the use of the console
      "for-direction": "error", // Prevents moving a for index in the wrong direction
      "no-dupe-else-if": "error", // Prevents an else if to duplicate a previously existing condition
      "no-duplicate-case": "error", // Prevents a switch to duplicate a previously existing condition
      "no-empty": "warn", // Forbids empty code blocks under if, else, for, while, or do while
      "no-sparse-arrays": "warn", // Forbids the existence of empty values in array declarations
      "no-template-curly-in-string": "error", // Prevents template literals in regular strings (without backticks)
      "no-cond-assign": "warn", // Prevents assignments in conditions (although maybe that is desired)
      "no-constant-condition": "warn", // Forbids constant conditions (e.g., if (true), or if (1 === 1))
      "valid-typeof": "error", // Prevents using an incorrect data type in typeof
      "brace-style": "error", // Forces opening curly braces to be in the control line that starts them
      "no-useless-escape": "off", // Turns off the rule that prevents unnecessary escape characters
    },
  },
  {
    files: ["test/**/*.{ts,js}"],
    rules: {
      camelcase: "off",
    },
  },
];
