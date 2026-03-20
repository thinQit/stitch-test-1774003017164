'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import type { Feature, PricingPlan, SiteContent } from '@/types';
import type React from 'react';

const fallbackFeatures: Feature[] = [
  {
    id: 'smart',
    title: 'Smart Scheduling',
    subtitle: 'Plan with precision',
    description: 'AI builds milestones, predicts risk, and adapts timelines to keep projects on track.'
  },
  {
    id: 'reporting',
    title: 'Automated Reporting',
    subtitle: 'Always up to date',
    description: 'Weekly status updates, health scores, and executive summaries delivered automatically.'
  },
  {
    id: 'insights',
    title: 'Team Insights',
    subtitle: 'Know what matters',
    description: 'Capacity, velocity, and engagement insights help leaders balance the load.'
  }
];

const fallbackPricing: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price_per_month: 29,
    currency: 'USD',
    features: ['Smart scheduling', 'Email reports', 'Up to 5 projects'],
    is_custom_contact: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price_per_month: 79,
    currency: 'USD',
    features: ['Everything in Starter', 'Team insights', 'Unlimited projects'],
    is_custom_contact: false
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price_per_month: null,
    currency: 'USD',
    features: ['Custom workflows', 'Dedicated success', 'Security reviews'],
    is_custom_contact: true
  }
];

