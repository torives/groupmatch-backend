import db from "../db/firestore-db";
import GetUser from "../actions/GetUser";
const getUser = new GetUser();
module.exports = class UpdateUser {
    
    update(userId, userData) {  
        return new Promise(function (resolve, reject) {
        
            getUser.get(userId).then(user => {
                let updateUser = user.set(userData, { merge: true });
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