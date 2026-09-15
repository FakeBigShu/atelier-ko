import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const products = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/products" }),
  schema: ({ image }) => {
    // Prepared assets are imported for metadata only, never re-encoded.
    const productImage = z.object({
      src: image(),
      alt: z.string(),
      variants: z.array(image()).min(1),
      thumbnail: image().optional(),
    });
    return z.object({
      sku: z.string().regex(/^[A-Z]{2}-\d{4}$/),
      name: z.string(),
      category: z.string(),
      subcategory: z.string().optional(),
      material: z.string().optional(),
      shortDescription: z.string(),
      dimensions: z.string().optional(),
      finish: z.string().optional(),
      application: z.string().optional(),
      customizable: z.union([z.boolean(), z.literal("To be confirmed")]).optional(),
      verificationStatus: z.string(),
      launchStatus: z.string(),
      featured: z.boolean().default(false),
      published: z.boolean().default(true),
      catalogueImage: productImage.optional(),
      images: z.array(productImage).default([]),
      order: z.number().int().nonnegative().default(999),
    }).superRefine((product, ctx) => {
      if (product.published && (!product.catalogueImage || product.images.length === 0)) {
        ctx.addIssue({ code: "custom", message: "Published products require catalogue and gallery images." });
      }
    });
  },
});

export const collections = { products };
