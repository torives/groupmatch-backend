import { matchesCollection } from "../firestore_db"
import { matchFactory } from "../../models/MatchFactory"


//TODO: Create model classes that wrap Firestore objects
class MatchDAO {

    createMatch(matchData) {
        return new Promise(function (resolve, reject) {
            const match = matchFactory.create(matchData.group, matchData.participants, matchData.creator)
            matchesCollection.add(match)
                .then(result => {
                    console.log(`[MatchDAO]: successfully created match with id: ${result.id}`);
                    resolve(result.id);
                }).catch(error => {
                    console.log(`[MatchDAO]: failed to create match.`, error);
                    reject({
                        code: 500,
                        message: `Failed to insert match into the database.`
                    })
                })
        });
    }

    getMatch(matchId) {
        return new Promise(function (resolve, reject) {
            matchesCollection.doc(matchId).get().then(match => {
                if (match.exists) {
                    console.log(`[MatchDAO]: successfully retrieved match with id ${matchId}`);
                    resolve(match);
                } else {
                    console.log(`[MatchDAO]: failed to retrieve match with id ${matchId}. Match does not exist.`);
                    reject({
                        code: 422,
                        message: `Match with id ${matchId} does not exist.`
                    });
                }
            }).catch(error => {
                console.log(`[MatchDAO]: failed to retrieve match with id ${matchId}`, error);
                reject({
                    code: 500,
                    message: `Failed to retrieve match with id ${matchId} from database.`
                });
            });
        })
    }

    updateMatch(matchId, matchData) {
        return new Promise(function (resolve, reject) {
            matchesCollection.doc(matchId).set(matchData, { merge: true }).then(result => {
                console.log(`[MatchDAO]: successfully updated match with id ${matchId}`);
                resolve(true);
            }).catch(error => {
                console.log(`MatchDAO: failed to update group with id ${matchId}`, error);
                reject({
                    code: 500,
                    message: `Failed to update group with id ${matchId} to the database.`
                })
            });
        });
    }
}


export const matchDAO = new MatchDAO();