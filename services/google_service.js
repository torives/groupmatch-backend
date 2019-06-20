const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const keyPath = path.join(__dirname, '../secrets/oauth2.keys.json');
let keys = { redirect_uris: [''] };
if (fs.existsSync(keyPath)) {
    keys = require(keyPath).web;
}


export const authClient = new google.auth.OAuth2(
    keys.client_id,
    keys.client_secret,
    keys.redirect_uris[0]
);

//FIXME: what happens when the token expires???
//TODO: Create a single Calendar Client and manage authentication per request 
export function getCalendarClient(userTokens) {
    const credentials = { access_token: userTokens.access, refresh_token: userTokens.refresh };
    authClient.setCredentials(credentials);

    return google.calendar({ 
        version: 'v3', 
        auth: authClient
    });
}
