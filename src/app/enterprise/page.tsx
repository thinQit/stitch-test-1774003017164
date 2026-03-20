import EnterpriseContactForm from '@/components/enterprise/EnterpriseContactForm';
import Footer from '@/components/layout/Footer';

export default function EnterprisePage() {
  return (
    <main className="flex flex-col">
      <section className="bg-muted/40 py-16">
        <div className="mx-auto w-full max-w-3xl px-4 md:px-6">
          <h1 className="text-3xl font-bold md:text-4xl">Enterprise solutions, designed with you</h1>
          <p className="mt-3 text-sm text-foreground/70 md:text-base">
            Tell us about your organization and we will craft a ProjectFlow rollout with custom workflows,
            security, and onboarding support.
          </p>
          <div className="mt-10 rounded-2xl border border-border bg-background p-6 md:p-8">
            <EnterpriseContactForm />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
