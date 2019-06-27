import { calendarDAO } from "../db/dao/CalendarDAO";
import { isNullOrUndefined } from "util";
const moment = require('moment-timezone');


const DATE_FORMAT = "YYYY-MM-DD";

//TODO: ignorar o tempo da semana que já passou
//TODO: no envio do calendario local, já consolida os horarios ocupadas em um evento apenas.
//TODO: mandar o calendário com o timezone correto

export class Match {
    /*
   Para cada resposta
       Se positiva
           Pega o calendário remoto do usuário
           Mergeia calendário remoto com calendário local
           Adiciona calendario consolidado na lista de calendarios

   Calcula horários livres

   Para cada dia da semana
       cria os horários livres
       ordena decrescentemente os horários livres por quantidade de tempo
   
   Retorna a lista de horários livres
    */
    static async calculate(matchData) {
        var events = [];
        const currentWeek = calendarDAO.currentWeek
        const answers = new Map(Object.entries(matchData.answers));

        answers.forEach(async (answer, userId) => {
            if (answer.hasJoined) {
                const remoteCalendar = await calendarDAO.getCalendar(userId);
                const localCalendar = answer.localCalendar;
                const userCalendar = mergeCalendars(localCalendar, remoteCalendar);

                events = mergeEventLists(events, userCalendar.events);
            }
        });

        const freeSlots = calculateFreeSlots(events, currentWeek);

        //TODO: ordenar os slots
        const matchResult; //= freeSlots.sort();
        return matchResult;
    }
}

function mergeCalendars(localCalendar, remoteCalendar) {

    var mergedCalendar = Object.assign({}, remoteCalendar); //CUIDADO
    mergedCalendar.events = mergeEventLists(localCalendar.events, remoteCalendar.events);

    return mergedCalendar
}

function mergeEventLists(firstList, lastList) {

    const sortEventsByStartDateAsc = function (lhs, rhs) {
        return lhs.start.isBefore(rhs.start) ? -1 : lhs.start.isAfter(rhs.start) ? 1 : 0;
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

        for (var day = moment(weekStart); day.diff(weekEnd, 'days') <= 0; day.add(1, 'days')) {
            eventsGroupedByDay.set(day.format(DATE_FORMAT), []);
        }

        events.forEach(event => {
            const day = moment(event.start).format(DATE_FORMAT)
            eventsGroupedByDay.get(day).push(event);
        });

        return eventsGroupedByDay;
    }

    const eventsGroupedByDay = groupEventsByDay(events, currentWeek);
    const freeSlots = [];

    eventsGroupedByDay.forEach((day, events) => {
        const freeSlotsPerDay = calculateFreeSlotsPerDay(day, events, 0, freeSlots)
        freeSlots.push(freeSlotsPerDay);
    })

    return freeSlots
}

function calculateFreeSlotsPerDay(day, dailyEvents, index, freeSlots) {
    if (index >= events.length) {
        return freeSlots
    } else {
        const event = events[index];

        const newFreeSlots = createFreeSlots(day, event);
        freeSlots.push(newFreeSlots);

        day = newFreeSlots.slice(-1).pop();

        return calculateFreeSlotsPerDay(day, dailyEvents, index++, freeSlots);
    }
}

function createFreeSlots(day, event) {
    if (moment(event.start).isAfter(day.start)) {
        const firstSlot = {
            start: day.start,
            end: event.start
        }
        const secondSlot = {
            start: event.end,
            end: day.end
        }
        return [firstSlot, secondSlot]
    }
}


function handleMatchResult(matchData) {
    /*
        update match on the database
        for each participant
            get deviceToken
            send push to notify match is finished 
     */
}