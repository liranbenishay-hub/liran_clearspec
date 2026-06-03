/**
 * Product registry.
 *
 * To add a new product to the sidebar and navigation:
 * 1. Add a new object to the PRODUCTS array below.
 * 2. Create the corresponding page at the href path.
 * That's it — the sidebar renders from this list automatically.
 */

export type ProductStatus = "live" | "beta" | "coming-soon";

export interface Product {
  id: string;
  title: string;
  description: string;
  href: string;
  status: ProductStatus;
}

export const PRODUCTS: Product[] = [
  {
    id: "clearspec",
    title: "Clearspec",
    description: "Decision records, made structured",
    href: "/products/clearspec",
    status: "live",
  },
  {
    id: "pm-operating-system",
    title: "PM Operating System",
    description: "The framework, applied",
    href: "/products/pm-operating-system",
    status: "live",
  },
];

export const STATUS_LABELS: Record<ProductStatus, string> = {
  live: "",
  beta: "beta",
  "coming-soon": "soon",
};
