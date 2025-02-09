const GEICO_ARX_RULES = {
    INCLUDED_OPERATIONS: {
        'replace_bumper_front': [
            { code: 'r&i_bumper_cover', description: 'R&I Bumper Cover' },
            { code: 'r&i_grille', description: 'R&I Grille Assembly' }
        ],
        'replace_fender': [
            { code: 'r&i_molding', description: 'R&I Fender Molding' },
            { code: 'r&i_liner', description: 'R&I Fender Liner' }
        ],
        'replace_door_shell': [
            { code: 'r&i_trim', description: 'R&I Door Trim Panel' },
            { code: 'r&i_mirror', description: 'R&I Mirror' }
        ]
    },
    
    REFINISH_OVERLAP_RULES: {
        'adjacent_panel_reduction': 0.5, // 50% overlap reduction
        'three_stage_multiplier': 1.5,   // 50% increase for three-stage
        'blend_panel_time': 2.0         // Standard blend time
    },
    
    PARTS_GUIDELINES: {
        oem_markup_max: 25,
        aftermarket_markup_max: 33,
        min_aftermarket_ratio: 30, // 30% minimum aftermarket usage
        preferred_vendors: ['CAPA', 'NSF', 'Diamond Standard']
    }
};

// Add these color-specific constants
const COLOR_COMPLEXITY_RULES = {
    FACTORS: {
        METALLIC: 1.5,      // Metallic colors are 50% more complex
        PEARL: 2.0,         // Pearl colors are 100% more complex
        TRI_COAT: 2.5,      // Tri-coat colors are 150% more complex
        MATTE: 1.8         // Matte finishes are 80% more complex
    },
    
    BLEND_THRESHOLDS: {
        STANDARD: 0.8,     // Standard colors need 80% match
        METALLIC: 0.85,    // Metallic colors need 85% match
        PEARL: 0.9,        // Pearl colors need 90% match
        TRI_COAT: 0.95     // Tri-coat colors need 95% match
    }
};

const securityModule = {
    verifyIntegrity() {
        // Implementation hidden
    },
    validateExecution() {
        // Implementation hidden
    },
    monitorUsage() {
        // Implementation hidden
    }
};

class OCRService {
    static async extractFromPDF(file) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${CONFIG.API_BASE_URL}/ocr/extract`, {
            method: 'POST',
            body: formData
        });
        
        return response.json();
    }

    static async processEMS(file) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${CONFIG.API_BASE_URL}/ems/process`, {
            method: 'POST',
            body: formData
        });
        
        return response.json();
    }
}

class PredictiveModel {
    static async getApprovalProbability(estimateData) {
        const response = await fetch(`${CONFIG.API_BASE_URL}/ai/predict-approval`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(estimateData)
        });
        
        return response.json();
    }

    static async submitFeedback(estimateId, outcome) {
        return APIService.makeRequest('/ai/feedback', 'POST', {
            estimateId,
            outcome,
            timestamp: new Date().toISOString()
        });
    }
}

class AIService {
    constructor() {
        if (!securityModule.verifyIntegrity()) {
            throw new Error('Security violation detected');
        }
        this.confidenceThreshold = 0.85;
        this.learningEnabled = true;
    }

    async analyzeEstimate(estimateData) {
        try {
            // Extract key data points from CCC estimate
            const extracted = await this.extractEstimateData(estimateData);
            
            // Compare against GEICO ARX guidelines
            const compliance = await this.checkCompliance(extracted);
            
            // Generate AI recommendations
            const recommendations = await this.generateRecommendations(extracted);
            
            // Calculate confidence score
            const confidence = this.calculateConfidence(compliance, recommendations);
            
            return {
                compliance,
                recommendations,
                confidence,
                autoCorrections: this.getAutoCorrections(recommendations)
            };
        } catch (error) {
            console.error('AI Analysis Error:', error);
            throw new Error('Failed to analyze estimate');
        }
    }

    async extractEstimateData(estimateData) {
        // Connect to CCC API for data extraction
        const cccData = await api.post(APIEndpoints.CCC_EXTRACT, {
            estimate: estimateData
        });

        return {
            laborOperations: cccData.laborOperations,
            partsData: cccData.parts,
            refinishOperations: cccData.refinish,
            totalHours: cccData.totalHours,
            lineItems: cccData.lineItems
        };
    }

    async checkCompliance(extractedData) {
        // Check against GEICO ARX rules
        const rules = await api.get(APIEndpoints.GET_DRP_RULES, {
            program: 'GEICO_ARX'
        });

        const complianceChecks = [
            this.checkLaborRates(extractedData, rules),
            this.checkPartsGuidelines(extractedData, rules),
            this.checkOperationTimes(extractedData, rules),
            this.checkRefinishOverlap(extractedData, rules)
        ];

        return Promise.all(complianceChecks);
    }

    async generateRecommendations(data) {
        // Get historical approval patterns
        const patterns = await api.get(APIEndpoints.GET_APPROVAL_PATTERNS);
        
        return {
            laborAdjustments: this.analyzeLaborOperations(data, patterns),
            partsRecommendations: this.analyzePartsChoices(data, patterns),
            refinishSuggestions: this.analyzeRefinishOperations(data, patterns)
        };
    }

    getAutoCorrections(recommendations) {
        // Filter recommendations that meet confidence threshold
        return recommendations.filter(rec => 
            rec.confidence >= this.confidenceThreshold
        ).map(rec => ({
            type: rec.type,
            action: rec.action,
            originalValue: rec.current,
            newValue: rec.recommended
        }));
    }

