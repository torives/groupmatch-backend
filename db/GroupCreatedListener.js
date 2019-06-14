import { pushService } from "../services/push-service";
import { getUsers } from "../actions/get_user"

class GroupCreatedListener {

    onGroupCreated(group) { 
        console.log(group);
        getUsers(group.members).then(users => {
            console.log(users);
        }).catch(error => {
            console.log(error);
        });
    }
}

export const groupCreatedListener = new GroupCreatedListener();