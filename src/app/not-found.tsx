export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="text-3xl font-bold">Page not found</h2>
      <p className="text-secondary">The page you are looking for does not exist.</p>
      <a href="/" className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-hover">
        Back to home
      </a>
    </div>
  );
}
