import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { fontsPreloadPlugin } from "./build/fonts-preload.plugin";

export default defineConfig({
  plugins: [vue(), tailwindcss(), fontsPreloadPlugin()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: { port: 5173, host: true },
  test: { environment: "jsdom", globals: true, include: ["src/**/*.test.ts"], setupFiles: ["./src/test/setup.ts"] },
});
