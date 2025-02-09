class DashboardController {
    static async initialize() {
        try {
            // Initialize UI state
            UIState.initialize();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize learning feedback
            if (FEATURES.LEARNING_FEEDBACK) {
                LearningFeedbackService.initialize();
            }
            
            // Load initial queue
            await this.loadQueue();
        } catch (error) {
            ErrorHandler.showError(error);
        }
    }

    static setupEventListeners() {
        // File upload handlers
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', async (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            await this.handleFiles(files);
        });

        fileInput.addEventListener('change', async (e) => {
            await this.handleFiles(e.target.files);
        });

        // Navigation handlers
        document.querySelectorAll('.terminal-sidebar a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(e.target.getAttribute('href').substring(1));
            });
        });

        // Queue filters
        const queueFilter = document.getElementById('queueFilter');
        const searchQueue = document.getElementById('searchQueue');
        if (queueFilter) queueFilter.addEventListener('change', () => this.filterQueue());
        if (searchQueue) searchQueue.addEventListener('input', () => this.filterQueue());
    }

    static async handleFiles(files) {
        try {
            UIState.setProcessingState('Processing estimate...');
            const file = files[0];
            
            // Validate file
            if (!this.isValidFile(file)) {
                throw new Error('Invalid file type. Please upload PDF or EMS files only.');
            }

            // Process estimate
            const result = await EstimateWorkflow.processNewEstimate(file);
            
            // Update UI with results
            await UIState.updateAllViews(result.extractedData, result.analysis);
            
            // Switch to analysis view
            this.handleNavigation('ai-analysis');
        } catch (error) {
            ErrorHandler.showError(error);
        } finally {
            UIState.clearProcessingState();
        }
    }

    static isValidFile(file) {
        const validTypes = CONFIG.SUPPORTED_FORMATS;
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        return validTypes.includes(fileExtension);
    }

    static async loadQueue() {
        try {
            const queueItems = await QueueService.getQueueItems();
            UIState.updateQueueView(queueItems);
        } catch (error) {
            ErrorHandler.showError(error);
        }
    }

    static async filterQueue() {
        try {
            const filter = document.getElementById('queueFilter').value;
            const search = document.getElementById('searchQueue').value;
            
            const filters = {
                status: filter !== 'all' ? filter : undefined,
                search: search || undefined
            };

            const filteredItems = await QueueService.filterQueue(filters);
            UIState.updateQueueView(filteredItems);
        } catch (error) {
            ErrorHandler.showError(error);
        }
    }

    static async handleNavigation(section) {
        // Hide all sections
        document.querySelectorAll('main section').forEach(s => s.classList.add('hidden'));
        
        // Show selected section
        const selectedSection = document.getElementById(section);
        if (selectedSection) {
            selectedSection.classList.remove('hidden');
        }

        // Update sidebar active state
        document.querySelectorAll('.terminal-sidebar li').forEach(li => {
            li.classList.toggle('active', li.querySelector(`a[href="#${section}"]`));
        });

        // Special handling for sections
        if (section === 'queue') {
            await this.loadQueue();
        }
    }

    static async handleEstimateAction(estimateId, action) {
        try {
            UIState.setProcessingState(`Processing ${action}...`);
            
            // Process the action
            await EstimateWorkflow.finalizeEstimate(estimateId, action);
            
            // Refresh queue
            await this.loadQueue();
            
            // Show success message
            UIState.showSuccess(`Estimate ${action} successfully`);
        } catch (error) {
            ErrorHandler.showError(error);
        } finally {
            UIState.clearProcessingState();
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    DashboardController.initialize();
}); 