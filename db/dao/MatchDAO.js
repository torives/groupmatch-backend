import { db } from "firestore_db"

const matchesCollection = db.collection("matches");


class MatchDAO {

    createMatch(match) {
        return new Promise(function (resolve, reject) {
            matchesCollection.add(match)
                .then(result => {
                    
                }).catch(error => {

                })
        });
    }

    updateMatch(match) {
        return new Promise(function (resolve, reject) { });
    }
}


export const matchDAO = new MatchDAO();