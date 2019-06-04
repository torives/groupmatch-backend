import firebaseAdmin from "firebase-admin";
let serviceAccount = "./secrets/firebase-serviceaccount-key.json";
import userCreatedListener from "./UserCreatedListener";

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://groupmatch-f14e4.firebaseio.com"
});

let db = firebaseAdmin.firestore();
let usersCollection = db.collection("users");

usersCollection.onSnapshot(snapshot => {
    console.log(`Snapshot Timestamp ${snapshot.readTime.toMillis()}`)
    snapshot.docChanges().forEach(change => {
        console.log(`Document Timestamp ${change.doc.createTime.toMillis()}`)
        console.log(snapshot.readTime.toMillis() < change.doc.createTime.toMillis())
        if (change.type == "added" && change.doc.createTime.toMillis() > snapshot.readTime.toMillis()) {
            let userData = change.doc.data();
            console.log(user);
            userCreatedListener.onUserCreated(change.doc.id, userData.tokens);
        }
    });
});

export default db;
