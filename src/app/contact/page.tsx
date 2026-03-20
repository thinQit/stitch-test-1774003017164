'use client';

import { useState } from 'react';
import Image from 'next/image';
import { api } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type Message = { type: 'success' | 'error'; text: string };

type FormState = {
  name: string;
  email: string;
  company: string;
  planInterest: string;
};

export default function ContactPage() {
  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    company: '',
    planInterest: 'enterprise'
  });
  const [message, setMessage] = useState<Message | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    if (!formState.name || !formState.email) {
      setMessage({ type: 'error', text: 'Name and email are required.' });
      return;
    }
    try {
      await api.post<{ id: string }>('/api/subscribe', formState);
      setMessage({ type: 'success', text: 'Thanks! Our team will reach out within one business day.' });
      setFormState({ name: '', email: '', company: '', planInterest: 'enterprise' });
    } catch (error: unknown) {
      setMessage({
        type: 'error',
        text: (error as Error).message || 'Unable to send. Please try again.'
      });
    }
  };

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-primary-hover text-white">
        <Image
          src="/images/hero.jpg"
          alt="ProjectFlow contact hero"
          width={1200}
          height={675}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-secondary/70 to-primary-hover/80" />
        <div className="relative mx-auto max-w-3xl px-4 py-16 lg:px-6">
          <h1 className="text-4xl font-bold">Contact ProjectFlow</h1>
          <p className="mt-2 text-sm text-white/80">
            Tell us about your team and we will tailor an AI-powered rollout plan.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-16 lg:px-6">
        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Contact form">
          <Input
            label="Name"
            name="name"
            value={formState.name}
            onChange={handleInputChange}
            placeholder="Your name"
            required
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={formState.email}
            onChange={handleInputChange}
            placeholder="you@company.com"
            required
          />
          <Input
            label="Company"
            name="company"
            value={formState.company}
            onChange={handleInputChange}
            placeholder="Company"
          />
          <Input
            label="Plan interest"
            name="planInterest"
            value={formState.planInterest}
            onChange={handleInputChange}
            placeholder="enterprise"
          />
          {message && (
            <p className={message.type === 'success' ? 'text-success text-sm' : 'text-error text-sm'}>
              {message.text}
            </p>
          )}
          <Button type="submit">Send inquiry</Button>
        </form>
      </div>
    </div>
  );
}
