import express from 'express';
import db from './db/db';
import bodyParser from 'body-parser';

// Set up the express app
const app = express();

//Parse incoming request data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// get all todos
app.get('/api/v1/todos', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'todos retrieved successfully',
    todos: db
  })
});
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