import { useEffect, useState } from 'react';

interface AIAnalysisProps {
  estimate: any;
}

export default function AIAnalysis({ estimate }: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    // The analysis is already done during upload, just display it
    setAnalysis(estimate.aiAnalysis);
  }, [estimate]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">AI Analysis</h2>
      
      {analysis && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded p-4">
              <h3 className="font-medium mb-2">Damage Detection</h3>
              <p className="text-lg">
                {analysis.damageDetected ? 'Damage Detected' : 'No Damage Detected'}
              </p>
            </div>
            
            <div className="border rounded p-4">
              <h3 className="font-medium mb-2">Severity Score</h3>
              <p className="text-lg">{(analysis.severityScore * 100).toFixed(1)}%</p>
            </div>
          </div>

          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Damage Locations</h3>
            <ul className="list-disc list-inside">
              {analysis.damageLocations.map((location: string, index: number) => (
                <li key={index} className="capitalize">
                  {location.replace('_', ' ')}
                </li>
              ))}
            </ul>
          </div>

          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Recommended Repairs</h3>
            <ul className="list-disc list-inside">
              {analysis.recommendedRepairs.map((repair: string, index: number) => (
                <li key={index} className="capitalize">
                  {repair.replace('_', ' ')}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
} 