"use client";

import { useState } from 'react';
import { PricingCard } from '@/components/marketing/PricingCard';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { EnterpriseContactForm } from '@/components/enterprise/EnterpriseContactForm';
import { api } from '@/lib/api';
import { PricingTier } from '@/types';

interface PricingSectionProps {
  tiers: PricingTier[];
  headline?: string;
  description?: string;
}

export function PricingSection({
  tiers,
  headline = 'Pricing that scales with your team',
  description = 'Choose the plan that meets your roadmap, from fast-moving startups to global enterprises.'
}: PricingSectionProps) {
  const [email, setEmail] = useState('');
  const [planInterest, setPlanInterest] = useState('Pro');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [showEnterpriseModal, setShowEnterpriseModal] = useState(false);

  const handleSubscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const response = await api.post<{ success: boolean; message: string }>('/api/subscribe', {
        email,
        planInterest
      });
      if (!response) {
        setStatus('error');
        setMessage('Unable to subscribe right now.');
        return;
      }
      if (response.success) {
        setStatus('success');
        setMessage(response.message || 'Thanks for subscribing!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(response.message || 'Something went wrong.');
      }
    } catch (_error: unknown) {
      setStatus('error');
      setMessage('Unable to subscribe right now. Please try again.');
    }
  };

  return (
    <section className="bg-muted/40 py-16">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold md:text-4xl">{headline}</h2>
          <p className="mt-3 text-sm text-foreground/70 md:text-base">{description}</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <PricingCard
              key={tier.id}
              name={tier.name}
              monthlyPrice={tier.monthlyPrice}
              isCustom={tier.isCustom}
              features={tier.features}
              highlighted={tier.name === 'Pro'}
              onSelect={() => (tier.isCustom ? setShowEnterpriseModal(true) : setPlanInterest(tier.name))}
            />
          ))}
        </div>
        <div className="mt-12 rounded-2xl border border-border bg-background p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold">Stay in the loop</h3>
              <p className="mt-2 text-sm text-foreground/70">
                Join the ProjectFlow insider list for launch updates, roadmap previews, and tailored plan offers.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full flex-col gap-3 md:max-w-md md:flex-row">
              <Input
                type="email"
                required
                placeholder="you@company.com"
                aria-label="Email address"
                value={email}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
              />
              <Button type="submit" size="md" className="md:w-40">
                {status === 'loading' ? 'Submitting' : 'Subscribe'}
              </Button>
            </form>
          </div>
          <div className="mt-3 text-sm text-foreground/70">
            {status === 'loading' && <Spinner />}
            {status === 'success' && <p className="text-success">{message}</p>}
            {status === 'error' && <p className="text-error">{message}</p>}
          </div>
        </div>
      </div>
      <Modal open={showEnterpriseModal} title="Enterprise Contact" onClose={() => setShowEnterpriseModal(false)}>
        <EnterpriseContactForm onSubmitted={() => setShowEnterpriseModal(false)} />
      </Modal>
    </section>
  );
}
