class MatchFactory {
    create(group, participants, creator) {
        const { id, name, localCalendar } = creator
        const _creator = { id, name }

        const status = "CREATED"

        const answers = {
            [id]: {
                hasJoined: true,
                localCalendar: localCalendar
            }
        }
        return {
            group: group,
            participants: participants,
            creator: _creator,
            answers: answers,
            status: status
        }
    }
}

export const matchFactory = new MatchFactory();