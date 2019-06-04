import oauth2Client from "../services/google-oath";

module.exports = class ExchangeTokens {

    get(authToken) {
        return new Promise(function (resolve, reject) {

            oauth2Client.getToken(authToken).then(response => {
                let tokens = response.tokens;
                oauth2Client.credentials = tokens;

                console.log(tokens);
                resolve(tokens.access_token, tokens.refresh_token);
            }).catch(error => {
                console.log(error)
                reject(error);
            });
        });
    }
}