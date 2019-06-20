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
    
    getCalendar(userData) {
        return new Promise(async function (resolve, reject) {
            try {
                const googleCalendarClient = getCalendarClient(userData.tokens);
                console.log(googleCalendarClient);
                resolve(true)
            } catch (error) {
                console.log(error);
                reject(error)
            }
        });
    } 
}


export const calendarDAO = new CalendarDAO();