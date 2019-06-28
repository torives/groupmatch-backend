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
            const deviceTokens = users.map(user => user.data().tokens.device);
            const payload = { groupId: match.group.id }

            sendMulticast(
                `${match.group.name}: Novo Match!`,
                `Deseja participar?`,
                deviceTokens,
                payload
            )
        } catch (error) {
            console.log(`[MatchListener] onMatchCreated failure \n`, error);
        }
    }

    async onMatchUpdated(matchDoc) {
        const match = matchDoc.data();
        if (match.status == "FINISHED") {
            try {
                const result = await Match.calculateResult(match);
                matchData.result = result;
                await matchDAO.updateMatch(matchDoc.id, match);

                //TODO: send push
            } catch (error) {
                console.log(`[MatchListener] Failed to calculate match with id: ${matchDoc.id}`, error);
            }
        }
    }
}

export const matchListener = new MatchListener();