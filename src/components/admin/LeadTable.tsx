'use client';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { Lead } from '@/types';
import { api } from '@/lib/api';

interface LeadTableProps {
  leads: Lead[];
  onUpdated: () => void;
}

export function LeadTable({ leads, onUpdated }: LeadTableProps) {
  const toggleContacted = async (leadId: string, contacted: boolean) => {
    try {
      await api.patch<{ success: boolean }>('/api/leads', { id: leadId, contacted: !contacted });
      onUpdated();
    } catch (_error) {
      // eslint-disable-next-line no-console
      console.error('Failed to update lead');
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-muted text-left text-secondary">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Tier</th>
            <th className="px-4 py-3">Submitted</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-t border-border">
              <td className="px-4 py-3 font-medium">{lead.name}</td>
              <td className="px-4 py-3">{lead.email}</td>
              <td className="px-4 py-3">{lead.company || '—'}</td>
              <td className="px-4 py-3">
                <Badge variant="default">{lead.interestTier || 'General'}</Badge>
              </td>
              <td className="px-4 py-3">
                {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
              </td>
              <td className="px-4 py-3">
                <Badge variant={lead.contacted ? 'success' : 'warning'}>
                  {lead.contacted ? 'Contacted' : 'Pending'}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleContacted(lead.id, lead.contacted)}
                >
                  {lead.contacted ? 'Mark pending' : 'Mark contacted'}
                </Button>
              </td>
            </tr>
          ))}
          {leads.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-6 text-center text-secondary">
                No leads found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
