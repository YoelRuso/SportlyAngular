import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../environments/environment';

const firebaseApp = getApps().length ? getApp() : initializeApp(environment.firebase);
const firestoreDb = getFirestore(firebaseApp);

export { firebaseApp, firestoreDb };