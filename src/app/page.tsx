"use client";

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Hero } from '@/components/marketing/Hero';
import FeatureCard from '@/components/marketing/FeatureCard';
import { PricingSection } from '@/components/marketing/PricingSection';
import Footer from '@/components/layout/Footer';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';
import { Feature, PricingTier } from '@/types';

export default function HomePage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [featuresResponse, pricingResponse] = await Promise.all([
        api.get<{ features: Feature[] }>('/api/features'),
        api.get<{ tiers: PricingTier[] }>('/api/pricing')
      ]);
      if (!featuresResponse || !pricingResponse) {
        setError('Unable to load ProjectFlow content right now.');
        return;
      }
      setFeatures(featuresResponse?.features ?? []);
      setTiers(pricingResponse?.tiers ?? []);
    } catch (_error: unknown) {
      setError('Unable to load ProjectFlow content right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return (
    <main className="flex flex-col">
      <Hero />

      <section className="py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 md:grid-cols-2 md:items-center md:px-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold md:text-4xl">Plan faster with intelligent workflows</h2>
            <p className="text-sm text-foreground/70 md:text-base">
              ProjectFlow pairs AI scheduling with team health analytics, so every initiative stays aligned to
              business outcomes. Visualize progress, automate reporting, and keep stakeholders confident.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary">See it in action</Button>
              <Link href="/enterprise">
                <Button variant="outline">Enterprise rollout</Button>
              </Link>
            </div>
          </div>
          <Image
            src="/images/feature.jpg"
            alt="ProjectFlow feature preview"
            width={1200}
            height={675}
            className="h-auto w-full rounded-2xl object-cover shadow-lg"
          />
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
            <h2 className="text-2xl font-semibold">We couldn’t load the latest updates</h2>
            <p className="text-sm text-foreground/70">{error}</p>
            <Button onClick={() => void loadData()}>Try again</Button>
          </div>
        </section>
      ) : (
        <>
          <section className="py-16">
            <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold md:text-4xl">Built for teams that move fast</h2>
                <p className="mt-3 text-sm text-foreground/70 md:text-base">
                  ProjectFlow pairs AI-driven automation with clear visibility, so every milestone lands on time.
                </p>
              </div>
              {features.length === 0 ? (
                <div className="mt-8 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-foreground/70">
                  Feature highlights are updating. Check back soon for the latest capabilities.
                </div>
              ) : (
                <div className="mt-10 grid gap-6 md:grid-cols-3">
                  {features.map((feature) => (
                    <FeatureCard
                      key={feature.id}
                      title={feature.title}
                      description={feature.description}
                      icon={feature.icon}
                      highlightColor={feature.highlightColor}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          {tiers.length === 0 ? (
            <section className="py-16">
              <div className="mx-auto w-full max-w-3xl px-4 text-center text-sm text-foreground/70 md:px-6">
                Pricing details are being refreshed. Please check back soon.
              </div>
            </section>
          ) : (
            <PricingSection tiers={tiers} />
          )}

          <section className="py-16">
            <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 md:grid-cols-2 md:items-center md:px-6">
              <Image
                src="/images/cta.jpg"
                alt="Teams collaborating with ProjectFlow"
                width={1200}
                height={675}
                className="h-auto w-full rounded-2xl object-cover shadow-lg"
              />
              <div className="space-y-4">
                <h2 className="text-3xl font-bold md:text-4xl">Ready to transform your delivery rhythm?</h2>
                <p className="text-sm text-foreground/70 md:text-base">
                  Align your portfolio, empower your teams, and give leadership real-time clarity with ProjectFlow.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/pricing">
                    <Button>Explore pricing</Button>
                  </Link>
                  <Link href="/enterprise">
                    <Button variant="outline">Talk to sales</Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </main>
  );
}
