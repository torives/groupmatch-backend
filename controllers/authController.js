const { body, validationResult } = require('express-validator/check');
import { userDAO } from "../db/dao/UserDAO";
import { authClient } from "../services/google_service";


class AuthController {
    exchangeAuthCode(req, res) {
        console.log(req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send({
                errors: errors.array()
            });
        }

        const userId = req.body.uid;
        userDAO.getUser(userId).then(user => {
            const userData = user.data();
            console.log(user.data());
            
            if (!userData.tokens.access.isEmpty) {
                return res.status(200).send({
                    success: true,
                    message: "Token already registered for user"
                });
            } else {
                const authToken = req.body.token;
                authClient.getToken(authToken).then(response => {
                    const { tokens } = response;
                    authClient.credentials = tokens;

                    console.log(tokens);
                    const userData = {
                        uid: userId,
                        tokens: {
                            access: tokens.access_token,
                            refresh: tokens.refresh_token
                        }
                    };
                    console.log(`id ${userId}`);
                    console.log(userData);

                    userDAO.updateUser(userId, userData)
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
                        success: false,
                        message: error.message
                    })
                });
            }
        }).catch(error => {
            console.log(error);
            return res.status(500).send({
                success: false,
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

export const authController = new AuthController();