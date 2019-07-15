import { exchangeTokens } from "../actions/exchange_tokens";
import { userDAO } from "../db/dao/UserDAO";
import { usersCollection, isSnapshotOutdated } from "../db/firestore_db";

class UserCreatedListener {

    onUserCreated(userId, tokens) {

        if (canProcessTokens(tokens)) {
            exchangeTokens(tokens.auth).then(tokens => {
                const [ accessToken, refreshToken ] = tokens;
                const userData = {
                    tokens: {
                        "access": accessToken,
                        "refresh": refreshToken
                    }
                }
                userDAO.updateUser(userId, userData)
                    .then(result => {
                        console.log(`Success: updated user: ${userId} with access and refresh tokens\n`, result);
                    }).catch(error => {
                        console.log(`Failure: failed to update user: ${userId} tokens`, error);
                    });
            }).catch(error => {
                console.log(`Failure: failed to obtain access token for user: ${userId}`, error)
            });
        }
    }
}

function canProcessTokens(tokens) {
    return tokens.access == null &&
        tokens.auth != null
}

usersCollection.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if (change.type == "added" && isSnapshotOutdated(snapshot, change.doc)) {
            const userData = change.doc.data();
            userCreatedListener.onUserCreated(change.doc.id, userData.tokens);
        }
    });
});

export const userCreatedListener = new UserCreatedListener();