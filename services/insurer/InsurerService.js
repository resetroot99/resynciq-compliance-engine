import axios from 'axios';
import config from '../../config';

class InsurerService {
  constructor() {
    this.rulesPath = config.insurerRulesPath;
  }

  async getRules(insurerId) {
    const response = await axios.get(`${this.rulesPath}/${insurerId}.json`);
    return response.data;
  }

  async validateRules(insurerId) {
    const rules = await this.getRules(insurerId);
    return this.checkRuleIntegrity(rules);
  }

  checkRuleIntegrity(rules) {
    // Implement rule validation logic
    return { valid: true, errors: [] };
  }
}

export const insurerService = new InsurerService(); 