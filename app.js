import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/routes.js';
import db from "./db/firestore-db";
import userCreatedListener from "./db/UserCreatedListener";


let usersCollection = db.collection("users");
usersCollection.onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if (change.type == "added") {
      let userData = change.doc.data();
      console.log(user);
      userCreatedListener.onUserCreated(change.doc.id, userData.tokens);
    }
  });
});





// Set up the express app
const app = express();

//Parse incoming request data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);


const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});


// let admin = require("firebase-admin");
// let serviceAccount = "firebase-serviceaccount-key.json";

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://groupmatch-f14e4.firebaseio.com"
// });

// let registrationToken = "dMc9NfpnPzg:APA91bFuXLUHemzR4aw0BJdqRfKoyaMYGzsaqLhp-tFHPWAY_zLGI0DJrm8bAq-UpoSzU1Hp-mQ_N3C9iwaHhUMsONLjepxwPlDO86-r0yQzmHN-ASxYL5QRBVxY4cN6qM0baLg_3b1U";
// let payload = {
//     notification: {
//       title: "Account Deposit",
//       body: "A deposit to your savings account has just cleared."
//     }
//   };

//   admin.messaging().sendToDevice(registrationToken, payload)
//   .then(function(response) {
//     console.log("Successfully sent message:", response);
//   })
//   .catch(function(error) {
//     console.log("Error sending message:", error);
//   });