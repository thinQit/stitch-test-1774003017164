'use client';

import { useEffect, useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { Lead, Plan } from '@/types';
import { useAuth } from '@/providers/AuthProvider';

const emptyPlanForm = { name: '', price_monthly: '', billing_description: '', features: '', is_custom: false };

type PlanFormState = typeof emptyPlanForm;

export default function AdminPage() {
  const { user, login, logout, loading: authLoading } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<PlanFormState>(emptyPlanForm);
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [authError, setAuthError] = useState('');

  const featureList = useMemo(
    () => form.features.split(',').map((item) => item.trim()).filter(Boolean),
    [form.features]
  );

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [plansResponse, leadsResponse] = await Promise.all([
        api.get<{ plans: Plan[] }>('/api/plans'),
        api.get<{ leads: Lead[] }>('/api/leads')
      ]);
      setPlans(plansResponse?.plans || []);
      setLeads(leadsResponse?.leads || []);
    } catch (_error) {
      setError('Unable to load admin data.');
      setPlans([]);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const handleCreatePlan = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const priceValue = form.price_monthly === '' ? null : Number(form.price_monthly);
    const payload = {
      name: form.name,
      price_monthly: form.is_custom ? null : priceValue,
      billing_description: form.billing_description,
      features: featureList,
      is_custom: form.is_custom
    };
    try {
      await api.post('/api/plans', payload);
      setForm(emptyPlanForm);
      loadData();
    } catch (_error) {
      setError('Unable to create plan.');
    }
  };

  const handleUpdatePlan = async (plan: Plan) => {
    try {
      await api.put(`/api/plans/${plan.id}`, {
        name: plan.name,
        price_monthly: plan.price_monthly,
        billing_description: plan.billing_description,
        features: plan.features,
        is_custom: plan.is_custom
      });
      loadData();
    } catch (_error) {
      setError('Unable to update plan.');
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      await api.delete(`/api/plans/${planId}`);
      loadData();
    } catch (_error) {
      setError('Unable to delete plan.');
    }
  };

  const handleAuthSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError('');
    try {
      await login(authForm.email, authForm.password);
    } catch (_error) {
      setAuthError('Invalid credentials.');
    }
  };

  if (authLoading) {
    return (
      <main className="mx-auto flex max-w-6xl justify-center px-6 py-20">
        <Spinner />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-md px-6 py-16">
        <Card>
          <h1 className="text-2xl font-semibold">Admin Sign In</h1>
          <p className="mt-2 text-sm text-slate-600">Use your admin credentials to manage plans and leads.</p>
          <form onSubmit={handleAuthSubmit} className="mt-6 space-y-4">
            <Input
              label="Email"
              name="email"
              type="email"
              required
              value={authForm.email}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setAuthForm((prev) => ({ ...prev, email: event.target.value }))
              }
            />
            <Input
              label="Password"
              name="password"
              type="password"
              required
              value={authForm.password}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setAuthForm((prev) => ({ ...prev, password: event.target.value }))
              }
            />
            <Button type="submit">Sign in</Button>
            {authError && <p className="text-sm text-error">{authError}</p>}
          </form>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-slate-600">Manage pricing plans and review captured leads.</p>
        </div>
        <Button variant="ghost" onClick={logout}>
          Sign out
        </Button>
      </div>

      {error && <p className="mt-6 text-sm text-error">{error}</p>}

      <section className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h2 className="text-xl font-semibold">Create a pricing plan</h2>
          <form onSubmit={handleCreatePlan} className="mt-6 space-y-4">
            <Input
              label="Plan name"
              name="name"
              required
              value={form.name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
            />
            <Input
              label="Monthly price"
              name="price"
              type="number"
              value={form.price_monthly}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setForm((prev) => ({ ...prev, price_monthly: event.target.value }))
              }
              placeholder="79"
            />
            <Input
              label="Billing description"
              name="billing_description"
              value={form.billing_description}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setForm((prev) => ({ ...prev, billing_description: event.target.value }))
              }
            />
            <Input
              label="Features (comma separated)"
              name="features"
              value={form.features}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setForm((prev) => ({ ...prev, features: event.target.value }))
              }
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_custom}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setForm((prev) => ({ ...prev, is_custom: event.target.checked }))
                }
                className="h-4 w-4 rounded border-slate-300"
              />
              Custom/enterprise plan
            </label>
            <Button type="submit">Create plan</Button>
          </form>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Captured leads</h2>
          {loading ? (
            <div className="mt-6 flex justify-center">
              <Spinner />
            </div>
          ) : leads.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">No leads captured yet.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {leads.map((lead) => (
                <div key={lead.id} className="rounded-lg border border-slate-200 p-4">
                  <p className="text-sm font-semibold">{lead.email}</p>
                  <p className="text-xs text-slate-500">
                    {lead.name || 'Anonymous'} • {lead.source || 'unknown'} •{' '}
                    {lead.createdAt ? formatDate(lead.createdAt) : 'N/A'}
                  </p>
                  {lead.message && <p className="mt-2 text-sm text-slate-700">{lead.message}</p>}
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Existing plans</h2>
        {loading ? (
          <div className="mt-6 flex justify-center">
            <Spinner />
          </div>
        ) : plans.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">No plans available yet.</p>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {plans.map((plan) => (
              <Card key={plan.id} className="space-y-4">
                <Input
                  label="Name"
                  name={`name-${plan.id}`}
                  value={plan.name}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setPlans((prev) =>
                      prev.map((item) => (item.id === plan.id ? { ...item, name: event.target.value } : item))
                    )
                  }
                />
                <Input
                  label="Monthly price"
                  name={`price-${plan.id}`}
                  type="number"
                  value={plan.price_monthly ?? ''}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setPlans((prev) =>
                      prev.map((item) =>
                        item.id === plan.id
                          ? {
                              ...item,
                              price_monthly: event.target.value === '' ? null : Number(event.target.value)
                            }
                          : item
                      )
                    )
                  }
                />
                <Input
                  label="Billing description"
                  name={`billing-${plan.id}`}
                  value={plan.billing_description ?? ''}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setPlans((prev) =>
                      prev.map((item) =>
                        item.id === plan.id ? { ...item, billing_description: event.target.value } : item
                      )
                    )
                  }
                />
                <Input
                  label="Features (comma separated)"
                  name={`features-${plan.id}`}
                  value={(plan.features || []).join(', ')}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setPlans((prev) =>
                      prev.map((item) =>
                        item.id === plan.id
                          ? { ...item, features: event.target.value.split(',').map((feature) => feature.trim()) }
                          : item
                      )
                    )
                  }
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={plan.is_custom ?? false}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setPlans((prev) =>
                        prev.map((item) =>
                          item.id === plan.id ? { ...item, is_custom: event.target.checked } : item
                        )
                      )
                    }
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Custom plan
                </label>
                <div className="flex gap-3">
                  <Button onClick={() => handleUpdatePlan(plan)}>Update</Button>
                  <Button variant="destructive" onClick={() => handleDeletePlan(plan.id)}>
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
