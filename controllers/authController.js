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
import UpdateUser from "../actions/UpdateUser";
let updateUser = new UpdateUser();

class AuthController {
    exchangeAuthCode(req, res) {
        console.log(req.body);

        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send({
                errors: errors.array()
            });
        }

        let authToken = req.body.token;
        let userId = req.body.uid;
        oauth2Client.getToken(authToken)
            .then(response => {
                const { tokens } = response;
                oauth2Client.credentials = tokens;

                let userData = {
                    uid: userId,
                    tokens: {
                        access: tokens.access_token,
                        refresh: tokens.refresh_token
                    }
                };
                console.log(`id ${userId}\n${userData}`);
                updateUser.update(userId, userData)
                    .then(result => {
                        return res.status(result.code).send({
                            success: true,
                            message: result.message
                        });
                    }).catch(error => {
                        return res.status(error.code).send({
                            success: false,
                            message: error.message
                        });
                    })
            }).catch(error => {
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