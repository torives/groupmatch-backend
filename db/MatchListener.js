import { userDAO } from "./dao/UserDAO";
import { getCalendar } from "../actions/get_calendar"

class MatchListener {

    async onMatchCreated(match) {
        const userIds = match.participants.map(participant => { participant.id })
        console.log(userIds);
        try {
            const users = await userDAO.getUsers(userIds);
            const userCalendar = await getCalendar(users[0]);
            console.log(userCalendar);
        } catch (error) {
            console.log(error);
        }
    }

    onMatchUpdated(match) { }
}

export const matchCreatedListener = new MatchListener();