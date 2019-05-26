const firebaseAdmin = require("firebase-admin");
const serviceAccount = "./secrets/firebase-serviceaccount-key.json";

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://groupmatch-f14e4.firebaseio.com"
});

class UserController {
    createUser(req, res) {
        return res.status(500).send({
            success: "false",
            message: "not implemented"
        });
    }
    
    updateUser(req, res) {
        let userId = req.params.id;
        console.log(userId);
        
        return res.status(500).send({
            success: "false",
            message: "not implemented"
        });
    }
}
const userController = new UserController();
export default userController;