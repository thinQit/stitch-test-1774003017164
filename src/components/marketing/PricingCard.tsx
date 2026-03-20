'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import type { SubscriptionPlan } from '@/types';
import { api } from '@/lib/api';

interface SubscribeResponse {
  success: boolean;
  checkoutUrl?: string;
  clientSecret?: string;
  message?: string;
}

export function PricingCard({ plan, onEnterprise }: { plan: SubscriptionPlan; onEnterprise: () => void }) {
  const [loading, setLoading] = useState(false);
  const isEnterprise = plan.isCustom;

  const handleSubscribe = async () => {
    if (isEnterprise) {
      onEnterprise();
      return;
    }
    try {
      setLoading(true);
      const response = await api.post<SubscribeResponse>('/api/subscribe', {
        planId: plan.id,
        customerEmail: 'customer@example.com'
      });
      if (response?.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      }
    } catch (_error) {
      // eslint-disable-next-line no-console
      console.error('Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <h3 className="text-xl font-semibold">{plan.name}</h3>
        <p className="mt-2 text-3xl font-bold">
          {plan.isCustom ? 'Custom' : `$${plan.priceMonthly ?? 0}`}
          {!plan.isCustom && <span className="text-sm font-medium text-secondary">/mo</span>}
        </p>
        <p className="text-sm text-secondary">
          {plan.isCustom ? 'Tailored to enterprise scale.' : 'Billed monthly, cancel anytime.'}
        </p>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-2 text-sm text-secondary">
          {Array.isArray(plan.features) &&
            plan.features.map((feature, index) => <li key={`${plan.id}-${index}`}>• {feature}</li>)}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          variant={isEnterprise ? 'outline' : 'primary'}
          className="w-full"
          onClick={handleSubscribe}
          disabled={loading}
        >
          {isEnterprise ? 'Contact sales' : 'Start 14-day trial'}
        </Button>
      </CardFooter>
    </Card>
  );
}
