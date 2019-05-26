const firebaseAdmin = require("firebase-admin");
const serviceAccount = "./secrets/firebase-serviceaccount-key.json";

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://groupmatch-f14e4.firebaseio.com"
});

const db = firebaseAdmin.firestore();

class UserController {

    createUser(req, res) {
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
        let userId = req.params.id;
        console.log(userId);

        let userRef = db.collection("users").doc(userId);
        var getUser = userRef.get()
            .then(user => {
                if (!user.exists) {
                    console.log('No such document!');
                } else {
                    console.log('Document data:', user.data());
                }
            })
            .catch(err => {
                console.log('Error getting user', err);
            });

        return res.status(500).send({
            success: "false",
            message: "not implemented"
        });
    }
}
const userController = new UserController();
export default userController;