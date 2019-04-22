const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const keyPath = path.join(__dirname, '../secrets/oauth2.keys.json');
let keys = { redirect_uris: [''] };
if (fs.existsSync(keyPath)) {
    keys = require(keyPath).web;
}

const oauth2Client = new google.auth.OAuth2(
    keys.client_id,
    keys.client_secret,
    keys.redirect_uris[0]
);

class AuthController {
    //TODO: validate request body
    handleGoogleAuthCode(req, res) {
        console.log(req.body)
        oauth2Client.getToken(req.body.token)
            .then(tokenResponse => {
                console.log(tokenResponse)
                return res.status(200).send({
                    success: "true",
                    message: tokenResponse.tokens
                });
            })
            .catch(error => {
                console.log(error)
                return res.status(error.code).send({
                    code: error.code,
                    message: error.response.data.error_description
                });
            });
    }

    handleGoogleOauthCallback(req, res) {
        console.log(req)
    }
}

const authController = new AuthController();
export default authController;