import { sendMulticast } from "../services/push_service";
import { userDAO } from "../db/dao/UserDAO"


class GroupCreatedListener {

    onGroupCreated(group) {
        console.log(group);
        userDAO.getUsers(group.members).then(userDocs => {
            const deviceTokens = userDocs
                .filter(userDoc => { return userDoc.id != group.admins[0] })
                .map(userDoc => { return userDoc.data().tokens.device });
            console.log(deviceTokens);

            const title = `${group.name}`;
            const body = `Você foi adicionado ao grupo por ${group.admins[0]}`
            sendMulticast(title, body, deviceTokens)
        }).catch(error => {
            console.log(error);
        });
    }
}

export const groupCreatedListener = new GroupCreatedListener();