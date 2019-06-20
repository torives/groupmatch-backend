import { userDAO } from "./dao/UserDAO";
import { calendarDAO } from "../db/dao/CalendarDAO"

class MatchListener {

    async onMatchCreated(match) {
        const userIds = match.participants.map(participant => participant.id);
        console.log(userIds);
        try {
            const users = await userDAO.getUsers(userIds);
            const userCalendar = await calendarDAO.getCalendar(users[0].data());
            console.log(userCalendar);
        } catch (error) {
            console.log(error);
        }
    }

    onMatchUpdated(match) { }
}

export const matchListener = new MatchListener();