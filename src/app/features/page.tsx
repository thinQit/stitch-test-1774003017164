'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { api } from '@/lib/api';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import type { Feature } from '@/types';

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

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<Feature[]>('/api/features');
        if (res.error) {
          setError(res.error);
        }
        setFeatures(res.data ?? []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load features');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const featureItems = useMemo(() => (features.length ? features : fallbackFeatures), [features]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">ProjectFlow features</h1>
          <p className="mt-4 text-slate-600">Smart automation, clear insights, and effortless collaboration.</p>
        </div>
        <div className="overflow-hidden rounded-3xl border border-border">
          <Image
            src="/images/feature.jpg"
            alt="ProjectFlow feature detail"
            width={1200}
            height={675}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {error && (
        <div className="mt-8 rounded-md border border-error bg-red-50 px-4 py-3 text-sm text-error">{error}</div>
      )}

      {loading ? (
        <div className="mt-12 flex justify-center">
          <Spinner label="Loading features" />
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {!features.length && (
            <p className="md:col-span-3 text-center text-sm text-slate-500">No custom features yet. Showing our defaults.</p>
          )}
          {featureItems.map((feature) => (
            <Card key={feature.id}>
              <Card.Header>
                <p className="text-sm font-semibold text-primary">{feature.subtitle}</p>
                <h2 className="mt-2 text-xl font-semibold text-foreground">{feature.title}</h2>
              </Card.Header>
              <Card.Content>
                <p className="text-slate-600">{feature.description}</p>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
