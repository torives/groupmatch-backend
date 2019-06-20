class MatchFactory {
    create(groupId, participants, creator) {
        const { id, name, local_calendar } = creator
        const _creator = { id, name }

        const status = "CREATED"

        const answers = {
            [id]: {
                has_joined: true,
                local_calendar: local_calendar
            }
        }
        return {
            groupId: groupId,
            participants: participants,
            creator: _creator,
            answers: answers,
            status: status
        }
    }
}

export const matchFactory = new MatchFactory();