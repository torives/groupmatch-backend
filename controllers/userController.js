import { userDAO } from "../db/dao/UserDAO";
const { body, validationResult } = require('express-validator/check');


class UserController {

    createUser(req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send({
                errors: errors.array()
            });
        }

        const newUser = req.body;
        userDAO.getUser(newUser.uid).then(user => {
            return res.status(400).send({
                success: "false",
                message: `User with id ${newUser.uid} already exists`
            });
        }).catch(error => {
            if (error.code == 422) {
                userDAO.createUser(newUser).then(result => {
                    return res.status(201).send({
                        success: "true",
                        message: "User created successfully"
                    });
                }).catch(error => {
                    console.log("Failed to create user");
                    console.log(error);

                    return res.status(500).send({
                        success: "false",
                        message: "Failed to create user"
                    });
                });
            } else {
                console.log("Failed to check if user already exists");
                console.log(error);

                return res.status(500).send({
                    success: "false",
                    message: "Failed to create user"
                });
            }
        });
    }

    updateUser(req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send({
                errors: errors.array()
            });
        }

        const userId = req.params.id;
        const userData = req.body;
        console.log(`id ${userId}\n${userData}`);
        userDAO.updateUser(userId, userData).then(result => {
            return res.status(result.code).send({
                success: true,
                message: result.message
            });
        }).catch(error => {
            return res.status(error.code).send({
                success: false,
                message: error.message
            });
        });
    }

    validate(method) {
        switch (method) {
            case 'createUser': {
                return [
                    body("name", "User must have a nome with at least 3 constters").exists().isLength({ min: 3 }),
                    body("email", "Invalid email").exists().isEmail(),
                    body("uid", "User must have a UID").exists(),
                    body("profileImage").optional().isURL()
                ]
            }
            case 'updateUser': {
                return [
                    body().custom(body => {
                        const validProperties = ["tokens", "profileImage"];
                        let isValid = true;
                        Object.keys(body).forEach(key => {
                            if (!validProperties.includes(key)) {
                                isValid = false;
                            }
                        });
                        return isValid;
                    }).withMessage("You can't update this property"),
                    body("tokens").optional().custom(tokens => {
                        const validTokens = ["access", "refresh", "device"];
                        let isValid = true;
                        Object.keys(tokens).forEach(token => {
                            if (!validTokens.includes(token)) {
                                isValid = false;
                            }
                        });
                        return isValid;
                    }).withMessage("Invalid token type"),
                    body("name").optional().isLength({ min: 3 }),
                    body("email", "Invalid operation. E-mail change is not supported").not().exists(),
                    body("uid", "Invalid operation. You cannot alter an user's UID").not().exists(),
                    body("profileImage", "Must be a valid URL").optional().isURL()
                ]
            }
        }
    }
}

export const userController = new UserController();
