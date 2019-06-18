import { exchangeTokens } from "../actions/exchange_tokens";
import { userDAO } from "../db/dao/UserDAO";


function canProcessTokens(tokens) {
    return tokens.access == null &&
        tokens.auth != null
}
class UserCreatedListener {

    onUserCreated(userId, tokens) {

        if (canProcessTokens(tokens)) {
            exchangeTokens(tokens.auth).then(tokens => {
                const [ accessToken, refreshToken ] = tokens;
                console.log(`Success: obtained access: ${accessToken} and refresh: ${refreshToken} tokens for user: ${userId}`)
                const userData = {
                    tokens: {
                        "access": accessToken,
                        "refresh": refreshToken
                    }
                }
                userDAO.updateUser(userId, userData)
                    .then(result => {
                        console.log(`Success: updated user: ${userId} with access and refresh tokens`, result);
                    }).catch(error => {
                        console.log(`Failure: failed to update user: ${userId} tokens`, error);
                    });
            }).catch(error => {
                console.log(`Failure: failed to obtain access token for user: ${userId}`, error)
            });
        }
    }
}

export const userCreatedListener = new UserCreatedListener();