import firebaseAdmin from "firebase-admin";
import { userCreatedListener } from "./UserCreatedListener";
import { groupCreatedListener } from "./GroupCreatedListener";
const serviceAccount = "./secrets/firebase-serviceaccount-key.json";


firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://groupmatch-f14e4.firebaseio.com"
});

const firestore = firebaseAdmin.firestore();

const usersCollection = firestore.collection("users");
usersCollection.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if (change.type == "added" && change.doc.createTime.toMillis() >= snapshot.readTime.toMillis()) {
            const userData = change.doc.data();
            console.log(userData);
            userCreatedListener.onUserCreated(change.doc.id, userData.tokens);
        }
    });
});

const groupsCollection = firestore.collection("groups");
groupsCollection.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if (change.type == "added" && change.doc.createTime.toMillis() >= snapshot.readTime.toMillis()) {
            const groupData = change.doc.data();
            console.log(groupData);
            groupCreatedListener.onGroupCreated(groupData);
        }
    });
});

export const db = firestore;
