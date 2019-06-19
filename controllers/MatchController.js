import { matchDAO } from "../db/dao/MatchDAO";
import { groupDAO } from "../db/dao/GroupDAO";

const { body, validationResult } = require('express-validator/check');


class MatchController {

    async createMatch(req, res) {
        const matchData = req.body;
        console.log(matchData);

        if (isRequestValid(req, res)) {
            try {
                const group = await getGroup(matchData.groupId);
                console.log(group);
                if (group.match == null) {
                    const matchId = await matchDAO.createMatch(matchData);
                    group.match = matchId;
                    await groupDAO.updateGroup(group);

                    return res.status(200).send({
                        success: true,
                        message: `Successfully started a new match for group ${group.id}`
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
                    message: `Failed to start match for group ${matchData.groupId}`
                })
            }
        }
    }

    async updateMatch(req, res) {
        console.log(req);
        const matchId = req.params.id;
        const { userId, has_joined, local_calendar } = req.body;

        if (isRequestValid(req, res)) {
            try {
                const match = await matchDAO.getMatch(matchId);
                const answer = { has_joined, local_calendar }
                match.answers[userId] = answer;
                await matchDAO.updateMatch(matchId, match);

                return res.status(200).send({
                    success: true,
                    message: "Successfully updated match"
                })
            } catch (error) {
                console.log(error);
                res.status(500).send({
                    success: false,
                    message: "Failed to update match"
                })
            }
        }
    }

    validate(method) {
        switch (method) {
            case "createMatch": {
                return [
                    body("groupId").exists(),
                    body("status")
                        .isIn(["CREATED", "ONGOING", "FINISHED"])
                        .withMessage(),
                    body("created_by").exists(),
                    body("participants").isArray(),
                    body("answers").isArray()
                ]
            }
            case "updateMatch": {
                return [
                    body("id").exists().isString(),
                    body("has_joined").exists().isBoolean(),
                    body("local_calendar").optional()
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
