import { PrismaClient } from '@prisma/client';
import { LoggingService } from '../logging/LoggingService';
import { TelemetryService } from '../telemetry/TelemetryService';

export class DatabaseService {
  private static instance: DatabaseService;
  private prisma: PrismaClient;
  private logger = LoggingService.getInstance();
  private telemetry = TelemetryService.getInstance();

  private constructor() {
    this.prisma = new PrismaClient();
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async getEstimate(id: string) {
    try {
      this.telemetry.trackEvent('database_estimate_retrieval_started', { estimateId: id });

      const estimate = await this.prisma.estimate.findUnique({
        where: { id },
        include: {
          vehicle: true,
          photos: true,
          lineItems: true,
          supplements: true,
          validationResults: true
        }
      });

      this.telemetry.trackEvent('database_estimate_retrieval_completed', { estimateId: id });

      return estimate;
    } catch (error) {
      this.logger.log({
        level: 'ERROR',
        message: 'Failed to retrieve estimate from database',
        context: { estimateId: id, error: error.message }
      });

      this.telemetry.trackEvent('database_estimate_retrieval_failed', { 
        estimateId: id,
        errorMessage: error.message
      });

      throw error;
    }
  }

  async saveEstimate(data: any) {
    try {
      this.telemetry.trackEvent('database_estimate_save_started', { estimateId: data.id });

      const estimate = await this.prisma.estimate.create({
        data: {
          ...data,
          vehicle: { create: data.vehicle },
          photos: { createMany: { data: data.photos } },
          lineItems: { createMany: { data: data.lineItems } },
          supplements: { createMany: { data: data.supplements } },
          validationResults: { create: data.validationResults }
        },
        include: {
          vehicle: true,
          photos: true,
          lineItems: true,
          supplements: true,
          validationResults: true
        }
      });

      this.telemetry.trackEvent('database_estimate_save_completed', { estimateId: data.id });

      return estimate;
    } catch (error) {
      this.logger.log({
        level: 'ERROR',
        message: 'Failed to save estimate to database',
        context: { estimateId: data.id, error: error.message }
      });

      this.telemetry.trackEvent('database_estimate_save_failed', { 
        estimateId: data.id,
        errorMessage: error.message
      });

      throw error;
    }
  }

  async getEstimates(userId: string) {
    try {
      this.telemetry.trackEvent('database_estimates_retrieval_started', { userId });

      const estimates = await this.prisma.estimate.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          vehicle: true,
          photos: true,
          lineItems: true,
          supplements: true,
          validationResults: true
        }
      });

      this.telemetry.trackEvent('database_estimates_retrieval_completed', { userId });

      return estimates;
    } catch (error) {
      this.logger.log({
        level: 'ERROR',
        message: 'Failed to retrieve estimates from database',
        context: { userId, error: error.message }
      });

      this.telemetry.trackEvent('database_estimates_retrieval_failed', { 
        userId,
        errorMessage: error.message
      });

      throw error;
    }
  }

  async close() {
    await this.prisma.$disconnect();
  }
}

export const databaseService = DatabaseService.getInstance(); 