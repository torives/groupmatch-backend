import { db } from "../db/firestore_db";

const groupsCollection = db.collection("groups");

export function getGroup(groupId) {
    return new Promise(function (resolve, reject) {

        const getGroup = groupsCollection.doc(groupId).get();
        getGroup.then(group => {
            if (group.exists) {
                console.log("GetGroup success");
                resolve(group);
            } else {
                console.log("GetGroup failed");
                reject({
                    code: 417,
                    message: `Group with id ${groupId} does not exist.`
                });
            }
        }).catch(error => {
            console.log(error);
            reject({
                code: 500,
                message: `Failed to retrieve group with id ${groupId} from database.`
            });
        });
    });
}