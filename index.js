var admin = require("firebase-admin");

var serviceAccount = "./secrets/firebase-serviceaccount-key.json";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://groupmatch-f14e4.firebaseio.com"
});