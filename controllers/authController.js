const { body, validationResult } = require('express-validator/check');
import UpdateUser from "../actions/UpdateUser";
let updateUser = new UpdateUser();
import GetUser from "../actions/GetUser";
let getUser = new GetUser();
import oauth2Client from "../services/google-oath";

class AuthController {
    exchangeAuthCode(req, res) {
        console.log(req.body);

        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send({
                errors: errors.array()
            });
        }

        let userId = req.body.uid;
        getUser.get(userId)
            .then(user => {
                let userData = user.data();
                console.log(user.data());
                if (!userData.tokens.access.isEmpty) {
                    return res.status(200).send({
                        success: true,
                        message: "Token already registered for user"
                    });
                } else {
                    let authToken = req.body.token;
                    oauth2Client.getToken(authToken).then(response => {
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
                        console.log(`id ${userId}`);
                        console.log(userData);

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
                            success: "false",
                            message: error.message
                        })
                    });
                }
            }).catch(error => {
                console.log(error);
                return res.status(500).send({
                    success: "false",
                    message: "Failed to execute oauth flow."
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