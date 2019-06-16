import admin from "firebase-admin";
const serviceAccount = "./secrets/firebase-serviceaccount-key.json";

//Set up Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://groupmatch-f14e4.firebaseio.com"
});

export const firebaseAdmin = admin;