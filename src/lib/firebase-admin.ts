import fs from 'node:fs';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth, type Auth, type DecodedIdToken } from 'firebase-admin/auth';

interface FirebaseAppletConfig {
  projectId?: string;
}

let adminAuthInstance: Auth | null = null;
let initErrorMessage: string | null = null;

function initializeFirebaseAdmin(): void {
  try {
    const configUrl = new URL('../../firebase-applet-config.json', import.meta.url);
    const raw = fs.readFileSync(configUrl, 'utf8');
    const firebaseConfig = JSON.parse(raw) as FirebaseAppletConfig;
    const projectId = firebaseConfig.projectId?.trim();

    if (!projectId || projectId === 'remixed-project-id') {
      initErrorMessage = 'Firebase Admin projectId is not configured.';
      return;
    }

    if (!getApps().length) {
      initializeApp({ projectId });
    }
    adminAuthInstance = getAuth();
  } catch {
    initErrorMessage = 'Firebase Admin configuration could not be loaded.';
    adminAuthInstance = null;
  }
}

initializeFirebaseAdmin();

export function isFirebaseAdminConfigured(): boolean {
  return adminAuthInstance !== null;
}

export function getFirebaseAdminInitError(): string | null {
  return initErrorMessage;
}

export async function verifyFirebaseIdToken(token: string): Promise<DecodedIdToken> {
  if (!adminAuthInstance) {
    throw new Error(initErrorMessage ?? 'Firebase Admin authentication service is unavailable.');
  }
  return adminAuthInstance.verifyIdToken(token);
}

export const adminAuth = adminAuthInstance;
