import { authClient } from "../services/google_service";


export function exchangeTokens(authToken) {
    return new Promise(function (resolve, reject) {

        authClient.getToken(authToken).then(response => {
            const tokens = response.tokens;
            authClient.setCredentials(tokens);
            resolve([tokens.access_token, tokens.refresh_token]);
        }).catch(error => {
            console.log(error)
            reject(error);
        });
    });
}