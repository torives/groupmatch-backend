import { matchDAO } from "../db/dao/MatchDAO";
import { groupDAO } from "../db/dao/GroupDAO";

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
                        message: `Successfully started a new match for group: ${group}`
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
        console.log(req);
        const matchId = req.params.matchId;
        const { userId, has_joined, localCalendar } = req.body;

        if (isRequestValid(req, res)) {
            try {
                const match = await matchDAO.getMatch(matchId);
                const matchData = match.data();
                const answer = { has_joined, localCalendar }
                
                matchData.answers[userId] = answer;
                matchData.status = "ONGOING";

                await matchDAO.updateMatch(matchId, matchData);

                res.status(200).send({
                    success: true,
                    message: `Successfully registered answer for user: ${userId}`
                })

                if(matchData.answers.length == matchData.participants.length) {
                    await processMatch(matchData)
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
                    body("has_joined").exists().isBoolean(),
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
function processMatch(matchData) {
    return new Promise(function (resolve, reject) {
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
    });
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
