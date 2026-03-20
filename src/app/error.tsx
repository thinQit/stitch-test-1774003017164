"use client";

import Button from '@/components/ui/Button';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="text-sm text-foreground/70">{error.message || 'Unexpected error.'}</p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
