import { defineConfig } from "eslint/config"
import react from "eslint-plugin-react"
import typescriptEslint from "@typescript-eslint/eslint-plugin"
import prettier from "eslint-plugin-prettier"
import globals from "globals"
import tsParser from "@typescript-eslint/parser"
import path from "node:path"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"
import importPlugin from "eslint-plugin-import"
import unusedImports from "eslint-plugin-unused-imports"

const currentFilename = fileURLToPath(import.meta.url)
const currentDirname = path.dirname(currentFilename)
const compat = new FlatCompat({
  baseDirectory: currentDirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default defineConfig([
  {
    files: ["**/*.ts", "**/*.tsx"],
    extends: compat.extends(
      "plugin:react/recommended",
      "plugin:@next/next/recommended",
      "airbnb",
      "prettier",
    ),

    plugins: {
      react,
      "@typescript-eslint": typescriptEslint,
      prettier,
      import: importPlugin,
      "unused-imports": unusedImports,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "space-before-function-paren": "off",
      "max-len": "off",
      "class-methods-use-this": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-filename-extension": "off",
      "react/jsx-props-no-spreading": "off",
      "react/function-component-definition": [
        "error",
        {
          namedComponents: ["arrow-function", "function-declaration"],
          unnamedComponents: "arrow-function",
        },
      ],
      "react/require-default-props": "off",
      "react/button-has-type": "off",
      "import/prefer-default-export": "off",
      "import/no-unresolved": "off",
      "import/extensions": "off",
      "no-unused-vars": "off",
      "prettier/prettier": [
        "warn",
        {
          singleQuote: false,
          semi: false,
          trailingComma: "all",
          endOfLine: "auto",
        },
      ],
    },
  },
])
