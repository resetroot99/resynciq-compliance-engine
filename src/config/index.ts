export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  },
  auth0: {
    domain: process.env.AUTH0_ISSUER_BASE_URL || '',
    clientId: process.env.AUTH0_CLIENT_ID || '',
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
  },
  aiModel: {
    endpoint: process.env.NEXT_PUBLIC_AI_MODEL_ENDPOINT,
    version: process.env.NEXT_PUBLIC_AI_MODEL_VERSION,
  },
}; 