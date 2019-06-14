import { pushService } from "../services/push-service";
import { getUsers } from "../actions/get_user"

class GroupCreatedListener {

    onGroupCreated(group) { 
        console.log("TO OUVINDO OS GRUPO, MAMAE!!!")
    }
}

export const groupCreatedListener = new GroupCreatedListener();