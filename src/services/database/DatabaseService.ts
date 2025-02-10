import { PrismaClient } from '@prisma/client';
import { loggingService } from '../logging/LoggingService';
import { TelemetryService } from '../telemetry/TelemetryService';

export class DatabaseService {
  private static instance: DatabaseService;
  private prisma: PrismaClient;
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

  async createEstimate(data: any) {
    try {
      this.telemetry.trackEvent('database_estimate_save_started', { estimateId: data.id });

      const estimate = await this.prisma.estimate.create({
        data,
        include: {
          user: true,
          company: true,
          complianceChecks: true,
        },
      });

      this.telemetry.trackEvent('database_estimate_save_completed', { estimateId: data.id });

      return estimate;
    } catch (error) {
      loggingService.error('Failed to create estimate', { error });

      this.telemetry.trackEvent('database_estimate_save_failed', { 
        estimateId: data.id,
        errorMessage: error.message
      });

      throw error;
    }
  }

  async getEstimate(id: number) {
    try {
      this.telemetry.trackEvent('database_estimate_retrieval_started', { estimateId: id });

      const estimate = await this.prisma.estimate.findUnique({
        where: { id },
        include: {
          user: true,
          company: true,
          complianceChecks: true,
        },
      });

      this.telemetry.trackEvent('database_estimate_retrieval_completed', { estimateId: id });

      return estimate;
    } catch (error) {
      loggingService.error('Failed to fetch estimate', { error });

      this.telemetry.trackEvent('database_estimate_retrieval_failed', { 
        estimateId: id,
        errorMessage: error.message
      });

      throw error;
    }
  }

  async updateEstimate(id: number, data: any) {
    try {
      const estimate = await this.prisma.estimate.update({
        where: { id },
        data,
        include: {
          user: true,
          company: true,
          complianceChecks: true,
        },
      });
      return estimate;
    } catch (error) {
      loggingService.error('Failed to update estimate', { error });
      throw error;
    }
  }

  async createComplianceCheck(data: any) {
    try {
      const check = await this.prisma.complianceCheck.create({
        data,
        include: {
          estimate: true,
        },
      });
      return check;
    } catch (error) {
      loggingService.error('Failed to create compliance check', { error });
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
      loggingService.error('Failed to retrieve estimates from database', { userId, error: error.message });

      this.telemetry.trackEvent('database_estimates_retrieval_failed', { 
        userId,
        errorMessage: error.message
      });

      throw error;
    }
  }

  async deleteEstimate(id: number) {
    try {
      this.telemetry.trackEvent('database_estimate_deletion_started', { estimateId: id });

      await this.prisma.estimate.delete({
        where: { id },
      });

      this.telemetry.trackEvent('database_estimate_deletion_completed', { estimateId: id });
    } catch (error) {
      loggingService.error('Failed to delete estimate', { error });

      this.telemetry.trackEvent('database_estimate_deletion_failed', { 
        estimateId: id,
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