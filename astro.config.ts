import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://www.estnaktoursandtravel.com",
  output: "static",
  trailingSlash: "never",
  integrations: [],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    format: "file",
  },
});
