class QueueService {
    static async getQueueItems() {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/estimates/queue`, {
                headers: {
                    'Authorization': `Bearer ${AuthService.getToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch queue items');
            }

            return response.json();
        } catch (error) {
            ErrorHandler.showError(error);
            throw error;
        }
    }

    static async updateQueueItem(estimateId, updates) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/estimates/${estimateId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AuthService.getToken()}`
                },
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                throw new Error('Failed to update queue item');
            }

            return response.json();
        } catch (error) {
            ErrorHandler.showError(error);
            throw error;
        }
    }

    static async filterQueue(filters) {
        try {
            const queryParams = new URLSearchParams(filters);
            const response = await fetch(
                `${CONFIG.API_BASE_URL}/estimates/queue/filter?${queryParams}`,
                {
                    headers: {
                        'Authorization': `Bearer ${AuthService.getToken()}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to filter queue');
            }

            return response.json();
        } catch (error) {
            ErrorHandler.showError(error);
            throw error;
        }
    }
} 