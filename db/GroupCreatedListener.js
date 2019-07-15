import { sendMulticast } from "../services/push_service";
import { userDAO } from "../db/dao/UserDAO"
import { groupsCollection, isSnapshotOutdated } from "../db/firestore_db";


class GroupCreatedListener {

    onGroupCreated(group) {
        userDAO.getUsers(group.members).then(userDocs => {
            const deviceTokens = userDocs
                .filter(userDoc => { return userDoc.id != group.admins[0] })
                .map(userDoc => { return userDoc.data().tokens.device });
            const title = `${group.name}`;
            const admin = userDocs.find((userDoc) => { return userDoc.id == group.admins[0] });
            const body = `Você foi adicionado ao grupo por ${admin.data().name}`
            sendMulticast(title, body, deviceTokens)
        }).catch(error => {
            console.log(error);
        });
    }
}

groupsCollection.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if (change.type == "added" && isSnapshotOutdated(snapshot, change.doc)) {
            const groupData = change.doc.data();
            groupCreatedListener.onGroupCreated(groupData);
        }
    });
});

export const groupCreatedListener = new GroupCreatedListener();