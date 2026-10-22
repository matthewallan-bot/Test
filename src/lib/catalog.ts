import { PRODUCTS, type Product, formatMoney } from "@/data/products";
import { isDatabaseConfigured, query, withDb } from "@/lib/db";

export { formatMoney };
export type { Product };

type ProductRow = {
  slug: string;
  name: string;
  description: string | null;
  base_price_cents: number;
  currency: string;
};

type VariantRow = {
  product_slug: string;
  sku: string;
  name: string;
  price_cents: number | null;
};

function mapProducts(
  products: ProductRow[],
  variants: VariantRow[],
): Product[] {
  return products.map((p) => ({
    slug: p.slug,
    name: p.name,
    description: p.description ?? "",
    basePriceCents: p.base_price_cents,
    currency: p.currency,
    imageLabel: p.name,
    variants: variants
      .filter((v) => v.product_slug === p.slug)
      .map((v) => ({
        sku: v.sku,
        name: v.name,
        priceCents: v.price_cents ?? undefined,
      })),
  }));
}

async function loadProductsFromDb(): Promise<Product[]> {
  const products = await query<ProductRow>(
    `SELECT slug, name, description, base_price_cents, currency
     FROM products
     WHERE status = 'active' AND deleted_at IS NULL
     ORDER BY sort_order, name`,
  );
  if (products.rows.length === 0) return PRODUCTS;

  const variants = await query<VariantRow>(
    `SELECT p.slug AS product_slug, v.sku, v.name, v.price_cents
     FROM product_variants v
     JOIN products p ON p.id = v.product_id
     WHERE v.is_active = true AND p.status = 'active' AND p.deleted_at IS NULL
     ORDER BY v.sku`,
  );
  return mapProducts(products.rows, variants.rows);
}

export async function listProducts(): Promise<Product[]> {
  return withDb(loadProductsFromDb, PRODUCTS);
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  const products = await listProducts();
  return products.find((p) => p.slug === slug);
}

export async function getVariantBySku(sku: string): Promise<{
  variantId: string;
  productId: string;
  productName: string;
  variantName: string;
  sku: string;
  unitPriceCents: number;
  currency: string;
} | null> {
  if (!isDatabaseConfigured()) return null;

  const result = await query<{
    variant_id: string;
    product_id: string;
    product_name: string;
    variant_name: string;
    sku: string;
    unit_price_cents: number;
    currency: string;
  }>(
    `SELECT v.id AS variant_id,
            p.id AS product_id,
            p.name AS product_name,
            v.name AS variant_name,
            v.sku,
            COALESCE(v.price_cents, p.base_price_cents) AS unit_price_cents,
            p.currency
     FROM product_variants v
     JOIN products p ON p.id = v.product_id
     WHERE v.sku = $1 AND v.is_active = true
       AND p.status = 'active' AND p.deleted_at IS NULL`,
    [sku],
  );
  const row = result.rows[0];
  if (!row) return null;
  return {
    variantId: row.variant_id,
    productId: row.product_id,
    productName: row.product_name,
    variantName: row.variant_name,
    sku: row.sku,
    unitPriceCents: row.unit_price_cents,
    currency: row.currency,
  };
}
