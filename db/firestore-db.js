import firebaseAdmin from "firebase-admin";
import { userCreatedListener } from "./UserCreatedListener";
const serviceAccount = "./secrets/firebase-serviceaccount-key.json";


firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://groupmatch-f14e4.firebaseio.com"
});

export const db = firebaseAdmin.firestore();
const usersCollection = db.collection("users");

usersCollection.onSnapshot(snapshot => {
    console.log(`Snapshot Timestamp ${snapshot.readTime.toMillis()}`)
    
    snapshot.docChanges().forEach(change => {
        console.log(`Document Timestamp ${change.doc.createTime.toMillis()}`)
        console.log(snapshot.readTime.toMillis() < change.doc.createTime.toMillis())
     
        if (change.type == "added" && change.doc.createTime.toMillis() >= snapshot.readTime.toMillis()) {
            const userData = change.doc.data();
            console.log(userData);
            userCreatedListener.onUserCreated(change.doc.id, userData.tokens);
        }
    });
});
