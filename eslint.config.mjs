// @ts-check
import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import react from "eslint-plugin-react"
import hooksPlugin from "eslint-plugin-react-hooks"

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "react-hooks": hooksPlugin,
    },
    rules: {
      ...hooksPlugin.configs.recommended.rules,
      "react-hooks/exhaustive-deps": "error",
      "react-hooks/rules-of-hooks": "error",
    },
    settings: { react: { version: "detect" } },
  },
  {
    plugins: {
      react: react,
    },
    rules: {
      ...react.configs.recommended.rules,
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "react/jsx-boolean-value": ["error", "always"],
      "react/jsx-curly-brace-presence": "error",
      "react/jsx-fragments": "error",
      "react/no-danger": "error",
      "react/no-render-return-value": "off", // Drops performance, no real value
      "react/prop-types": "off",
      "react/self-closing-comp": "error",
    },
  },
]