    async submitFeedback(estimateId, feedback) {
        if (!this.learningEnabled) return;

        await api.post(APIEndpoints.SUBMIT_FEEDBACK, {
            estimateId,
            feedback,
            timestamp: new Date().toISOString()
        });

        // Trigger model retraining if enough new data
        await this.checkAndTriggerRetraining();
    }

    calculateConfidence(compliance, recommendations) {
        // Weighted scoring based on multiple factors
        const weights = {
            compliance: 0.4,
            historical: 0.3,
            pattern: 0.3
        };

        return (
            weights.compliance * this.getComplianceScore(compliance) +
            weights.historical * this.getHistoricalScore(recommendations) +
            weights.pattern * this.getPatternScore(recommendations)
        );
    }

    async checkLaborRates(data, rules) {
        const laborChecks = [];
        
        // Check body labor rate
        if (data.laborOperations.bodyRate > rules.laborRates.body) {
            laborChecks.push({
                type: 'labor_rate',
                operation: 'Body',
                current: data.laborOperations.bodyRate,
                recommended: rules.laborRates.body,
                severity: 'high',
                description: 'Body labor rate exceeds program maximum'
            });
        }
        
        // Check refinish labor rate
        if (data.laborOperations.refinishRate > rules.laborRates.refinish) {
            laborChecks.push({
                type: 'labor_rate',
                operation: 'Refinish',
                current: data.laborOperations.refinishRate,
                recommended: rules.laborRates.refinish,
                severity: 'high',
                description: 'Refinish labor rate exceeds program maximum'
            });
        }
        
        return laborChecks;
    }

    async checkPartsGuidelines(data, rules) {
        const partsChecks = [];
        
        // Check OEM parts markup
        const oemMarkup = this.calculatePartsMarkup(data.partsData.oem);
        if (oemMarkup > rules.partsMarkup.oem) {
            partsChecks.push({
                type: 'parts_markup',
                category: 'OEM',
                current: oemMarkup,
                recommended: rules.partsMarkup.oem,
                severity: 'medium',
                description: 'OEM parts markup exceeds guideline'
            });
        }
        
        // Check aftermarket parts usage
        const aftermarketRatio = this.calculateAftermarketRatio(data.partsData);
        if (aftermarketRatio < rules.partsUsage.minimumAftermarket) {
            partsChecks.push({
                type: 'parts_usage',
                category: 'Aftermarket',
                current: aftermarketRatio,
                recommended: rules.partsUsage.minimumAftermarket,
                severity: 'medium',
                description: 'Aftermarket parts usage below program requirement'
            });
        }
        
        return partsChecks;
    }

    async checkOperationTimes(data, rules) {
        const timeChecks = [];
        
        // Check standard operation times
        data.laborOperations.items.forEach(operation => {
            const standardTime = rules.operationTimes[operation.code];
            if (standardTime && operation.hours > standardTime * 1.2) { // 20% threshold
                timeChecks.push({
                    type: 'operation_time',
                    operation: operation.description,
                    current: operation.hours,
                    recommended: standardTime,
                    severity: 'medium',
                    description: `Operation time exceeds GEICO ARX guideline by ${Math.round((operation.hours - standardTime) * 10) / 10} hours`
                });
            }
        });

        // Check included operations
        const includedOps = this.findMissingIncludedOperations(data.laborOperations.items, rules.includedOperations);
        includedOps.forEach(op => {
            timeChecks.push({
                type: 'included_operation',
                operation: op.description,
                severity: 'high',
                description: 'Operation should be included with parent operation per GEICO ARX guidelines'
            });
        });

        return timeChecks;
    }

    async checkRefinishOverlap(data, rules) {
        const overlapChecks = [];
        
        // Check adjacent panel overlap
        const adjacentPanels = this.findAdjacentPanels(data.refinishOperations);
        adjacentPanels.forEach(panels => {
            if (!this.hasOverlapDeduction(panels, data.refinishOperations)) {
                overlapChecks.push({
                    type: 'refinish_overlap',
                    panels: panels.map(p => p.description).join(' & '),
                    severity: 'high',
                    description: 'Missing overlap deduction for adjacent panels',
                    recommendation: 'Add overlap deduction per program guidelines'
                });
            }
        });
        
        return overlapChecks;
    }

    analyzeLaborOperations(data, patterns) {
        const laborAnalysis = {
            adjustments: [],
            confidence: 0,
            totalImpact: 0
        };

        // Analyze each operation against historical patterns
        for (const operation of data.laborOperations.items) {
            const similarOps = patterns.labor.filter(p => 
                p.operation_code === operation.code &&
                p.vehicle_match_score > 0.8
            );

            if (similarOps.length >= 5) {
                const avgTime = this.calculateAverageTime(similarOps);
                const deviation = Math.abs(operation.hours - avgTime);
                
                if (deviation > avgTime * 0.15) { // 15% threshold
                    laborAnalysis.adjustments.push({
                        operation: operation.description,
                        current: operation.hours,
                        recommended: avgTime,
                        confidence: this.calculatePatternConfidence(similarOps.length),
                        impact: (operation.hours - avgTime) * data.laborOperations.bodyRate
                    });
                }
            }
        }

        // Calculate overall confidence and impact
        if (laborAnalysis.adjustments.length > 0) {
            laborAnalysis.confidence = laborAnalysis.adjustments.reduce(
                (sum, adj) => sum + adj.confidence, 0
            ) / laborAnalysis.adjustments.length;

            laborAnalysis.totalImpact = laborAnalysis.adjustments.reduce(
                (sum, adj) => sum + adj.impact, 0
            );
        }

        return laborAnalysis;
    }

