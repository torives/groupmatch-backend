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

export const calendarClient = google.calendar({version: 'v3', authClient});