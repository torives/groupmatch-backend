import { firebaseAdmin } from "../services/firebase_service";


const firestore = firebaseAdmin.firestore();

export const usersCollection = firestore.collection("users");
export const groupsCollection = firestore.collection("groups");
export const matchesCollection = firestore.collection("matches");

export function isSnapshotOutdated(snapshot, doc) {
    return doc.createTime.toMillis() >= snapshot.readTime.toMillis() ||
        doc.updateTime.toMillis() >= snapshot.readTime.toMillis()
}

export const db = firestore;
