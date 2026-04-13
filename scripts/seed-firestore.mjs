import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import process from 'node:process';
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const DB_JSON_PATH = resolve(process.cwd(), 'db.json');
const BATCH_LIMIT = 450;

async function resolveCredential() {
  const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!keyPath) {
    return applicationDefault();
  }

  const raw = await readFile(resolve(process.cwd(), keyPath), 'utf8');
  return cert(JSON.parse(raw));
}

async function initAdmin() {
  const credential = await resolveCredential();
  return getApps().length ? getApps()[0] : initializeApp({ credential });
}

async function readSeedData() {
  const raw = await readFile(DB_JSON_PATH, 'utf8');
  return JSON.parse(raw);
}

function collectionEntries(seedData) {
  return Object.entries(seedData).filter(([collectionName, docs]) => {
    return Array.isArray(docs) && !collectionName.startsWith('$');
  });
}

async function importCollection(db, collectionName, docs) {
  let imported = 0;

  for (let i = 0; i < docs.length; i += BATCH_LIMIT) {
    const chunk = docs.slice(i, i + BATCH_LIMIT);
    const batch = db.batch();

    chunk.forEach((doc, index) => {
      const safeDoc = typeof doc === 'object' && doc !== null ? doc : {};
      const sourceId = safeDoc.id;
      const fallbackId = `${i + index}`;
      const docId = String(sourceId ?? fallbackId);
      const docRef = db.collection(collectionName).doc(docId);
      batch.set(docRef, safeDoc, { merge: true });
    });

    await batch.commit();
    imported += chunk.length;
  }

  return imported;
}

async function main() {
  try {
    await initAdmin();
    const db = getFirestore();
    const seedData = await readSeedData();
    const entries = collectionEntries(seedData);

    if (entries.length === 0) {
      console.log('No array collections found in db.json');
      return;
    }

    let totalImported = 0;

    for (const [collectionName, docs] of entries) {
      const imported = await importCollection(db, collectionName, docs);
      totalImported += imported;
      console.log(`Imported ${imported} docs into '${collectionName}'`);
    }

    console.log(`Firestore seed finished. Total docs: ${totalImported}`);
  } catch (error) {
    console.error('Firestore seed failed:', error);
    process.exitCode = 1;
  }
}

main();
