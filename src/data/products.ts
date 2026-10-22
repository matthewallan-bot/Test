export type Product = {
  slug: string;
  name: string;
  description: string;
  basePriceCents: number;
  currency: string;
  imageLabel: string;
  variants: { sku: string; name: string; priceCents?: number }[];
};

export const PRODUCTS: Product[] = [
  {
    slug: "signal-tee",
    name: "Signal Tee",
    description: "Heavyweight tee with Fixed Reaction wordmark. Soft black ink on ash.",
    basePriceCents: 3200,
    currency: "USD",
    imageLabel: "Signal Tee",
    variants: [
      { sku: "FR-TEE-S", name: "S / Ash" },
      { sku: "FR-TEE-M", name: "M / Ash" },
      { sku: "FR-TEE-L", name: "L / Ash" },
    ],
  },
  {
    slug: "afterimage-hoodie",
    name: "Afterimage Hoodie",
    description: "Midweight hoodie. Embroidered mark on chest, tour back print.",
    basePriceCents: 5800,
    currency: "USD",
    imageLabel: "Afterimage Hoodie",
    variants: [
      { sku: "FR-HOOD-M", name: "M / Charcoal" },
      { sku: "FR-HOOD-L", name: "L / Charcoal" },
      { sku: "FR-HOOD-XL", name: "XL / Charcoal" },
    ],
  },
  {
    slug: "static-cap",
    name: "Static Cap",
    description: "Structured cap with tonal Fixed Reaction embroidery.",
    basePriceCents: 2800,
    currency: "USD",
    imageLabel: "Static Cap",
    variants: [{ sku: "FR-CAP-OS", name: "One Size / Black" }],
  },
];

export function formatMoney(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
