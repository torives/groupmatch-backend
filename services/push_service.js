import { firebaseAdmin } from "./firebase_service";

export function sendMulticast(title, body, deviceTokens) {
    const push = {
        notification: {
            title: title,
            body: body
        },
        tokens: deviceTokens,
    }

    firebaseAdmin.messaging().sendMulticast(push)
        .then(response => {
            console.log(response.successCount + ' messages were sent successfully');
        })
        .catch(error => {
            console.log(error);
        });
}