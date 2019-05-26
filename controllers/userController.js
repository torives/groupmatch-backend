const firebaseAdmin = require("firebase-admin");
const serviceAccount = "./secrets/firebase-serviceaccount-key.json";

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://groupmatch-f14e4.firebaseio.com"
});

const db = firebaseAdmin.firestore();

class UserController {
    createUser(req, res) {
        let newUser = req.body;
        console.log(newUser);

        let createPromise = db.collection("users").doc(newUser.uid).set(newUser);
        createPromise.then( result => {
            return res.status(201).send({
                success: "true",
                message: "User created successfully"
            });
        }).catch( error => {
            return res.status(500).send({
                success: "false",
                message: "Failed to create user"
            });
        });
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