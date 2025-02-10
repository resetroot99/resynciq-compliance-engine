const { execSync } = require('child_process');
const { modelService } = require('../app/services/ai/ModelService');
const { insurerService } = require('../app/services/insurer/InsurerService');
const crypto = require('crypto');
const fetch = require('node-fetch');
const fs = require('fs');
const { deploymentService } = require('../src/services/deployment/DeploymentService');
const { loggingService } = require('../src/services/logging/LoggingService');

async function deploy() {
  try {
    loggingService.log({ level: 'INFO', message: 'Starting deployment...' });

    const environment = process.env.NODE_ENV || 'production';
    await deploymentService.deploy(environment);

    loggingService.log({ level: 'INFO', message: 'Deployment completed successfully' });
  } catch (error) {
    loggingService.log({
      level: 'ERROR',
      message: 'Deployment failed',
      context: { error: error.message }
    });
    process.exit(1);
  }
}

// Run deployment
deploy(); 