    analyzePartsChoices(data, patterns) {
        return {
            recommendations: this.findPartsAlternatives(data, patterns),
            confidence: this.calculatePartsConfidence(data, patterns)
        };
    }

    analyzeRefinishOperations(data, patterns) {
        return {
            suggestions: this.findRefinishOptimizations(data, patterns),
            confidence: this.calculateRefinishConfidence(data, patterns)
        };
    }

    // Helper methods
    calculatePartsMarkup(partsData) {
        return ((partsData.sellPrice - partsData.costPrice) / partsData.costPrice) * 100;
    }

    calculateAftermarketRatio(partsData) {
        const totalParts = partsData.oem.length + partsData.aftermarket.length;
        return (partsData.aftermarket.length / totalParts) * 100;
    }

    findAdjacentPanels(operations) {
        const adjacentPanelMap = {
            'front_bumper': ['hood', 'left_fender', 'right_fender'],
            'hood': ['front_bumper', 'left_fender', 'right_fender', 'cowl'],
            'left_fender': ['hood', 'front_bumper', 'left_door_front', 'left_pillar_a'],
            'right_fender': ['hood', 'front_bumper', 'right_door_front', 'right_pillar_a'],
            'left_door_front': ['left_fender', 'left_door_rear', 'left_pillar_b'],
            'right_door_front': ['right_fender', 'right_door_rear', 'right_pillar_b'],
            'left_quarter': ['left_door_rear', 'left_pillar_c', 'rear_bumper'],
            'right_quarter': ['right_door_rear', 'right_pillar_c', 'rear_bumper'],
            'deck_lid': ['left_quarter', 'right_quarter', 'rear_bumper']
        };

        const adjacentPairs = [];
        const refinishPanels = operations.map(op => op.panel_code);

        refinishPanels.forEach(panel => {
            const adjacent = adjacentPanelMap[panel] || [];
            adjacent.forEach(adjPanel => {
                if (refinishPanels.includes(adjPanel)) {
                    adjacentPairs.push([
                        operations.find(op => op.panel_code === panel),
                        operations.find(op => op.panel_code === adjPanel)
                    ]);
                }
            });
        });

        return adjacentPairs;
    }

    hasOverlapDeduction(panels, operations) {
        const [panel1, panel2] = panels;
        const overlapOperations = operations.filter(op => 
            op.operation_code === 'overlap_deduction' &&
            op.related_panels.includes(panel1.panel_code) &&
            op.related_panels.includes(panel2.panel_code)
        );

        return overlapOperations.length > 0;
    }

    findPartsAlternatives(data, patterns) {
        const alternatives = [];
        
        // Check for alternative parts options
        data.partsData.oem.forEach(part => {
            const alternativeParts = patterns.parts.filter(p => 
                p.part_type === part.type && 
                p.vehicle_match === true
            );

            if (alternativeParts.length > 0) {
                const bestAlternative = this.findBestAlternative(part, alternativeParts);
                if (bestAlternative) {
                    alternatives.push({
                        part: part.description,
                        current: {type: 'OEM', price: part.price},
                        recommended: {
                            type: bestAlternative.type,
                            price: bestAlternative.price,
                            supplier: bestAlternative.supplier
                        },
                        confidence: this.calculatePartConfidence(bestAlternative)
                    });
                }
            }
        });

        return alternatives;
    }

    findRefinishOptimizations(data, patterns) {
        const optimizations = [];
        
        // Analyze refinish operations for optimization opportunities
        const refinishGroups = this.groupRefinishOperations(data.refinishOperations);
        refinishGroups.forEach(group => {
            const similarPatterns = patterns.refinish.filter(p => 
                this.matchesRefinishPattern(group, p)
            );

            if (similarPatterns.length > 0) {
                const optimization = this.generateRefinishOptimization(group, similarPatterns);
                if (optimization) {
                    optimizations.push({
                        ...optimization,
                        confidence: this.calculateRefinishConfidence(similarPatterns.length)
                    });
                }
            }
        });

        return optimizations;
    }

    // Helper methods for confidence calculations
    calculatePatternConfidence(sampleSize) {
        // More samples = higher confidence
        return Math.min(0.95, 0.7 + (sampleSize / 1000));
    }

    calculatePartConfidence(alternative) {
        // Consider factors like supplier rating, price difference, and historical success
        const factors = {
            supplierRating: alternative.supplier_rating / 5,
            priceDifference: this.calculatePriceDifferenceScore(alternative),
            historicalSuccess: alternative.success_rate
        };

        return (
            factors.supplierRating * 0.3 +
            factors.priceDifference * 0.3 +
            factors.historicalSuccess * 0.4
        );
    }

    calculateRefinishConfidence(sampleSize) {
        // Base confidence on sample size and pattern consistency
        return Math.min(0.9, 0.6 + (sampleSize / 500));
    }

