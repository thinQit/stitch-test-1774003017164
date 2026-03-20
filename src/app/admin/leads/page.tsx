'use client';

import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { LeadTable } from '@/components/admin/LeadTable';
import Spinner from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import type { Lead } from '@/types';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [tierFilter, setTierFilter] = useState('all');
  const [authError, setAuthError] = useState('');

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await api.get<Lead[]>('/api/leads');
      setLeads(data ?? []);
      setAuthError('');
    } catch (_error) {
      setAuthError('Unauthorized. Please authenticate to view leads.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const filteredLeads = leads.filter((lead) =>
    tierFilter === 'all' ? true : (lead.interestTier || '').toLowerCase() === tierFilter
  );

  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Lead Dashboard</h1>
            <p className="text-secondary">Review demo requests and mark outreach status.</p>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="tier" className="text-sm text-secondary">
              Filter by tier
            </label>
            <select
              id="tier"
              className="rounded-lg border border-border bg-white px-3 py-2 text-sm"
              value={tierFilter}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                setTierFilter(event.target.value)
              }
            >
              <option value="all">All</option>
              <option value="starter">Starter</option>
              <option value="growth">Growth</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-white p-6">
          {loading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : authError ? (
            <div className="rounded-lg border border-error bg-red-50 p-4 text-center text-error">
              {authError}
            </div>
          ) : filteredLeads.length === 0 ? (
            <p className="text-center text-secondary">No leads match the selected filter.</p>
          ) : (
            <LeadTable leads={filteredLeads} onRefresh={loadLeads} />
          )}
        </div>
      </div>
    </main>
  );
}
