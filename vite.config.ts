import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  resolve: {
    alias: [
      {
        find: /@\/(.+)/,
        replacement: path.resolve(__dirname, "./src/$1"),
      },
    ],
  },
  server: {
    proxy: {
      "^/api/.*": {
        target: "https://people.googleapis.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "^/authapi/.*": {
        target: "https://meow-contacts.vercel.app",
        changeOrigin: true,
        rewrite: (path) => {
          return path.replace(/^\/authapi/, "/api");
        },
      },
    },
  },
});
