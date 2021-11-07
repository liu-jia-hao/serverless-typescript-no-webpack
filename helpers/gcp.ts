import * as admin from 'firebase-admin';

export const firebaseAdmin = (): admin.app.App => {
  if (admin.apps.length) {
    // @ts-ignore
    return admin;
  }
  if (!process.env.FIREBASE_CREDENTIALS) throw Error('no FIREBASE_CREDENTIALS');
  const secretText = Buffer.from(
    process.env.FIREBASE_CREDENTIALS,
    'base64',
  ).toString('utf-8');
  const secrets = JSON.parse(secretText);
  admin.initializeApp({
    credential: admin.credential.cert(secrets),
  });
  // @ts-ignore
  return admin;
};

export const firestore = (): admin.firestore.Firestore => {
  return firebaseAdmin().firestore();
};
