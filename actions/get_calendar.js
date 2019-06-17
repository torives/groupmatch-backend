import { getGoogleCalendar } from "../services/calendar_service";

export async function getCalendars(users) {
    // var remoteCalendars = new Map();
    // const getCalendarPromises = users.map(user => {
    //     getCalendar(user)
    // });
    // const result = await Promise.all(getCalendarPromises);
    // console.log(result);
}


export async function getCalendar(user) {
    return new Promise(async function (resolve, reject) {
        try {
            const googleCalendar = await getGoogleCalendar(user.tokens);
            console.log(googleCalendar);
            resolve(googleCalendar)
        } catch (error) {
            console.log(error);
            reject(error)
        }
    });
} 