import { userDAO } from "./dao/UserDAO";
import { calendarDAO } from "../db/dao/CalendarDAO"
import { sendMulticast } from "../services/push_service"

class MatchListener {

    async onMatchCreated(match) {
        const userIds = match.participants
            .filter(participant => participant.id != match.creator.id)
            .map(participant => participant.id);
        try {
            const users = await userDAO.getUsers(userIds);
            const deviceTokens = users.map(user => user.tokens.device);

            sendMulticast(
                `${match.group.name}: Novo Match!`,
                `Deseja participar?`,
                deviceTokens
            )
        } catch (error) {
            console.log(`[MatchListener] onMatchCreated failure`, error);
        }
    }

    onMatchUpdated(match) {
        // const userCalendar = await calendarDAO.getCurrentWeekEvents(users[0].data());
        // console.log(userCalendar);
    }
}

export const matchListener = new MatchListener();