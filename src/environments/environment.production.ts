import type { FirebaseOptions } from 'firebase/app';

const firebaseConfig = (window as Window & { __firebaseConfig?: FirebaseOptions }).__firebaseConfig;

if (!firebaseConfig?.apiKey || firebaseConfig.apiKey.startsWith('REPLACE_WITH_')) {
  throw new Error(
    'Missing Firebase config. Create public/firebase-config.js from public/firebase-config.template.js.'
  );
}

export const environment = {
  production: true,
  firebase: firebaseConfig,
};