    async checkAndTriggerRetraining() {
        try {
            const stats = await api.get(APIEndpoints.GET_AI_STATS);
            
            // Check if retraining is needed based on multiple factors
            const shouldRetrain = 
                stats.feedbackCount >= 100 || // New feedback threshold
                stats.errorRate > 0.15 || // Error rate threshold
                stats.lastTrainingAge > 30; // Days since last training
            
            if (shouldRetrain) {
                console.log('Triggering AI model retraining...');
                await api.post(APIEndpoints.TRIGGER_RETRAINING, {
                    reason: 'Automated retraining based on feedback and performance metrics'
                });
            }
        } catch (error) {
            console.error('Error checking retraining status:', error);
        }
    }

    calculateAverageTime(operations) {
        const times = operations.map(op => op.hours);
        return times.reduce((a, b) => a + b, 0) / times.length;
    }

    findBestAlternative(oemPart, alternatives) {
        // Score each alternative based on multiple factors
        const scoredAlternatives = alternatives.map(alt => ({
            ...alt,
            score: this.calculateAlternativeScore(oemPart, alt)
        }));

        // Sort by score and return the best match
        return scoredAlternatives.sort((a, b) => b.score - a.score)[0];
    }

    calculateAlternativeScore(oemPart, alternative) {
        const weights = {
            price: 0.4,
            quality: 0.3,
            availability: 0.2,
            warranty: 0.1
        };

        return (
            weights.price * this.getPriceScore(oemPart.price, alternative.price) +
            weights.quality * (alternative.quality_rating / 5) +
            weights.availability * (alternative.in_stock ? 1 : 0.5) +
            weights.warranty * this.getWarrantyScore(alternative.warranty_months)
        );
    }

    getPriceScore(oemPrice, altPrice) {
        const savings = (oemPrice - altPrice) / oemPrice;
        // Higher score for 20-40% savings, lower for extreme differences
        return savings <= 0 ? 0 : Math.min(1, Math.max(0, 1 - Math.abs(0.3 - savings)));
    }

    getWarrantyScore(months) {
        // Score warranty length (12 months = 0.7, 24+ months = 1.0)
        return Math.min(1, months / 24);
    }

    groupRefinishOperations(operations) {
        // Group adjacent panels that are being refinished
        const groups = [];
        const processed = new Set();

        operations.forEach(op => {
            if (!processed.has(op.panel_code)) {
                const group = this.findConnectedPanels(op, operations);
                groups.push(group);
                group.forEach(p => processed.add(p.panel_code));
            }
        });

        return groups;
    }

    findConnectedPanels(startPanel, operations) {
        const connected = [startPanel];
        const queue = [startPanel];
        const processed = new Set([startPanel.panel_code]);

        while (queue.length > 0) {
            const current = queue.shift();
            const adjacent = this.findAdjacentPanels([current], operations)
                .flat()
                .filter(p => !processed.has(p.panel_code));

            adjacent.forEach(panel => {
                processed.add(panel.panel_code);
                connected.push(panel);
                queue.push(panel);
            });
        }

        return connected;
    }

    matchesRefinishPattern(group, pattern) {
        // Check if panel group matches a known refinish pattern
        const groupPanels = new Set(group.map(p => p.panel_code));
        const patternPanels = new Set(pattern.panel_codes);

        // Compare panel sets
        return (
            groupPanels.size === patternPanels.size &&
            [...groupPanels].every(panel => patternPanels.has(panel))
        );
    }

    generateRefinishOptimization(group, patterns) {
        const bestPattern = patterns.sort((a, b) => b.success_rate - a.success_rate)[0];
        
        if (!bestPattern) return null;

        return {
            panels: group.map(p => p.description),
            current: {
                operations: group.map(p => p.operations).flat(),
                totalHours: group.reduce((sum, p) => sum + p.hours, 0)
            },
            recommended: {
                operations: bestPattern.recommended_operations,
                totalHours: bestPattern.typical_hours,
                notes: bestPattern.technique_notes
            }
        };
    }

    calculatePriceDifferenceScore(alternative) {
        const savingsPercent = ((alternative.oem_price - alternative.price) / alternative.oem_price) * 100;
        
        // Optimal savings is between 20-40%
        if (savingsPercent < 20) return 0.5;
        if (savingsPercent > 40) return 0.7;
        return 1.0;
    }

    getComplianceScore(compliance) {
        const weights = {
            high: 1.0,
            medium: 0.7,
            low: 0.4
        };

        const issues = compliance.flat();
        if (issues.length === 0) return 1.0;

        const weightedSum = issues.reduce((sum, issue) => 
            sum + weights[issue.severity], 0
        );

        return Math.max(0, 1 - (weightedSum / issues.length / 2));
    }

    getHistoricalScore(recommendations) {
        const scores = recommendations.map(rec => rec.confidence || 0);
        return scores.length > 0 ? 
            scores.reduce((a, b) => a + b, 0) / scores.length : 
            0.5;
    }

    getPatternScore(recommendations) {
        // Calculate how well the current estimate matches known patterns
        const patternMatches = recommendations.filter(rec => rec.pattern_match);
        return patternMatches.length / recommendations.length;
    }

    findMissingIncludedOperations(operations, includedRules) {
        const missingOps = [];
        
        operations.forEach(mainOp => {
            const included = includedRules[mainOp.code] || [];
            included.forEach(includedOp => {
                if (operations.some(op => op.code === includedOp.code)) {
                    missingOps.push({
                        parentOp: mainOp.description,
                        description: includedOp.description,
                        code: includedOp.code
                    });
                }
            });
        });
        
        return missingOps;
    }

