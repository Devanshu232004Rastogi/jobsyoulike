import { FlatCompat } from "@eslint/eslintrc";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

const compat = new FlatCompat({
  // For Node.js versions before v20.11.0, replace with your directory path
  baseDirectory: import.meta.dirname || ".",
});

const eslintConfig = [
  // Add TypeScript support
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": typescript,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // Disable rules that are causing too many warnings
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          // Add this to be more lenient with unused variables
          ignoreRestSiblings: true,
          caughtErrors: "none",
        },
      ],
      "@typescript-eslint/no-unused-expressions": "off", // Turn off if these are intentional
      "@typescript-eslint/no-this-alias": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      // Turn off React rules if needed
      "react/no-unescaped-entities": "off",
    },
  },

  // For lib/generated files - disable most rules
  {
    files: ["lib/generated/**/*"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  // Next.js core rules through compatibility layer
  ...compat.config({
    extends: ["next/core-web-vitals"],
  }),

  {
    // Explicitly ignore generated files
    ignores: ["lib/generated/**/*"],
  },
];

export default eslintConfig;
