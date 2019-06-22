import { firebaseAdmin } from "./firebase_service";

export function sendMulticast(title, body, deviceTokens, payload = null) {
    const push = {
        notification: {
            title: title,
            body: body
        },
        tokens: deviceTokens,
    }

    if(payload != null) {
        push["data"] = payload;
    }

    firebaseAdmin.messaging().sendMulticast(push)
        .then(response => {
            console.log(`[Push Service] Sent ${response.successCount} of ${deviceTokens.length} messages successfully'`);
        })
        .catch(error => {
            console.log(`[Push Service] Failed to send messages.`, error);
        });
}