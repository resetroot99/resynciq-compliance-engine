import { PrismaClient } from '@prisma/client';
import { loggingService } from '../services/logging/LoggingService';

async function initializeDatabase() {
  const prisma = new PrismaClient();

  try {
    // Create a test company
    const company = await prisma.company.create({
      data: {
        name: 'Test Body Shop',
        type: 'BODY_SHOP',
        subscriptionTier: 'FREE',
      },
    });

    // Create a test user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'hashed_password_here',
        name: 'Test User',
        role: 'ESTIMATOR',
        companyId: company.id,
      },
    });

    // Create sample compliance rules
    await prisma.complianceRule.create({
      data: {
        name: 'Labor Rate Check',
        description: 'Validates labor rates against insurer guidelines',
        category: 'LABOR',
        severity: 'ERROR',
        parameters: {
          maxRate: 100,
          minRate: 40,
        },
        active: true,
      },
    });

    loggingService.info('Database initialized successfully');
  } catch (error) {
    loggingService.error('Failed to initialize database', { error });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

initializeDatabase()
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }); 