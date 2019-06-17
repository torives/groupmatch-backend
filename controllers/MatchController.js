const { body, validationResult } = require('express-validator/check');


class MatchController {

    createMatch(req, res) { }

    updateMatch(req, res) { }

    validate(method) {
        switch (method) {
            case "createMatch": {
                return [
                    body("groupId").exists(),
                    body("status").exists().isIn(["ONGOING", "FINISHED"], "Invalid status. Must be: ONGOING or FINISHED"),
                    body("created_by").exists(),
                    body("created_at").exists().isRFC3339(),
                    body("participants").exists().isArray(),
                    body("answers").exists().isArray()
                ]
            }
            case "updateMatch": {
                return [
                    body("id").exists().isString(),
                    body("has_joined").exists().isBoolean(),
                    body("local_calendar").optional().isJSON()
                ]
            }
        }
    }
}

export const matchController = new MatchController();
