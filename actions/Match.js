import { calendarDAO } from "../db/dao/CalendarDAO";
import { isNullOrUndefined } from "util";
const moment = require('moment-timezone');


const DATE_FORMAT = "YYYY-MM-DD";

//TODO: ignorar o tempo da semana que já passou
//TODO: no envio do calendario local, já consolida os horarios ocupadas em um evento apenas.
//TODO: mandar o calendário com o timezone correto

export class Match {
    static async calculateResult(matchData) {
        const currentWeek = calendarDAO.currentWeek
        const answers = new Map(Object.entries(matchData.answers));

        const events = await consolidateEvents(answers);
        const freeSlots = calculateFreeSlots(events, currentWeek);

        orderFreeSlots(freeSlots);

        return freeSlots;
    }
}

function orderFreeSlots(freeSlots) {
    function duration(timeSlot) {
        return moment(timeSlot.end).diff(moment(timeSlot.start), "hours");
    }

    freeSlots.sort((lhs, rhs) => {
        const lhsDuration = duration(lhs);
        const rhsDuration = duration(rhs);

        return lhsDuration > rhsDuration ? -1 : lhsDuration < rhsDuration ? 1 : 0;
    });
}

async function consolidateEvents(answers) {
    var events = [];
    for (var [userId, answer] of answers) {
        if (answer.hasJoined) {
            const remoteCalendar = await calendarDAO.getCalendar(userId);
            normalizeRemoteCalendar(remoteCalendar);

            const userCalendar = mergeCalendars(answer.localCalendar, remoteCalendar);

            events = mergeEventLists(events, userCalendar.events);
        }
    }
    return events;
}

function normalizeRemoteCalendar(remoteCalendar) {
    const normalizedEvents = []
    
    remoteCalendar.events.forEach(event => {
        if(!moment(event.start).isSame(event.end, "day")){
            const firstEvent = {
                start: event.start,
                end: moment(event.start).endOf("day").toISOString(true)
            }
            const secondEvent = {
                start: moment(event.end).startOf("day").toISOString(true),
                end: event.end
            }
            normalizedEvents.push(firstEvent, secondEvent);
        } else {
            normalizedEvents.push(event);
        }
    });

    remoteCalendar.events = normalizedEvents;
}

function mergeCalendars(localCalendar, remoteCalendar) {

    var mergedCalendar = Object.assign({}, remoteCalendar); //CUIDADO
    mergedCalendar.events = mergeEventLists(localCalendar.events, remoteCalendar.events);

    return mergedCalendar
}

function mergeEventLists(firstList, lastList) {

    const sortEventsByStartDateAsc = function (lhs, rhs) {
        return moment(lhs.start).isBefore(rhs.start) ? -1 : moment(lhs.start).isAfter(rhs.start) ? 1 : 0;
    };

    const allEvents = firstList.concat(lastList);
    allEvents.sort(sortEventsByStartDateAsc);

    //If one of the lists is empty, merge is not necessary
    if (firstList.length == 0 || lastList.length == 0) {
        return allEvents
    }

    const mergedEvents = mergeEvents(allEvents)
    return mergedEvents
}

function mergeEvents(eventList) {
    var newEvent = {
        start: eventList[0].start,
        end: eventList[0].end
    }
    var currentEvent;
    var index = 1;
    const mergedEvents = [];

    while (index < eventList.length) {
        currentEvent = eventList[index];
        if (moment(currentEvent.start).isBetween(newEvent.start, newEvent.end, null, [])) {
            if (moment(currentEvent.end).isAfter(newEvent.end)) {
                newEvent.end = currentEvent.end
            }
        } else {
            mergedEvents.push(newEvent);
            newEvent = {
                start: currentEvent.start,
                end: currentEvent.end,
            }
        }
        index++;
    }
    return mergedEvents
}

function calculateFreeSlots(events, currentWeek) {

    function groupEventsByDay(events, currentWeek) {
        var weekStart = moment(currentWeek.start);
        var weekEnd = moment(currentWeek.end);
        const eventsGroupedByDay = new Map();

        for (var day = moment(weekStart); day.isBefore(weekEnd, "day") || day.isSame(weekEnd, "day"); day.add(1, 'days')) {
            eventsGroupedByDay.set(day.format(DATE_FORMAT), []);
        }

        events.forEach(event => {
            const day = moment(event.start).format(DATE_FORMAT)
            eventsGroupedByDay.get(day).push(event);
        });

        return eventsGroupedByDay;
    }

    const eventsGroupedByDay = groupEventsByDay(events, currentWeek);
    var freeSlots = [];

    eventsGroupedByDay.forEach((events, day) => {
        const currentDay = {
            start: moment(day).startOf("day").toISOString(true),
            end: moment(day).endOf("day").toISOString(true)
        }
        const currentDayFreeSlots = calculateFreeSlotsPerDay(currentDay, events.slice(), [])
        freeSlots = freeSlots.concat(currentDayFreeSlots);
    });

    return freeSlots;
}

function calculateFreeSlotsPerDay(day, events, freeSlots) {
    if (events.length == 0) { //if there are no more events, we´re done
        freeSlots.push(day);
        return freeSlots
    } else {
        const event = events.shift(); //Grabs the first event

        const newFreeSlots = createFreeSlots(day, event); //Calculates freeSlots for the event
        if(newFreeSlots.length == 0){ //If there´s no free slots anymore, this day is complete
            return freeSlots;
        } else if(newFreeSlots.length == 2) { // if there´s 2 free slots, add the first to the final list
            freeSlots.push(newFreeSlots.shift());
        }

        day = newFreeSlots.pop(); //the second or only free slot is the remaining free time of the day

        return calculateFreeSlotsPerDay(day, events, freeSlots); //Compare the remaining free time of the day with the rest of the events
    }
}

function createFreeSlots(day, event) {
    const freeSlots = [];

    if (moment(event.start).isAfter(day.start)) {
        const firstSlot = {
            start: day.start,
            end: event.start
        }
        const secondSlot = {
            start: event.end,
            end: day.end
        }
        freeSlots.push(firstSlot, secondSlot);
    } else if(moment(event.end).isBefore(day.end)){
        const freeSlot = {
            start: event.end,
            end: day.end
        }
        freeSlots.push(freeSlot);
    }

    return freeSlots
}