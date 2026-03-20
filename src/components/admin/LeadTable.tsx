'use client';

import type { Lead } from '@/types';

type LeadTableProps = {
  leads: Lead[];
};

export function LeadTable({ leads }: LeadTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted text-xs uppercase tracking-wide text-secondary">
          <tr>
            <th className="px-4 py-3">Lead</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Tier</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {leads.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-secondary">
                No leads yet.
              </td>
            </tr>
          ) : (
            leads.map((lead) => (
              <tr key={lead.id ?? lead.email} className="border-t border-border">
                <td className="px-4 py-3 font-medium">
                  {lead.name ?? (lead as { companyName?: string }).companyName ?? '—'}
                </td>
                <td className="px-4 py-3 text-secondary">{lead.email ?? '—'}</td>
                <td className="px-4 py-3">
                  {(lead as { interestTier?: string }).interestTier ?? '—'}
                </td>
                <td className="px-4 py-3">
                  {(lead as { status?: string }).status ?? 'Pending'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LeadTable;
