'use client';

import Button from '@/components/ui/Button';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="text-sm text-slate-600">{error.message || 'An unexpected error occurred.'}</p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
