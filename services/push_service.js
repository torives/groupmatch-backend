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
            console.log(`[Push Service] Sent ${response.successCount} of ${deviceTokens.length} messages successfully'`);
        })
        .catch(error => {
            console.log(`[Push Service] Failed to send messages.`, error);
        });
}