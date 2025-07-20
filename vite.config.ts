import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
// import removeConsole from "vite-plugin-remove-console";

// eslint-disable-next-line import/no-default-export
export default defineConfig(({ mode }) => {
  const isBuild = mode === "production";

  console.log(path.resolve());

  return {
    server: {
      port: 1000,
      host: "0.0.0.0",
    },
    define: {
      __USE_MOCKS__: JSON.stringify(!isBuild),
      __APP_TARGET__: JSON.stringify(process.env.APP_TARGET || "base"),
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
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
    },
  };
});