    async analyzeComplexOperations(data) {
        const complexAnalysis = {
            structuralOperations: this.checkStructuralRepair(data),
            refinishSequence: this.analyzeRefinishSequence(data),
            laborEfficiency: this.calculateLaborEfficiency(data),
            repairDecisions: this.evaluateRepairDecisions(data)
        };

        // Calculate impact and recommendations
        return {
            ...complexAnalysis,
            totalImpact: this.calculateTotalImpact(complexAnalysis),
            recommendations: this.generateDetailedRecommendations(complexAnalysis)
        };
    }

    checkStructuralRepair(data) {
        const structuralChecks = [];
        
        // Check for proper sectioning locations
        data.laborOperations.items
            .filter(op => op.type === 'structural')
            .forEach(op => {
                const locationCheck = this.validateSectioningLocation(op);
                if (!locationCheck.valid) {
                    structuralChecks.push({
                        type: 'sectioning_location',
                        operation: op.description,
                        severity: 'high',
                        description: locationCheck.reason,
                        recommendation: locationCheck.recommendation
                    });
                }
            });

        return structuralChecks;
    }

    analyzeRefinishSequence(data) {
        const sequence = this.buildOptimalRefinishSequence(data.refinishOperations);
        const currentSequence = data.refinishOperations.map(op => op.panel_code);
        
        return {
            optimal: sequence,
            current: currentSequence,
            efficiency: this.calculateSequenceEfficiency(currentSequence, sequence),
            recommendations: this.getSequenceOptimizations(currentSequence, sequence)
        };
    }

    calculateLaborEfficiency(data) {
        const efficiencyMetrics = {
            bodyLabor: this.analyzeLaborEfficiency(data.laborOperations.body),
            refinishLabor: this.analyzeLaborEfficiency(data.laborOperations.refinish),
            structuralLabor: this.analyzeLaborEfficiency(data.laborOperations.structural)
        };

        return {
            ...efficiencyMetrics,
            overallScore: this.calculateOverallEfficiency(efficiencyMetrics),
            potentialSavings: this.calculatePotentialSavings(efficiencyMetrics, data)
        };
    }

    evaluateRepairDecisions(data) {
        return {
            repairVsReplace: this.analyzeRepairDecisions(data),
            blendVsFullRefinish: this.analyzeBlendDecisions(data),
            partSelection: this.analyzePartSelections(data)
        };
    }

    validateSectioningLocation(operation) {
        // Implementation of OEM sectioning location validation
        const oemLocations = this.getOEMSectioningLocations(operation.vehicle);
        const proposedLocation = operation.location;

        return {
            valid: oemLocations.includes(proposedLocation),
            reason: !oemLocations.includes(proposedLocation) ? 
                'Sectioning location not approved by OEM' : null,
            recommendation: !oemLocations.includes(proposedLocation) ?
                `Use approved sectioning location: ${oemLocations[0]}` : null
        };
    }

    buildOptimalRefinishSequence(operations) {
        // Implementation of optimal refinish sequence algorithm
        const panels = operations.map(op => ({
            code: op.panel_code,
            adjacent: this.getAdjacentPanels(op.panel_code),
            type: op.refinish_type
        }));

        return this.optimizeRefinishSequence(panels);
    }

    optimizeRefinishSequence(panels) {
        // Implement sequence optimization logic
        const sequence = [];
        const unprocessed = [...panels];
        
        while (unprocessed.length > 0) {
            const next = this.findOptimalNext(unprocessed, sequence);
            sequence.push(next);
            unprocessed.splice(unprocessed.indexOf(next), 1);
        }
        
        return sequence;
    }

    analyzeRepairDecisions(data) {
        const decisions = [];
        
        // Analyze repair vs replace decisions
        data.laborOperations.items
            .filter(op => op.type === 'repair')
            .forEach(repair => {
                const replaceCost = this.calculateReplaceCost(repair.panel, data.partsData);
                const repairCost = this.calculateRepairCost(repair);
                
                if (repairCost > replaceCost * 0.8) { // 80% threshold
                    decisions.push({
                        type: 'repair_vs_replace',
                        panel: repair.panel,
                        current: {
                            method: 'repair',
                            cost: repairCost
                        },
                        recommended: {
                            method: 'replace',
                            cost: replaceCost
                        },
                        impact: repairCost - replaceCost,
                        confidence: this.calculateDecisionConfidence(repair, replaceCost)
                    });
                }
            });
        
        return decisions;
    }

    analyzeBlendDecisions(data) {
        const blendAnalysis = [];
        
        // Check refinish operations for optimal blend decisions
        data.refinishOperations.forEach(refinish => {
            if (refinish.type === 'full' && this.shouldBeBlend(refinish, data)) {
                const fullRefinishCost = this.calculateRefinishCost(refinish);
                const blendCost = this.calculateBlendCost(refinish);
                
                blendAnalysis.push({
                    type: 'blend_recommendation',
                    panel: refinish.panel,
                    current: {
                        method: 'full_refinish',
                        cost: fullRefinishCost
                    },
                    recommended: {
                        method: 'blend',
                        cost: blendCost
                    },
                    impact: fullRefinishCost - blendCost,
                    reason: 'Adjacent panel damage minimal, blend recommended'
                });
            }
        });
        
        return blendAnalysis;
    }

