import path from "node:path";
import { fileURLToPath } from "node:url";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  resolve: {
    alias: [
      {
        find: "@/UI_Components",
        replacement: path.resolve(rootDir, "src/shared/ANTD_UIComponents"),
      },
      {
        find: "@/UIComponents",
        replacement: path.resolve(rootDir, "src/shared/ANTD_UIComponents"),
      },
      {
        find: "@",
        replacement: path.resolve(rootDir, "src"),
      },
    ],
  },
});
