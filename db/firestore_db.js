import { firebaseAdmin } from "../services/firebase_service";
import { userCreatedListener } from "./UserCreatedListener";
import { groupCreatedListener } from "./GroupCreatedListener";
import { matchCreatedListener } from "./MatchCreatedListener";

const firestore = firebaseAdmin.firestore();

//TODO: extract observation logic to a function

const usersCollection = firestore.collection("users");
usersCollection.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if (change.type == "added" && isSnapshotOutdated(snapshot, change.doc)) {
            const userData = change.doc.data();
            console.log(userData);
            userCreatedListener.onUserCreated(change.doc.id, userData.tokens);
        }
    });
});

const groupsCollection = firestore.collection("groups");
groupsCollection.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if (change.type == "added" && isSnapshotOutdated(snapshot, change.doc)) {
            const groupData = change.doc.data();
            console.log(groupData);
            groupCreatedListener.onGroupCreated(groupData);
        }
    });
});

const matchesCollection = firestore.collection("matches");
matchesCollection.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        const matchData = change.doc.data();
        if (isSnapshotOutdated(snapshot, change.doc)) {
            console.log(matchData);
            if (change.type == "added") {
                matchCreatedListener.onMatchCreated(matchData);
            } else if (change.type == "modified") {
                matchCreatedListener.onMatchUpdated(matchData);
            }
        }
    });
});

function isSnapshotOutdated(snapshot, doc) {
    return doc.createTime.toMillis() >= snapshot.readTime.toMillis() ||
        doc.updateTime.toMillis() >= snapshot.readTime.toMillis()
}

export const db = firestore;
