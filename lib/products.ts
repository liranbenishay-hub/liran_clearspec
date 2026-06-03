/**
 * Product registry.
 *
 * To add a new product:
 * 1. Add an object to PRODUCTS below.
 * 2. Create the page at the href path.
 * The sidebar and any product listing renders from this array automatically.
 */

export type ProductStatus = "live" | "beta" | "concept" | "coming-soon";
export type ProductCategory = "framework" | "ai-tool";
export type ProductInputType = "url" | "text" | "prd" | "feature-idea";

export interface Product {
  id: string;
  title: string;
  description: string;      // Short line shown in sidebar and cards
  href: string;
  status: ProductStatus;
  category: ProductCategory;
  inputType: ProductInputType;
  oneLiner: string;         // Tagline / subtitle on product page
  whyItMatters: string;     // PM positioning — what this demonstrates
}

export const PRODUCTS: Product[] = [
  {
    id: "clearspec",
    title: "Clearspec",
    description: "Decision records, made structured",
    href: "/products/clearspec",
    status: "live",
    category: "framework",
    inputType: "text",
    oneLiner: "The PM Operating System, Built in Public.",
    whyItMatters:
      "Demonstrates systems thinking, spec-first execution, and the ability to extract a repeatable methodology from years of real product decisions.",
  },
  {
    id: "pm-operating-system",
    title: "PM Operating System",
    description: "The framework, applied",
    href: "/products/pm-operating-system",
    status: "live",
    category: "framework",
    inputType: "text",
    oneLiner: "Seven questions. One structured decision record.",
    whyItMatters:
      "Shows a complete product thinking workflow — from operational pain to tradeoff documentation — applied to any product problem.",
  },
  {
    id: "ai-product-qa-auditor",
    title: "AI Product QA Auditor",
    description: "Audit any product page for UX and QA issues",
    href: "/products/ai-product-qa-auditor",
    status: "beta",
    category: "ai-tool",
    inputType: "url",
    oneLiner: "Paste a URL. Get a structured product, UX, and QA audit.",
    whyItMatters:
      "Combines product management, UX judgment, and QA thinking into a single structured output — showing I can evaluate product quality the way a senior PM would.",
  },
  {
    id: "prd-critic",
    title: "PRD Critic",
    description: "Find the gaps in any product spec before engineering starts",
    href: "/products/prd-critic",
    status: "concept",
    category: "ai-tool",
    inputType: "prd",
    oneLiner: "Paste a PRD. Get a structured gap analysis before build starts.",
    whyItMatters:
      "Demonstrates spec-first execution and the ability to catch missing context, weak assumptions, and rollout gaps before they become engineering problems.",
  },
  {
    id: "feature-spec-generator",
    title: "Feature Spec Generator",
    description: "Turn a rough idea into a usable product spec",
    href: "/products/feature-spec-generator",
    status: "concept",
    category: "ai-tool",
    inputType: "feature-idea",
    oneLiner: "One paragraph in. Full structured spec out.",
    whyItMatters:
      "Shows how I turn ambiguity into clear execution — the same process I apply to every feature from discovery to acceptance criteria.",
  },
  {
    id: "startup-teardown-ai",
    title: "Startup Teardown AI",
    description: "Strategic product analysis of any startup",
    href: "/products/startup-teardown-ai",
    status: "concept",
    category: "ai-tool",
    inputType: "url",
    oneLiner: "Paste a startup URL. Get ICP, UX gaps, and product opportunities.",
    whyItMatters:
      "Shows strategic product thinking, market analysis, UX review, and the ability to identify AI opportunities — the skills a senior PM brings to a new product domain.",
  },
];

export const STATUS_LABELS: Record<ProductStatus, string> = {
  live: "",
  beta: "beta",
  concept: "concept",
  "coming-soon": "concept",
};

export const STATUS_COLORS: Record<ProductStatus, string> = {
  live: "bg-green-500",
  beta: "bg-blue-500",
  concept: "bg-zinc-600",
  "coming-soon": "bg-zinc-600",
};
