import { db } from "../db/firestore-db";


export function getUser(userId) {
    return new Promise(function (resolve, reject) {

        const usersCollection = db.collection("users");
        const getUser = usersCollection.doc(userId).get();
        getUser.then(user => {
            if (user.exists) {
                console.log("GetUser success");
                resolve(user);
            } else {
                console.log("GetUser failed");
                reject({
                    code: 417,
                    message: `User with id ${userId} does not exist.`
                });
            }
        }).catch(error => {
            console.log(error);
            reject({
                code: 500,
                message: `Failed to retrieve user with id ${userId} from database.`
            });
        });
    });
}
