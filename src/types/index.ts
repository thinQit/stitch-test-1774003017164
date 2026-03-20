export type Feature = {
  id: string;
  title?: string | null;
  summary?: string | null;
  icon?: string | null;
};

export type PricingTier = {
  id: string;
  name?: string | null;
  pricePerMonth?: number | null;
  currency?: string | null;
  features?: string[] | null;
  stripePriceId?: string | null;
  isCustom?: boolean | null;
};

export type Lead = {
  id: string;
  email?: string | null;
  name?: string | null;
  company?: string | null;
  planInterest?: string | null;
  createdAt?: string | Date | null;
};

export type AdminUser = {
  id: string;
  email: string;
  name?: string | null;
  role?: string | null;
  passwordHash: string;
  createdAt?: string | Date | null;
};
