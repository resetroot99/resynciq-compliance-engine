class EstimateStorageService {
  /**
   * Store the uploaded estimate in the portal.
   * @param {File} file - The uploaded file.
   * @param {Object} metadata - Additional metadata about the estimate.
   * @returns {Promise<Object>} - The server response.
   */
  static async storeEstimate(file, metadata) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify(metadata));
      
      const response = await fetch(`${CONFIG.API_BASE_URL}/estimates/store`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AuthService.getToken()}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to store estimate on the portal.');
      }
      return response.json();
    } catch (error) {
      ErrorHandler.showError(error);
      throw error;
    }
  }
} 