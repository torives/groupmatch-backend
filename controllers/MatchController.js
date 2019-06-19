import { matchDAO } from "../db/dao/MatchDAO";
import { groupDAO } from "../db/dao/GroupDAO";

const { body, validationResult } = require('express-validator/check');


class MatchController {

    async createMatch(req, res) {
        const match = req.body;
        console.log(match);

        if (isRequestValid(req, res)) {
            return res.status(200).send({
                success: "true",
                message: "Test success message"
            });
        }

        try {
            const group = await getGroup(match.groupId);
            console.log(group);
            if(group.match == null) {
                
            } else {
                //TODO: Create error code for this scenario
                return res.status(422).send({
                    success: "false",
                    message: "A group can have only one ongoing match at a time"
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(error.code).send({
                success: "false",
                message: error.message
            })
        }
    }

    async updateMatch(req, res) {
        console.log(req.body);

        if (isRequestValid(req, res)) {
            return res.status(200).send({
                success: "true",
                message: "Test success message"
            })
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
