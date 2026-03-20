"use client";

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';
import Spinner from '@/components/ui/Spinner';

interface EnterpriseContactFormProps {
  onSubmitted?: () => void;
}

export function EnterpriseContactForm({ onSubmitted }: EnterpriseContactFormProps) {
  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const response = await api.post<{ success: boolean; message: string }>('/api/contact-enterprise', form);
      if (!response) {
        setStatus('error');
        setMessage('Unable to send your request right now.');
        return;
      }
      if (response.success) {
        setStatus('success');
        setMessage(response.message || 'Thanks! We will be in touch soon.');
        setForm({ companyName: '', contactName: '', email: '', message: '' });
        onSubmitted?.();
      } else {
        setStatus('error');
        setMessage(response.message || 'Something went wrong.');
      }
    } catch (_error: unknown) {
      setStatus('error');
      setMessage('Unable to send your request right now.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Company name"
        value={form.companyName}
        onChange={handleChange('companyName')}
        required
      />
      <Input
        label="Contact name"
        value={form.contactName}
        onChange={handleChange('contactName')}
        required
      />
      <Input
        label="Work email"
        type="email"
        value={form.email}
        onChange={handleChange('email')}
        required
      />
      <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
        Message
        <textarea
          className="min-h-[120px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          value={form.message}
          onChange={handleChange('message')}
          required
        />
      </label>
      <Button type="submit" className="w-full">
        {status === 'loading' ? 'Sending' : 'Request a quote'}
      </Button>
      {status === 'loading' && <Spinner />}
      {status === 'success' && <p className="text-sm text-success">{message}</p>}
      {status === 'error' && <p className="text-sm text-error">{message}</p>}
    </form>
  );
}

export default EnterpriseContactForm;
