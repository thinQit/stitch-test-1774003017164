'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { PricingCard } from '@/components/marketing/PricingCard';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import { LeadForm } from '@/components/marketing/LeadForm';
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
                {...plan}
                onSelect={() => setEnterpriseOpen(true)}
                onContact={() => setEnterpriseOpen(true)}
              />
            ))}
          </div>
        )}
        <div className="mt-12 flex flex-col items-center gap-6 rounded-3xl bg-white p-8 shadow-sm md:flex-row md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Need a custom rollout?</h2>
            <p className="mt-2 text-secondary">
              Talk to our team about enterprise compliance, onboarding, and implementation services.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEnterpriseOpen(true)}
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white"
          >
            Request a demo
          </button>
        </div>
      </div>
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
