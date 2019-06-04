import { db } from "../db/firestore-db";


export function createUser(user) {
    return new Promise(function (resolve, reject) {

        let usersCollection = db.collection("users");
        let createUser = usersCollection.doc(user.uid).set(user);
        createUser.then(result => {
            resolve(true);
        }).catch(error => {
            console.log("Failed to create user.");
            console.log(error);

            reject({
                code: 500,
                message: `Failed to write user with id ${userId} to the database.`
            })
        });

    });
}
