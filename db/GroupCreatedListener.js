import { pushService } from "../services/push-service";

class GroupCreatedListener {

    onGroupCreated(group) { 
        console.log("TO OUVINDO OS GRUPO, MAMAE!!!")
    }
}

export const groupCreatedListener = new GroupCreatedListener();