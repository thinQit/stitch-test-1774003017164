export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly?: number | null;
  billingInterval?: string | null;
  features?: string[] | string | null;
  isCustom: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  message?: string | null;
  interestTier?: string | null;
  contacted: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
