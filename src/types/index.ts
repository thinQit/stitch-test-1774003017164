export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  highlightColor: string;
}

export interface PricingTier {
  id: string;
  name: string;
  monthlyPrice: number;
  isCustom: boolean;
  features: string[];
}
