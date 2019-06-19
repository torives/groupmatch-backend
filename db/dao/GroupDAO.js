import { db } from "../firestore_db";

const groupsCollection = db.collection("groups");


class GroupDAO {

    getGroup(groupId) {
        return new Promise(function (resolve, reject) {
            groupsCollection.doc(groupId).get().then(group => {
                if (group.exists) {
                    console.log(`[GroupDAO]: successfully created group with id ${group.id}`);
                    resolve(group);
                } else {
                    console.log(`[GroupDAO]: failed to retrieve group with id ${group.id}. Group does not exist.`);
                    reject({
                        code: 422,
                        message: `Group with id ${groupId} does not exist.`
                    });
                }
            }).catch(error => {
                console.log(`[GroupDAO]: failed to retrieve group with id ${group.id}`, error);
                reject({
                    code: 500,
                    message: `Failed to retrieve group with id ${groupId} from database.`
                });
            });
        });
    }

    updateGroup(groupId, groupData) {
        return new Promise(function (resolve, reject) {
            groupsCollection.doc(groupId).set(groupData, { merge: true }).then(result => {
                console.log(`[GroupDAO]: successfully updated group with id ${groupId}`);
                resolve(true);
            }).catch(error => {
                console.log(`GroupDAO: failed to update group with id ${groupId}`, error);
                reject({
                    code: 500,
                    message: `Failed to update group with id ${groupId} to the database.`
                })
            });
        });
    }
}

export const groupDAO = new GroupDAO();