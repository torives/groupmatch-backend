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

export function getCalendarClient(credentials) {
    authClient.credentials = credentials;
    return google.calendar({ version: 'v3', authClient });
}

// calendarClient.events.list({
//     calendarId: 'primary',
//     timeMin: (new Date()).toISOString(),
//     maxResults: 10,
//     singleEvents: true,
//     orderBy: 'startTime',
// }, (err, res) => {
//     if (err) return console.log('The API returned an error: ' + err);
//     const events = res.data.items;
//     if (events.length) {
//         console.log('Upcoming 10 events:');
//         events.map((event, i) => {
//             const start = event.start.dateTime || event.start.date;
//             console.log(`${start} - ${event.summary}`);
//         });
//     } else {
//         console.log('No upcoming events found.');
//     }
// });
