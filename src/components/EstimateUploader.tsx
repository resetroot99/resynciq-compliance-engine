import { useState } from 'react';
import { uploadEstimate } from '../utils/mockApi';

interface EstimateUploaderProps {
  onEstimateUploaded: (estimate: any) => void;
}

export default function EstimateUploader({ onEstimateUploaded }: EstimateUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);
      
      const estimate = await uploadEstimate(file);
      onEstimateUploaded(estimate);
    } catch (err) {
      setError('Failed to upload estimate. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload Estimate</h2>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          type="file"
          accept=".pdf,.jpg,.png"
          onChange={handleFileUpload}
          className="hidden"
          id="estimate-upload"
          disabled={uploading}
        />
        <label
          htmlFor="estimate-upload"
          className="cursor-pointer text-blue-600 hover:text-blue-800"
        >
          {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
        </label>
        
        {error && (
          <p className="text-red-500 mt-2">{error}</p>
        )}
      </div>
    </div>
  );
} 