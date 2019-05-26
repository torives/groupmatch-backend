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
        
        return res.status(500).send({
            success: "false",
            message: "not implemented"
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