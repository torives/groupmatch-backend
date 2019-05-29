const { body, validationResult } = require('express-validator/check');
import db from '../db/firestore-db';
import UpdateUser from "../actions/UpdateUser";

let updateUser = new UpdateUser();

class UserController {

    createUser(req, res) {

        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send({
                errors: errors.array()
            });
        }

        try {
            let newUser = req.body;
            let usersCollection = db.collection("users");
            let getUser = usersCollection.doc(newUser.uid).get();
            getUser.then(user => {
                if (user.exists) {
                    return res.status(400).send({
                        success: "false",
                        message: `User with id ${newUser.uid} already exists`
                    });
                } else {
                    let createUser = usersCollection.doc(newUser.uid).set(newUser);
                    createUser.then(result => {
                        return res.status(201).send({
                            success: "true",
                            message: "User created successfully"
                        });
                    }).catch(error => {
                        console.log(error);

                        return res.status(500).send({
                            success: "false",
                            message: "Failed to create user"
                        });
                    });
                }
            }).catch(error => {
                console.log(error);

                return res.status(500).send({
                    success: "false",
                    message: "Failed to create user"
                });
            });
        } catch (error) {
            console.log(error);

            return res.status(500).send({
                success: "false",
                message: "Failed to create user"
            });
        }
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
                    body("name").optional().isLength({ min: 3 }),
                    body("email", "Invalid operation. E-mail change is not supported").not().exists(),
                    body("uid", "Invalid operation. You cannot alter an user's UID").not().exists(),
                    body("profileImage").optional().isURL()
                ]
            }
        }
    }
}

const userController = new UserController();
export default userController;
