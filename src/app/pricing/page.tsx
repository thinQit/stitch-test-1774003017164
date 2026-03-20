'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import { PricingTier } from '@/types';
import Button from '@/components/ui/Button';
import Card, { CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';

export default function PricingPage() {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get<PricingTier[]>('/api/tiers');
        const list = Array.isArray(data) ? data : [];
        setTiers(list);
      } catch (error: unknown) {
        setError((error as Error).message || 'Unable to load pricing tiers.');
        setTiers([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCheckout = async (
    event: React.FormEvent<HTMLFormElement>,
    tier: PricingTier
  ) => {
    event.preventDefault();
    if (tier.isCustom) {
      return;
    }
    try {
      const res = await api.post<{ url?: string }>('/api/checkout', { tierId: tier.id });
      if (res?.url) {
        window.location.href = res.url;
      }
    } catch (_error) {
      // ignore
    }
  };

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-primary-hover text-white">
        <Image
          src="/images/hero.jpg"
          alt="ProjectFlow pricing hero"
          width={1200}
          height={675}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-secondary/70 to-primary-hover/80" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 lg:px-6">
          <h1 className="text-4xl font-bold">ProjectFlow Pricing</h1>
          <p className="mt-2 text-sm text-white/80">Flexible tiers built for growing project portfolios.</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Choose your plan</h2>
            <p className="mt-2 text-sm text-foreground/70">Pick the tier that matches your delivery velocity.</p>
          </div>
          {loading && <Spinner />}
        </div>
        {error && <p className="mt-4 text-sm text-error">{error}</p>}
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card key={tier.id}>
              <CardHeader>
                <h3 className="text-xl font-semibold">{tier.name}</h3>
                <p className="mt-2 text-3xl font-bold">
                  {tier.isCustom ? 'Custom' : `$${tier.pricePerMonth}`}
                  {!tier.isCustom && <span className="text-sm font-medium text-foreground/70">/mo</span>}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-foreground/70">
                  {tier.features?.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {tier.isCustom ? (
                  <Link href="/contact" className="w-full">
                    <Button className="w-full" variant="outline">Contact Sales</Button>
                  </Link>
                ) : (
                  <form className="w-full" onSubmit={(event) => handleCheckout(event, tier)}>
                    <Button className="w-full">Start Checkout</Button>
                  </form>
                )}
              </CardFooter>
            </Card>
          ))}
          {!loading && tiers.length === 0 && (
            <Card>
              <CardContent>
                <p className="text-sm text-foreground/70">No pricing tiers available.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 pb-16 lg:px-6">
        <div className="grid gap-8 rounded-2xl bg-muted p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h3 className="text-2xl font-semibold">Need a custom rollout?</h3>
            <p className="mt-2 text-sm text-foreground/70">
              Enterprise teams receive dedicated onboarding, security reviews, and custom AI playbooks.
            </p>
            <Link href="/contact" className="mt-4 inline-flex">
              <Button>Talk to Sales</Button>
            </Link>
          </div>
          <div className="relative overflow-hidden rounded-2xl">
            <Image
              src="/images/cta.jpg"
              alt="ProjectFlow enterprise CTA"
              width={1200}
              height={675}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
