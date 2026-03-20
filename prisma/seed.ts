import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.lead.deleteMany();
  await prisma.subscriptionPlan.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash('Password123!', 10);

  await prisma.user.create({
    data: {
      email: 'admin@projectflow.ai',
      name: 'ProjectFlow Admin',
      password: adminPassword
    }
  });

  const starterFeatures = JSON.stringify([
    'Up to 10 teammates',
    'AI scheduling for 3 projects',
    'Basic reporting'
  ]);
  const proFeatures = JSON.stringify([
    'Unlimited teammates',
    'Automated reporting',
    'Advanced team insights'
  ]);
  const enterpriseFeatures = JSON.stringify([
    'Custom workflows',
    'Dedicated CSM',
    'Security & compliance reviews'
  ]);

  await prisma.subscriptionPlan.create({
    data: {
      name: 'Starter',
      priceMonthly: 29,
      billingInterval: 'month',
      features: starterFeatures,
      isCustom: false
    }
  });

  await prisma.subscriptionPlan.create({
    data: {
      name: 'Pro',
      priceMonthly: 79,
      billingInterval: 'month',
      features: proFeatures,
      isCustom: false
    }
  });

  await prisma.subscriptionPlan.create({
    data: {
      name: 'Enterprise',
      priceMonthly: null,
      billingInterval: 'month',
      features: enterpriseFeatures,
      isCustom: true
    }
  });

  await prisma.siteSettings.create({
    data: {
      primaryColor: '#7c3aed',
      secondaryColor: '#3b82f6',
      tertiaryColor: '#06b6d4',
      heroTitle: 'AI-powered project management that keeps your team ahead.',
      heroSubtitle: 'Smart scheduling, automated reporting, and team insights in one hub.'
    }
  });

  await prisma.lead.create({
    data: {
      name: 'Jordan Lee',
      email: 'jordan@acme.io',
      company: 'Acme Inc',
      message: 'Interested in a Pro plan demo for our delivery team.',
      interestTier: 'Pro',
      contacted: false
    }
  });

  await prisma.lead.create({
    data: {
      name: 'Sam Patel',
      email: 'sam@northwind.co',
      company: 'Northwind',
      message: 'We need enterprise security support.',
      interestTier: 'Enterprise',
      contacted: true
    }
  });
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
