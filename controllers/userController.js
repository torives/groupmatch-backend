import UpdateUser from "../actions/UpdateUser";
import GetUser from "../actions/GetUser";
import CreateUser from "../actions/CreateUser";
const { body, validationResult } = require('express-validator/check');
let updateUser = new UpdateUser();
let getUser = new GetUser();
let createUser = new CreateUser();

class UserController {

    createUser(req, res) {

        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send({
                errors: errors.array()
            });
        }

        let newUser = req.body;
        getUser.get(newUser.uid).then(user => {
            return res.status(400).send({
                success: "false",
                message: `User with id ${newUser.uid} already exists`
            });
        }).catch(error => {
            if (error.code == 417) {
                createUser.create(newUser).then(result => {
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

        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send({
                errors: errors.array()
            });
        }

        let userId = req.params.id;
        let userData = req.body;
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
            });
    }

    validate(method) {
        switch (method) {
            case 'createUser': {
                return [
                    body("name", "User must have a nome with at least 3 letters").exists().isLength({ min: 3 }),
                    body("email", "Invalid email").exists().isEmail(),
                    body("uid", "User must have a UID").exists(),
                    body("profileImage").optional().isURL()
                ]
            }
            case 'updateUser': {
                return [
                    body().custom(body => {
                        let validProperties = ["tokens", "profileImage"];
                        var isValid = true;
                        Object.keys(body).forEach(key => {
                            if (!validProperties.includes(key)) {
                                isValid = false;
                            }
                        });
                        return isValid;
                    }).withMessage("You can't update this property"),
                    body("tokens").optional().custom(tokens => {
                        let validTokens = ["access", "refresh", "device"];
                        var isValid = true;
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

const userController = new UserController();
export default userController;
