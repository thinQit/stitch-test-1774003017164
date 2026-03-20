'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import type { PricingPlan } from '@/types';

const fallbackPricing: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price_per_month: 29,
    currency: 'USD',
    features: ['Smart scheduling', 'Email reports', 'Up to 5 projects'],
    is_custom_contact: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price_per_month: 79,
    currency: 'USD',
    features: ['Everything in Starter', 'Team insights', 'Unlimited projects'],
    is_custom_contact: false
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price_per_month: null,
    currency: 'USD',
    features: ['Custom workflows', 'Dedicated success', 'Security reviews'],
    is_custom_contact: true
  }
];

export default function PricingPage() {
  const [pricing, setPricing] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<PricingPlan[]>('/api/pricing');
        if (res.error) {
          setError(res.error);
        }
        setPricing(res.data ?? []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load pricing');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const pricingItems = useMemo(() => (pricing.length ? pricing : fallbackPricing), [pricing]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">ProjectFlow pricing</h1>
          <p className="mt-4 text-slate-600">Flexible tiers for every stage of growth.</p>
        </div>
        <div className="overflow-hidden rounded-3xl border border-border">
          <Image
            src="/images/hero.jpg"
            alt="Pricing overview"
            width={1200}
            height={675}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {error && (
        <div className="mt-8 rounded-md border border-error bg-red-50 px-4 py-3 text-sm text-error">{error}</div>
      )}

      {loading ? (
        <div className="mt-12 flex justify-center">
          <Spinner label="Loading pricing" />
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {!pricing.length && (
            <p className="md:col-span-3 text-center text-sm text-slate-500">
              No custom pricing yet. Showing default tiers.
            </p>
          )}
          {pricingItems.map((plan) => (
            <Card key={plan.id} className="flex h-full flex-col">
              <Card.Header>
                <h2 className="text-xl font-semibold text-foreground">{plan.name}</h2>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {plan.is_custom_contact ? 'Custom' : `$${plan.price_per_month}/mo`}
                </p>
              </Card.Header>
              <Card.Content className="flex-1">
                <ul className="space-y-2 text-sm text-slate-600">
                  {(plan.features || []).map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card.Content>
              <Card.Footer>
                <Button asChild className="w-full">
                  <Link href={`/signup?plan=${plan.id}`}>{plan.is_custom_contact ? 'Contact sales' : 'Choose ' + plan.name}</Link>
                </Button>
              </Card.Footer>
            </Card>
          ))}
        </div>
      )}

      <section className="mt-16 grid gap-10 rounded-3xl bg-slate-900 p-10 text-white md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div>
          <h2 className="text-2xl font-semibold">Need enterprise scale?</h2>
          <p className="mt-3 text-slate-200">We build custom rollouts, security reviews, and AI governance for large teams.</p>
          <Button asChild className="mt-6">
            <Link href="/signup?plan=enterprise">Talk to sales</Link>
          </Button>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-800">
          <Image
            src="/images/cta.jpg"
            alt="Enterprise teams collaborating"
            width={1200}
            height={675}
            className="h-full w-full object-cover"
          />
        </div>
      </section>
    </div>
  );
}
