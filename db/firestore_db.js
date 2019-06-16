import { firebaseAdmin } from "../services/firebase_service";
import { userCreatedListener } from "./UserCreatedListener";
import { groupCreatedListener } from "./GroupCreatedListener";
import { matchCreatedListener } from "./MatchCreatedListener";

const firestore = firebaseAdmin.firestore();

//TODO: extract observation logic to a function

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

const matchesCollection = firestore.collection("matches");
matchesCollection.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if (change.type == "added" && change.doc.createTime.toMillis() >= snapshot.readTime.toMillis()) {
            const matchData = change.doc.data();
            console.log(matchData);
            matchCreatedListener.onMatchCreated(matchData);
        }
    });
});

export const db = firestore;
