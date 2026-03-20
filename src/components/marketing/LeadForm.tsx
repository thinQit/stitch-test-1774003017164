'use client';

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';

interface LeadFormProps {
  defaultTier?: string;
  onSuccess?: () => void;
}

export function LeadForm({ defaultTier = 'Starter', onSuccess }: LeadFormProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    interestTier: defaultTier
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const response = await api.post<{ message?: string }>('/api/leads', form);
      setStatus(response?.message ?? 'Thanks! We will be in touch shortly.');
      setForm({ name: '', email: '', company: '', message: '', interestTier: defaultTier });
      onSuccess?.();
    } catch (_error) {
      setStatus('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-white p-6 shadow-sm">
      <div className="grid gap-4">
        <Input
          id="name"
          label="Full name"
          value={form.name}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            handleChange('name', event.target.value)
          }
          required
        />
        <Input
          id="email"
          type="email"
          label="Work email"
          value={form.email}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            handleChange('email', event.target.value)
          }
          required
        />
        <Input
          id="company"
          label="Company"
          value={form.company}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            handleChange('company', event.target.value)
          }
        />
        <div className="flex flex-col gap-1">
          <label htmlFor="interestTier" className="text-sm font-medium text-foreground">
            Interested tier
          </label>
          <select
            id="interestTier"
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm"
            value={form.interestTier}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              handleChange('interestTier', event.target.value)
            }
          >
            <option>Starter</option>
            <option>Pro</option>
            <option>Enterprise</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="message" className="text-sm font-medium text-foreground">
            Message
          </label>
          <textarea
            id="message"
            className="min-h-[120px] rounded-lg border border-border bg-white px-3 py-2 text-sm"
            value={form.message}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              handleChange('message', event.target.value)
            }
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit request'}
        </Button>
        {status && <p className="text-sm text-secondary">{status}</p>}
      </div>
    </form>
  );
}
