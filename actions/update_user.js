import { getUser } from "./get_user";


export function updateUser(userId, userData) {
    return new Promise(function (resolve, reject) {

        getUser(userId).then(user => {
            const updateUser = user.ref.set(userData, { merge: true });
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
