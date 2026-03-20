'use client';

import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils';
import { Lead, PricingTier } from '@/types';
import Button from '@/components/ui/Button';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Input from '@/components/ui/Input';

interface TierFormState {
  name: string;
  pricePerMonth: string;
  currency: string;
  features: string;
  isCustom: boolean;
}

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<TierFormState>({
    name: '',
    pricePerMonth: '',
    currency: 'USD',
    features: '',
    isCustom: false
  });

  useEffect(() => {
    const stored = localStorage.getItem('adminToken');
    if (stored) {
      setToken(stored);
    }
  }, []);

  const fetchWithAuth = async <T,>(url: string, options?: RequestInit): Promise<T | null> => {
    const headers: HeadersInit = {
      ...(options?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || 'Request failed');
    }
    const data = (await response.json()) as T;
    return data ?? null;
  };

  const loadData = async () => {
    if (!token) {
      setError('Admin token required to load data.');
      return;
    }
    setLoading(true);
    setError(null);
    setStatus('');
    try {
      const [tiersData, leadsData] = await Promise.all([
        fetchWithAuth<PricingTier[]>('/api/admin/tiers'),
        fetchWithAuth<Lead[]>('/api/admin/leads')
      ]);
      setTiers(Array.isArray(tiersData) ? tiersData : []);
      setLeads(Array.isArray(leadsData) ? leadsData : []);
    } catch (error: unknown) {
      setError((error as Error).message || 'Unable to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('adminToken', token);
      loadData();
    }
  }, [token]);

  const handleCreateTier = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      setError('Admin token required to create tiers.');
      return;
    }
    setError(null);
    try {
      const payload = {
        name: form.name,
        pricePerMonth: form.pricePerMonth ? Number(form.pricePerMonth) : null,
        currency: form.currency,
        features: form.features
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        isCustom: form.isCustom
      };
      await fetchWithAuth<PricingTier>('/api/admin/tiers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setForm({ name: '', pricePerMonth: '', currency: 'USD', features: '', isCustom: false });
      setStatus('Tier created successfully.');
      loadData();
    } catch (error: unknown) {
      setError((error as Error).message || 'Unable to create tier');
    }
  };

  const handleDeleteTier = async (id: string) => {
    if (!token) {
      setError('Admin token required to delete tiers.');
      return;
    }
    setError(null);
    try {
      await fetchWithAuth<unknown>(`/api/admin/tiers/${id}`, { method: 'DELETE' });
      setStatus('Tier deleted.');
      loadData();
    } catch (error: unknown) {
      setError((error as Error).message || 'Unable to delete tier');
    }
  };

  const handleCopyCsv = async () => {
    const csv = [
      'name,email,company,planInterest,createdAt',
      ...leads.map((lead) =>
        [lead.name, lead.email, lead.company, lead.planInterest, lead.createdAt]
          .map((value) => `"${value ?? ''}"`)
          .join(',')
      )
    ].join('\n');
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(csv);
      setStatus('Leads copied to clipboard.');
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-sm text-foreground/70">Manage pricing tiers and review captured leads.</p>

      <div className="mt-6 max-w-md">
        <Input
          label="Admin token"
          value={token}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setToken(event.target.value)}
          placeholder="Enter ADMIN_TOKEN"
        />
      </div>

      {loading && <p className="mt-4 text-sm text-foreground/70">Loading admin data...</p>}
      {error && <p className="mt-4 text-sm text-error">{error}</p>}
      {status && <p className="mt-4 text-sm text-success">{status}</p>}

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Pricing tiers</h2>
            <p className="text-sm text-foreground/70">Create or remove tiers shown on the landing page.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTier} className="space-y-3">
              <Input
                label="Name"
                value={form.name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, name: event.target.value })
                }
              />
              <Input
                label="Price per month"
                value={form.pricePerMonth}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, pricePerMonth: event.target.value })
                }
              />
              <Input
                label="Currency"
                value={form.currency}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, currency: event.target.value })
                }
              />
              <Input
                label="Features (comma separated)"
                value={form.features}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, features: event.target.value })
                }
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isCustom}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setForm({ ...form, isCustom: event.target.checked })
                  }
                />
                Custom plan
              </label>
              <Button type="submit">Create tier</Button>
            </form>
            <div className="mt-6 space-y-3">
              {tiers.map((tier) => (
                <div key={tier.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                  <div>
                    <p className="font-medium">{tier.name}</p>
                    <p className="text-xs text-foreground/70">
                      {tier.isCustom ? 'Custom pricing' : `$${tier.pricePerMonth}/mo`}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteTier(tier.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
              {!loading && tiers.length === 0 && (
                <p className="text-sm text-foreground/70">No tiers available.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Captured leads</h2>
            <p className="text-sm text-foreground/70">Export or copy your latest newsletter and trial interest submissions.</p>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" onClick={handleCopyCsv}>Copy CSV</Button>
            <div className="mt-4 space-y-3">
              {leads.map((lead) => (
                <div key={lead.id} className="rounded-lg border border-border px-4 py-3">
                  <p className="font-medium">{lead.name || 'Unnamed lead'}</p>
                  <p className="text-xs text-foreground/70">{lead.email}</p>
                  <p className="text-xs text-foreground/70">{lead.planInterest}</p>
                  <p className="text-xs text-foreground/60">
                    {lead.createdAt ? formatDate(lead.createdAt) : 'N/A'}
                  </p>
                </div>
              ))}
              {!loading && leads.length === 0 && (
                <p className="text-sm text-foreground/70">No leads captured yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
