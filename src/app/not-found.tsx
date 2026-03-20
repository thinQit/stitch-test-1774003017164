export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-sm text-slate-600">The page you’re looking for doesn’t exist.</p>
      <a href="/" className="text-sm font-semibold text-primary hover:text-primary-hover">Return to home</a>
    </main>
  );
}
