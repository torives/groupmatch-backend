import { exchangeTokens } from "../actions/exchange_tokens";
import { updateUser } from "../actions/update_user";


function canProcessTokens(tokens) {
    return tokens.access != null &&
        tokens.access.isEmpty &&
        tokens.auth != null
}
class UserCreatedListener {

    onUserCreated(userId, tokens) {

        if (canProcessTokens(tokens)) {
            exchangeTokens(tokens.auth).then((accessToken, refreshToken) => {
                console.log(`Success: obtained access: ${accessToken} and refresh: ${refreshToken} tokens for user: ${userId}`)
                const userData = {
                    tokens: {
                        "access": accessToken,
                        "refresh": refreshToken
                    }
                }
                updateUser(userId, userData)
                    .then(result => {
                        console.log(`Success: updated user: ${userId} with access and refresh tokens`)
                        console.log(result);
                    }).catch(error => {
                        console.log(`Failure: failed to update user: ${userId} tokens`)
                        console.log(error);
                    });
            }).catch(error => {
                console.log(`Failure: failed to obtain access token for user: ${userId}`)
                console.log(error);
            });
        }
    }
}

export const userCreatedListener = new UserCreatedListener();