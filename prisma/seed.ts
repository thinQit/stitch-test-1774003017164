import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth.ts';

const prisma = new PrismaClient();

async function main() {
  await prisma.lead.deleteMany();
  await prisma.feature.deleteMany();
  await prisma.pricingTier.deleteMany();
  await prisma.adminUser.deleteMany();

  await prisma.feature.create({
    data: {
      id: 'smart-scheduling',
      title: 'Smart Scheduling',
      summary: 'AI schedules tasks & meetings automatically',
      icon: 'calendar-star'
    }
  });
  await prisma.feature.create({
    data: {
      id: 'automated-reporting',
      title: 'Automated Reporting',
      summary: 'One-click reports from live project data',
      icon: 'bar-chart'
    }
  });
  await prisma.feature.create({
    data: {
      id: 'team-insights',
      title: 'Team Insights',
      summary: 'Balance workloads with AI insights and alerts',
      icon: 'users'
    }
  });

  await prisma.pricingTier.create({
    data: {
      id: 'starter',
      name: 'Starter',
      pricePerMonth: 29,
      currency: 'USD',
      features: JSON.stringify(['AI scheduling', '3 projects', 'Email support']),
      stripePriceId: 'price_starter',
      isCustom: false
    }
  });
  await prisma.pricingTier.create({
    data: {
      id: 'pro',
      name: 'Pro',
      pricePerMonth: 79,
      currency: 'USD',
      features: JSON.stringify(['Unlimited projects', 'Automated reporting', 'Slack + Teams integrations']),
      stripePriceId: 'price_pro',
      isCustom: false
    }
  });
  await prisma.pricingTier.create({
    data: {
      id: 'enterprise',
      name: 'Enterprise',
      pricePerMonth: null,
      currency: 'USD',
      features: JSON.stringify(['Dedicated success team', 'Custom AI workflows', 'Security review']),
      stripePriceId: 'price_enterprise',
      isCustom: true
    }
  });

  await prisma.lead.create({
    data: {
      email: 'ava@projectflow.ai',
      name: 'Ava Patel',
      company: 'Skyline Ventures',
      planInterest: 'pro'
    }
  });
  await prisma.lead.create({
    data: {
      email: 'liam@greenlabs.com',
      name: 'Liam Chen',
      company: 'GreenLabs',
      planInterest: 'starter'
    }
  });

  const passwordHash = await hashPassword('password123');
  await prisma.adminUser.create({
    data: {
      email: 'admin@projectflow.ai',
      name: 'ProjectFlow Admin',
      role: 'admin',
      passwordHash
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
