'use client';

import Button from '@/components/ui/Button';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-semibold text-foreground">Something went wrong</h1>
      <p className="text-slate-600">Please try again or contact support if the issue persists.</p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
