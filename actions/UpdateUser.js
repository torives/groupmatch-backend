import db from "../db/firestore-db";

module.exports = class UpdateUser {
    update(userId, userData) {
        return new Promise(function (resolve, reject) {
            let usersCollection = db.collection("users");
            let getUser = usersCollection.doc(userId).get();
            
            getUser.then(user => {
                if (!user.exists) {
                    console.log(`Failed to update user. There's no user with id ${userId}`);

                    reject({
                        code: 400,
                        message: `User with id ${userId} does not exist`
                    });
                } else {
                    let updateUser = user.ref.set(userData, { merge: true });
                    updateUser.then(result => {
                        console.log(`Updated user with id ${userId}`);

                        return resolve({
                            code: 200,
                            message: `Updated user with id ${userId}`
                        });
                    }).catch(error => {
                        console.log(`Failed to update user with id ${userId}`, error);

                        return reject({
                            code: 500,
                            message: `Failed to update user with id ${userId}`
                        });
                    })
                }
            }).catch(error => {
                console.log(`Failed to update user with id ${userId}`, error);

                return reject({
                    code: 500,
                    message: `Failed to update user with id ${userId}`
                });
            });
        });
    }
}