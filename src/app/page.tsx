'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import type { FeatureCard } from '@/types';

type SubscribeResponse = { success: boolean; message?: string };

type ContactResponse = { success: boolean; message?: string };

type PricingTier = {
  id: string;
  name: string;
  priceMonthly: number | 'custom';
  benefits: string[];
};

type PricingResponse = { tiers: PricingTier[] };

export default function HomePage() {
  const [subscribeState, setSubscribeState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [contactState, setContactState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [featuresState, setFeaturesState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [pricingState, setPricingState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [features, setFeatures] = useState<FeatureCard[]>([]);
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const data = await api.get<FeatureCard[]>('/api/features');
        const items = Array.isArray(data) ? data : [];
        setFeatures(items);
        setFeaturesState('ready');
      } catch (_error) {
        setFeaturesState('error');
      }
    };

    const loadPricing = async () => {
      try {
        const data = await api.get<PricingResponse>('/api/pricing');
        const items = data?.tiers ?? [];
        setTiers(items);
        setPricingState('ready');
      } catch (_error) {
        setPricingState('error');
      }
    };

    void loadFeatures();
    void loadPricing();
  }, []);

  const handleSubscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubscribeState('loading');
    try {
      const response = await api.post<SubscribeResponse>('/api/subscribe', { email: subscribeEmail, plan: 'starter' });
      if (response?.success) {
        setSubscribeState('success');
        setSubscribeEmail('');
      } else {
        setSubscribeState('error');
      }
    } catch (_error) {
      setSubscribeState('error');
    }
  };

  const handleContact = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContactState('loading');
    try {
      const response = await api.post<ContactResponse>('/api/contact', contactForm);
      if (response?.success) {
        setContactState('success');
        setContactForm({ name: '', email: '', message: '' });
      } else {
        setContactState('error');
      }
    } catch (_error) {
      setContactState('error');
    }
  };

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 py-20 text-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/80">AI-powered project management</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              ProjectFlow keeps teams aligned, automated, and ahead of schedule.
            </h1>
            <p className="mt-4 text-base text-white/90">
              Automate planning, reporting, and team insights with a single workspace designed for modern product teams.
              ProjectFlow turns roadmap chaos into clear execution.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="inline-flex">
                <Button size="lg">Get started</Button>
              </Link>
              <Link href="#contact" className="inline-flex">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Contact sales
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/images/hero.jpg"
              alt="ProjectFlow dashboard preview"
              width={1200}
              height={675}
              className="rounded-2xl object-cover shadow-2xl"
            />
            <div className="absolute inset-0 rounded-2xl bg-black/10" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center" id="features">
        <div>
          <p className="text-sm font-semibold uppercase text-primary">Features</p>
          <h2 className="mt-2 text-3xl font-bold">Everything your team needs to ship faster</h2>
          <p className="mt-3 text-secondary">
            ProjectFlow brings AI-driven scheduling, automated reporting, and team insights together in one workspace.
          </p>
          {featuresState === 'loading' && (
            <div className="mt-6 flex items-center gap-2 text-sm text-secondary">
              <Spinner /> Loading features...
            </div>
          )}
          {featuresState === 'error' && <p className="mt-6 text-sm text-error">Unable to load features right now.</p>}
          {featuresState === 'ready' && features.length === 0 && (
            <p className="mt-6 text-sm text-secondary">No features available yet.</p>
          )}
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.id}>
                <CardHeader>
                  <div className="text-3xl">{feature.icon ?? '✨'}</div>
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                </CardHeader>
                <CardContent>{feature.description}</CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="relative">
          <Image
            src="/images/feature.jpg"
            alt="Team collaborating with ProjectFlow"
            width={1200}
            height={675}
            className="rounded-2xl object-cover shadow-lg"
          />
        </div>
      </section>

      <section className="bg-muted py-16" id="pricing">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase text-primary">Pricing</p>
            <h2 className="mt-2 text-3xl font-bold">Choose the plan that fits your team</h2>
            <p className="mt-3 text-secondary">Flexible tiers for startups to enterprise portfolios.</p>
          </div>
          {pricingState === 'loading' && (
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-secondary">
              <Spinner /> Loading pricing...
            </div>
          )}
          {pricingState === 'error' && <p className="mt-8 text-center text-sm text-error">Unable to load pricing.</p>}
          {pricingState === 'ready' && tiers.length === 0 && (
            <p className="mt-8 text-center text-sm text-secondary">Pricing tiers will be available soon.</p>
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
                  <ul className="list-disc space-y-2 pl-4">
                    {tier.benefits.map((benefit) => (
                      <li key={benefit}>{benefit}</li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Link href={tier.id === 'enterprise' ? '#contact' : '/signup'}>
                    <Button variant={tier.id === 'pro' ? 'primary' : 'outline'}>
                      {tier.id === 'enterprise' ? 'Contact sales' : 'Get started'}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16" id="subscribe">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-2xl font-bold">Stay ahead with ProjectFlow insights</h2>
            <p className="mt-3 text-secondary">
              Get product updates, AI workflow playbooks, and early access to new features.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              required
              aria-label="Email address"
              placeholder="you@company.com"
              value={subscribeEmail}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSubscribeEmail(event.target.value)}
            />
            <Button type="submit" disabled={subscribeState === 'loading'}>
              {subscribeState === 'loading' ? 'Submitting...' : 'Subscribe'}
            </Button>
          </form>
          {subscribeState === 'success' && <p className="text-sm text-success">Thanks for joining! Check your inbox soon.</p>}
          {subscribeState === 'error' && <p className="text-sm text-error">Something went wrong. Try again shortly.</p>}
        </div>
      </section>

      <section className="bg-muted py-16" id="contact">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-bold">Talk with our team</h2>
            <p className="mt-3 text-secondary">Tell us about your roadmap. We will help tailor ProjectFlow for you.</p>
            <div className="mt-6">
              <Image
                src="/images/cta.jpg"
                alt="ProjectFlow team support"
                width={1200}
                height={675}
                className="rounded-2xl object-cover shadow-lg"
              />
            </div>
          </div>
          <form onSubmit={handleContact} className="grid gap-4 rounded-lg border border-border bg-white p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Name"
                required
                value={contactForm.name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setContactForm({ ...contactForm, name: event.target.value })
                }
              />
              <Input
                label="Email"
                type="email"
                required
                value={contactForm.email}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setContactForm({ ...contactForm, email: event.target.value })
                }
              />
            </div>
            <label className="block text-sm text-foreground">
              <span className="mb-1 block font-medium">Message</span>
              <textarea
                required
                className="min-h-[120px] w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                value={contactForm.message}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setContactForm({ ...contactForm, message: event.target.value })
                }
              />
            </label>
            <Button type="submit" disabled={contactState === 'loading'}>
              {contactState === 'loading' ? 'Sending...' : 'Send message'}
            </Button>
            {contactState === 'success' && <p className="text-sm text-success">Message sent. We will reply soon.</p>}
            {contactState === 'error' && <p className="text-sm text-error">Unable to send. Please retry.</p>}
          </form>
        </div>
      </section>

      <footer className="border-t border-border bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-sm text-secondary md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-foreground">ProjectFlow</p>
            <p>AI-powered project management for modern teams.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/pricing" className="hover:text-primary">
              Pricing
            </Link>
            <Link href="/signin" className="hover:text-primary">
              Sign in
            </Link>
            <Link href="/signup" className="hover:text-primary">
              Get started
            </Link>
          </div>
          <p>© {new Date().getFullYear()} ProjectFlow. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
