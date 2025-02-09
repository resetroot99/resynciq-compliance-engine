class UIState {
    static currentEstimate = null;
    static currentAnalysis = null;
    static currentView = 'upload';
    static isProcessing = false;
    static currentEstimateId = null;
    static processingState = false;

    static initialize() {
        this.currentEstimateId = null;
        this.processingState = false;
        this.setupEventListeners();
    }

    static setupEventListeners() {
        window.addEventListener('hashchange', () => {
            this.handleRouteChange(window.location.hash);
        });
    }

    static setProcessingState(message) {
        this.processingState = true;
        const overlay = document.createElement('div');
        overlay.className = 'processing-overlay';
        overlay.innerHTML = `
            <div class="processing-content">
                <div class="processing-spinner"></div>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    static clearProcessingState() {
        this.processingState = false;
        const overlay = document.querySelector('.processing-overlay');
        if (overlay) overlay.remove();
    }

    static async updateAllViews(estimateData, analysis) {
        this.updateEstimateView(estimateData);
        this.updateAnalysisView(analysis);
        this.updateComplianceView(analysis.compliance);
        await this.refreshQueue();
    }

    static updateEstimateView(data) {
        const formatted = EstimateDetailService.formatEstimateData(data);
        
        // Update summary
        document.getElementById('estimateStatus').textContent = formatted.status;
        document.getElementById('estimateDate').textContent = formatted.timestamp;
        document.getElementById('estimateTotal').textContent = `$${formatted.total.toFixed(2)}`;
        document.getElementById('aiConfidence').textContent = `${formatted.aiConfidence}%`;

        // Update labor rates
        const laborRatesBody = document.getElementById('laborRatesBody');
        laborRatesBody.innerHTML = formatted.laborRates.map(rate => `
            <tr>
                <td>${rate.type}</td>
                <td>${rate.formattedRate}</td>
                <td><span class="status-badge ${rate.status}">${rate.status}</span></td>
            </tr>
        `).join('');

        // Update parts
        const partsListBody = document.getElementById('partsListBody');
        partsListBody.innerHTML = formatted.parts.map(part => `
            <tr>
                <td>${part.number}</td>
                <td>${part.description}</td>
                <td>${part.formattedPrice}</td>
                <td><span class="status-badge ${part.status}">${part.status}</span></td>
            </tr>
        `).join('');

        // Update operations
        const operationsListBody = document.getElementById('operationsListBody');
        operationsListBody.innerHTML = formatted.operations.map(op => `
            <tr>
                <td>${op.name}</td>
                <td>${op.hours}</td>
                <td>${op.formattedRate}</td>
                <td>${op.formattedCost}</td>
                <td><span class="status-badge ${op.status}">${op.status}</span></td>
            </tr>
        `).join('');
    }

    static updateAnalysisView(analysis) {
        document.getElementById('laborAnalysis').innerHTML = 
            TemplateService.createAnalysisCard(analysis.laborAnalysis);
        document.getElementById('partsAnalysis').innerHTML = 
            TemplateService.createAnalysisCard(analysis.partsAnalysis);
        document.getElementById('operationsAnalysis').innerHTML = 
            TemplateService.createAnalysisCard(analysis.operationsAnalysis);
        document.getElementById('approvalPrediction').innerHTML = 
            TemplateService.createAnalysisCard(analysis.approvalPrediction);
    }

    static updateComplianceView(compliance) {
        document.getElementById('insuranceChecks').innerHTML = 
            compliance.insurance.map(check => TemplateService.createComplianceCheck(check)).join('');
        document.getElementById('oemChecks').innerHTML = 
            compliance.oem.map(check => TemplateService.createComplianceCheck(check)).join('');
        
        document.getElementById('insuranceStatus').className = 
            `status-badge ${compliance.insurance.status}`;
        document.getElementById('oemStatus').className = 
            `status-badge ${compliance.oem.status}`;
    }

    static async refreshQueue() {
        const queueItems = await QueueService.getQueueItems();
        this.updateQueueView(queueItems);
    }

    static updateQueueView(items) {
        const queueList = document.getElementById('queueList');
        queueList.innerHTML = items.map(item => TemplateService.createQueueItem(item)).join('');
    }

    static showSuccess(message) {
        NotificationService.success(message);
    }

    static showError(message) {
        NotificationService.error(message);
    }

    static showWarning(message) {
        NotificationService.warning(message);
    }

    private static handleRouteChange(hash) {
        const section = hash.substring(1) || 'upload';
        document.querySelectorAll('main section').forEach(s => {
            s.classList.toggle('hidden', s.id !== section);
        });
        document.querySelectorAll('.terminal-sidebar li').forEach(li => {
            li.classList.toggle('active', li.querySelector(`a[href="#${section}"]`));
        });
    }

    static async updateEstimateView(estimateData, analysis, prediction) {
        this.currentEstimate = estimateData;
        this.currentAnalysis = analysis;

        // Update estimate details
        document.getElementById('estimateTitle').textContent = `Estimate #${estimateData.id}`;
        document.getElementById('estimateStatus').className = `status-badge ${estimateData.status}`;
        document.getElementById('estimateStatus').textContent = estimateData.status;
        document.getElementById('approvalProbability').textContent = 
            `Approval: ${Math.round(prediction.probability)}%`;

        // Update estimate content
        document.querySelector('.estimate-data').textContent = 
            this.formatEstimateData(estimateData);
        document.querySelector('.analysis-data').textContent = 
            this.formatAnalysisData(analysis);
        
        // Update recommendations
        this.updateRecommendations(analysis.recommendations);
        
        // Update compliance checks
        this.updateComplianceChecks(analysis.compliance);
    }

    static updateRecommendations(recommendations) {
        const container = document.querySelector('.recommendations-list');
        container.innerHTML = recommendations.map(rec => `
            <div class="recommendation-item ${rec.severity}">
                <div class="recommendation-header">
                    <span class="title">${rec.title}</span>
                    <span class="confidence">${rec.confidence}%</span>
                </div>
                <p class="description">${rec.description}</p>
                <button onclick="UIState.applyRecommendation('${rec.id}')" 
                        class="action-btn">Apply</button>
            </div>
        `).join('');
    }

    static updateComplianceChecks(compliance) {
        const items = document.querySelectorAll('.compliance-item');
        items.forEach(item => {
            const label = item.querySelector('.check-label').textContent;
            const status = compliance[label.toLowerCase().replace(' ', '_')];
            item.querySelector('.check-status').className = 
                `check-status ${status.isCompliant ? 'compliant' : 'non-compliant'}`;
            item.querySelector('.check-status').textContent = status.message;
        });
    }

    static async applyRecommendation(recId) {
        try {
            this.isProcessing = true;
            const recommendation = this.currentAnalysis.recommendations
                .find(r => r.id === recId);
            
            if (!recommendation) {
                throw new Error('Recommendation not found');
            }

            const updatedEstimate = await AutoCorrection.applyCorrections(
                this.currentEstimate,
                [recommendation]
            );

            // Update UI with new estimate data
            await this.updateEstimateView(
                updatedEstimate,
                this.currentAnalysis,
                await PredictiveModel.getApprovalProbability(updatedEstimate)
            );

            showSuccess('Recommendation applied successfully');
        } catch (error) {
            ErrorHandler.showError(error);
        } finally {
            this.isProcessing = false;
        }
    }

    static formatEstimateData(estimate) {
        // Implementation from dashboard.js
        return `...`;
    }

    static formatAnalysisData(analysis) {
        // Implementation from dashboard.js
        return `...`;
    }
} 