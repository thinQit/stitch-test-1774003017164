export type Feature = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  order: number;
};

export type Plan = {
  id: string;
  name: string;
  price_monthly?: number | null;
  billing_description?: string | null;
  features: string[];
  is_custom: boolean;
};

export type Lead = {
  id: string;
  email: string;
  name?: string | null;
  company?: string | null;
  message?: string | null;
  source?: string | null;
  createdAt: string;
  updatedAt: string;
};
