import { userDAO } from "./dao/UserDAO";
import { matchDAO } from "../db/dao/MatchDAO";
import { sendMulticast } from "../services/push_service";
import { matchesCollection, isSnapshotOutdated } from "../db/firestore_db";
import { Match } from "../actions/Match";


class MatchListener {

    async onMatchCreated(matchDoc) {
        const match = matchDoc.data();
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
        const matchData = matchDoc.data();
        if (matchData.status == "FINISHED" && matchData.result == null) {
            try {
                const result = await Match.calculateResult(matchData);
                matchData.result = result;
                await matchDAO.updateMatch(matchDoc.id, matchData);

                const userIds = matchData.participants.map(participant => participant.id);
                const deviceTokens = await getDeviceTokens(userIds);

                sendMulticast(
                    `${matchData.group.name}: Fim do Match!`,
                    `Deseja ver o resultado?`,
                    deviceTokens
                )
            } catch (error) {
                console.log(`[MatchListener] Failed to calculate match with id: ${matchDoc.id}`, error);
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
        const match = change.doc;
        if (isSnapshotOutdated(snapshot, change.doc)) {
            if (change.type == "added") {
                matchListener.onMatchCreated(match);
            } else if (change.type == "modified") {
                matchListener.onMatchUpdated(match);
            }
        }
    });
});

export const matchListener = new MatchListener();