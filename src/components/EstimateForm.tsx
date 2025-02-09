import React, { useState } from 'react';
import { fetchApi } from '../lib/api';
import { notificationService } from '../services/notification-service';

export function EstimateForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      await fetchApi('/estimates', {
        method: 'POST',
        body: formData,
      });

      notificationService.notify('Estimate uploaded successfully', 'success');
      setFile(null);
    } catch (error) {
      notificationService.notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Upload Estimate
        </label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mt-1 block w-full"
        />
      </div>
      <button
        type="submit"
        disabled={!file || loading}
        className="bg-primary-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
} 