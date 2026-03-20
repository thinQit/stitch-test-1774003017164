'use client';

import { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { api } from '@/lib/api';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const response = await api.post<{ success: boolean }>('/api/contact', form);
      if (response?.success) {
        setStatus('success');
        setMessage('Thanks! Our team will be in touch within 1 business day.');
        setForm({ name: '', email: '', company: '', message: '' });
      } else {
        setStatus('error');
        setMessage('Unable to send your request.');
      }
    } catch (_error) {
      setStatus('error');
      setMessage('Unable to send your request.');
    }
  };

  return (
    <main className="bg-background">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt="ProjectFlow contact hero"
            width={1200}
            height={675}
            className="h-full w-full object-cover opacity-30"
            priority
          />
        </div>
        <div className="relative mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Enterprise</p>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">Let’s design your ProjectFlow rollout</h1>
          <p className="mt-4 text-white/70">
            Tell us about your team and we will craft a plan that scales with you.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8" aria-label="Contact form">
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label="Full name"
              name="name"
              required
              value={form.name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange('name', event.target.value)}
              placeholder="Jamie Rivera"
            />
            <Input
              label="Work email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange('email', event.target.value)}
              placeholder="jamie@company.com"
            />
          </div>
          <Input
            label="Company"
            name="company"
            value={form.company}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange('company', event.target.value)}
            placeholder="Company Inc."
          />
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="message">
              How can we help?
            </label>
            <textarea
              id="message"
              name="message"
              required
              value={form.message}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('message', event.target.value)}
              placeholder="Describe your goals, timeline, and any required integrations."
              className="min-h-[140px] w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Sending...' : 'Request demo'}
          </Button>
          {status === 'success' && <p className="text-sm text-success">{message}</p>}
          {status === 'error' && <p className="text-sm text-error">{message}</p>}
        </form>
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <Image
              src="/images/feature.jpg"
              alt="ProjectFlow team planning"
              width={1200}
              height={675}
              className="w-full rounded-2xl object-cover"
            />
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-semibold">What happens next?</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>• We review your workflow goals and current toolset.</li>
              <li>• You get a tailored product tour with an AI delivery specialist.</li>
              <li>• We deliver a rollout plan with timelines, security, and onboarding.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h3 className="text-3xl font-bold">Prefer a live walkthrough?</h3>
            <p className="mt-3 text-white/70">We can demo ProjectFlow with your data and timelines in as little as 48 hours.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <Image
              src="/images/cta.jpg"
              alt="ProjectFlow demo session"
              width={1200}
              height={675}
              className="w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
