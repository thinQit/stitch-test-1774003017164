'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type LeadFormProps = {
  onClose?: () => void;
  onSuccess?: () => void;
};

export function LeadForm({ onClose, onSuccess }: LeadFormProps) {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSuccess?.();
    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        value={form.name}
        onChange={(event) => setForm({ ...form, name: event.target.value })}
        required
      />
      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={(event) => setForm({ ...form, email: event.target.value })}
        required
      />
      <Input
        label="Company"
        value={form.company}
        onChange={(event) => setForm({ ...form, company: event.target.value })}
      />
      <Input
        label="Message"
        value={form.message}
        onChange={(event) => setForm({ ...form, message: event.target.value })}
      />
      <div className="flex flex-col gap-2">
        <Button type="submit" className="w-full">
          Request demo
        </Button>
        {onClose && (
          <Button type="button" className="w-full" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

export default LeadForm;
