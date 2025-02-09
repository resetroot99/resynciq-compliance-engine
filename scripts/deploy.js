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

deploy(); 