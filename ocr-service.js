class OCRService {
    static async extractFromPDF(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('config', JSON.stringify({
                language: CONFIG.OCR.SUPPORTED_LANGUAGES,
                mode: CONFIG.OCR.PDF_EXTRACTION_MODE
            }));

            const response = await fetch(`${CONFIG.API_BASE_URL}/ocr/extract`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('PDF extraction failed');
            }

            const data = await response.json();
            return this.validateExtractedData(data);
        } catch (error) {
            ErrorHandler.showError(error);
            throw error;
        }
    }

    static async processEMS(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${CONFIG.API_BASE_URL}/ems/process`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('EMS processing failed');
            }

            const data = await response.json();
            return this.validateExtractedData(data);
        } catch (error) {
            ErrorHandler.showError(error);
            throw error;
        }
    }

    static validateExtractedData(data) {
        const validation = ValidationService.validateEstimateData(data);
        if (!validation.isValid) {
            throw new Error(`Data validation failed: ${validation.errors.join(', ')}`);
        }
        return data;
    }
} 