import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const starterSubscription = await prisma.subscription.create({
    data: {
      tier: 'starter',
      priceMonthly: 29,
      customerId: 'cust_starter_001'
    }
  });

  const proSubscription = await prisma.subscription.create({
    data: {
      tier: 'pro',
      priceMonthly: 79,
      customerId: 'cust_pro_001'
    }
  });

  const userA = await prisma.user.create({
    data: {
      email: 'alex@projectflow.com',
      name: 'Alex Morgan',
      passwordHash,
      role: 'admin',
      subscriptionId: starterSubscription.id
    }
  });

  const userB = await prisma.user.create({
    data: {
      email: 'jamie@projectflow.com',
      name: 'Jamie Rivera',
      passwordHash,
      role: 'user',
      subscriptionId: proSubscription.id
    }
  });

  await prisma.team.create({
    data: {
      name: 'Product Strategy',
      members: JSON.stringify([userA.id, userB.id])
    }
  });

  await prisma.featureCard.create({
    data: {
      title: 'Smart Scheduling',
      description: 'AI builds sprint plans and adapts schedules based on real-time progress.',
      icon: '⚡'
    }
  });

  await prisma.featureCard.create({
    data: {
      title: 'Automated Reporting',
      description: 'Generate executive-ready reports with progress, blockers, and risks.',
      icon: '📊'
    }
  });

  await prisma.featureCard.create({
    data: {
      title: 'Team Insights',
      description: 'Understand capacity, velocity, and focus areas across teams instantly.',
      icon: '🧠'
    }
  });

  await prisma.project.create({
    data: {
      title: 'AI Roadmap Refresh',
      description: 'Align Q3 roadmap with AI-assisted delivery milestones.',
      ownerId: userA.id,
      status: 'active',
      dueDate: '2024-11-15'
    }
  });

  await prisma.project.create({
    data: {
      title: 'Customer Insights Pipeline',
      description: 'Implement automated reporting for customer feedback loops.',
      ownerId: userB.id,
      status: 'active',
      dueDate: '2024-12-05'
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
