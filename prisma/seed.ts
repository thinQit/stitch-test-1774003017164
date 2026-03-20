import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@projectflow.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.contactMessage.deleteMany();
  await prisma.subscriber.deleteMany();
  await prisma.pricingPlan.deleteMany();
  await prisma.feature.deleteMany();
  await prisma.siteContent.deleteMany();

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash }
  });

  await prisma.siteContent.create({
    data: {
      hero_title: 'AI-powered project management that keeps teams in flow',
      hero_subtitle: 'Automate planning, deliverables, and reporting with smart scheduling, instant insights, and streamlined collaboration.',
      footer_text: 'AI-powered project management for modern teams.'
    }
  });

  await prisma.feature.create({
    data: {
      title: 'Smart Scheduling',
      subtitle: 'Plan with precision',
      description: 'AI builds milestones, predicts risk, and adapts timelines to keep projects on track.'
    }
  });
  await prisma.feature.create({
    data: {
      title: 'Automated Reporting',
      subtitle: 'Always up to date',
      description: 'Weekly status updates, health scores, and executive summaries delivered automatically.'
    }
  });
  await prisma.feature.create({
    data: {
      title: 'Team Insights',
      subtitle: 'Know what matters',
      description: 'Capacity, velocity, and engagement insights help leaders balance the load.'
    }
  });

  await prisma.pricingPlan.create({
    data: {
      name: 'Starter',
      price_per_month: 29,
      currency: 'USD',
      features: JSON.stringify(['Smart scheduling', 'Email reports', 'Up to 5 projects']),
      is_custom_contact: false
    }
  });
  await prisma.pricingPlan.create({
    data: {
      name: 'Pro',
      price_per_month: 79,
      currency: 'USD',
      features: JSON.stringify(['Everything in Starter', 'Team insights', 'Unlimited projects']),
      is_custom_contact: false
    }
  });
  await prisma.pricingPlan.create({
    data: {
      name: 'Enterprise',
      price_per_month: null,
      currency: 'USD',
      features: JSON.stringify(['Custom workflows', 'Dedicated success', 'Security reviews']),
      is_custom_contact: true
    }
  });

  await prisma.subscriber.create({ data: { email: 'alex@projectflow.app' } });
  await prisma.subscriber.create({ data: { email: 'jordan@projectflow.app' } });

  await prisma.contactMessage.create({
    data: {
      name: 'Enterprise Lead',
      email: 'enterprise@company.com',
      message: 'Interested in a custom rollout for 200+ users.'
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
