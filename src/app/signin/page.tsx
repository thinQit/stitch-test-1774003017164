'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type SignInResponse = { success: boolean; message?: string; token?: string };

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    try {
      const response = await api.post<SignInResponse>('/api/auth/signin', form);
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
      <h1 className="text-3xl font-bold">Welcome back</h1>
      <p className="mt-2 text-secondary">Sign in to access your ProjectFlow dashboard.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setForm({ ...form, email: event.target.value })
          }
        />
        <Input
          label="Password"
          type="password"
          required
          value={form.password}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setForm({ ...form, password: event.target.value })
          }
        />
        <Button type="submit" className="w-full" disabled={status === 'loading'}>
          {status === 'loading' ? 'Signing in...' : 'Sign in'}
        </Button>
        {status === 'error' && (
          <p className="text-sm text-error">Invalid credentials. Try again.</p>
        )}
      </form>
    </main>
  );
}
