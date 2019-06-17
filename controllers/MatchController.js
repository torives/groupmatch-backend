const { body, validationResult } = require('express-validator/check');


class MatchController {

    createMatch(req, res) {
        console.log(req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send({
                errors: errors.array()
            });
        }
    }

    updateMatch(req, res) {
        console.log(req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send({
                errors: errors.array()
            });
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

export const matchController = new MatchController();
