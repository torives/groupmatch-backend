import ExchangeTokens from "../actions/ExchangeTokens";
let exchangeTokens = new ExchangeTokens();
import UpdateUser from "../actions/UpdateUser";
let updateUser = new UpdateUser();

class UserCreatedListener {
    
    onUserCreated(userId, tokens) {
    
        if (tokens.access.isEmpty && tokens.auth != null) {
            exchangeTokens.get(userId, tokens.auth).then((accessToken, refreshToken) => {
                let userData = {
                    tokens: {
                        "access": accessToken,
                        "refresh": refreshToken
                    }
                }
                updateUser.update(userId, userData).then({

                }).catch(error => {

                });
            }).catch(error => {

            });
        }
    }
}

const userCreatedListener = new UserCreatedListener();
export default userCreatedListener;