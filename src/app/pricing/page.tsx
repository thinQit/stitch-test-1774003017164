"use client";

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PricingSection } from '@/components/marketing/PricingSection';
import Footer from '@/components/layout/Footer';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';
import { PricingTier } from '@/types';

export default function PricingPage() {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPricing = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pricingResponse = await api.get<{ tiers: PricingTier[] }>('/api/pricing');
      if (!pricingResponse) {
        setError('Unable to load pricing details right now.');
        return;
      }
      setTiers(pricingResponse?.tiers ?? []);
    } catch (_error: unknown) {
      setError('Unable to load pricing details right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPricing();
  }, [loadPricing]);

  return (
    <main className="flex flex-col">
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <h1 className="text-3xl font-bold md:text-4xl">Pricing built for every stage</h1>
          <p className="mt-3 max-w-2xl text-sm text-foreground/70 md:text-base">
            Whether you are a growing startup or a global enterprise, ProjectFlow delivers AI-first planning tools
            that align teams and accelerate delivery.
          </p>
        </div>
      </section>

      {loading ? (
        <section className="py-16">
          <div className="mx-auto flex w-full max-w-6xl justify-center px-4 md:px-6">
            <Spinner />
          </div>
        </section>
      ) : error ? (
        <section className="py-16">
          <div className="mx-auto w-full max-w-3xl space-y-4 px-4 text-center md:px-6">
            <h2 className="text-2xl font-semibold">We couldn’t load pricing</h2>
            <p className="text-sm text-foreground/70">{error}</p>
            <Button onClick={() => void loadPricing()}>Try again</Button>
          </div>
        </section>
      ) : tiers.length === 0 ? (
        <section className="py-16">
          <div className="mx-auto w-full max-w-3xl px-4 text-center text-sm text-foreground/70 md:px-6">
            Pricing details are being refreshed. Please check back soon.
          </div>
        </section>
      ) : (
        <PricingSection
          tiers={tiers}
          headline="Choose the right plan for your roadmap"
          description="Upgrade anytime, or talk with our enterprise team for a bespoke rollout strategy."
        />
      )}

      <section className="py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 md:grid-cols-2 md:items-center md:px-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold md:text-4xl">Need a bespoke rollout?</h2>
            <p className="text-sm text-foreground/70 md:text-base">
              Our enterprise team will build a plan that includes security reviews, onboarding support, and
              workflow optimization for your organization.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/enterprise">
                <Button>Contact enterprise</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline">Compare plans</Button>
              </Link>
            </div>
          </div>
          <Image
            src="/images/cta.jpg"
            alt="Enterprise team collaboration"
            width={1200}
            height={675}
            className="h-auto w-full rounded-2xl object-cover shadow-lg"
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
