import { getCalendarClient } from "../../services/google_service";

class CalendarDAO {
    getCalendars(users) {
        // var remoteCalendars = new Map();
        // const getCalendarPromises = users.map(user => {
        //     getCalendar(user)
        // });
        // const result = await Promise.all(getCalendarPromises);
        // console.log(result);
    }

    getCurrentWeekEvents(userData) {
        return new Promise(async function (resolve, reject) {
            try {
                const calendarClient = getCalendarClient(userData.tokens);
                const currentWeekEvents = await calendarClient.events.list({
                    calendarId: 'primary',
                    timeMin: (new Date()).toISOString(),
                    maxResults: 10,
                    singleEvents: true,
                    orderBy: 'startTime',
                });
                resolve(currentWeekEvents)
            } catch (error) {
                console.log(error);
                reject(error)
            }
        });
    }
}


export const calendarDAO = new CalendarDAO();