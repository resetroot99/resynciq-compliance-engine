import { useState, useEffect } from 'react';
import { validateCompliance } from '../services/estimateService';

interface ComplianceCheckProps {
  estimate: any;
}

export default function ComplianceCheck({ estimate }: ComplianceCheckProps) {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkCompliance() {
      try {
        setLoading(true);
        const complianceResults = await validateCompliance(estimate);
        setResults(complianceResults);
      } catch (err) {
        setError('Failed to validate compliance');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    checkCompliance();
  }, [estimate]);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Compliance Check</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Compliance Check</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Compliance Check</h2>
      <div className="space-y-4">
        {results?.issues?.map((issue: any, index: number) => (
          <div key={index} className="border-l-4 border-yellow-500 pl-4">
            <p className="font-medium">{issue.title}</p>
            <p className="text-gray-600">{issue.description}</p>
          </div>
        ))}
        {results?.issues?.length === 0 && (
          <p className="text-green-600">All compliance checks passed!</p>
        )}
      </div>
    </div>
  );
} 