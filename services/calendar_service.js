import { getCalendarClient } from "./google_service";

export function getGoogleCalendar(userCredentials) {
    console.log(userCredentials);
    const calendarClient = getCalendarClient(userCredentials);
    console.log(calendarClient);
}