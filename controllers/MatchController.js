import { matchDAO } from "../db/dao/MatchDAO";
import { groupDAO } from "../db/dao/GroupDAO";
import { calendarDAO } from "../db/dao/CalendarDAO";
const moment = require('moment-timezone');

const { body, validationResult } = require('express-validator/check');


class MatchController {

    async createMatch(req, res) {
        const matchData = req.body;
        console.log(matchData);

        if (isRequestValid(req, res)) {
            try {
                const group = await groupDAO.getGroup(matchData.group.id);
                const groupData = group.data();
                console.log(groupData);
                if (groupData.current_match == null) {
                    const matchId = await matchDAO.createMatch(matchData);
                    groupData.current_match = matchId;
                    await groupDAO.updateGroup(group.id, groupData);

                    return res.status(200).send({
                        success: true,
                        message: `Successfully started a new match for group: ${group.id}`
                    });
                } else {
                    return res.status(422).send({
                        success: false,
                        message: "A group can have only one ongoing match at a time"
                    })
                }
            } catch (error) {
                console.log(error)
                return res.status(500).send({
                    success: false,
                    message: `Failed to start match for group ${matchData.group}`
                })
            }
        }
    }

    //TODO: check if answer already exists
    async addAnswer(req, res) {
        const matchId = req.params.matchId;
        const { userId, hasJoined, localCalendar } = req.body;

        if (isRequestValid(req, res)) {
            try {
                const match = await matchDAO.getMatch(matchId);
                const matchData = match.data();
                const answer = { hasJoined, localCalendar }

                matchData.answers[userId] = answer;
                matchData.status = "ONGOING";

                await matchDAO.updateMatch(matchId, matchData);

                res.status(200).send({
                    success: true,
                    message: `Successfully registered answer for user: ${userId}`
                })

                if (Object.keys(matchData.answers).length == matchData.participants.length) {
                    const result = await processMatch(matchData)
                    console.log(result);
                }

            } catch (error) {
                console.log(error);
                res.status(500).send({
                    success: false,
                    message: "Failed to register answer"
                })
            }
        }
    }

    validate(method) {
        switch (method) {
            case "createMatch": {
                return [
                    body("group").exists(),
                    body("participants").isArray(),
                    body("creator").exists()
                ]
            }
            case "addAnswer": {
                return [
                    body("userId").exists().isString(),
                    body("hasJoined").exists().isBoolean(),
                    body("localCalendar").optional()
                ]
            }
        }
    }
}

function isRequestValid(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).send({
            errors: errors.array()
        });
        return false
    }
    return true
}


//TODO: ignorar o tempo da semana que já passou
async function processMatch(matchData) {

    var eventList = [];
    const currentWeek = calendarDAO.currentWeek
    const answers = new Map(Object.entries(matchData.answers));
    
    answers.forEach(async (answer, userId) => {
        if (answer.hasJoined) {
            const remoteCalendar = await calendarDAO.getCalendar(userId);
            const localCalendar = answer.localCalendar;
            // const userCalendar = mergeCalendars(localCalendar, remoteCalendar);
            const userCalendar = mergeCalendars(remoteCalendar, remoteCalendar);

            eventList = mergeEventLists(eventList, userCalendar.events);

            console.log(userCalendar);
            return remoteCalendar //Test Purposes
        }
    });

    const matchResult = analyseFreeTime(eventList, currentWeek);
    /*
    Obs: no envio do calendario local, já consolida os horarios ocupadas
    em um evento apenas.
    Obs²: mandar o calendário com o timezone correto

    Cria calendário da semana

    Para cada resposta
        Se positiva
            Pega o calendário remoto do usuário
            Mergeia calendário remoto com calendário local ???
            Adiciona calendario consolidado na lista de calendarios

    Mergeia cada calendário consolidado com o calendário da semana

    Para cada dia da semana
        cria os horários livres
        ordena decrescentemente os horários livres por quantidade de tempo
    
    Retorna a lista de horários livres
     */
}

function analyseFreeTime(){}

function mergeCalendars(localCalendar, remoteCalendar) {

    var mergedCalendar = Object.assign({}, remoteCalendar); //CUIDADO
    mergedCalendar.events = mergeEventLists(localCalendar.events, remoteCalendar.events);

    return mergedCalendar
}

function mergeEventLists(firstList, lastList) {

    const sortEventsByStartDateAsc = function (lhs, rhs) {
        return lhs.start.isBefore(rhs.start) ? -1 : lhs.start.isAfter(rhs.start) ? 1 : 0;
    };

    var allEvents = firstList.concat(lastList);
    var allEvents = allEvents.map(event => {
        return {
            start: moment(event.start),
            end: moment(event.end)
        };
    });

    for (var event of allEvents) {
        console.log("///// EVENT /////")
        console.log(event.start.toISOString(true))
        console.log(event.end.toISOString(true))
        console.log("/////////////////")
    }

    allEvents.sort(sortEventsByStartDateAsc);

    console.log("///// AFTER SORT /////\n")
    for (var event of allEvents) {
        console.log("///// EVENT /////")
        console.log(event.start.toISOString(true))
        console.log(event.end.toISOString(true))
        console.log("/////////////////\n")
    }

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
        if (currentEvent.start.isBetween(newEvent.start, newEvent.end, null, [])) {
            if (currentEvent.end.isAfter(newEvent.end)) {
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

function handleMatchResult(matchData) {
    /*
        update match on the database
        for each participant
            get deviceToken
            send push to notify match is finished 
     */
}

export const matchController = new MatchController();
