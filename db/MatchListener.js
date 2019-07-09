import { userDAO } from "./dao/UserDAO";
import { matchDAO } from "../db/dao/MatchDAO";
import { sendMulticast } from "../services/push_service";
import { matchesCollection, isSnapshotOutdated } from "../db/firestore_db";
import { Match } from "../actions/Match";


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

    async onMatchUpdated(match) {
        if (match.status == "FINISHED") {
            try {
                const result = await Match.calculateResult(match);
                matchData.result = result;
                await matchDAO.updateMatch(match.id, match);

                const userIds = match.participants.map(participant => participant.id);
                const deviceTokens = await getDeviceTokens(userIds);

                sendMulticast(
                    `${match.group.name}: Fim do Match!`,
                    `Deseja ver o resultado?`,
                    deviceTokens
                )
            } catch (error) {
                console.log(`[MatchListener] Failed to calculate match with id: ${match.id}`, error);
            }
        }
    }
}

async function getDeviceTokens(userIds) {
    const users = await userDAO.getUsers(userIds);
    return users.map(user => user.data().tokens.device);
}

matchesCollection.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        const matchData = change.doc.data();
        if (isSnapshotOutdated(snapshot, change.doc)) {
            console.log(matchData);
            if (change.type == "added") {
                matchListener.onMatchCreated(matchData);
            } else if (change.type == "modified") {
                matchListener.onMatchUpdated(matchData);
            }
        }
    });
});

export const matchListener = new MatchListener();