'use client';

export default function ErrorPage({ error }: { error: Error }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="mt-3 text-secondary">{error.message}</p>
    </div>
  );
}
