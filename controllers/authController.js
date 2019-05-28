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

const { body, validationResult } = require('express-validator/check');

class AuthController {
    exchangeAuthCode(req, res) {
        
        console.log(req.body)
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send({
                errors: errors.array()
            });
        }
        
        oauth2Client.getToken(req.body.token)
            .then(response => {
                const { tokens } = response
                oauth2Client.credentials = tokens
                console.log(tokens)

                return res.status(200).send({
                    success: "true",
                    message: response.tokens
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

    validate(method) {
        switch (method) {
            case 'exchangeAuthCode': {
                return [
                    body("token").not().isEmpty(),
                    body("uid").not().isEmpty()
                ]
            }
        }
    }
}

const authController = new AuthController();
export default authController;