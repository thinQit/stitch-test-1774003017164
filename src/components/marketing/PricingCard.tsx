'use client';

import clsx from 'clsx';
import Button from '@/components/ui/Button';
import type { SubscriptionPlan } from '@/types';

type PricingCardProps = {
  plan: SubscriptionPlan;
  featured?: boolean;
  onSelect?: () => void;
};

export function PricingCard({ plan, featured, onSelect }: PricingCardProps) {
  const name = (plan as { name?: string; tier?: string }).name ?? (plan as { tier?: string }).tier ?? 'Plan';
  const price =
    (plan as { priceMonthly?: number }).priceMonthly ??
    (plan as { monthlyPrice?: number }).monthlyPrice ??
    0;
  const features = Array.isArray((plan as { features?: unknown }).features)
    ? ((plan as { features?: string[] }).features ?? [])
    : [];

  return (
    <div
      className={clsx(
        'flex h-full flex-col rounded-2xl border border-border bg-white p-6 shadow-sm',
        featured && 'border-primary shadow-md'
      )}
    >
      <div className="mb-4">
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="mt-2 text-3xl font-bold">${price}</p>
        <p className="text-sm text-secondary">per month</p>
      </div>
      <ul className="flex-1 space-y-2 text-sm text-secondary">
        {features.length === 0 ? (
          <li>Custom onboarding and tailored automation.</li>
        ) : (
          features.map((feature) => <li key={feature}>{feature}</li>)
        )}
      </ul>
      <Button type="button" className="mt-6 w-full" onClick={onSelect}>
        Choose plan
      </Button>
    </div>
  );
}

export default PricingCard;
