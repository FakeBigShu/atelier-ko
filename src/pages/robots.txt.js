import { siteConfig } from "../config/site";

export const GET = ({ site }) => {
  const baseUrl = site ?? new URL(siteConfig.siteUrl);

  return new Response(
    `User-agent: *
Allow: /

Sitemap: ${new URL("sitemap-index.xml", baseUrl).href}
`,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    },
  );
};