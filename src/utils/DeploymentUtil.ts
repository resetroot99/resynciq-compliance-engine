import { deploymentService } from '../services/deployment/DeploymentService';

export class DeploymentUtil {
  static async deploy(environment: 'staging' | 'production') {
    return deploymentService.deploy(environment);
  }
} 