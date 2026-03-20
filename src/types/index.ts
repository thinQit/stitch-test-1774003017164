export interface Feature {
  id?: string;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
}

export interface PricingPlan {
  id?: string;
  name?: string | null;
  price_per_month?: number | null;
  currency?: string | null;
  features?: string[];
  is_custom_contact?: boolean;
}

export interface SiteContent {
  id?: string;
  hero_title?: string | null;
  hero_subtitle?: string | null;
  footer_text?: string | null;
}
