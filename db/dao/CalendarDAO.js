import { getCalendarClient } from "../../services/google_service";
import { userDAO } from "./UserDAO";
const moment = require('moment-timezone');

const defaultTimezone = moment().tz("America/Sao_Paulo");
const weekStart = moment(defaultTimezone).startOf("isoweek").startOf("day");
const weekEnd = moment(defaultTimezone).endOf("isoweek");

const eventSearchParameters = {
    calendarId: 'primary',
    timeMin: weekStart.toISOString(true),
    timeMax: weekEnd.toISOString(true),
    timezone: "America/Sao_Paulo",
    singleEvents: true,
    orderBy: 'startTime'
}

class CalendarDAO {

    get currentWeek() {
        return {
            weekStart: moment(defaultTimezone).startOf("isoweek").startOf("day"),
            weekEnd: moment(defaultTimezone).endOf("isoweek")
        }
    }

    getCalendars(users) {
        // var remoteCalendars = new Map();
        // const getCalendarPromises = users.map(user => {
        //     getCalendar(user)
        // });
        // const result = await Promise.all(getCalendarPromises);
        // console.log(result);
    }

    // getCurrentWeekEvents(userData) {
    //     return new Promise(async function (resolve, reject) {
    //         try {
    //             const calendarClient = getCalendarClient(userData.tokens);
    //             const currentWeekEvents = await calendarClient.events.list({
    //                 calendarId: 'primary',
    //                 timeMin: (new Date()).toISOString(),
    //                 maxResults: 10,
    //                 singleEvents: true,
    //                 orderBy: 'startTime',
    //             });
    //             resolve(currentWeekEvents)
    //         } catch (error) {
    //             console.log(error);
    //             reject(error)
    //         }
    //     });
    // }

    async getCalendar(userId) {
        try {
            const user = await userDAO.getUser(userId);
            console.log(user.id, user.data().email);
            const userCredentials = { access_token: user.data().tokens.access, refresh_token: user.data().tokens.refresh };
            const calendarClient = getCalendarClient(userCredentials);
            const events = await calendarClient.events.list(eventSearchParameters);
            const calendar = createCalendar(events.data);

            return calendar;
        } catch (error) {
            return error
        }
    }
}

function createCalendar(events) {
    //TODO: implementar o map de calendar da CalendarAPI para meu modelo
    console.log(events);
}


export const calendarDAO = new CalendarDAO();