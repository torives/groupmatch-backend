import db from "../db/firestore-db";


export function updateGroup(group) {
    return new Promise(function (resolve, reject) {
        const groupCollection = db.collection("group");
        groupCollection.doc(group.id).set(group, { merge: true }).then(result => {
            console.log(resolve);
            resolve(true);
        }).catch(error => {
            console.log(error);
            reject({
                code: 500,
                message: `Failed to update group with id ${group.id} to the database.`
            })
        });
    });
}