    analyzePartSelections(data) {
        const partAnalysis = [];
        
        // Analyze each OEM part for alternative recommendations
        data.partsData.oem.forEach(part => {
            const alternatives = this.findQualifiedAlternatives(part);
            if (alternatives.length > 0) {
                const bestAlternative = this.selectBestAlternative(alternatives);
                
                partAnalysis.push({
                    type: 'part_selection',
                    part: part.description,
                    current: {
                        type: 'OEM',
                        cost: part.price
                    },
                    recommended: {
                        type: bestAlternative.type,
                        vendor: bestAlternative.vendor,
                        cost: bestAlternative.price,
                        certification: bestAlternative.certification
                    },
                    savings: part.price - bestAlternative.price,
                    confidence: this.calculatePartConfidence(bestAlternative)
                });
            }
        });
        
        return partAnalysis;
    }

    findQualifiedAlternatives(part) {
        // Filter alternatives based on GEICO ARX requirements
        return GEICO_ARX_RULES.PARTS_GUIDELINES.preferred_vendors
            .map(vendor => this.findVendorPart(part, vendor))
            .filter(alt => alt && this.meetsQualityStandards(alt));
    }

    meetsQualityStandards(part) {
        return (
            part.certification && 
            GEICO_ARX_RULES.PARTS_GUIDELINES.preferred_vendors.includes(part.certification) &&
            part.fitScore >= 0.85 && // 85% minimum fit score
            part.qualityRating >= 4.0 // 4.0+ quality rating required
        );
    }

    calculateDecisionConfidence(repair, replaceCost) {
        const factors = {
            damageExtent: repair.damageScore / 10,
            laborTime: this.getTimeConfidence(repair.hours),
            costRatio: this.getCostRatioConfidence(repair.totalCost, replaceCost)
        };
        
        return (
            factors.damageExtent * 0.4 +
            factors.laborTime * 0.3 +
            factors.costRatio * 0.3
        );
    }

    getTimeConfidence(hours) {
        // Lower confidence for very high repair times
        return hours <= 8 ? 1.0 :
               hours <= 12 ? 0.8 :
               hours <= 15 ? 0.6 :
               0.4;
    }

    getCostRatioConfidence(repairCost, replaceCost) {
        const ratio = repairCost / replaceCost;
        return ratio <= 0.6 ? 1.0 :
               ratio <= 0.8 ? 0.8 :
               ratio <= 1.0 ? 0.6 :
               0.4;
    }

    calculateTotalImpact(analysis) {
        const impacts = {
            structural: this.sumStructuralImpact(analysis.structuralOperations),
            refinish: this.sumRefinishImpact(analysis.refinishSequence),
            labor: analysis.laborEfficiency.potentialSavings,
            decisions: this.sumDecisionImpact(analysis.repairDecisions)
        };

        return {
            totalSavings: Object.values(impacts).reduce((a, b) => a + b, 0),
            breakdown: impacts
        };
    }

    generateDetailedRecommendations(analysis) {
        return {
            highPriority: this.getHighPriorityRecommendations(analysis),
            required: this.getRequiredChanges(analysis),
            optional: this.getOptionalOptimizations(analysis)
        };
    }

    getHighPriorityRecommendations(analysis) {
        const recommendations = [];

        // Check structural issues first
        analysis.structuralOperations.forEach(check => {
            if (check.severity === 'high') {
                recommendations.push({
                    type: 'structural',
                    priority: 1,
                    description: check.description,
                    action: check.recommendation,
                    impact: this.calculateStructuralImpact(check)
                });
            }
        });

        // Check repair vs replace decisions
        analysis.repairDecisions.repairVsReplace.forEach(decision => {
            if (decision.impact > 100) { // $100 threshold
                recommendations.push({
                    type: 'repair_decision',
                    priority: 2,
                    description: `Consider replacing ${decision.panel} instead of repair`,
                    impact: decision.impact,
                    confidence: decision.confidence
                });
            }
        });

        return recommendations.sort((a, b) => a.priority - b.priority);
    }

    getRequiredChanges(analysis) {
        const required = [];

        // GEICO ARX compliance requirements
        if (analysis.laborEfficiency.bodyLabor.rate > GEICO_ARX_RULES.LABOR_RATES.body) {
            required.push({
                type: 'labor_rate',
                description: 'Adjust body labor rate to program maximum',
                current: analysis.laborEfficiency.bodyLabor.rate,
                required: GEICO_ARX_RULES.LABOR_RATES.body
            });
        }

        // Parts compliance
        const partsDecisions = analysis.repairDecisions.partSelection;
        const aftermarketRatio = this.calculateAftermarketRatio(partsDecisions);
        if (aftermarketRatio < GEICO_ARX_RULES.PARTS_GUIDELINES.min_aftermarket_ratio) {
            required.push({
                type: 'parts_usage',
                description: 'Increase aftermarket parts usage to meet program minimum',
                current: aftermarketRatio,
                required: GEICO_ARX_RULES.PARTS_GUIDELINES.min_aftermarket_ratio
            });
        }

        return required;
    }

    getOptionalOptimizations(analysis) {
        return {
            refinish: this.getOptimalRefinishSequence(analysis.refinishSequence),
            blend: this.getBlendOpportunities(analysis.repairDecisions.blendVsFullRefinish),
            operations: this.getOperationOptimizations(analysis.laborEfficiency)
        };
    }

    calculateStructuralImpact(check) {
        // Calculate potential cost impact of structural issues
        const baseImpact = check.severity === 'high' ? 1000 : 500;
        const laborImpact = check.laborHours ? check.laborHours * 50 : 0;
        return baseImpact + laborImpact;
    }

