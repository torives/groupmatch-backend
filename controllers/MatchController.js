const { body, validationResult } = require('express-validator/check');


class MatchController {

    createMatch(req, res) {
        console.log(req.body);

        if(isRequestValid(req, res)) {
            return res.status(200).send({
                success: "true",
                message: "Test success message"
            })
        }
    }

    updateMatch(req, res) {
        console.log(req.body);

        if(isRequestValid(req, res)) {
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
