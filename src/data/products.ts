import { getCollection, type CollectionEntry } from "astro:content";

type ProductEntry = CollectionEntry<"products">;
export type Product = ProductEntry["data"] & { slug: string; entry: ProductEntry };

function slugFromEntry(entry: ProductEntry): string {
  return entry.id.replace(/\.(md|mdx)$/, "");
}

function byOrderThenName(a: Product, b: Product): number {
  return a.order - b.order || a.name.localeCompare(b.name);
}

export async function getProducts(): Promise<Product[]> {
  const entries = await getCollection("products", ({ data }) => data.published);
  return entries
    .map((entry: ProductEntry) => ({
      slug: slugFromEntry(entry),
      entry,
      ...entry.data,
    }))
    .sort(byOrderThenName);
}

export function getRelated(products: Product[], slug: string, limit = 3): Product[] {
  const current = products.find((product) => product.slug === slug);
  if (!current) return products.slice(0, limit);

  return products
    .filter((product) => product.slug !== slug)
    .sort((a, b) => {
      const aScore = a.category === current.category ? -1 : 1;
      const bScore = b.category === current.category ? -1 : 1;
      return aScore - bScore || byOrderThenName(a, b);
    })
    .slice(0, limit);
}

export function getProductFilters(products: Product[]): {
  categories: string[];
} {
  return {
    categories: [...new Set(products.map((product) => product.category))],
  };
}

/** Keep unverified values in content, but do not present them as specifications. */
export function confirmedValue(value: string | undefined): string | undefined {
  return value && value.trim().toLowerCase() !== "to be confirmed" ? value : undefined;
}