export default function HomePage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [pricing, setPricing] = useState<PricingPlan[]>([]);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [contact, setContact] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<string | null>(null);
  const [contactStatus, setContactStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [f, p, c] = await Promise.all([
          api.get<Feature[]>('/api/features'),
          api.get<PricingPlan[]>('/api/pricing'),
          api.get<SiteContent>('/api/content')
        ]);
        if (f.error || p.error || c.error) {
          setError(f.error || p.error || c.error || 'Failed to load content');
        }
        setFeatures(f.data ?? []);
        setPricing(p.data ?? []);
        setContent(c.data ?? null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const featureItems = useMemo(() => (features.length ? features : fallbackFeatures), [features]);
  const pricingItems = useMemo(() => (pricing.length ? pricing : fallbackPricing), [pricing]);

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);
    if (!subscribeEmail.trim()) {
      setStatus('Please enter a valid email.');
      return;
    }
    const res = await api.post('/api/subscribers', { email: subscribeEmail });
    if (res.error) {
      setStatus(res.error);
      return;
    }
    setStatus('Thanks for subscribing!');
    setSubscribeEmail('');
  };

  const handleContact = async (event: React.FormEvent) => {
    event.preventDefault();
    setContactStatus(null);
    if (!contact.name.trim() || !contact.email.trim() || !contact.message.trim()) {
      setContactStatus('Please fill in all fields.');
      return;
    }
    const res = await api.post('/api/contact', contact);
    if (res.error) {
      setContactStatus(res.error);
      return;
    }
    setContactStatus('Message received. We will get back to you shortly.');
    setContact({ name: '', email: '', message: '' });
  };

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-cyan-200/20" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">ProjectFlow</p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
                {content?.hero_title || 'AI-powered project management that keeps teams in flow'}
              </h1>
              <p className="mt-5 text-lg text-slate-600">
                {content?.hero_subtitle ||
                  'Automate planning, deliverables, and reporting with smart scheduling, instant insights, and streamlined collaboration built for modern teams.'}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild>
                  <Link href="#pricing">See pricing</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/signup">Start a trial</Link>
                </Button>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  <span>99.9% uptime</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span>Launch in days, not months</span>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-3xl border border-border bg-white/70 shadow-lg backdrop-blur">
              <Image
                src="/images/hero.jpg"
                alt="ProjectFlow dashboard preview"
                width={1200}
                height={675}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {error && (
        <section className="mx-auto max-w-6xl px-6 pb-4">
          <div className="rounded-md border border-error bg-red-50 px-4 py-3 text-sm text-error">{error}</div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <div className="text-left">
              <h2 className="text-3xl font-bold text-foreground">Features built for momentum</h2>
              <p className="mt-4 text-slate-600">Every capability is tuned for fast-moving product and delivery teams.</p>
            </div>
            {loading ? (
              <div className="mt-8">
                <Spinner label="Loading features" />
              </div>
            ) : (
              <div className="mt-10 grid gap-6">
                {!features.length && (
                  <p className="text-sm text-slate-500">No custom features yet. Showing our recommended set.</p>
                )}
                <div className="grid gap-6 md:grid-cols-2">
                  {featureItems.map((feature) => (
                    <Card key={feature.id} className="h-full">
                      <Card.Header>
                        <p className="text-sm font-semibold text-primary">{feature.subtitle}</p>
                        <h3 className="mt-2 text-xl font-semibold text-foreground">{feature.title}</h3>
                      </Card.Header>
                      <Card.Content>
                        <p className="text-slate-600">{feature.description}</p>
                      </Card.Content>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
            <Image
              src="/images/feature.jpg"
              alt="ProjectFlow feature workflow"
              width={1200}
              height={675}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-3xl font-bold text-foreground">Pricing that scales with you</h2>
            <p className="text-slate-600">Choose the plan that fits your team. Upgrade anytime.</p>
          </div>
          {loading ? (
            <div className="mt-10 flex justify-center">
              <Spinner label="Loading pricing" />
            </div>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {!pricing.length && (
                <p className="md:col-span-3 text-center text-sm text-slate-500">
                  No custom pricing yet. Showing our default tiers.
                </p>
              )}
              {pricingItems.map((plan) => (
                <Card key={plan.id} className="flex h-full flex-col">
                  <Card.Header>
                    <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                    <p className="mt-2 text-3xl font-bold text-foreground">
                      {plan.is_custom_contact ? 'Custom' : `$${plan.price_per_month}/mo`}
                    </p>
                    <p className="text-sm text-slate-500">
                      {plan.is_custom_contact ? 'Talk to sales for a tailored rollout.' : 'Billed monthly, cancel anytime.'}
                    </p>
                  </Card.Header>
                  <Card.Content className="flex-1">
                    <ul className="space-y-2 text-sm text-slate-600">
                      {(plan.features || []).map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card.Content>
                  <Card.Footer>
                    <Button asChild className="w-full">
                      <Link href={`/signup?plan=${plan.id}`}>{plan.is_custom_contact ? 'Contact sales' : 'Start with ' + plan.name}</Link>
                    </Button>
                  </Card.Footer>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2">
          <Card>
            <Card.Header>
              <h3 className="text-xl font-semibold text-foreground">Join the ProjectFlow updates list</h3>
              <p className="text-sm text-slate-600">Get product tips, release notes, and beta access.</p>
            </Card.Header>
            <Card.Content>
              <form onSubmit={handleSubscribe} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={subscribeEmail}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSubscribeEmail(event.target.value)}
                  required
                />
                <Button type="submit">Subscribe</Button>
                {status && <p className="text-sm text-slate-600">{status}</p>}
              </form>
            </Card.Content>
          </Card>
          <Card>
            <Card.Header>
              <h3 className="text-xl font-semibold text-foreground">Contact us</h3>
              <p className="text-sm text-slate-600">Tell us about your team and we will follow up.</p>
            </Card.Header>
            <Card.Content>
              <form onSubmit={handleContact} className="space-y-4">
                <Input
                  label="Name"
                  name="name"
                  value={contact.name}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setContact({ ...contact, name: event.target.value })}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={contact.email}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setContact({ ...contact, email: event.target.value })}
                  required
                />
                <label className="block text-sm text-slate-600">
                  <span className="mb-1 block font-medium text-slate-700">Message</span>
                  <textarea
                    name="message"
                    value={contact.message}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setContact({ ...contact, message: event.target.value })
                    }
                    required
                    className="min-h-[120px] w-full rounded-md border border-border px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </label>
                <Button type="submit">Send message</Button>
                {contactStatus && <p className="text-sm text-slate-600">{contactStatus}</p>}
              </form>
            </Card.Content>
          </Card>
        </div>
      </section>

      <section className="bg-slate-900 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div className="text-white">
            <h2 className="text-3xl font-bold">Ready to move faster with ProjectFlow?</h2>
            <p className="mt-4 text-slate-200">
              Launch an AI-powered project hub that keeps leadership, delivery, and teams aligned.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/signup">Start a trial</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/features">Explore features</Link>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-slate-800">
            <Image
              src="/images/cta.jpg"
              alt="ProjectFlow team collaboration"
              width={1200}
              height={675}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold text-foreground">ProjectFlow</p>
            <p className="text-sm text-slate-500">{content?.footer_text || 'AI-powered project management for modern teams.'}</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <Link href="/features" className="hover:text-primary">
              Features
            </Link>
            <Link href="/pricing" className="hover:text-primary">
              Pricing
            </Link>
            <Link href="/signup" className="hover:text-primary">
              Signup
            </Link>
            <Link href="/admin" className="hover:text-primary">
              Admin
            </Link>
          </div>
          <p className="text-xs text-slate-400">© 2026 ProjectFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
