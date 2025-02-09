// DRP Rules Management
class DRPRulesManager {
    constructor() {
        this.currentProgram = null;
        this.rules = new Map();
        this.initializeListeners();
    }

    initializeListeners() {
        // Insurance program selection
        document.getElementById('insuranceSelect').addEventListener('change', (e) => {
            this.loadProgramRules(e.target.value);
        });

        // Save button
        document.querySelector('.btn-primary').addEventListener('click', () => {
            this.saveCurrentRules();
        });
    }

    async loadProgramRules(programName) {
        try {
            // In real app, this would be an API call
            const rules = await this.fetchProgramRules(programName);
            this.currentProgram = programName;
            this.displayRules(rules);
        } catch (error) {
            console.error('Error loading rules:', error);
        }
    }

    displayRules(rules) {
        // Update labor rates
        document.querySelector('[data-rule="bodyLabor"]').value = rules.laborRates.body;
        document.querySelector('[data-rule="paintLabor"]').value = rules.laborRates.paint;
        document.querySelector('[data-rule="frameLabor"]').value = rules.laborRates.frame;

        // Update parts guidelines
        document.querySelector('[data-rule="oemMarkup"]').value = rules.partsMarkup.oem;
        document.querySelector('[data-rule="aftermarketMarkup"]').value = rules.partsMarkup.aftermarket;

        // Store current rules
        this.rules.set(this.currentProgram, rules);
    }

    async saveCurrentRules() {
        if (!this.currentProgram) return;

        const rules = {
            laborRates: {
                body: parseFloat(document.querySelector('[data-rule="bodyLabor"]').value),
                paint: parseFloat(document.querySelector('[data-rule="paintLabor"]').value),
                frame: parseFloat(document.querySelector('[data-rule="frameLabor"]').value)
            },
            partsMarkup: {
                oem: parseInt(document.querySelector('[data-rule="oemMarkup"]').value),
                aftermarket: parseInt(document.querySelector('[data-rule="aftermarketMarkup"]').value)
            }
        };

        try {
            await this.saveProgramRules(this.currentProgram, rules);
            this.showSuccess('Rules saved successfully');
        } catch (error) {
            this.showError('Error saving rules');
        }
    }

    // Mock API calls
    async fetchProgramRules(programName) {
        // This would be an actual API call in production
        const mockRules = {
            'GEICO ARX': {
                laborRates: { body: 52, paint: 52, frame: 65 },
                partsMarkup: { oem: 25, aftermarket: 33 }
            },
            'State Farm Select Service': {
                laborRates: { body: 54, paint: 54, frame: 68 },
                partsMarkup: { oem: 30, aftermarket: 35 }
            }
        };

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockRules[programName] || mockRules['GEICO ARX']);
            }, 300);
        });
    }

    async saveProgramRules(program, rules) {
        // This would be an actual API call in production
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Saved rules for', program, rules);
                resolve(true);
            }, 500);
        });
    }

    showSuccess(message) {
        // Implementation of success notification
    }

    showError(message) {
        // Implementation of error notification
    }
}

// Initialize the rules manager
const rulesManager = new DRPRulesManager(); 