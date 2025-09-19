module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,   // 🔥 tells ESLint that Node globals like "global" are allowed
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  settings: {
    react: { version: "detect" },
  },
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "@next/next/no-img-element": "off",
    "react/react-in-jsx-scope": "off",
    "react-hooks/exhaustive-deps": "warn",
    "no-unused-vars": ["warn"],
    "react/no-unescaped-entities": "off",
  },
};