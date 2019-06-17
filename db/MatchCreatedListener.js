import { getUsers } from "../actions/get_user";
import { getCalendar } from "../actions/get_calendar"

class MatchCreatedListener {

    async onMatchCreated(match) {
        const userIds = match.participants.map(participant => { participant.id })
        console.log(userIds);
        try {
            const users = await getUsers(userIds);
            const userCalendar = await getCalendar(users[0]);
            console.log(userCalendar);
        } catch (error) {
            console.log(error);
        }
    }

    onMatchUpdated(match) { }
}

export const matchCreatedListener = new MatchCreatedListener();