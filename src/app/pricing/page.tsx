'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import type { Plan } from '@/types';

const fallbackPlans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price_monthly: 29,
    billing_description: 'For growing teams getting organized fast.',
    features: ['Up to 5 projects', 'AI scheduling', 'Weekly reports'],
    is_custom: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price_monthly: 79,
    billing_description: 'For scaling teams that need advanced insights.',
    features: ['Unlimited projects', 'Automation workflows', 'Priority support'],
    is_custom: false
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price_monthly: null,
    billing_description: 'Custom security, SLAs, and onboarding.',
    features: ['Dedicated success manager', 'Custom integrations', 'On-prem options'],
    is_custom: true
  }
];

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get<{ plans: Plan[] }>('/api/plans');
        setPlans(response?.plans?.length ? response.plans : fallbackPlans);
      } catch (_error) {
        setError('Unable to load pricing. Showing standard plans.');
        setPlans(fallbackPlans);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <main className="bg-background">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt="ProjectFlow pricing hero"
            width={1200}
            height={675}
            className="h-full w-full object-cover opacity-30"
            priority
          />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Pricing</p>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">Choose the plan that matches your momentum</h1>
          <p className="mt-4 text-white/70">
            Every plan includes AI scheduling, automated reporting, and secure collaboration.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        {error && <p className="text-center text-sm text-slate-500">{error}</p>}
        {loading ? (
          <div className="mt-10 flex justify-center">
            <Spinner />
          </div>
        ) : plans.length === 0 ? (
          <p className="mt-10 text-center text-sm text-slate-600">Pricing details are being finalized.</p>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.id} className="flex h-full flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">{plan.name}</h2>
                  <p className="mt-3 text-4xl font-bold">
                    {plan.is_custom || plan.price_monthly === null ? 'Custom' : `$${plan.price_monthly}`}
                    {!plan.is_custom && plan.price_monthly !== null && (
                      <span className="text-base font-medium text-slate-500">/mo</span>
                    )}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{plan.billing_description}</p>
                  <ul className="mt-6 space-y-2 text-sm text-slate-700">
                    {(plan.features || []).map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button asChild className="mt-8">
                  <a href={plan.is_custom ? '/contact' : '/pricing'}>{plan.is_custom ? 'Contact sales' : 'Get started'}</a>
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="bg-muted">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Enterprise ready</p>
            <h3 className="mt-3 text-3xl font-bold">Need a tailored rollout?</h3>
            <p className="mt-2 text-slate-600">
              Enterprise onboarding, security reviews, and custom integrations are available for large PMOs.
            </p>
            <Button asChild className="mt-6" size="lg">
              <a href="/contact">Schedule a demo</a>
            </Button>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <Image
              src="/images/cta.jpg"
              alt="ProjectFlow enterprise collaboration"
              width={1200}
              height={675}
              className="w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
