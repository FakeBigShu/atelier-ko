import { siteConfig } from "./src/config/site.ts";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: process.env.SITE ?? siteConfig.siteUrl,
  trailingSlash: "always",
  integrations: [sitemap()],
});
