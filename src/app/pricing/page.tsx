'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import PricingCard from '@/components/marketing/PricingCard';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import LeadForm from '@/components/marketing/LeadForm';
import { api } from '@/lib/api';
import type { SubscriptionPlan } from '@/types';

export default function PricingPage() {
  const [pricing, setPricing] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enterpriseOpen, setEnterpriseOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const pricingData = await api.get<SubscriptionPlan[]>('/api/pricing');
        setPricing(pricingData ?? []);
      } catch (_error) {
        setError('Unable to load pricing. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <main className="min-h-screen bg-muted py-16">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold">Choose the plan that fits your delivery team</h1>
          <p className="mt-4 text-secondary">
            Unlock AI scheduling, automated reporting, and team insights with ProjectFlow.
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
                onEnterprise={() => setEnterpriseOpen(true)}
              />
            ))}
          </div>
        )}
      </div>

      <section className="mx-auto mt-16 grid w-full max-w-6xl gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <Image
            src="/images/cta.jpg"
            alt="ProjectFlow executive insights"
            width={1200}
            height={675}
            className="h-auto w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold">Need a tailored rollout?</h2>
          <p className="text-secondary">
            We support enterprise data residency, custom workflows, and dedicated success
            enablement. Tell us about your team and we will craft the right plan.
          </p>
          <button
            type="button"
            onClick={() => setEnterpriseOpen(true)}
            className="inline-flex w-fit items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            Contact sales
          </button>
        </div>
      </section>

      <Modal isOpen={enterpriseOpen} onClose={() => setEnterpriseOpen(false)} title="Enterprise Contact">
        <LeadForm defaultTier="Enterprise" onSuccess={() => setEnterpriseOpen(false)} />
      </Modal>
    </main>
  );
}
