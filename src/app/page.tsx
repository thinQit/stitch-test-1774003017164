'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Feature, PricingTier } from '@/types';
import Button from '@/components/ui/Button';
import Card, { CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';

type Message = { type: 'success' | 'error'; text: string };

type FormState = {
  name: string;
  email: string;
  company: string;
  planInterest: string;
};

export default function HomePage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    company: '',
    planInterest: 'pro'
  });
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [featuresData, tiersData] = await Promise.all([
          api.get<Feature[]>('/api/features'),
          api.get<PricingTier[]>('/api/tiers')
        ]);
        const featureList = Array.isArray(featuresData) ? featuresData : [];
        const tierList = Array.isArray(tiersData) ? tiersData : [];
        setFeatures(featureList);
        setTiers(tierList);
      } catch (error: unknown) {
        setError((error as Error).message || 'Unable to load content.');
        setFeatures([]);
        setTiers([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    if (!formState.name || !formState.email) {
      setMessage({ type: 'error', text: 'Name and email are required.' });
      return;
    }
    try {
      await api.post<{ id: string }>('/api/subscribe', formState);
      setMessage({
        type: 'success',
        text: 'Thanks! We will reach out with your personalized ProjectFlow demo.'
      });
      setFormState({ name: '', email: '', company: '', planInterest: 'pro' });
    } catch (error: unknown) {
      setMessage({
        type: 'error',
        text: (error as Error).message || 'Unable to submit. Please try again.'
      });
    }
  };

  const handleCheckout = async (
    event: React.FormEvent<HTMLFormElement>,
    tier: PricingTier
  ) => {
    event.preventDefault();
    if (tier.isCustom) {
      return;
    }
    try {
      const response = await api.post<{ url?: string }>(
        '/api/checkout',
        { tierId: tier.id }
      );
      if (response?.url) {
        window.location.href = response.url;
      }
    } catch (_error) {
      // handled silently for now
    }
  };

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-primary-hover text-white">
        <Image
          src="/images/hero.jpg"
          alt="ProjectFlow hero"
          width={1200}
          height={675}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-secondary/70 to-primary-hover/80" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-8 px-4 py-20 lg:flex-row lg:items-center lg:px-6">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-white/80">AI-Powered ProjectOps</p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              ProjectFlow keeps every team aligned, automated, and ahead of schedule.
            </h1>
            <p className="max-w-xl text-lg text-white/90">
              Launch projects faster with AI scheduling, automated status reporting, and real-time team insights. ProjectFlow gives leaders a single view of progress and risk.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="#pricing" className="inline-flex">
                <Button size="lg" variant="secondary">View Pricing</Button>
              </Link>
              <Link href="/contact" className="inline-flex">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Book a Demo
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full max-w-md rounded-2xl bg-white/10 p-6 backdrop-blur">
            <h2 className="text-xl font-semibold">Live status in minutes</h2>
            <p className="mt-2 text-sm text-white/80">
              Connect your tools and ProjectFlow will build an executive-ready project dashboard in one day.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white/20" />
              <div>
                <p className="text-sm font-semibold">98% on-time milestones</p>
                <p className="text-xs text-white/70">Across teams using ProjectFlow AI</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-secondary">Features</p>
            <h2 className="mt-2 text-3xl font-bold">Designed for fast-moving product teams</h2>
          </div>
          {loading && <Spinner />}
        </div>
        {error && <p className="mb-6 text-sm text-error">{error}</p>}
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-1">
            {features.map((feature) => (
              <Card key={feature.id} className="bg-white/80">
                <CardHeader>
                  <p className="text-xs uppercase tracking-[0.3em] text-secondary">{feature.icon}</p>
                  <h3 className="mt-3 text-xl font-semibold">{feature.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/70">{feature.summary}</p>
                </CardContent>
              </Card>
            ))}
            {!loading && features.length === 0 && (
              <Card>
                <CardContent>
                  <p className="text-sm text-foreground/70">No features available right now.</p>
                </CardContent>
              </Card>
            )}
          </div>
          <div className="relative overflow-hidden rounded-2xl">
            <Image
              src="/images/feature.jpg"
              alt="ProjectFlow feature overview"
              width={1200}
              height={675}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
          <div className="mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-secondary">Pricing</p>
            <h2 className="mt-2 text-3xl font-bold">Plans that grow with your roadmap</h2>
            <p className="mt-2 max-w-xl text-sm text-foreground/70">
              Choose a tier that matches your project scale. Upgrade instantly as teams grow.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {tiers.map((tier) => (
              <Card key={tier.id} className="relative overflow-hidden border-border">
                <CardHeader>
                  <h3 className="text-xl font-semibold">{tier.name}</h3>
                  <p className="mt-2 text-3xl font-bold">
                    {tier.isCustom ? 'Custom' : `$${tier.pricePerMonth}`}
                    {!tier.isCustom && (
                      <span className="text-sm font-medium text-foreground/70">/mo</span>
                    )}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-foreground/70">
                    {tier.features?.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {tier.isCustom ? (
                    <Link href="/contact" className="w-full">
                      <Button className="w-full" variant="outline">Contact Sales</Button>
                    </Link>
                  ) : (
                    <form className="w-full" onSubmit={(event) => handleCheckout(event, tier)}>
                      <Button className="w-full">Start Checkout</Button>
                    </form>
                  )}
                </CardFooter>
              </Card>
            ))}
            {!loading && tiers.length === 0 && (
              <Card>
                <CardContent>
                  <p className="text-sm text-foreground/70">No pricing tiers available.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
        <div className="grid gap-10 rounded-2xl bg-muted p-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Get updates and early access</h2>
            <p className="text-sm text-foreground/70">
              Join the ProjectFlow newsletter for launch updates, AI playbooks, and invites to our private beta.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4" aria-label="Newsletter signup">
              <Input
                label="Name"
                name="name"
                value={formState.name}
                onChange={handleInputChange}
                placeholder="Your name"
                required
              />
              <Input
                label="Work email"
                type="email"
                name="email"
                value={formState.email}
                onChange={handleInputChange}
                placeholder="you@company.com"
                required
              />
              <Input
                label="Company"
                name="company"
                value={formState.company}
                onChange={handleInputChange}
                placeholder="Company"
              />
              <Input
                label="Plan interest"
                name="planInterest"
                value={formState.planInterest}
                onChange={handleInputChange}
                placeholder="starter | pro | enterprise"
              />
              {message && (
                <p className={message.type === 'success' ? 'text-success text-sm' : 'text-error text-sm'}>
                  {message.text}
                </p>
              )}
              <Button type="submit" className="w-full">Join the list</Button>
            </form>
          </div>
          <div className="relative overflow-hidden rounded-2xl">
            <Image
              src="/images/cta.jpg"
              alt="ProjectFlow call to action"
              width={1200}
              height={675}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <div>
            <p className="text-lg font-semibold">ProjectFlow</p>
            <p className="text-sm text-foreground/70">AI-powered project management for modern product teams.</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-foreground/70">
            <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
            <Link href="/admin" className="hover:text-foreground">Admin</Link>
          </div>
        </div>
        <div className="border-t border-border py-4 text-center text-xs text-foreground/60">© 2026 ProjectFlow. All rights reserved.</div>
      </footer>
    </div>
  );
}
