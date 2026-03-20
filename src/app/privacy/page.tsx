import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <main className="flex flex-col">
      <section className="py-16">
        <div className="mx-auto w-full max-w-4xl px-4 md:px-6">
          <h1 className="text-3xl font-bold md:text-4xl">Privacy & Terms</h1>
          <p className="mt-4 text-sm text-foreground/70 md:text-base">
            ProjectFlow is committed to protecting your data. We collect only the information needed to operate
            our services, respond to inquiries, and improve the platform. We never sell personal information.
          </p>
          <div className="mt-8 space-y-6 text-sm text-foreground/70">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Data Collection</h2>
              <p>
                We collect contact and subscription details only when you submit a form. These details are used
                to respond to your request and share relevant product updates.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Security</h2>
              <p>
                Data is stored securely and access is limited to authorized personnel. We employ industry
                standard security practices and encryption for sensitive information.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Terms of Service</h2>
              <p>
                By using ProjectFlow, you agree to comply with our acceptable use policies and refrain from
                misuse of the platform. For questions, contact us at support@projectflow.ai.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
