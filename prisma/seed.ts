import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  await prisma.user.upsert({
    where: { email: 'admin@projectflow.ai' },
    update: {},
    create: {
      email: 'admin@projectflow.ai',
      name: 'ProjectFlow Admin',
      passwordHash
    }
  });

  await prisma.feature.upsert({
    where: { id: 'feature-smart-scheduling' },
    update: {},
    create: {
      id: 'feature-smart-scheduling',
      title: 'Smart Scheduling',
      description: 'Predictive timelines adjust automatically as priorities shift, keeping every deliverable on track.',
      icon: '⚡',
      highlightColor: 'bg-primary'
    }
  });

  await prisma.feature.upsert({
    where: { id: 'feature-reporting' },
    update: {},
    create: {
      id: 'feature-reporting',
      title: 'Automated Reporting',
      description: 'Generate executive-ready updates with one click, complete with risk alerts and progress snapshots.',
      icon: '📊',
      highlightColor: 'bg-secondary'
    }
  });

  await prisma.feature.upsert({
    where: { id: 'feature-insights' },
    update: {},
    create: {
      id: 'feature-insights',
      title: 'Team Insights',
      description: 'Surface workload balance, velocity trends, and blockers across every squad in real time.',
      icon: '🧠',
      highlightColor: 'bg-accent'
    }
  });

  await prisma.pricingTier.upsert({
    where: { id: 'tier-starter' },
    update: {},
    create: {
      id: 'tier-starter',
      name: 'Starter',
      monthlyPrice: 29,
      isCustom: false,
      features: JSON.stringify(['AI task prioritization', 'Weekly health reports', 'Up to 10 projects'])
    }
  });

  await prisma.pricingTier.upsert({
    where: { id: 'tier-pro' },
    update: {},
    create: {
      id: 'tier-pro',
      name: 'Pro',
      monthlyPrice: 79,
      isCustom: false,
      features: JSON.stringify([
        'Everything in Starter',
        'Automated reporting',
        'Unlimited projects',
        'Slack + Jira integrations'
      ])
    }
  });

  await prisma.pricingTier.upsert({
    where: { id: 'tier-enterprise' },
    update: {},
    create: {
      id: 'tier-enterprise',
      name: 'Enterprise',
      monthlyPrice: 0,
      isCustom: true,
      features: JSON.stringify(['Custom AI workflows', 'Dedicated success lead', 'Advanced security & SSO'])
    }
  });

  await prisma.subscriber.upsert({
    where: { email: 'growth@projectflow.ai' },
    update: {},
    create: {
      email: 'growth@projectflow.ai',
      planInterest: 'Pro'
    }
  });

  await prisma.enterpriseContact.upsert({
    where: { id: 'enterprise-seed' },
    update: {},
    create: {
      id: 'enterprise-seed',
      companyName: 'Nimbus Labs',
      contactName: 'Avery Chen',
      email: 'avery@nimbuslabs.com',
      message: 'We need an enterprise rollout for 200+ collaborators and custom onboarding.'
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
