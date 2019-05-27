const { body, check, validationResult } = require('express-validator/check');
import firebaseAdmin from "firebase-admin";
const serviceAccount = "./secrets/firebase-serviceaccount-key.json";

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://groupmatch-f14e4.firebaseio.com"
});

const db = firebaseAdmin.firestore();

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
        let usersCollection = db.collection("users");

        var getUser = usersCollection.doc(userId).get();
        getUser.then(user => {
            if (!user.exists) {
                console.log(`Failed to update user. There's no user with id ${userId}`);

                return res.status(400).send({
                    success: "false",
                    message: `User with id ${userId} does not exist`
                });
            } else {
                let updateUser = user.ref.set(userData, { merge: true });
                updateUser.then(result => {
                    console.log(`Updated user with id ${userId}`);

                    return res.status(200).send({
                        success: "true",
                        message: `Updated user with id ${userId}`
                    });
                }).catch(error => {
                    console.log(`Failed to update user with id ${userId}`, error);

                    return res.status(500).send({
                        success: "false",
                        message: `Failed to update user with id ${userId}`
                    });
                })
            }
        }).catch(error => {
            console.log(`Failed to update user with id ${userId}`, error);

            return res.status(500).send({
                success: "false",
                message: `Failed to update user with id ${userId}`
            });
        });
    }

    validate(method) {
        switch (method) {
            case 'createUser': {
                return [
                    body("name").exists(),
                    body("email").exists().isEmail(),
                    body("uid").exists().isString(),
                    body("profileImage").optional().isURL()
                ]
            }
            case 'updateUser': {
                return [
                    check("id").isLength({ min: 5 })
                ]
            }
        }
    }
}

const userController = new UserController();
export default userController;