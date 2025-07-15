import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
// import removeConsole from "vite-plugin-remove-console";

export default defineConfig(({ mode }) => {
  const isBuild = mode === "production";

  return {
    server: {
      port: 3001,
      host: "0.0.0.0",
    },
    define: {
      __USE_MOCKS__: JSON.stringify(!isBuild),
    },
    base: isBuild ? "/static/" : "/",
    build: {
      assetsDir: isBuild ? "" : undefined,
      assetsInlineLimit: 0,
    },
    plugins: [
      react(),
      svgr({
        include: "**/*.svg?react",
        exclude: "",
      }),
      // removeConsole({})
    ],
  };
});
