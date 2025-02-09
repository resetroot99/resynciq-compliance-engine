import { Analytics } from '../types/analytics';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Parser } from 'json2csv';

export async function exportAnalytics(
  analytics: Analytics,
  format: 'pdf' | 'csv' | 'excel'
) {
  switch (format) {
    case 'pdf':
      return exportPDF(analytics);
    case 'csv':
      return exportCSV(analytics);
    case 'excel':
      return exportExcel(analytics);
  }
}

function exportPDF(analytics: Analytics) {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Analytics Report', 20, 20);
  
  // Add overview section
  doc.setFontSize(16);
  doc.text('Overview', 20, 40);
  
  const overviewData = [
    ['Total Estimates', analytics.overview.totalEstimates.toString()],
    ['Average Compliance', `${analytics.overview.averageComplianceScore}%`],
    ['Processing Time', `${analytics.overview.processingTime}s`]
  ];
  
  // @ts-ignore
  doc.autoTable({
    startY: 45,
    head: [['Metric', 'Value']],
    body: overviewData
  });
  
  // Add compliance issues
  doc.setFontSize(16);
  doc.text('Common Issues', 20, doc.lastAutoTable.finalY + 20);
  
  const issuesData = analytics.compliance.commonIssues.map(issue => [
    issue.type,
    issue.severity,
    issue.count.toString()
  ]);
  
  // @ts-ignore
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 25,
    head: [['Issue', 'Severity', 'Count']],
    body: issuesData
  });
  
  doc.save('analytics-report.pdf');
}

function exportCSV(analytics: Analytics) {
  const fields = [
    'totalEstimates',
    'averageComplianceScore',
    'processingTime',
    'estimateAcceptanceRate'
  ];
  
  const parser = new Parser({ fields });
  
  const csv = parser.parse({
    totalEstimates: analytics.overview.totalEstimates,
    averageComplianceScore: analytics.overview.averageComplianceScore,
    processingTime: analytics.overview.processingTime,
    estimateAcceptanceRate: analytics.performance.estimateAcceptanceRate
  });
  
  downloadFile(csv, 'analytics-report.csv', 'text/csv');
}

function exportExcel(analytics: Analytics) {
  const wb = XLSX.utils.book_new();
  
  // Overview sheet
  const overviewData = [
    ['Metric', 'Value'],
    ['Total Estimates', analytics.overview.totalEstimates],
    ['Average Compliance', analytics.overview.averageComplianceScore],
    ['Processing Time', analytics.overview.processingTime]
  ];
  const wsOverview = XLSX.utils.aoa_to_sheet(overviewData);
  XLSX.utils.book_append_sheet(wb, wsOverview, 'Overview');
  
  // Compliance sheet
  const complianceData = [
    ['Issue Type', 'Severity', 'Count'],
    ...analytics.compliance.commonIssues.map(issue => [
      issue.type,
      issue.severity,
      issue.count
    ])
  ];
  const wsCompliance = XLSX.utils.aoa_to_sheet(complianceData);
  XLSX.utils.book_append_sheet(wb, wsCompliance, 'Compliance Issues');
  
  // Performance sheet
  const performanceData = [
    ['User', 'Role', 'Estimates', 'Average Score'],
    ...analytics.performance.userPerformance.map(user => [
      user.name,
      user.role,
      user.estimateCount,
      user.averageScore
    ])
  ];
  const wsPerformance = XLSX.utils.aoa_to_sheet(performanceData);
  XLSX.utils.book_append_sheet(wb, wsPerformance, 'Performance');
  
  XLSX.writeFile(wb, 'analytics-report.xlsx');
}

function downloadFile(content: string, fileName: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(url);
} 