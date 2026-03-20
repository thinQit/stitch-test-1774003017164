import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@projectflow.ai';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await hashPassword('AdminPass123!');
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'ProjectFlow Admin',
        passwordHash,
        role: 'admin'
      }
    });
  }

  const plans = await prisma.plan.findMany();
  if (plans.length === 0) {
    await prisma.plan.create({
      data: {
        name: 'Starter',
        price_monthly: 29,
        billing_description: 'For growing teams getting organized fast.',
        features: JSON.stringify(['Up to 5 projects', 'AI scheduling', 'Weekly reports']),
        is_custom: false
      }
    });
    await prisma.plan.create({
      data: {
        name: 'Pro',
        price_monthly: 79,
        billing_description: 'For scaling teams that need advanced insights.',
        features: JSON.stringify(['Unlimited projects', 'Automation workflows', 'Priority support']),
        is_custom: false
      }
    });
    await prisma.plan.create({
      data: {
        name: 'Enterprise',
        price_monthly: null,
        billing_description: 'Custom security, SLAs, and onboarding.',
        features: JSON.stringify(['Dedicated success manager', 'Custom integrations', 'On-prem options']),
        is_custom: true
      }
    });
  }

  const features = await prisma.feature.findMany();
  if (features.length === 0) {
    await prisma.feature.create({
      data: {
        title: 'Smart Scheduling',
        subtitle: 'AI optimizes timelines, dependencies, and workload across your portfolio.',
        icon: 'calendar',
        order: 1
      }
    });
    await prisma.feature.create({
      data: {
        title: 'Automated Reporting',
        subtitle: 'Real-time executive summaries and KPI dashboards in one click.',
        icon: 'insights',
        order: 2
      }
    });
    await prisma.feature.create({
      data: {
        title: 'Team Insights',
        subtitle: 'Spot bottlenecks early with predictive delivery risk signals.',
        icon: 'group',
        order: 3
      }
    });
  }
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
