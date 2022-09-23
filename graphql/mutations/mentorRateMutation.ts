export const MentorRateMutation = `
mutation MentorRate($mentorRateId: Float!, $rating: Float!) {
    mentorRate(id: $mentorRateId, rating: $rating)
}`;