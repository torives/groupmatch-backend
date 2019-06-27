import { getCalendarClient } from "../../services/google_service";
import { userDAO } from "./UserDAO";
import { isNullOrUndefined } from "util";
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
            start: weekStart.toISOString(true),
            end: weekEnd.toISOString(true)
        }
    }

    async getCalendar(userId) {
        try {
            const user = await userDAO.getUser(userId);
            const userCredentials = { access_token: user.data().tokens.access, refresh_token: user.data().tokens.refresh };
            const calendarClient = getCalendarClient(userCredentials);
            const googleCalendarEvents = await calendarClient.events.list(eventSearchParameters);
            const calendar = formatCalendar(user, this.currentWeek, googleCalendarEvents.data);

            return calendar;
        } catch (error) {
            return error
        }
    }
}

function formatCalendar(user, week, googleCalendarEvents) {
    //TODO: implementar o map de calendar da CalendarAPI para meu modelo
    const calendar = {
        owner: {
            id: user.id,
            name: user.data().name
        },
        week: {
            start: week.start,
            end: week.end
        }
    };

    const events = [];
    //FIXME: Levar em consideração que eventos "all day" possuem propriedade "date" e n"ao "dateTime"
    googleCalendarEvents.items.forEach(item => {
        if (!isNullOrUndefined(item.start.dateTime) && !isNullOrUndefined(item.end.dateTime)) {
            events.push({
                start: item.start.dateTime,
                end: item.end.dateTime
            });
        }
    });

    calendar.events = events;

    return calendar;
}


export const calendarDAO = new CalendarDAO();