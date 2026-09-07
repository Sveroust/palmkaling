import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Sumber pihak ketiga dari ThreeUI. Sengaja TIDAK di-lint: berkasnya
    // harus tetap byte-exact dengan bundle resmi (SHA-256 tercatat di
    // DISKUSI-DAN-KEPUTUSAN.md), jadi tidak boleh diedit untuk menyenangkan
    // aturan lint kita sendiri.
    "src/shaders/**",
  ]),
]);

export default eslintConfig;
