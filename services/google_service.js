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

//TODO: what happens when the token expires???
export function getCalendarClient(credentials) {
    const googleCredentials = {
        id_token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjY4NjQyODlmZmE1MWU0ZTE3ZjE0ZWRmYWFmNTEzMGRmNDBkODllN2QiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNDg1MTkzMzQxODgtYjFkajM2dTRlaTZlbjA2OHFmN2VnazcxdHJodmFsMGEuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNDg1MTkzMzQxODgtYjFkajM2dTRlaTZlbjA2OHFmN2VnazcxdHJodmFsMGEuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDg2NjA3NTQ1NDIxNDQ5MDYyNTQiLCJlbWFpbCI6Imdyb3VwbWF0Y2h0ZXN0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiN09sNDlKUWFsNXNOSkZNMGZnallxUSIsIm5hbWUiOiJHcm91cE1hdGNoIFRlc3QiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDQuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1ZR012emVrUXZPZy9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BQ0hpM3JmM2tVZk9JTmZWY3ZSWmw3OGpsdHhEaFdWdFp3L3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJHcm91cE1hdGNoIiwiZmFtaWx5X25hbWUiOiJUZXN0IiwibG9jYWxlIjoicHQtQlIiLCJpYXQiOjE1NjEwNjA1NjAsImV4cCI6MTU2MTA2NDE2MH0.FQXxWS8A2O2fmRL4rDA-FKticSDgqhU1zWuvuWwi4aXy6SlA4vwKfnWsDTnc-3DsxWyRUFJwh3c0PuCM0V9CDjk0Y1C24sVMKMVbPK2qTqRR2nk8DQeyJnkv1AdC3RRlQOqHOUw61KHP5sbUBb8YCMziHEF6qYi6jyJqX80buY2z2DQw4pEsXQfucApZkxsesQ2HCXK3BmmsByLDdJ-ut5YmYOfs4y_s0xeRtCdoXIUqpnEs9572gh5-bXCqISUeOFEHZr6CrwmJVSnnhYpC9eWY-yIhJtQZ9aAhk6OKQI0focRvKudmNe1NrhsMM_PNqUaJynDP1gz2pgDGKZVB-A",
        refresh_token: "1/xmcx02tdzUSDRwTKg96f2nKF1c4p5Vfp0Gxta9feZ8E",
        scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.events openid https://www.googleapis.com/auth/userinfo.profile",
        token_type: "Bearer"
    }
    // const googleCredentials = {
    //     refresh_token: credentials.refresh,
    //     access_token: credentials.access
    // }
    authClient.setCredentials(googleCredentials);

    return google.calendar({ 
        version: 'v3', 
        auth: credentials.access 
    });
}
