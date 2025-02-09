class TemplateService {
    static createQueueItem(item) {
        return `
            <div class="queue-item ${item.status.toLowerCase()}" data-id="${item.id}">
                <div class="queue-item-details">
                    <span class="queue-item-title">Estimate #${item.id}</span>
                    <span class="queue-item-meta">
                        Submitted: ${new Date(item.timestamp).toLocaleString()} | 
                        Confidence: ${item.aiConfidence}%
                    </span>
                </div>
                <div class="queue-item-actions">
                    <button onclick="DashboardController.handleEstimateAction('${item.id}', 'approve')" 
                            class="action-btn approve">
                        [ Approve ]
                    </button>
                    <button onclick="DashboardController.handleEstimateAction('${item.id}', 'reject')" 
                            class="action-btn reject">
                        [ Reject ]
                    </button>
                    <button onclick="DashboardController.viewEstimateDetails('${item.id}')" 
                            class="action-btn view">
                        [ View Details ]
                    </button>
                </div>
            </div>
        `;
    }

    static createAnalysisCard(analysis) {
        return `
            <div class="analysis-card">
                <div class="card-header">
                    <span class="prompt">> </span>${analysis.title}
                    <span class="confidence">${analysis.confidence}%</span>
                </div>
                <div class="analysis-content">
                    ${this.formatAnalysisContent(analysis)}
                </div>
                ${this.createActionButtons(analysis)}
            </div>
        `;
    }

    static formatAnalysisContent(analysis) {
        let content = '';
        
        if (analysis.findings) {
            content += '<div class="findings">';
            analysis.findings.forEach(finding => {
                content += `<p class="${finding.type}">${finding.message}</p>`;
            });
            content += '</div>';
        }

        if (analysis.recommendations) {
            content += '<div class="recommendations">';
            analysis.recommendations.forEach(rec => {
                content += `
                    <div class="recommendation">
                        <p class="description">${rec.description}</p>
                        <button onclick="AutoCorrection.applyRecommendation('${rec.id}')" 
                                class="action-btn">
                            [ Apply ]
                        </button>
                    </div>
                `;
            });
            content += '</div>';
        }

        return content;
    }

    static createActionButtons(analysis) {
        if (!analysis.actions) return '';

        return `
            <div class="action-buttons">
                ${analysis.actions.map(action => `
                    <button onclick="${action.handler}" class="action-btn ${action.type}">
                        [ ${action.label} ]
                    </button>
                `).join('')}
            </div>
        `;
    }

    static createComplianceCheck(check) {
        return `
            <div class="check-item ${check.status}">
                <span class="check-label">${check.label}</span>
                <span class="check-value">${check.value}</span>
                <span class="check-status ${check.status}">
                    ${this.getStatusIcon(check.status)}
                </span>
            </div>
        `;
    }

    static getStatusIcon(status) {
        switch (status) {
            case 'pass': return '✓';
            case 'fail': return '✗';
            case 'warning': return '⚠';
            default: return '?';
        }
    }
} 