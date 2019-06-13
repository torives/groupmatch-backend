import { admin } from "firebase-admin";
const serviceAccount = "firebase-serviceaccount-key.json";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://groupmatch-f14e4.firebaseio.com"
});


function sendPush(push, deviceTokens) {
    
}
// const registrationToken = "dMc9NfpnPzg:APA91bFuXLUHemzR4aw0BJdqRfKoyaMYGzsaqLhp-tFHPWAY_zLGI0DJrm8bAq-UpoSzU1Hp-mQ_N3C9iwaHhUMsONLjepxwPlDO86-r0yQzmHN-ASxYL5QRBVxY4cN6qM0baLg_3b1U";
// const payload = {
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