import { getStorage } from "firebase/storage";
const firebase_app = useFirebaseApp();
export const storage = getStorage(
  firebase_app,
  `gs://${process.env.storageBucket}`
);