    getOptimalRefinishSequence(sequence) {
        if (sequence.efficiency < 0.8) { // Less than 80% efficient
            return {
                type: 'refinish_sequence',
                description: 'Optimize refinish sequence for better efficiency',
                current: sequence.current,
                recommended: sequence.optimal,
                efficiency_gain: sequence.optimal.efficiency - sequence.current.efficiency,
                impact: this.calculateRefinishEfficiencyImpact(sequence)
            };
        }
        return null;
    }

    calculateRefinishEfficiencyImpact(sequence) {
        const currentTime = sequence.current.totalHours;
        const optimalTime = sequence.optimal.totalHours;
        const hoursSaved = currentTime - optimalTime;
        return hoursSaved * GEICO_ARX_RULES.REFINISH_RATES.paint;
    }

    getBlendOpportunities(blendDecisions) {
        return blendDecisions
            .filter(decision => decision.impact > 50) // $50 minimum impact
            .map(decision => ({
                panel: decision.panel,
                savings: decision.impact,
                confidence: this.calculateBlendConfidence(decision)
            }))
            .sort((a, b) => b.savings - a.savings);
    }

    calculateBlendConfidence(decision) {
        // Factors affecting blend confidence
        const factors = {
            panelLocation: this.getLocationFactor(decision.panel),
            damageProximity: this.getDamageProximityFactor(decision),
            colorComplexity: this.getColorComplexityFactor(decision)
        };

        return Object.values(factors).reduce((a, b) => a + b, 0) / 3;
    }

    getLocationFactor(panel) {
        const locationFactors = {
            'hood': 0.9,           // High visibility
            'front_bumper': 0.8,   // High visibility
            'fender': 0.85,        // High visibility
            'door_front': 0.8,
            'door_rear': 0.8,
            'quarter_panel': 0.9,  // Large panel, critical
            'deck_lid': 0.85,
            'rear_bumper': 0.75
        };

        return locationFactors[panel] || 0.8;
    }

    getDamageProximityFactor(decision) {
        // Calculate how close damage is to blend area
        const distanceToBlend = decision.damageDistance || 0;
        if (distanceToBlend < 6) return 0.6;  // Too close, lower confidence
        if (distanceToBlend < 12) return 0.8;  // Moderate distance
        return 1.0;  // Good distance for blend
    }

    getColorComplexityFactor(decision) {
        const colorType = decision.paint_info.type;
        const complexity = COLOR_COMPLEXITY_RULES.FACTORS[colorType] || 1.0;
        
        return 1 / complexity; // Inverse relationship - more complex = lower confidence
    }

    shouldBeBlend(refinish, data) {
        // Determine if panel should be blended based on multiple factors
        const colorInfo = data.paintInfo[refinish.panel];
        const damageExtent = this.calculateDamageExtent(refinish);
        
        // Check color type specific thresholds
        const threshold = COLOR_COMPLEXITY_RULES.BLEND_THRESHOLDS[colorInfo.type] || 
                         COLOR_COMPLEXITY_RULES.BLEND_THRESHOLDS.STANDARD;
        
        return (
            damageExtent < 0.3 && // Less than 30% panel damage
            this.hasAdjacentRefinish(refinish, data) &&
            this.meetsBlendRequirements(refinish, colorInfo, threshold)
        );
    }

    calculateDamageExtent(refinish) {
        // Calculate percentage of panel affected
        const panelArea = this.getPanelArea(refinish.panel);
        const damageArea = refinish.damage_points.reduce((sum, point) => 
            sum + point.area, 0
        );
        
        return damageArea / panelArea;
    }

    meetsBlendRequirements(refinish, colorInfo, threshold) {
        // Check specific requirements for blending
        return (
            colorInfo.variance < 0.05 && // Color variance within 5%
            this.hasProperLighting(refinish.booth_info) &&
            this.hasRequiredClearance(refinish) &&
            this.getColorMatchConfidence(colorInfo) >= threshold
        );
    }

    getColorMatchConfidence(colorInfo) {
        // Calculate confidence in color match
        const factors = {
            formulaMatch: colorInfo.formula_match_score,
            sprayOutMatch: colorInfo.spray_out_match_score,
            variantHistory: colorInfo.variant_success_rate
        };
        
        return (
            factors.formulaMatch * 0.4 +
            factors.sprayOutMatch * 0.4 +
            factors.variantHistory * 0.2
        );
    }

    calculateBlendCost(refinish) {
        const baseTime = GEICO_ARX_RULES.REFINISH_OVERLAP_RULES.blend_panel_time;
        const complexity = COLOR_COMPLEXITY_RULES.FACTORS[refinish.paint_info.type] || 1.0;
        
        return baseTime * complexity * refinish.paint_info.labor_rate;
    }

    calculateRefinishCost(refinish) {
        const panelTime = this.getPanelRefinishTime(refinish.panel);
        const complexity = COLOR_COMPLEXITY_RULES.FACTORS[refinish.paint_info.type] || 1.0;
        
        return panelTime * complexity * refinish.paint_info.labor_rate;
    }

    getPanelRefinishTime(panel) {
        // Standard refinish times by panel
        const standardTimes = {
            'hood': 4.0,
            'roof': 4.5,
            'deck_lid': 3.5,
            'fender': 3.0,
            'door': 3.0,
            'quarter_panel': 4.5,
            'bumper_cover': 3.0
        };
        
        return standardTimes[panel] || 3.0;
    }

