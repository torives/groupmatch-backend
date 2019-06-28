import { usersCollection } from "../firestore_db";


//TODO: Create model classes that wrap Firestore objects
class UserDAO {

    getUser(userId) {
        return new Promise(function (resolve, reject) {
            usersCollection.doc(userId).get()
                .then(user => {
                    if (user.exists) {
                        console.log(`[UserDAO]: successfully retrieved user with id ${userId}.`);
                        resolve(user);
                    } else {
                        console.log(`[UserDAO]: failed to retrieve user with id ${userId}. User does not exist.`);
                        reject({
                            code: 422,
                            message: `User with id ${userId} does not exist.`
                        });
                    }
                }).catch(error => {
                    console.log(`[UserDAO]: failed to retrieve user with id ${userId}. User does not exist.`, error);
                    reject({
                        code: 500,
                        message: `Failed to retrieve user with id ${userId} from database.`
                    });
                });
        });
    }

    getUsers(userIds) {
        return new Promise(function (resolve, reject) {
            usersCollection.get()
                .then(snapshot => {
                    const userDocs = snapshot.docs.filter(user => {
                        return userIds.includes(user.id)
                    })
                    console.log(`[UserDAO]: successfully retrieved specified users.`);
                    resolve(userDocs)
                }).catch(error => {
                    console.log(`[UserDAO]: failed to retrieve specified users.`, error);
                    reject({
                        code: 500,
                        message: `Failed to retrieve specified users from database.`
                    });
                });
        });
    }

    createUser(user) {
        return new Promise(function (resolve, reject) {
            usersCollection.doc(user.uid).set(user)
                .then(result => {
                    console.log(`[UserDAO]: successfully created user.`);
                    resolve(true);
                }).catch(error => {
                    console.log(`[UserDAO]: failed to create user.`, error);
                    reject({
                        code: 500,
                        message: `Failed to write user with id ${userId} to the database.`
                    })
                });
        });
    }

    updateUser(userId, userData) {
        var self = this;
        return new Promise(async function (resolve, reject) {
            try {
                const user = await self.getUser(userId);
                const result = await user.ref.set(userData, { merge: true })

                console.log(`[UserDAO]: successfully updated user with id ${userId}.`);
                return resolve({
                    code: 200,
                    message: `Updated user with id ${userId}`
                });

            } catch (error) {
                console.log(`[UserDAO]: failed to update user with id ${userId}`, error);
                return reject({
                    code: 500,
                    message: `Failed to update user with id ${userId}`
                });
            }
        });
    }
}

export const userDAO = new UserDAO();