'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type SignUpResponse = { success: boolean; message?: string; userId?: string };

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', plan: 'starter' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    try {
      const response = await api.post<SignUpResponse>('/api/auth/signup', form);
      if (response?.success) {
        router.push('/dashboard');
      } else {
        setStatus('error');
      }
    } catch (_error) {
      setStatus('error');
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold">Create your ProjectFlow account</h1>
      <p className="mt-2 text-secondary">Start building smarter project plans with AI assistance.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input
          label="Name"
          required
          value={form.name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: event.target.value })}
        />
        <Input
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, email: event.target.value })}
        />
        <Input
          label="Password"
          type="password"
          required
          value={form.password}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, password: event.target.value })}
        />
        <label className="block text-sm text-foreground">
          <span className="mb-1 block font-medium">Plan</span>
          <select
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
            value={form.plan}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, plan: event.target.value })}
          >
            <option value="starter">Starter</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </label>
        <Button type="submit" className="w-full" disabled={status === 'loading'}>
          {status === 'loading' ? 'Creating account...' : 'Create account'}
        </Button>
        {status === 'error' && <p className="text-sm text-error">Unable to sign up. Try again.</p>}
      </form>
    </main>
  );
}
