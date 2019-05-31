const { body, validationResult } = require('express-validator/check');
import UpdateUser from "../actions/UpdateUser";
import oauth2Client from "../services/google-oath";
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

        //get user. if has access token, do nothing

        let authToken = req.body.token;
        let userId = req.body.uid;
        oauth2Client.getToken(authToken)
            .then(response => {
                const { tokens } = response;
                oauth2Client.credentials = tokens;
                console.log(tokens);
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