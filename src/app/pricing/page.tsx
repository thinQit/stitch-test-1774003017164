'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { api } from '@/lib/api';

type PricingTier = {
  id: string;
  name: string;
  priceMonthly: number | 'custom';
  benefits: string[];
};

type PricingResponse = { tiers: PricingTier[] };

export default function PricingPage() {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const loadPricing = async () => {
      try {
        const data = await api.get<PricingResponse>('/api/pricing');
        setTiers(data?.tiers ?? []);
        setStatus('ready');
      } catch (_error) {
        setStatus('error');
      }
    };

    void loadPricing();
  }, []);

  return (
    <main>
      <section className="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 py-16 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-bold">Pricing built for every stage</h1>
            <p className="mt-3 text-white/90">
              From early-stage teams to global portfolios, ProjectFlow scales with you and keeps roadmaps on track.
            </p>
          </div>
          <Image
            src="/images/hero.jpg"
            alt="ProjectFlow pricing overview"
            width={1200}
            height={675}
            className="rounded-2xl object-cover shadow-2xl"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase text-primary">Plans</p>
          <h2 className="mt-2 text-3xl font-bold">Choose the plan that fits your team</h2>
          <p className="mt-3 text-secondary">Every tier includes AI scheduling, reporting, and team insights.</p>
        </div>

        {status === 'loading' && (
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-secondary">
            <Spinner /> Loading pricing...
          </div>
        )}
        {status === 'error' && <p className="mt-8 text-center text-sm text-error">Unable to load pricing tiers.</p>}
        {status === 'ready' && tiers.length === 0 && (
          <p className="mt-8 text-center text-sm text-secondary">Pricing will be available soon.</p>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <Card key={tier.id} className="flex flex-col">
              <CardHeader>
                <h3 className="text-xl font-semibold text-foreground">{tier.name}</h3>
                <p className="text-3xl font-bold">
                  {tier.priceMonthly === 'custom' ? 'Custom' : `$${tier.priceMonthly}/mo`}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-4 text-secondary">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Link href={tier.id === 'enterprise' ? '/#contact' : '/signup'}>
                  <Button variant={tier.id === 'pro' ? 'primary' : 'outline'}>
                    {tier.id === 'enterprise' ? 'Contact sales' : 'Get started'}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <h2 className="text-3xl font-bold">Need a custom rollout?</h2>
            <p className="mt-3 text-secondary">
              Our enterprise team helps you design a rollout plan, integrate tooling, and launch with full support.
            </p>
            <Link href="/#contact" className="mt-6 inline-flex">
              <Button>Talk to sales</Button>
            </Link>
          </div>
          <Image
            src="/images/cta.jpg"
            alt="ProjectFlow enterprise support"
            width={1200}
            height={675}
            className="rounded-2xl object-cover shadow-lg"
          />
        </div>
      </section>
    </main>
  );
}
