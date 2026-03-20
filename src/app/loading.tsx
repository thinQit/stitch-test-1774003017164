import Spinner from '@/components/ui/Spinner';

export default function LoadingPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] items-center justify-center">
      <Spinner />
    </main>
  );
}
