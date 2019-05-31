import db from "../db/firestore-db";

module.exports = class GetUser {
    
    get(userId) {
        return new Promise(function (resolve, reject) {
            
            let usersCollection = db.collection("users");
            let getUser = usersCollection.doc(userId).get();
            getUser.then(user => {
                console.log(user);
                if (user.exists) {
                    resolve(user.ref);
                } else {
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
}