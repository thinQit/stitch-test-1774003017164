'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import type { Feature, Plan } from '@/types';

const fallbackFeatures: Feature[] = [
  {
    id: '1',
    title: 'Smart Scheduling',
    subtitle: 'AI optimizes timelines, dependencies, and workload across your portfolio.',
    icon: 'calendar',
    order: 1
  },
  {
    id: '2',
    title: 'Automated Reporting',
    subtitle: 'Real-time executive summaries and KPI dashboards in one click.',
    icon: 'insights',
    order: 2
  },
  {
    id: '3',
    title: 'Team Insights',
    subtitle: 'Spot bottlenecks early with predictive delivery risk signals.',
    icon: 'group',
    order: 3
  }
];

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

export default function HomePage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeName, setSubscribeName] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subscribeMessage, setSubscribeMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [featuresResponse, plansResponse] = await Promise.all([
          api.get<{ features: Feature[] }>('/api/features'),
          api.get<{ plans: Plan[] }>('/api/plans')
        ]);
        setFeatures(featuresResponse?.features?.length ? featuresResponse.features : fallbackFeatures);
        setPlans(plansResponse?.plans?.length ? plansResponse.plans : fallbackPlans);
      } catch (_error) {
        setError('Unable to load live data. Showing latest published content.');
        setFeatures(fallbackFeatures);
        setPlans(fallbackPlans);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const orderedFeatures = useMemo(() => [...features].sort((a, b) => a.order - b.order), [features]);

  const handleSubscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubscribeStatus('loading');
    setSubscribeMessage('');
    try {
      const response = await api.post<{ success: boolean; message?: string }>('/api/subscribe', {
        email: subscribeEmail,
        name: subscribeName,
        source: 'landing'
      });
      if (response?.success) {
        setSubscribeStatus('success');
        setSubscribeMessage('You are on the list! We will keep you updated.');
        setSubscribeEmail('');
        setSubscribeName('');
      } else {
        setSubscribeStatus('error');
        setSubscribeMessage(response?.message || 'Something went wrong.');
      }
    } catch (_error) {
      setSubscribeStatus('error');
      setSubscribeMessage('Something went wrong.');
    }
  };

  return (
    <main className="bg-background">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt="ProjectFlow hero background"
            width={1200}
            height={675}
            className="h-full w-full object-cover opacity-20"
            priority
          />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-20 md:flex-row md:items-center md:py-28">
          <div className="flex-1 space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">ProjectFlow</p>
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              AI-powered project management that keeps teams two steps ahead.
            </h1>
            <p className="max-w-xl text-lg text-white/90">
              ProjectFlow turns scattered timelines into an intelligent delivery system with automated scheduling, instant reporting, and
              clarity across every stakeholder.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button asChild variant="secondary" size="lg">
                <a href="/pricing">Start free trial</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="/contact">Talk to sales</a>
              </Button>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/80">
              <div>
                <p className="text-2xl font-semibold">120+</p>
                <p>AI-driven workflows shipped weekly</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">98%</p>
                <p>Teams reporting higher delivery confidence</p>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-md">
              <div className="rounded-2xl bg-white/90 p-6 text-foreground shadow-xl">
                <p className="text-sm font-semibold text-primary">Live overview</p>
                <h3 className="mt-2 text-2xl font-semibold">Momentum dashboard</h3>
                <p className="mt-3 text-sm text-slate-600">
                  See real-time risk signals, project health, and team capacity across every initiative.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {['Schedule risk', 'Automation coverage', 'Team focus', 'Stakeholder health'].map((item, index) => (
                    <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-800">{item}</p>
                      <p className="mt-2 text-xl font-bold text-primary">{[92, 88, 95, 90][index]}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Capabilities</p>
          <h2 className="text-3xl font-bold md:text-4xl">Everything you need to run smarter projects</h2>
          <p className="text-slate-600">Purpose-built AI features that keep delivery, reporting, and team insight in perfect sync.</p>
        </div>
        {error && <p className="mt-6 text-center text-sm text-slate-500">{error}</p>}
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center">
                <Spinner />
              </div>
            ) : orderedFeatures.length === 0 ? (
              <p className="text-center text-sm text-slate-600">No feature highlights available right now.</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-1">
                {orderedFeatures.map((feature) => (
                  <Card key={feature.id} className="bg-white">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <span className="text-xl" aria-hidden>
                          {feature.icon.slice(0, 1).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{feature.title}</h3>
                        <p className="text-sm text-slate-600">{feature.subtitle}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <Image
              src="/images/feature.jpg"
              alt="ProjectFlow feature overview"
              width={1200}
              height={675}
              className="w-full rounded-2xl object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">AI that orchestrates every project layer</h3>
              <p className="mt-2 text-sm text-slate-600">
                Connect milestones, dependencies, and team capacity to keep delivery plans adaptive and always on time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-col gap-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Pricing</p>
            <h2 className="text-3xl font-bold md:text-4xl">Plans built for every stage of growth</h2>
            <p className="text-slate-600">Start fast, scale seamlessly, or customize for enterprise workflows.</p>
          </div>
          {loading ? (
            <div className="mt-10 flex justify-center">
              <Spinner />
            </div>
          ) : plans.length === 0 ? (
            <p className="mt-10 text-center text-sm text-slate-600">Pricing details are being updated.</p>
          ) : (
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {plans.map((plan) => (
                <Card key={plan.id} className="flex h-full flex-col justify-between bg-white">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">{plan.name}</h3>
                      {plan.name === 'Pro' && (
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Most popular</span>
                      )}
                    </div>
                    <p className="mt-3 text-3xl font-bold">
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
                    <a href={plan.is_custom ? '/contact' : '/pricing'}>{plan.is_custom ? 'Contact sales' : 'Choose plan'}</a>
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 rounded-3xl border border-slate-200 bg-white p-8 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Newsletter</p>
            <h3 className="mt-3 text-3xl font-bold">Stay ahead of the roadmap</h3>
            <p className="mt-3 text-slate-600">
              Get monthly product updates, AI delivery insights, and playbooks from ProjectFlow’s product team.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="space-y-4" aria-label="Newsletter subscription form">
            <Input
              label="Name"
              name="name"
              value={subscribeName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSubscribeName(event.target.value)}
              placeholder="Your name"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              required
              value={subscribeEmail}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSubscribeEmail(event.target.value)}
              placeholder="you@company.com"
            />
            <Button type="submit" disabled={subscribeStatus === 'loading'}>
              {subscribeStatus === 'loading' ? 'Submitting...' : 'Subscribe'}
            </Button>
            {subscribeStatus === 'success' && <p className="text-sm text-success">{subscribeMessage}</p>}
            {subscribeStatus === 'error' && <p className="text-sm text-error">{subscribeMessage}</p>}
          </form>
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Launch faster</p>
            <h3 className="mt-3 text-3xl font-bold">Ready to orchestrate your next delivery sprint?</h3>
            <p className="mt-3 text-white/70">
              ProjectFlow gives PMOs, product leaders, and delivery teams a shared command center. Start today or book a guided walkthrough.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button asChild variant="secondary" size="lg">
                <a href="/pricing">See pricing</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="/contact">Book a demo</a>
              </Button>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <Image
              src="/images/cta.jpg"
              alt="ProjectFlow team collaboration"
              width={1200}
              height={675}
              className="w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold">ProjectFlow</p>
            <p className="text-sm text-slate-600">AI-powered clarity for modern project teams.</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <a href="/pricing" className="hover:text-primary">
              Pricing
            </a>
            <a href="/contact" className="hover:text-primary">
              Contact
            </a>
            <a href="/admin" className="hover:text-primary">
              Admin
            </a>
          </div>
          <p className="text-xs text-slate-500">© 2026 ProjectFlow. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
