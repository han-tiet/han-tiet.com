import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      ".next/*",
      "node_modules/*",
      "next-env.d.ts"
    ]
  },
  ...compat.extends("eslint-config-next/core-web-vitals", "eslint-config-prettier/prettier", "eslint-config-next/typescript")
];


export default eslintConfig;