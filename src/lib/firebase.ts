import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { config } from '../config';

const firebaseConfig = {
  projectId: config.firebase.projectId,
  storageBucket: config.firebase.storageBucket,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function uploadToFirebase(file: File): Promise<string> {
  const storageRef = ref(storage, `estimates/${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
} 