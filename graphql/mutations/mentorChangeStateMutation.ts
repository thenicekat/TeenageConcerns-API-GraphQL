export const MentorChangeStateMutation = `
mutation MentorChangeWorkState($mentorChangeWorkStateId: Float!) {
    mentorChangeWorkState(id: $mentorChangeWorkStateId)
}`;