import { admin } from "firebase-admin";
const serviceAccount = "firebase-serviceaccount-key.json";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://groupmatch-f14e4.firebaseio.com"
});


export function sendMulticast(title, body, deviceTokens) {
    const push = {
        notification: {
            title: title,
            body: body
        },
        tokens: deviceTokens,
    }

    admin.messaging().sendMulticast(push)
        .then(response => {
            console.log(response.successCount + ' messages were sent successfully');
        })
        .catch(error => {
            console.log(error);
        });
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