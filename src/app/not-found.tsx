export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-3xl font-semibold text-foreground">Page not found</h1>
      <p className="text-slate-600">The page you are looking for does not exist.</p>
    </div>
  );
}
