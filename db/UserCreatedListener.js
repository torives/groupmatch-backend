import { exchangeTokens } from "../actions/exchange_tokens";
import { updateUser } from "../actions/update_user";


class UserCreatedListener {

    onUserCreated(userId, tokens) {

        if (tokens.access.isEmpty && tokens.auth != null) {
            exchangeTokens(tokens.auth)
                .then((accessToken, refreshToken) => {
                    const userData = {
                        tokens: {
                            "access": accessToken,
                            "refresh": refreshToken
                        }
                    }
                    updateUser(userId, userData)
                        .then({

                        }).catch(error => {

                        });
                }).catch(error => {

                });
        }
    }
}

export const userCreatedListener = new UserCreatedListener();