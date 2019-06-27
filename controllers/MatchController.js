import { matchDAO } from "../db/dao/MatchDAO";
import { groupDAO } from "../db/dao/GroupDAO";
import { Match } from "../actions/Match";

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
                    const result = await Match.calculate(matchData)
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


export const matchController = new MatchController();
