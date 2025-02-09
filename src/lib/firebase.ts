import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
  });
}

export const storage = getStorage();

export async function uploadToFirebase(file: Buffer, path: string): Promise<string> {
  const bucket = storage.bucket();
  const blob = bucket.file(path);
  
  await blob.save(file, {
    contentType: 'application/pdf',
    metadata: {
      firebaseStorageDownloadTokens: Date.now().toString(),
    },
  });

  return blob.publicUrl();
} 