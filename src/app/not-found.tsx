import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-sm text-foreground/70">We couldn’t find the page you’re looking for.</p>
      <Link href="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
