import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

declare const process: { env: { GITHUB_PAGES?: string } };

const isGitHubPages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  site: "https://www.estnaktoursandtravel.com",
  base: isGitHubPages ? "/estnak-tours-and-travel-site/" : "/",
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
