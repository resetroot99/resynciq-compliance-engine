import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '../../../middleware/withAuth';
import prisma from '../../../lib/prisma';
import { getCachedAnalytics, cacheAnalytics } from '../../../lib/redis';
import { broadcastAnalyticsUpdate } from '../../../lib/websocket';
import { Analytics } from '../../../types/analytics';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // @ts-ignore
    const user = req.user;
    const companyId = user.companyId;

    // Try to get cached analytics
    const cached = await getCachedAnalytics(companyId);
    if (cached) {
      return res.json(cached);
    }

    // Get company estimates with full data
    const estimates = await prisma.estimate.findMany({
      where: { companyId },
      include: {
        compliance: true,
        vehicleInfo: true,
        user: {
          select: {
            name: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate analytics
    const analytics: Analytics = {
      overview: {
        totalEstimates: estimates.length,
        averageComplianceScore: calculateAverageScore(estimates),
        estimatesByStatus: groupByStatus(estimates),
        processingTime: calculateAverageProcessingTime(estimates)
      },
      compliance: {
        commonIssues: findCommonIssues(estimates),
        trendData: calculateComplianceTrends(estimates),
        riskAreas: identifyRiskAreas(estimates)
      },
      vehicles: analyzeVehicles(estimates),
      performance: {
        userPerformance: analyzeUserPerformance(estimates),
        monthlyVolume: calculateMonthlyVolume(estimates),
        estimateAcceptanceRate: calculateAcceptanceRate(estimates)
      }
    };

    // Cache the results
    await cacheAnalytics(companyId, analytics);

    // Broadcast update to connected clients
    broadcastAnalyticsUpdate(companyId, analytics);

    return res.json(analytics);
  } catch (error) {
    console.error('Analytics Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

function calculateAverageScore(estimates: any[]) {
  const scores = estimates
    .filter(e => e.compliance)
    .map(e => e.compliance.score);
  return scores.length ? 
    Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)) : 0;
}

function groupByStatus(estimates: any[]) {
  const statusCounts = estimates.reduce((acc, est) => {
    acc[est.status] = (acc[est.status] || 0) + 1;
    return acc;
  }, {});

  // Calculate percentages
  const total = estimates.length;
  return Object.entries(statusCounts).reduce((acc, [status, count]) => {
    acc[status] = {
      count,
      percentage: Number(((count as number / total) * 100).toFixed(1))
    };
    return acc;
  }, {} as Record<string, { count: number; percentage: number }>);
}

function findCommonIssues(estimates: any[]) {
  const issues = estimates
    .filter(e => e.compliance?.issues)
    .flatMap(e => e.compliance.issues);

  const issueCount = issues.reduce((acc, issue) => {
    const key = `${issue.type}:${issue.severity}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(issueCount)
    .map(([key, count]) => {
      const [type, severity] = key.split(':');
      return { type, severity, count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function analyzeVehicles(estimates: any[]) {
  const vehicles = estimates.filter(e => e.vehicleInfo).map(e => e.vehicleInfo);
  
  // Group by make/model
  const makeModels = vehicles.reduce((acc, vehicle) => {
    const key = `${vehicle.make}:${vehicle.model}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate average vehicle age
  const currentYear = new Date().getFullYear();
  const averageAge = vehicles.reduce((sum, vehicle) => 
    sum + (currentYear - vehicle.year), 0) / vehicles.length;

  return {
    popularVehicles: Object.entries(makeModels)
      .map(([key, count]) => {
        const [make, model] = key.split(':');
        return { make, model, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
    averageAge: Number(averageAge.toFixed(1)),
    yearDistribution: calculateYearDistribution(vehicles)
  };
}

function calculateYearDistribution(vehicles: any[]) {
  const years = vehicles.reduce((acc, vehicle) => {
    const yearRange = Math.floor(vehicle.year / 5) * 5;
    acc[yearRange] = (acc[yearRange] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return Object.entries(years)
    .map(([year, count]) => ({
      range: `${year}-${Number(year) + 4}`,
      count
    }))
    .sort((a, b) => Number(a.range.split('-')[0]) - Number(b.range.split('-')[0]));
}

function calculateComplianceTrends(estimates: any[]) {
  // Group by month
  const monthlyScores = estimates.reduce((acc, est) => {
    if (est.compliance) {
      const month = new Date(est.createdAt).toISOString().slice(0, 7);
      if (!acc[month]) acc[month] = [];
      acc[month].push(est.compliance.score);
    }
    return acc;
  }, {} as Record<string, number[]>);

  return Object.entries(monthlyScores)
    .map(([month, scores]) => ({
      month,
      averageScore: Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2))
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6);
}

function calculateAverageProcessingTime(estimates: any[]) {
  const times = estimates
    .filter(e => e.status === 'COMPLETED')
    .map(e => {
      const start = new Date(e.createdAt).getTime();
      const end = new Date(e.updatedAt).getTime();
      return (end - start) / 1000; // Convert to seconds
    });

  return times.length ?
    Number((times.reduce((a, b) => a + b, 0) / times.length).toFixed(1)) : 0;
}

function analyzeUserPerformance(estimates: any[]) {
  const userStats = estimates.reduce((acc, est) => {
    const userId = est.user.name;
    if (!acc[userId]) {
      acc[userId] = {
        name: est.user.name,
        role: est.user.role,
        estimateCount: 0,
        averageScore: 0,
        scores: []
      };
    }
    acc[userId].estimateCount++;
    if (est.compliance) {
      acc[userId].scores.push(est.compliance.score);
    }
    return acc;
  }, {} as Record<string, any>);

  return Object.values(userStats).map(user => ({
    name: user.name,
    role: user.role,
    estimateCount: user.estimateCount,
    averageScore: user.scores.length ?
      Number((user.scores.reduce((a: number, b: number) => a + b, 0) / user.scores.length).toFixed(2)) : 0
  }));
}

function calculateMonthlyVolume(estimates: any[]) {
  const monthly = estimates.reduce((acc, est) => {
    const month = new Date(est.createdAt).toISOString().slice(0, 7);
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(monthly)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6);
}

function calculateAcceptanceRate(estimates: any[]) {
  const completed = estimates.filter(e => e.status === 'COMPLETED').length;
  return Number(((completed / estimates.length) * 100).toFixed(1));
}

function identifyRiskAreas(estimates: any[]) {
  const issues = estimates
    .filter(e => e.compliance?.issues)
    .flatMap(e => e.compliance.issues)
    .filter(issue => issue.severity === 'ERROR' || issue.severity === 'WARNING');

  const riskAreas = issues.reduce((acc, issue) => {
    if (!acc[issue.type]) {
      acc[issue.type] = {
        count: 0,
        severity: issue.severity,
        impact: 0
      };
    }
    acc[issue.type].count++;
    acc[issue.type].impact += issue.severity === 'ERROR' ? 2 : 1;
    return acc;
  }, {} as Record<string, any>);

  return Object.entries(riskAreas)
    .map(([type, data]) => ({
      type,
      ...data,
      riskScore: Number(((data.impact / data.count) * data.count).toFixed(2))
    }))
    .sort((a, b) => b.riskScore - a.riskScore);
}

export default withAuth(handler); 