'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import type { Feature, PricingPlan, SiteContent } from '@/types';
import type React from 'react';

export default function AdminPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [pricing, setPricing] = useState<PricingPlan[]>([]);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [featureForm, setFeatureForm] = useState({ id: '', title: '', subtitle: '', description: '' });
  const [pricingForm, setPricingForm] = useState({ id: '', name: '', price_per_month: '', currency: 'USD', features: '', is_custom_contact: false });
  const [contentForm, setContentForm] = useState({ hero_title: '', hero_subtitle: '', footer_text: '' });
  const [message, setMessage] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  const loadData = async () => {
    setDataLoading(true);
    setDataError(null);
    try {
      const [f, p, c] = await Promise.all([
        api.get<Feature[]>('/api/features'),
        api.get<PricingPlan[]>('/api/pricing'),
        api.get<SiteContent>('/api/content')
      ]);
      if (f.error || p.error || c.error) {
        setDataError(f.error || p.error || c.error || 'Failed to load admin data');
      }
      setFeatures(f.data ?? []);
      setPricing(p.data ?? []);
      if (c.data) {
        setContent(c.data);
        setContentForm({
          hero_title: c.data.hero_title || '',
          hero_subtitle: c.data.hero_subtitle || '',
          footer_text: c.data.footer_text || ''
        });
      }
    } catch (err: unknown) {
      setDataError(err instanceof Error ? err.message : 'Failed to load admin data');
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError(null);
    const result = await login(email, password);
    if (!result.success) {
      setAuthError(result.message || 'Login failed');
    }
  };

  const handleFeatureSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    if (featureForm.id) {
      const res = await api.put(`/api/features/${featureForm.id}`, {
        title: featureForm.title,
        subtitle: featureForm.subtitle,
        description: featureForm.description
      });
      if (res.error) return setMessage(res.error);
    } else {
      const res = await api.post('/api/features', {
        title: featureForm.title,
        subtitle: featureForm.subtitle,
        description: featureForm.description
      });
      if (res.error) return setMessage(res.error);
    }
    setFeatureForm({ id: '', title: '', subtitle: '', description: '' });
    await loadData();
  };

  const handleFeatureEdit = (feature: Feature) => {
    setFeatureForm({
      id: feature.id || '',
      title: feature.title || '',
      subtitle: feature.subtitle || '',
      description: feature.description || ''
    });
  };

  const handleFeatureDelete = async (id: string) => {
    const res = await api.delete(`/api/features/${id}`);
    if (res.error) return setMessage(res.error);
    await loadData();
  };

  const handlePricingSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const res = await api.post('/api/pricing', {
      id: pricingForm.id || undefined,
      name: pricingForm.name,
      price_per_month: pricingForm.price_per_month ? Number(pricingForm.price_per_month) : null,
      currency: pricingForm.currency,
      features: pricingForm.features.split(',').map((item) => item.trim()).filter(Boolean),
      is_custom_contact: pricingForm.is_custom_contact
    });
    if (res.error) return setMessage(res.error);
    setPricingForm({ id: '', name: '', price_per_month: '', currency: 'USD', features: '', is_custom_contact: false });
    await loadData();
  };

  const handlePricingEdit = (plan: PricingPlan) => {
    setPricingForm({
      id: plan.id || '',
      name: plan.name || '',
      price_per_month: plan.price_per_month ? String(plan.price_per_month) : '',
      currency: plan.currency || 'USD',
      features: (plan.features || []).join(', '),
      is_custom_contact: Boolean(plan.is_custom_contact)
    });
  };

  const handleContentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const res = await api.put('/api/content', contentForm);
    if (res.error) return setMessage(res.error);
    await loadData();
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner label="Loading" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-6 py-16">
        <Card>
          <Card.Header>
            <h1 className="text-2xl font-semibold text-foreground">Admin login</h1>
            <p className="text-sm text-slate-600">Sign in to manage ProjectFlow content.</p>
          </Card.Header>
          <Card.Content>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                required
              />
              <Button type="submit" className="w-full">
                Sign in
              </Button>
              {authError && <p className="text-sm text-error">{authError}</p>}
            </form>
          </Card.Content>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin dashboard</h1>
        <p className="text-slate-600">Manage features, pricing, and site content.</p>
      </div>
      {message && <p className="mb-6 text-sm text-slate-600">{message}</p>}
      {dataError && <p className="mb-6 rounded-md border border-error bg-red-50 px-4 py-3 text-sm text-error">{dataError}</p>}
      {dataLoading ? (
        <Spinner label="Loading admin data" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-foreground">Feature cards</h2>
            </Card.Header>
            <Card.Content>
              <form onSubmit={handleFeatureSubmit} className="space-y-4">
                <Input
                  label="Title"
                  value={featureForm.title}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFeatureForm({ ...featureForm, title: event.target.value })
                  }
                  required
                />
                <Input
                  label="Subtitle"
                  value={featureForm.subtitle}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFeatureForm({ ...featureForm, subtitle: event.target.value })
                  }
                />
                <Input
                  label="Description"
                  value={featureForm.description}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFeatureForm({ ...featureForm, description: event.target.value })
                  }
                  required
                />
                <Button type="submit">{featureForm.id ? 'Update feature' : 'Add feature'}</Button>
              </form>
              <div className="mt-6 space-y-3">
                {!features.length && <p className="text-sm text-slate-500">No feature cards yet.</p>}
                {features.map((feature) => (
                  <div key={feature.id} className="rounded-md border border-border p-3">
                    <p className="font-semibold text-foreground">{feature.title}</p>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                    <div className="mt-3 flex gap-3 text-sm">
                      <button type="button" onClick={() => handleFeatureEdit(feature)} className="text-primary hover:underline">
                        Edit
                      </button>
                      {feature.id && (
                        <button type="button" onClick={() => handleFeatureDelete(feature.id)} className="text-error hover:underline">
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-foreground">Pricing plans</h2>
            </Card.Header>
            <Card.Content>
              <form onSubmit={handlePricingSubmit} className="space-y-4">
                <Input
                  label="Plan name"
                  value={pricingForm.name}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setPricingForm({ ...pricingForm, name: event.target.value })
                  }
                  required
                />
                <Input
                  label="Monthly price"
                  type="number"
                  value={pricingForm.price_per_month}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setPricingForm({ ...pricingForm, price_per_month: event.target.value })
                  }
                />
                <Input
                  label="Currency"
                  value={pricingForm.currency}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setPricingForm({ ...pricingForm, currency: event.target.value })
                  }
                />
                <Input
                  label="Features (comma separated)"
                  value={pricingForm.features}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setPricingForm({ ...pricingForm, features: event.target.value })
                  }
                />
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={pricingForm.is_custom_contact}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setPricingForm({ ...pricingForm, is_custom_contact: event.target.checked })
                    }
                    className="h-4 w-4 rounded border-border"
                  />
                  Custom contact plan
                </label>
                <Button type="submit">{pricingForm.id ? 'Update plan' : 'Add plan'}</Button>
              </form>
              <div className="mt-6 space-y-3">
                {!pricing.length && <p className="text-sm text-slate-500">No pricing plans yet.</p>}
                {pricing.map((plan) => (
                  <div key={plan.id} className="rounded-md border border-border p-3">
                    <p className="font-semibold text-foreground">{plan.name}</p>
                    <p className="text-sm text-slate-600">
                      {plan.is_custom_contact ? 'Custom pricing' : `$${plan.price_per_month}/mo`}
                    </p>
                    <button
                      type="button"
                      onClick={() => handlePricingEdit(plan)}
                      className="mt-2 text-sm text-primary hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>
      )}

      <div className="mt-6">
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-foreground">Site content</h2>
            <p className="text-sm text-slate-600">Update hero and footer copy for the marketing site.</p>
          </Card.Header>
          <Card.Content>
            <form onSubmit={handleContentSubmit} className="space-y-4">
              <Input
                label="Hero title"
                value={contentForm.hero_title}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setContentForm({ ...contentForm, hero_title: event.target.value })
                }
              />
              <Input
                label="Hero subtitle"
                value={contentForm.hero_subtitle}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setContentForm({ ...contentForm, hero_subtitle: event.target.value })
                }
              />
              <Input
                label="Footer text"
                value={contentForm.footer_text}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setContentForm({ ...contentForm, footer_text: event.target.value })
                }
              />
              <Button type="submit">Save content</Button>
            </form>
            {!content && <p className="mt-4 text-sm text-slate-500">No content set yet.</p>}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
