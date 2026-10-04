import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
export default defineConfig({
  plugins: [react()],
  server: { host: "0.0.0.0", port: 4173, allowedHosts: ["terminal.local"] },
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        [
          "index",
          "login",
          "register",
          "dashboard",
          "opportunities",
          "products",
          "expenses",
          "data-hub",
          "meeting",
        ].map((name) => [name, resolve(import.meta.dirname, name + ".html")]),
      ),
    },
  },
});
