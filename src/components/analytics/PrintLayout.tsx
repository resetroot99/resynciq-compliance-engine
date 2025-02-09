import { Analytics } from '../../types/analytics';
import { formatNumber, formatPercentage, formatDate } from '../../utils/format';

interface Props {
  data: Analytics;
  dateRange: { start: Date; end: Date };
}

export default function PrintLayout({ data, dateRange }: Props) {
  return (
    <div className="print:block hidden p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Analytics Report</h1>
        <p className="text-gray-600">
          {formatDate(dateRange.start.toISOString())} - {formatDate(dateRange.end.toISOString())}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="border rounded p-4">
          <h2 className="font-semibold mb-4">Overview</h2>
          <dl className="grid grid-cols-2 gap-2">
            <dt>Total Estimates</dt>
            <dd>{formatNumber(data.overview.totalEstimates)}</dd>
            <dt>Compliance Score</dt>
            <dd>{formatPercentage(data.overview.averageComplianceScore)}</dd>
            <dt>Processing Time</dt>
            <dd>{data.overview.processingTime}s</dd>
            <dt>Acceptance Rate</dt>
            <dd>{formatPercentage(data.performance.estimateAcceptanceRate)}</dd>
          </dl>
        </div>

        <div className="border rounded p-4">
          <h2 className="font-semibold mb-4">Top Issues</h2>
          <ul className="space-y-2">
            {data.compliance.commonIssues.map((issue, i) => (
              <li key={i} className="flex justify-between">
                <span>{issue.type}</span>
                <span>{issue.count} occurrences</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border rounded p-4 mb-8">
        <h2 className="font-semibold mb-4">Team Performance</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Name</th>
              <th className="text-left">Role</th>
              <th className="text-right">Estimates</th>
              <th className="text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {data.performance.userPerformance.map((user, i) => (
              <tr key={i}>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td className="text-right">{user.estimateCount}</td>
                <td className="text-right">{formatPercentage(user.averageScore)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-gray-500 text-center">
        Generated on {new Date().toLocaleString()}
      </div>
    </div>
  );
} 