    hasProperLighting(boothInfo) {
        return (
            boothInfo.color_temp >= 5000 && // Color temperature (Kelvin)
            boothInfo.lux >= 1000 &&        // Light intensity
            boothInfo.cri >= 90             // Color Rendering Index
        );
    }

    hasRequiredClearance(refinish) {
        // Check if there's enough space for proper blending
        return refinish.blend_area_clearance >= 12; // 12 inches minimum
    }

    async processCompleteWorkflow(estimateData) {
        try {
            // Initial analysis
            const analysis = await this.analyzeEstimate(estimateData);
            
            // Complex operations analysis
            const complexAnalysis = await this.analyzeComplexOperations(estimateData);
            
            // Combine analyses
            const completeAnalysis = {
                ...analysis,
                ...complexAnalysis,
                workflow: await this.determineWorkflowPath(analysis, complexAnalysis)
            };

            // Apply automatic corrections if applicable
            if (this.canAutoCorrect(completeAnalysis)) {
                completeAnalysis.corrections = await this.applyAutoCorrections(
                    estimateData,
                    completeAnalysis
                );
            }

            // Determine next steps
            completeAnalysis.nextSteps = this.determineNextSteps(completeAnalysis);

            return completeAnalysis;
        } catch (error) {
            console.error('Workflow Error:', error);
            throw new Error('Failed to process estimate workflow');
        }
    }

    determineWorkflowPath(analysis, complexAnalysis) {
        const workflowDecision = {
            canAutoApprove: this.checkAutoApprovalEligibility(analysis),
            requiresReview: this.checkReviewTriggers(analysis, complexAnalysis),
            autoCorrectionsAvailable: this.hasValidAutoCorrections(analysis),
            criticalIssues: this.findCriticalIssues(analysis, complexAnalysis)
        };

        return {
            ...workflowDecision,
            path: this.selectWorkflowPath(workflowDecision),
            requiredActions: this.getRequiredActions(workflowDecision)
        };
    }

    checkAutoApprovalEligibility(analysis) {
        const { AUTO_APPROVE } = GEICO_ARX_WORKFLOW.AUTOMATION_RULES;
        
        return (
            analysis.confidence >= GEICO_ARX_WORKFLOW.APPROVAL_THRESHOLDS.CONFIDENCE_MIN &&
            analysis.totalAmount <= AUTO_APPROVE.MAX_TOTAL &&
            analysis.operationCount <= AUTO_APPROVE.MAX_OPERATIONS &&
            analysis.complianceScore >= AUTO_APPROVE.REQUIRED_SCORE &&
            !this.hasBlockingIssues(analysis)
        );
    }

    checkReviewTriggers(analysis, complexAnalysis) {
        const triggers = [];
        const { REVIEW_TRIGGERS } = GEICO_ARX_WORKFLOW;

        // Check labor variance
        if (this.hasExcessiveLaborVariance(analysis, REVIEW_TRIGGERS.LABOR_VARIANCE)) {
            triggers.push({
                type: 'labor_variance',
                details: this.getLaborVarianceDetails(analysis)
            });
        }

        // Check parts markup
        if (this.hasExcessivePartsMarkup(analysis, REVIEW_TRIGGERS.PARTS_MARKUP)) {
            triggers.push({
                type: 'parts_markup',
                details: this.getPartsMarkupDetails(analysis)
            });
        }

        // Check operation count
        if (analysis.operationCount > REVIEW_TRIGGERS.OPERATION_COUNT) {
            triggers.push({
                type: 'operation_count',
                count: analysis.operationCount
            });
        }

        return triggers;
    }

    hasValidAutoCorrections(analysis) {
        return analysis.autoCorrections.some(correction => 
            correction.confidence >= GEICO_ARX_WORKFLOW.APPROVAL_THRESHOLDS.CONFIDENCE_MIN &&
            !correction.requiresManualReview
        );
    }

    findCriticalIssues(analysis, complexAnalysis) {
        const criticalIssues = [];

        // Check structural issues
        complexAnalysis.structuralOperations.forEach(op => {
            if (op.severity === 'high') {
                criticalIssues.push({
                    type: 'structural',
                    description: op.description,
                    impact: op.impact
                });
            }
        });

        // Check safety related operations
        analysis.operations
            .filter(op => op.safetyCritical)
            .forEach(op => {
                criticalIssues.push({
                    type: 'safety',
                    operation: op.description,
                    details: op.safetyNotes
                });
            });

        return criticalIssues;
    }

    selectWorkflowPath(decision) {
        if (decision.criticalIssues.length > 0) {
            return 'manual_review_required';
        }
        if (decision.canAutoApprove) {
            return 'auto_approve';
        }
        if (decision.autoCorrectionsAvailable) {
            return 'auto_correct_then_review';
        }
        return 'standard_review';
    }

    getRequiredActions(decision) {
        const actions = [];

        if (decision.criticalIssues.length > 0) {
            actions.push({
                type: 'review_critical',
                priority: 1,
                issues: decision.criticalIssues
            });
        }

        if (decision.autoCorrectionsAvailable) {
            actions.push({
                type: 'apply_corrections',
                priority: 2,
                corrections: this.getValidAutoCorrections()
            });
        }

        return actions.sort((a, b) => a.priority - b.priority);
    }
}

// Initialize AI Service
const aiService = new AIService(); 