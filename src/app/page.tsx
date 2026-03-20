'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FeatureCard from '@/components/marketing/FeatureCard';
import PricingCard from '@/components/marketing/PricingCard';
import LeadForm from '@/components/marketing/LeadForm';
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
              AI-powered project management that keeps your team ahead of every deadline.
            </h1>
            <p className="text-lg text-white/90">
              Orchestrate smart scheduling, automated reporting, and real-time team insights
              from one modern workspace built for fast-moving product teams.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="#pricing"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-primary to-primary-hover px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:opacity-90"
              >
                Start 14-day trial
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center justify-center rounded-lg border border-white/60 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Book a demo
              </Link>
            </div>
          </div>
          <div className="relative w-full max-w-lg">
            <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur">
              <Image
                src="/images/hero.jpg"
                alt="ProjectFlow dashboard preview"
                width={1200}
                height={675}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold">Predict, plan, and deliver with confidence</h2>
            <p className="text-base text-secondary">
              ProjectFlow connects your roadmap, execution, and stakeholder updates in one
              AI-augmented hub. The result: calmer launches and happier teams.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-secondary">
              <li>• Smart prioritization across cross-functional workstreams.</li>
              <li>• Live workload balance with sentiment tracking.</li>
              <li>• Automated status updates that build executive trust.</li>
            </ul>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <Image
              src="/images/feature.jpg"
              alt="Team collaboration analytics"
              width={1200}
              height={675}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="mb-10 flex flex-col gap-3 text-center">
          <h2 className="text-3xl font-bold">Built for smart, strategic delivery</h2>
          <p className="text-base text-secondary">
            ProjectFlow bundles AI automation with clear team visibility.
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
        ) : features.length === 0 ? (
          <div className="rounded-lg border border-border bg-white p-6 text-center text-secondary">
            No feature data available yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        )}
      </section>

      <section id="pricing" className="bg-muted py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold">Pricing built for growing teams</h2>
            <p className="mt-3 text-secondary">
              Start with a 14-day trial. Upgrade to unlock advanced automation and insights.
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
              Pricing details are coming soon.
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
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold">Align leaders with one click</h2>
            <p className="text-secondary">
              Deliver leadership-ready updates on demand and keep roadmap changes crystal clear.
              ProjectFlow turns progress into an executive-ready narrative.
            </p>
            <Link
              href="#contact"
              className="inline-flex w-fit items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              Book an executive demo
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
            <Image
              src="/images/cta.jpg"
              alt="Executive overview experience"
              width={1200}
              height={675}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold">Talk to our product experts</h2>
            <p className="text-secondary">
              Tell us about your team and we will tailor a ProjectFlow demo to your roadmap.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-secondary">
              <li>• AI schedule optimization for cross-team dependency mapping.</li>
              <li>• Automated status reports for exec stakeholders.</li>
              <li>• Team sentiment and workload insights.</li>
            </ul>
          </div>
          <LeadForm defaultTier="Pro" />
        </div>
      </section>

      <footer className="border-t border-border bg-white py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div>
            <p className="text-lg font-semibold">ProjectFlow</p>
            <p className="text-sm text-secondary">
              AI-powered project management for modern product teams.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-secondary">
            <Link href="/pricing" className="hover:text-primary">
              Pricing
            </Link>
            <Link href="/admin/leads" className="hover:text-primary">
              Admin
            </Link>
            <a href="#contact" className="hover:text-primary">
              Contact
            </a>
          </div>
          <p className="text-xs text-secondary">© 2026 ProjectFlow. All rights reserved.</p>
        </div>
      </footer>

      <Modal isOpen={enterpriseOpen} onClose={() => setEnterpriseOpen(false)} title="Enterprise Contact">
        <LeadForm defaultTier="Enterprise" onSuccess={() => setEnterpriseOpen(false)} />
      </Modal>
    </main>
  );
}
