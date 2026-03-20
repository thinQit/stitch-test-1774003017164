'use client';

import Button from '@/components/ui/Button';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-4xl font-bold">Something went wrong</h1>
      <p className="text-sm text-foreground/70">Please try again or refresh the page.</p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
