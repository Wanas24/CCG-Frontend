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
        find: "@/modules",
        replacement: path.resolve(rootDir, "src/modules"),
      },
      {
        find: "@/lib",
        replacement: path.resolve(rootDir, "src/lib"),
      },
      {
        find: "@/shared",
        replacement: path.resolve(rootDir, "src/shared"),
      },
      {
        find: "@/router",
        replacement: path.resolve(rootDir, "src/router"),
      },
      {
        find: "@/layouts",
        replacement: path.resolve(rootDir, "src/layouts"),
      },
      {
        find: "@/services",
        replacement: path.resolve(rootDir, "src/services"),
      },
      {
        find: "@/i18n",
        replacement: path.resolve(rootDir, "src/i18n"),
      },
      {
        find: "@/AntdTheme",
        replacement: path.resolve(rootDir, "src/AntdTheme"),
      },
      {
        find: "@/providers",
        replacement: path.resolve(rootDir, "src/providers"),
      },
      {
        find: "@/assets",
        replacement: path.resolve(rootDir, "src/assets"),
      },
      {
        find: "@",
        replacement: path.resolve(rootDir, "src"),
      },
    ],
  },
});
