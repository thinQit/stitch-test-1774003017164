'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import type { PricingPlan } from '@/types';
import type React from 'react';

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

export default function SignupPage() {
  const searchParams = useSearchParams();
  const [pricing, setPricing] = useState<PricingPlan[]>([]);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const planId = searchParams.get('plan');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<PricingPlan[]>('/api/pricing');
        if (res.error) {
          setError(res.error);
        }
        setPricing(res.data ?? []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load pricing');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const pricingItems = useMemo(() => (pricing.length ? pricing : fallbackPricing), [pricing]);
  const selectedPlan = pricingItems.find((plan) => plan.id === planId) || pricingItems[0];

  const handleCheckout = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);
    if (!email.trim()) {
      setStatus('Please enter a valid email.');
      return;
    }
    if (!selectedPlan) {
      setStatus('Please select a plan first.');
      return;
    }
    if (selectedPlan.is_custom_contact) {
      const res = await api.post('/api/contact', { name: 'Enterprise Lead', email, message: message || 'Enterprise inquiry' });
      if (res.error) {
        setStatus(res.error);
        return;
      }
      setStatus('Thanks! Our team will reach out soon.');
      setEmail('');
      setMessage('');
      return;
    }
    const res = await api.post('/api/checkout', { planId: selectedPlan.id, email });
    if (res.error) {
      setStatus(res.error);
      return;
    }
    setStatus('Checkout session created. We will email you next steps.');
    setEmail('');
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground">Start with ProjectFlow</h1>
        <p className="mt-4 text-slate-600">Choose a plan and activate your account in minutes.</p>
      </div>

      {error && (
        <div className="mt-8 rounded-md border border-error bg-red-50 px-4 py-3 text-sm text-error">{error}</div>
      )}

      {loading ? (
        <div className="mt-12 flex justify-center">
          <Spinner label="Loading plans" />
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-foreground">Plan summary</h2>
            </Card.Header>
            <Card.Content>
              {selectedPlan ? (
                <div className="space-y-4">
                  <p className="text-lg font-semibold text-foreground">{selectedPlan.name}</p>
                  <p className="text-2xl font-bold text-foreground">
                    {selectedPlan.is_custom_contact ? 'Custom pricing' : `$${selectedPlan.price_per_month}/mo`}
                  </p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {(selectedPlan.features || []).map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-slate-600">No plans available.</p>
              )}
            </Card.Content>
            <div className="overflow-hidden rounded-2xl border border-border">
              <Image
                src="/images/cta.jpg"
                alt="ProjectFlow onboarding"
                width={1200}
                height={675}
                className="h-full w-full object-cover"
              />
            </div>
          </Card>
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-foreground">Checkout</h2>
              <p className="text-sm text-slate-600">Provide your email to continue.</p>
            </Card.Header>
            <Card.Content>
              <form onSubmit={handleCheckout} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                  required
                />
                {selectedPlan?.is_custom_contact && (
                  <Input
                    label="Message"
                    name="message"
                    value={message}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setMessage(event.target.value)}
                    required
                  />
                )}
                <Button type="submit" className="w-full">
                  {selectedPlan?.is_custom_contact ? 'Request contact' : 'Create checkout session'}
                </Button>
                {status && <p className="text-sm text-slate-600">{status}</p>}
              </form>
            </Card.Content>
          </Card>
        </div>
      )}
    </div>
  );
}
