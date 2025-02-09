export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  auth0: {
    domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '',
    clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '',
    audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || '',
  },
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  },
  aiModel: {
    endpoint: process.env.NEXT_PUBLIC_AI_MODEL_ENDPOINT,
    version: process.env.NEXT_PUBLIC_AI_MODEL_VERSION,
  },
}; 