'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FeatureCard from '@/components/marketing/FeatureCard';
import { PricingCard } from '@/components/marketing/PricingCard';
import { LeadForm } from '@/components/marketing/LeadForm';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import type { SubscriptionPlan } from '@/types';

interface Feature {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export default function HomePage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [pricing, setPricing] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enterpriseOpen, setEnterpriseOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [featureData, pricingData] = await Promise.all([
          api.get<Feature[]>('/api/features'),
          api.get<SubscriptionPlan[]>('/api/pricing')
        ]);
        setFeatures(featureData ?? []);
        setPricing(pricingData ?? []);
      } catch (_error) {
        setError('Unable to load ProjectFlow data. Please try again soon.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <main className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-hover to-[#06b6d4] py-20 text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-6 lg:flex-row lg:justify-between">
          <div className="flex max-w-xl flex-col gap-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
              ProjectFlow
            </p>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              AI-powered project management for delivery teams
            </h1>
            <p className="text-lg text-white/90">
              Align every sprint, automate reporting, and ship faster with shared visibility.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/pricing"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary"
              >
                View pricing
              </Link>
              <button
                type="button"
                onClick={() => setEnterpriseOpen(true)}
                className="rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white"
              >
                Talk to sales
              </button>
            </div>
          </div>
          <div className="relative h-[320px] w-full max-w-md">
            <Image
              src="/images/dashboard-preview.png"
              alt="ProjectFlow dashboard preview"
              fill
              className="rounded-3xl object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold">Every project milestone, automated.</h2>
          <p className="mt-3 text-secondary">
            ProjectFlow surfaces risks early and keeps stakeholders aligned with real-time insights.
          </p>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-error bg-red-50 p-4 text-center text-error">
            {error}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.id} {...feature} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-muted py-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="mb-10 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-bold">Plans for every delivery team</h2>
              <p className="mt-3 text-secondary">
                Choose a tier that scales with your roadmap.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEnterpriseOpen(true)}
              className="rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary"
            >
              Need enterprise?
            </button>
          </div>
          {loading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : pricing.length === 0 ? (
            <div className="rounded-lg border border-border bg-white p-6 text-center text-secondary">
              Pricing tiers are being finalized.
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {pricing.map((plan) => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  {...plan}
                  onSelect={() => setEnterpriseOpen(true)}
                  onContact={() => setEnterpriseOpen(true)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Modal
        isOpen={enterpriseOpen}
        open={enterpriseOpen}
        onClose={() => setEnterpriseOpen(false)}
        title="Request an enterprise demo"
      >
        <LeadForm
          onClose={() => setEnterpriseOpen(false)}
          onSuccess={() => setEnterpriseOpen(false)}
          onSubmitted={() => setEnterpriseOpen(false)}
        />
      </Modal>
    </main>
  );
}
