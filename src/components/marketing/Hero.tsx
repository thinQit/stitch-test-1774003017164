import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-hover to-accent">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/30 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
      </div>
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-20 text-white md:flex-row md:items-center md:justify-between md:px-6">
        <div className="max-w-xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/80">ProjectFlow</p>
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
            AI-powered project management that keeps teams aligned and ahead.
          </h1>
          <p className="text-base text-white/85 md:text-lg">
            Orchestrate complex timelines, automate reporting, and unlock team insights in one intelligent workspace.
            ProjectFlow turns strategy into execution with predictive planning and real-time clarity.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/pricing">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Start with Pro
              </Button>
            </Link>
            <Link href="/enterprise">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Talk to Enterprise
              </Button>
            </Link>
          </div>
          <div className="flex gap-6 text-sm text-white/80">
            <span>Trusted by remote-first teams</span>
            <span>•</span>
            <span>Launch in days, not weeks</span>
          </div>
        </div>
        <div className="w-full max-w-md space-y-4">
          <Image
            src="/images/hero.jpg"
            alt="ProjectFlow AI dashboard overview"
            width={1200}
            height={675}
            className="h-auto w-full rounded-2xl object-cover shadow-lg"
            priority
          />
          <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
            <p className="text-sm font-semibold text-white/80">What you get</p>
            <ul className="mt-4 space-y-3 text-sm text-white/90">
              <li>• Smart scheduling with AI conflict resolution</li>
              <li>• Executive-ready status reports in minutes</li>
              <li>• Team insight dashboards for proactive leadership</li>
              <li>• Secure data with enterprise-grade controls</li>
            </ul>
            <div className="mt-6 rounded-lg bg-white/15 p-4 text-xs text-white/80">
              “ProjectFlow cut our planning time by 40% in the first month.”
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
